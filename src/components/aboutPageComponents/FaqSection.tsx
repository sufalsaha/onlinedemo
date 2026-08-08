"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "OnlineTrustPoint কী?",
    answer:
      "OnlineTrustPoint একটি প্ল্যাটফর্ম যেখানে গ্রাহকরা বিভিন্ন অনলাইন ব্যবসা প্রতিষ্ঠান সম্পর্কে প্রকৃত রিভিউ ও রেটিং দেখতে ও দিতে পারেন, যাতে বিশ্বস্ত ব্যবসা খুঁজে পাওয়া সহজ হয়।",
  },
  {
    question: "OnlineTrustPoint কীভাবে কাজ করে?",
    answer:
      "আমরা ব্যবসা প্রতিষ্ঠানগুলোকে তালিকাভুক্ত করি এবং গ্রাহকদের সেই প্রতিষ্ঠান সম্পর্কে রিভিউ ও রেটিং দেওয়ার সুযোগ দিই। এই তথ্যের ভিত্তিতে প্রতিটি ব্যবসার একটি ট্রাস্ট স্কোর তৈরি হয়।",
  },
  {
    question: "কেন আমি OnlineTrustPoint ব্যবহার করব?",
    answer:
      "কোনো প্রতিষ্ঠান থেকে পণ্য বা সেবা নেওয়ার আগে অন্য গ্রাহকদের অভিজ্ঞতা জেনে সিদ্ধান্ত নেওয়া অনেক সহজ ও নিরাপদ হয়, আর এটিই আমরা নিশ্চিত করি।",
  },
  {
    question: "OnlineTrustPoint-এ ব্যবসা প্রতিষ্ঠান যুক্ত করা যায় কীভাবে?",
    answer:
      "\"Apply For Business\" বাটনে ক্লিক করে প্রয়োজনীয় তথ্য দিয়ে যেকোনো ব্যবসা প্রতিষ্ঠান সহজেই আমাদের প্ল্যাটফর্মে যুক্ত করা যায়।",
  },
  {
    question: "আমি কীভাবে একটি রিভিউ দেব?",
    answer:
      "প্রতিটি ব্যবসার পেজে থাকা \"Write a Review\" বাটনে ক্লিক করে রেটিং ও মতামত দিয়ে সহজেই একটি রিভিউ জমা দেওয়া যায়।",
  },
  {
    question: "কোনো ভুল তথ্য বা প্রতারণা কীভাবে রিপোর্ট করব?",
    answer:
      "আমাদের \"Complain Box\" এর মাধ্যমে যেকোনো ভুল তথ্য বা প্রতারণামূলক আচরণের অভিযোগ জানাতে পারেন, আমরা তা যাচাই করে ব্যবস্থা নেব।",
  },
  {
    question: "OnlineTrustPoint কি বিনামূল্যে ব্যবহার করা যায়?",
    answer:
      "হ্যাঁ, গ্রাহকদের জন্য ব্যবসা প্রতিষ্ঠান খোঁজা, রিভিউ দেখা এবং রিভিউ দেওয়া সম্পূর্ণ বিনামূল্যে।",
  },
];

export function FaqSection() {
  return (
    <section className="bg-[#F9F9F4] py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-8 lg:px-[157px] max-w-[1440px]">
        <h2 className="text-[24px] md:text-[28px] lg:text-[32px] font-bold text-black text-center mb-8 md:mb-12">
          Frequently Asked Questions
        </h2>

        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className="flex flex-col gap-4 max-w-[900px] mx-auto"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="not-last:border-b-0 border border-[#E3DBDB] rounded-xl bg-white shadow-sm overflow-hidden px-5 md:px-6"
            >
              <AccordionTrigger className="text-[15px] md:text-[16px] font-semibold text-black hover:text-[#00C085] hover:no-underline py-4 md:py-5 [&_svg]:text-[#00C085]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[14px] md:text-[15px] leading-[1.8] text-[#5A5A5A]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
