export function MissionVisionSection() {
  return (
    <section className="bg-white pb-10 md:pb-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-[157px] max-w-[1440px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[20px] p-7 md:p-9" style={{ background: "#dceddd" }}>
            <h3 className="text-[20px] md:text-[22px] font-bold text-[#2D2D2D] mb-3">
              Our Mission
            </h3>
            <p className="text-[15px] leading-[1.8] text-[#474B47]">
              বিশ্বস্ত ব্যবসা প্রতিষ্ঠান খুঁজে পাওয়া যেন সহজ হয়, সেই লক্ষ্যে
              আমরা কাজ করি। প্রকৃত গ্রাহক রিভিউ ও তথ্যের মাধ্যমে আমরা ক্রেতা
              ও ব্যবসায়ীদের মধ্যে একটি বিশ্বাসযোগ্য সেতুবন্ধন তৈরি করতে চাই।
            </p>
          </div>
          <div className="rounded-[20px] p-7 md:p-9" style={{ background: "#FFEED7" }}>
            <h3 className="text-[20px] md:text-[22px] font-bold text-[#2D2D2D] mb-3">
              Our Vision
            </h3>
            <p className="text-[15px] leading-[1.8] text-[#474B47]">
              বাংলাদেশের অনলাইন ব্যবসা খাতকে আরও স্বচ্ছ ও নির্ভরযোগ্য করে
              তোলাই আমাদের লক্ষ্য। আমরা এমন একটি প্ল্যাটফর্ম গড়ে তুলতে চাই,
              যেখানে প্রতিটি ব্যবসা তার সততা ও মানের ভিত্তিতে পরিচিত হবে।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
