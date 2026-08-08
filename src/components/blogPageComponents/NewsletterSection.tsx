import { ScrollReveal } from "@/components/ScrollReveal";
import { NewsletterForm } from "./NewsletterForm";

export function NewsletterSection() {
  return (
    <section className="py-10 md:py-16 flex justify-center" style={{ background: "#B2F8CC" }}>
      <ScrollReveal className="w-full max-w-[1206px] mx-6">
        <div
          className="rounded-[20px] flex flex-col lg:flex-row items-center justify-between gap-8 px-[32px] md:px-[40px] lg:px-[70px] py-[32px] md:py-[60px]"
          style={{ background: "#00552C" }}
        >
          <div className="flex-1 max-w-[560px] text-center lg:text-left">
            <h2 className="text-[24px] md:text-[28px] font-bold text-white leading-[1.4] mb-3">
              Never Miss an Update
            </h2>
            <p className="text-[15px] text-[#D7E6D7] leading-[1.6]">
              Subscribe to our newsletter and get the latest guides, tips,
              and trust insights delivered straight to your inbox.
            </p>
          </div>

          <div className="w-full max-w-[420px]">
            <NewsletterForm variant="full" />
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
