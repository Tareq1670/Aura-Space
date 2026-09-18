const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY || "1320b11e94c1d6fa8214c925bb1ca8e1";
const IMGBB_URL = "https://api.imgbb.com/1/upload";

async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const imageUploader = async (image: File) => {
  const base64 = await fileToBase64(image);
  const params = new URLSearchParams({ key: IMGBB_KEY });
  const formData = new FormData();
  formData.append("image", base64);
  const res = await fetch(`${IMGBB_URL}?${params}`, { method: "POST", body: formData });
  const result = await res.json();
  if (!result.success) {
    throw new Error(result.error?.message || "Image upload failed");
  }
  return { display_url: result.data.display_url, url: result.data.url };
};
