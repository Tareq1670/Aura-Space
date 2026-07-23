const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const imageUploader = async (image: File) => {
    const formData = new FormData();
    formData.append("image", image);
    const res = await fetch(`${API_BASE}/api/upload/local`, {
        method: "POST",
        body: formData,
    });
    const result = await res.json();
    if (!result.success || !result.data?.url) {
        throw new Error(result.message || "Image upload failed");
    }
    return { display_url: result.data.url, url: result.data.url };
};
