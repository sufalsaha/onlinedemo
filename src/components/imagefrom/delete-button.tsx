



"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteImage } from "@/actions/image-action";

export function DeleteProductButton({
  imageName,
  deleteimage,
}: {
  imageName: string;
  deleteimage: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const clickme = () => {
    setOpen(true);
  };

  async function submitDeleteForm() {
    setPending(true);
    await deleteImage({
      imageName: imageName,
    });
    setPending(false);
    setOpen(false);
    deleteimage();
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button onClick={clickme}>
            <Trash2 size={30} className="bg-red-600 p-2 rounded-full " />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm delete</DialogTitle>
            {/* CHANGED: Added break-all to ensure the long URL wraps inside the dialog box */}
            <DialogDescription className="break-all">
              Anyone who has Image Uplod success will be able to view this.{" "}
              <span className="font-semibold block mt-1 text-xs text-muted-foreground">
                {imageName}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">hello</div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={submitDeleteForm}
              disabled={pending}
            >
              {pending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}













// "use client";

// import { useFormStatus } from "react-dom";
// import { Button } from "../ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../ui/dialog";
// import { ReloadIcon } from "@radix-ui/react-icons";
// import { useState } from "react";
// import { Trash2 } from "lucide-react";
// import { deleteImage } from "@/actions/image-action";

// export function DeleteProductButton({
//   imageName,
//   deleteimage,
// }: {
//   imageName: string;

//   deleteimage: () => void;
// }) {
//   const [open, setOpen] = useState(false);
//   const [pending, setPending] = useState(false);

//   const clickme = () => {
//     setOpen(true);
//   };

//   async function submitDeleteForm() {
//     setPending(true);
//     await deleteImage({
//       imageName: imageName,
//     });
//     setPending(false);
//     setOpen(false);
//     deleteimage();
//   }

//   return (
//     <div>
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <button onClick={clickme}>
//             <Trash2 size={30} className="bg-red-600 p-2 rounded-full " />
//           </button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Confirm delete</DialogTitle>
//             <DialogDescription>
//               Anyone who has Image Uplod success will be able to view this.
//               {imageName}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="flex items-center space-x-2">hello</div>
//           <DialogFooter className="sm:justify-start">
//             <DialogClose asChild>
//               <Button type="button" variant="secondary">
//                 Close
//               </Button>
//             </DialogClose>
//             <Button
//               variant="destructive"
//               onClick={submitDeleteForm}
//               disabled={pending}
//             >
//               {pending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// // function DeleteButton() {
// //   const { pending } = useFormStatus();
// //   return (
// //     <Button variant="destructive" type="submit" disabled={pending}>
// //       {pending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
// //       Delete
// //     </Button>
// //   );
// // }
