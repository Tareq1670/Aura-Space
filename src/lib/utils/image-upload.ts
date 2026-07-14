// lib/utils/image-upload.ts

const CONCURRENCY = 3;

export const imageUploader = async (image: File) => {
    const formData = new FormData();
    formData.append("image", image);
    const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
        {
            method: "POST",
            body: formData,
        },
    );
    const result = await res.json();
    if (!result.success) {
        throw new Error("Image upload failed. Please try again.");
    }
    return result.data;
};

async function asyncPool<T, R>(
    items: T[],
    limit: number,
    fn: (item: T) => Promise<R>
): Promise<R[]> {
    const results: R[] = [];
    const executing = new Set<Promise<void>>();

    for (const item of items) {
        const p = (async () => {
            const result = await fn(item);
            results.push(result);
        })();
        executing.add(p);
        const cleanup = () => executing.delete(p);
        p.then(cleanup, cleanup);
        if (executing.size >= limit) {
            await Promise.race(executing);
        }
    }

    await Promise.all(executing);
    return results;
}

export const uploadMultipleImages = async (
    images: File[],
    onProgress?: (completed: number, total: number) => void
): Promise<string[]> => {
    let completed = 0;
    const results = await asyncPool(images, CONCURRENCY, async (file) => {
        const result = await imageUploader(file);
        completed++;
        onProgress?.(completed, images.length);
        return result.display_url || result.url;
    });
    return results;
};
