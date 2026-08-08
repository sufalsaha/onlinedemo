
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ImageUplod from "./image-input";
import ShowImage from "./show-imag";
import Image from "next/image";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { allImge } from "@/actions/image-action";
import { ImgCopy } from "@/actions/image-copy-action";
// import { ImgCopy } from "@/actions/image-copy-action";
// import { ImgCopy } from "@/app/actions/image-copy-action";

export type ImageSeletorRef = {
  selectedImages: string[];
  reset: () => void;
};

export const ImageSeletor = forwardRef<
  ImageSeletorRef,
  {
    multiselects?: boolean;
    label: string;
    defaultImag?: string[];
  }
>(({ multiselects, label, defaultImag }, ref) => {
  const [open, setOpen] = useState(false);
  const [allImages, setAllImages] = useState<string[]>(
    []
  );
  const [selectedImages, setSelectedImages] = useState<
    string[]
  >(defaultImag || []);
  useImperativeHandle(ref, () => ({
    selectedImages: selectedImages.map((e) => e),

    reset: () => {
      setSelectedImages(defaultImag || []);
    },
  }));
  async function fetchAllImagesFromServer() {
    const add = await allImge();
    const ass = add.map((e: { name: string }) => e.name);
    setAllImages(ass);
  }

  async function copyling(imgid: string[]) {
    const all = imgid;

    const alls = all.map((e) => {
      return e;
    });
    await ImgCopy(alls);
    setSelectedImages(alls);

    if (all) {
      setOpen(false);
    }
    // console.log(all);
  }

  useEffect(() => {
    fetchAllImagesFromServer();
  }, []);

  function imgdelete(path: string) {
    if (selectedImages.find((e) => e == path)) {
      // console.log({ show });
      const add = selectedImages.filter((imgId) => imgId !== path);
      setSelectedImages(add);
      // const app = add.map((e) => e.path);
    }
  }

  return (
    <div className="">
      <p className="text-[25px]">{label}</p>
      <div className=" flex justify-center items-center w-[450px]">
        <div className=" border-2 border-gray-500 p-2 rounded-md">
          <div className="flex flex-wrap gap-2  ">
            {selectedImages.map(function (
              e,
              i: number
            ) {
              return (
                <div
                  key={i}
                  className="relative w-[100px] h-[100px] group overflow-hidden "
                >
                  <img
                    src={e}
                    alt=""
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute  min-w-full flex justify-end top-0.5 right-0.5 group:opacity-100 ">
                    <button
                      onClick={(event) => {
                        event.preventDefault();
                        imgdelete(e);
                      }}
                    >
                      <X
                        size={30}
                        className="bg-white p-1 font-bold rounded-md border-2 border-gray-500"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
            <div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="w-[100px] h-[100px] border-4 border-gray-400 bg-yellow-50 rounded-lg"
                  >
                    add image
                  </button>
                </DialogTrigger>
                <DialogContent className="!max-w-[600px] w-full h-fit">
                  <DialogHeader>
                    <DialogTitle>Edit image</DialogTitle>
                    <DialogDescription>
                      Make changes to your image here. Click save when you re
                      done.
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="showimage" className="w-full">
                    <TabsList className="flex w-full justify-start text-[#000]  ">
                      <TabsTrigger value="showimage" className="">
                        show image
                      </TabsTrigger>
                      <TabsTrigger value="imageuplod">image uplod</TabsTrigger>
                    </TabsList>
                    <TabsContent value="showimage">
                      <div className="max-h-[70vh] flex items-center justify-center overflow-y-auto">
                        <ShowImage
                          data={allImages}
                          ondata={fetchAllImagesFromServer}
                          copyimgs={copyling}
                          multiselect={multiselects}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="imageuplod">
                      <div>
                        <ImageUplod ondata={fetchAllImagesFromServer} />
                      </div>
                    </TabsContent>
                  </Tabs>

                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ImageSeletor.displayName = "ImageSeletor";
