import { ComplainBoxIcon } from "@/components/icons";
import Link from "next/link";

export function ComplainSection() {
  return (
    <section
      className="py-10 md:py-20  flex justify-center"
      style={{ background: "#B2F8CC" }}
    >
      <div
        className="w-full max-w-[1206px] mx-6 rounded-[20px] flex flex-col lg:flex-row items-center justify-between gap-10 px-[32px] md:px-[40px]  lg:px-[70px] py-[32px] md:py-[76px]"
        style={{ background: "#00552C" }}
      >
        {/* Text */}
        <div className="flex-1 max-w-[560px] text-center lg:text-left">
          <h2 className="text-[24px] md:text-[28px] lg:text-[32px] font-bold text-white leading-[1.5] mb-4">
            কমপ্লেইন করুন, আমরা সমাধান করব
          </h2>
          <p className="text-[15px] md:text-[17px] text-[#D7E6D7] leading-[1.6] mb-7">
            আমরা সবসময় বিশ্বস্ত ব্যবসা প্রতিষ্ঠান খুঁজে দিতে চেষ্টা করি। তবে
            আমাদের সাজেস্ট করা কোনো কোম্পানি থেকে খারাপ পণ্য বা সেবা পেলে এবং
            তারা সমস্যার সমাধান না করলে, আমাদের কাছে অভিযোগ করুন। আমরা বিষয়টি
            যাচাই করে সমাধানে সহযোগিতা করব।
          </p>
    <Link href="/complain" className="inline-block">
            <button
            className="text-white text-[16px] font-medium rounded-[12px] px-7 py-3.5 hover:opacity-90 transition-opacity cursor-pointer border-none"
            style={{ background: "#49C24C" }}
          >
            Complain Box
          </button>
    </Link>
        </div>

        {/* Icon */}
        <div className="shrink-0 w-[160px] h-[160px] flex items-center justify-center hidden lg:flex">
          <ComplainBoxIcon />
        </div>
      </div>
    </section>
  );
}
