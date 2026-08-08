export function VerifySection() {
  const photos = [
    { gradient: "linear-gradient(135deg, #a8d5b5, #6aad85)", delay: "" },
    { gradient: "linear-gradient(135deg, #7bb5c9, #4a90c4)", delay: "-36px" },
    { gradient: "linear-gradient(135deg, #c9a87b, #a0724a)", delay: "" },
  ];

  return (
    <section className="bg-white py-10 md:py-16 flex justify-center">
      <div
        className="w-full max-w-[1206px] mx-6 rounded-[20px] flex flex-col lg:flex-row items-center justify-between gap-10 px-[32px] lg:px-[70px] py-[32px] md:py-[76px] overflow-hidden relative"
        style={{ background: "#FFEED7" }}
      >
        {/* Text */}
        <div className="max-w-[480px]">
          <h2 className="text-[24px] md:text-[32px] font-bold text-[#2D2D2D] mb-2">
            অনলাইন কেনাকাটা নিরাপদ করুন
          </h2>
          <p className="text-[15px] md:text-[20px] text-[#474B47] leading-[1.5] mb-7">
            অনলাইনে কেনাকাটার আগে ব্যবসার ট্রাস্ট চেক করুন। ভেরিফাইড ব্যবসা দেখে নিরাপদভাবে কেনাকাটা করুন।
          </p>
          <button
            className="text-[#fff] text-[16px] font-medium rounded-[12px] px-7 py-3.5 hover:opacity-90 transition-opacity cursor-pointer border-none"
            style={{ background: "#00C085" }}
          >
            Contact Us
          </button>
        </div>

        {/* Staggered photos */}
        <div className="flex gap-2 items-flex-start shrink-0 mt-10">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="rounded-[10px] w-[168px] h-[252px]"
              style={{
                background: photo.gradient,
                marginTop: i === 1 ? "-36px" : "0",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
