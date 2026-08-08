export function BlogHero() {
  return (
    <section className="py-10 md:pt-[80px] md:pb-14 bg-[#dceddd] md:bg-white relative overflow-hidden">
      <div className="absolute w-[383px] h-[300px] left-1/2 -translate-x-[650px] top-[10%] bg-gradient-to-b from-[#7CB342] to-[#4A90E2] blur-[150px] opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 lg:px-[157px] max-w-[1440px] relative">
        <span className="text-[#00C085] text-[14px] font-medium">Home / Blog</span>
        <h1 className="text-[28px] md:text-[40px] font-bold text-black mt-2 mb-4">
          Blog
        </h1>
        <p className="text-[15px] md:text-[17px] text-[#5A5A5A] leading-[1.7] max-w-[640px]">
          Insights, guides, and stories to help you find trustworthy
          businesses and make confident buying decisions online.
        </p>
      </div>
    </section>
  );
}
