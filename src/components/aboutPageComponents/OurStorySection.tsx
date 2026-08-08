import { ArrowDownRight } from "lucide-react";

const paragraphs = [
  "আপনার যদি কোনো প্রশ্ন থাকে, কোনো বিষয়ে দ্বিধা অনুভব করেন, অথবা আমাদের সম্পর্কে আরও ধারণা পেতে চান, তাহলে সরাসরি আমাদের সাথে যোগাযোগ করুন।",
  "আপনার যদি কোনো প্রশ্ন থাকে, কোনো বিষয়ে দ্বিধা অনুভব করেন, অথবা আমাদের সম্পর্কে আরও ধারণা পেতে চান, তাহলে সরাসরি আমাদের সাথে যোগাযোগ করুন।",
  "আপনার যদি কোনো প্রশ্ন থাকে, কোনো বিষয়ে দ্বিধা অনুভব করেন, অথবা আমাদের সম্পর্কে আরও ধারণা পেতে চান, তাহলে সরাসরি আমাদের সাথে যোগাযোগ করুন।",
];

export function OurStorySection() {
  return (
    <section className="bg-white py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-8 lg:px-[157px] max-w-[1440px]">
        <h2 className="flex items-center gap-2 text-[20px] md:text-[24px] font-bold text-black mb-5">
          Our Story
          <ArrowDownRight className="text-[#00C085]" size={22} />
        </h2>
        <div className="flex flex-col gap-5 max-w-[900px]">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-[15px] md:text-[16px] leading-[1.9] text-[#5A5A5A]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
