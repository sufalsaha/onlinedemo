import Link from "next/link";

import { ScrollReveal } from "@/components/ScrollReveal";

export function BlogCtaSection() {
  return (
    <section className="bg-white py-10 md:py-16 flex justify-center">
      <ScrollReveal className="w-full max-w-[1206px] mx-6">
        <div
          className="rounded-[20px] flex flex-col lg:flex-row items-center justify-between gap-8 px-[32px] md:px-[40px] lg:px-[70px] py-[32px] md:py-[60px]"
          style={{ background: "#FFEED7" }}
        >
          <div className="flex-1 max-w-[560px] text-center lg:text-left">
            <h2 className="text-[24px] md:text-[28px] font-bold text-[#2D2D2D] leading-[1.4] mb-3">
              Ready to find a trustworthy business?
            </h2>
            <p className="text-[15px] text-[#474B47] leading-[1.6]">
              Explore verified businesses on OnlineTrustPoint, or reach out
              to our team if you have any questions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/businesses"
              className="text-center rounded-[12px] px-7 py-3.5 font-medium text-white hover:opacity-90 transition-opacity"
              style={{ background: "#00C085" }}
            >
              Explore Businesses
            </Link>
            <Link
              href="/contact"
              className="text-center rounded-[12px] px-7 py-3.5 font-medium text-[#2D2D2D] border border-[#CEBFBF] hover:bg-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
