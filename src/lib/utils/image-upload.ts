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
    const results: R[] = new Array(items.length);
    let nextIndex = 0;

    async function worker(): Promise<void> {
        while (nextIndex < items.length) {
            const i = nextIndex++;
            results[i] = await fn(items[i]);
        }
    }

    const workers = Array.from(
        { length: Math.min(limit, items.length) },
        () => worker()
    );
    await Promise.all(workers);

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
