"use server"
// utils/uploadImage.ts
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("filename", file);

  const res = await fetch(
    "https://prod.api.market/api/v1/magicapi/image-upload/upload",
    {
      method: "POST",
      headers: { "x-magicapi-key": process.env.MAGICAPI_KEY! },
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  const { url } = await res.json();
  return url; // public URL of uploaded image
}
