import Image from "next/image";
import { DeleteProductButton } from "./delete-button";
import { useState } from "react";
import { SquareCheck } from "lucide-react";
import clsx from "clsx";

export default function ShowImage({
  data,
  ondata,
  multiselect,
  copyimgs,
}: {
  data: string[];
  ondata: () => void;
  multiselect?: boolean;
  copyimgs: (imgid: string[]) => void;
}) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  function selectimg(name: string) {
    if (multiselect) {
      if (selectedImages.find((e) => e == name)) {
        setSelectedImages(selectedImages.filter((imgId) => imgId !== name));
      } else {
        setSelectedImages([...selectedImages, name]);
      }
    } else {
      setSelectedImages([name]);
    }
  }

  function copyimg() {
    // const all = selectedImages
    copyimgs(selectedImages);
  }

  return (
    <div className="h-[85vh]">
      <button
        onClick={() => {
          copyimg();
        }}
        className="px-4 py-2 bg-gray-500 mt-20 text-white rounded-lg overflow-hidden"
      >
        click me
      </button>
      <div className="grid grid-cols-5 gap-4  mt-2">
        {data.map(function (e, i) {
          return (
            <div
              key={i}
              className="relative group "
              onClick={() => {
                selectimg(e);
              }}
            >
              <Image src={e} alt="" width={400} height={100} />

              <div
                className={clsx(
                  "absolute flex  group-hover:top-0 opacity-0 group-hover:opacity-100 transition-all duration-300",
                  {
                    "text-[#21ee32] -top-10": !selectedImages.find(
                      (ee) => ee == e
                    ),
                    "bg-green-500 text-white top-0 opacity-100 ":
                      selectedImages.find((ee) => ee == e),
                  }
                )}
              >
                <button className="">
                  <SquareCheck />
                </button>
              </div>
              <div className="absolute h-full w-full flex justify-center items-center bottom-0  opacity-0 group-hover:opacity-100 transition-all duration-300  ">
                <DeleteProductButton imageName={e} deleteimage={ondata} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
