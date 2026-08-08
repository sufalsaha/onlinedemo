"use server";

import { Imagescopy } from "@/lib/models/copyimg";
import { connectMongoDB } from "@/lib/mongodb";



export async function ImgCopy(imgid: string[]) {
  await connectMongoDB();
  await Imagescopy.create({ image:imgid });
  // console.log(imgid);
  
}



