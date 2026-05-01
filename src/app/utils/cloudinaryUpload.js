export const uploadImageToCloudinary = async (imageFile) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", "cake-heaven"); 

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dwtg6jzwr/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  console.log(data); // 🔍 debug

  if (!res.ok) {
    throw new Error(data.error?.message || "Upload failed");
  }

  return data.secure_url;
};