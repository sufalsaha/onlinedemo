

"use server";

import cloudinary from "cloudinary";
import { Images } from "@/lib/models/images";
import { connectMongoDB } from "@/lib/mongodb";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function ImgAdd(e: string | undefined) {
  await connectMongoDB();
  await Images.create({ image: e });
}

export async function allImge() {
  await connectMongoDB();
  const all = await Images.find();
  const images = all.map((e: any) => {
    return { name: e.image, id: e.id };
  });

  return images;
}

export async function uploadFile(data: FormData) {
  // console.log("uploadFile called");
  const file: File | null = data.get("file") as File;
  if (!file) {
    return { message: "no image found", success: false };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadResult: string | undefined = await new Promise((resolve) => {
    cloudinary.v2.uploader
      // secure_url, not url — `url` is http://, and next.config.ts only
      // whitelists https for remote images, so an http asset is rejected by
      // next/image and blocked as mixed content on an https deploy.
      .upload_stream((error, uploadResult) => {
        return resolve(uploadResult?.secure_url);
      })
      .end(buffer);
  });

  return { uploadResult };
}

export async function deleteImage({ imageName }: { imageName: string }) {
  await connectMongoDB();

  // 1. Delete the record from your MongoDB database
  await Images.deleteOne({ image: imageName });

  // 2. Extract the public ID from the full Cloudinary URL
  // Example: "http://.../v1783165853/sxwwcdhnobstb1jqtfol.heic" -> "sxwwcdhnobstb1jqtfol"
  const publicId = imageName.split("/").at(-1)!.split(".")[0];

  // 3. Delete it directly from Cloudinary's cloud storage
  try {
    await cloudinary.v2.uploader.destroy(publicId);
  } catch (cloudinaryError) {
    console.error("Failed to delete image from Cloudinary:", cloudinaryError);
    // We catch this so a Cloudinary issue doesn't crash your whole Server Action
  }
}






// "use server";

// import { unlink } from "fs/promises";
// import cloudinary from "cloudinary";
// import { Images } from "@/lib/models/images";
// import { connectMongoDB } from "@/lib/mongodb";

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function ImgAdd(e: string | undefined) {
//   await connectMongoDB();
//   await Images.create({ image: e });
// }
// export async function allImge() {
//   await connectMongoDB();
//   const all = await Images.find();
//   const images = all.map((e: any) => {
//     return { name: e.image, id: e.id };
//   });
//   // console.log(images);

//   return images;
// }

// export async function uploadFile(data: FormData) {
//   console.log("uploadFile called");
//   const file: File | null = data.get("file") as File;
//   if (!file) {
//     return { message: "no image found", success: false }; //->
//   }

//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);

//   // const path = join("./public/", file.name);
//   // await writeFile(path, buffer);

//   const uploadResult: string | undefined = await new Promise((resolve) => {
//     cloudinary.v2.uploader
//       .upload_stream((error, uploadResult) => {
//         return resolve(uploadResult?.url);
//       })
//       .end(buffer);
//   });
//   // console.log({uploadResult});

//   return { uploadResult };
// }

// export async function deleteImage({ imageName }: { imageName: string }) {
//   await connectMongoDB();

//   await Images.deleteOne({ image: imageName });
//   await cloudinary.v2.uploader.destroy(
//     imageName.split("/").at(-1)!.split(".")[0]
//   );
//   await unlink("./public/" + imageName);
// }

// // 7QqM279a2fEP6cFg supabas pass
