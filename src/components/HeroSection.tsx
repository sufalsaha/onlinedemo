// "use client";

// import { useState } from "react";
// import { TrustedIcon } from "@/components/icons";

// export function HeroSection() {
//   const [query, setQuery] = useState("");

//   return (
//     <section
//       className="relative min-h-[717px] flex items-center justify-center overflow-hidden py-24"
//       style={{ background: "#F9F9F4" }}
//     >
//       {/* Gradient blobs */}
//       <div
//         className="absolute pointer-events-none rounded-full"
//         style={{
//           width: 383,
//           height: 280,
//           left: "calc(50% - 383px/2 - 458px)",
//           top: "8%",
//           background: "linear-gradient(180deg, #7CB342 22.6%, #4A90E2 72.12%)",
//           filter: "blur(120px)",
//           opacity: 0.65,
//         }}
//       />
//       <div
//         className="absolute pointer-events-none rounded-full"
//         style={{
//           width: 375,
//           height: 280,
//           right: "calc(50% - 375px/2 - 533px)",
//           top: "20%",
//           background: "linear-gradient(180deg, #7CB342 22.6%, #4A90E2 72.12%)",
//           filter: "blur(130px)",
//           opacity: 0.65,
//         }}
//       />

//       {/* Decorative shapes */}
//       <div
//         className="absolute pointer-events-none"
//         style={{
//           width: 340,
//           height: 380,
//           left: -160,
//           bottom: 80,
//           background: "rgba(73,194,77,0.3)",
//           borderRadius: "50%",
//           transform: "rotate(-49deg)",
//           filter: "blur(18px)",
//         }}
//       />
//       <div
//         className="absolute pointer-events-none"
//         style={{
//           width: 280,
//           height: 130,
//           right: 60,
//           bottom: 120,
//           background: "rgba(255,228,0,0.5)",
//           borderRadius: 9999,
//           transform: "rotate(51deg)",
//           filter: "blur(10px)",
//         }}
//       />
//       <div
//         className="absolute pointer-events-none"
//         style={{
//           width: 260,
//           height: 320,
//           right: -70,
//           top: -20,
//           background: "rgba(0,142,255,0.38)",
//           borderRadius: "40% 60% 60% 40%",
//           transform: "rotate(176deg)",
//           filter: "blur(14px)",
//         }}
//       />

//       {/* Content */}
//       <div className="relative z-10 flex flex-col items-center gap-9 max-w-[920px] w-full px-6 text-center">
//         {/* Trusted badge */}
//         <div className="flex items-center gap-2 bg-white border border-[#49C24C] rounded-full px-4 py-2 shadow-sm">
//           <TrustedIcon />
//           <span className="text-[14px] font-medium text-[#49C24C]">100% Trusted</span>
//           <TrustedIcon />
//         </div>

//         {/* Headline */}
//         <h1
//           className="font-bold text-[#2D2D2D] leading-[1.55]"
//           style={{ fontSize: "clamp(28px, 4vw, 46px)" }}
//         >
//           বিশ্বাসযোগ্য অনলাইন ব্যবসা খুঁজে নিন
//         </h1>

//         {/* Subtitle */}
//         <p
//           className="font-medium text-[#626161] leading-[1.55]"
//           style={{ fontSize: "clamp(16px, 2vw, 24px)" }}
//         >
//           রেটিং, রিভিউ এবং অভিযোগ দেখে নিরাপদে কেনাকাটা করুন
//         </p>

//         {/* Search bar */}
//         <div className="flex items-center w-full max-w-[760px] bg-white border border-[#BEBEBE] rounded-full px-6 py-2 gap-3 shadow-sm">
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Company/Facebook page/Website"
//             className="flex-1 outline-none font-[family-name:var(--font-poppins)] text-[18px] text-[#AEAEAE] placeholder:text-[#AEAEAE] bg-transparent py-2"
//           />
//           <button
//             className="shrink-0 text-white rounded-full px-7 py-3 text-[16px] font-medium transition-opacity hover:opacity-90 cursor-pointer"
//             style={{ background: "#00C085" }}
//           >
//             Search
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import greenArc from "@/assets/Frame.svg";
import { IoSearch } from "react-icons/io5";
import { LogoPlaceholder } from "@/components/icons";
import type { BusinessSearchResult } from "@/lib/search";

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M7.5 1L9.2 5.3L13.9 5.7L10.5 8.9L11.6 13.5L7.5 11.1L3.4 13.5L4.5 8.9L1.1 5.7L5.8 5.3Z"
        fill={filled ? "#49C24C" : "none"}
        stroke="#49C24C"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [results, setResults] = useState<BusinessSearchResult[]>([]);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setHasError(false);

    fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: { results: BusinessSearchResult[] }) => {
        setResults(data.results);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setHasError(true);
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const showDropdown = isOpen && query.trim().length > 0;

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] bg-[#F9F9F4] flex flex-col items-center justify-center ">
        {/* Decorative background layer — clipped to the section bounds so it can't bleed, kept separate from the content below so overlays (like the search dropdown) aren't clipped too */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Dashed vertical grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 80px)",
            }}
          />

          {/* Top-left blur blob */}
          <div
            className="absolute -top-16 -left-10 w-[480px] h-[270px] rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(160deg, #7CB342 22%, #4A90E2 72%)",
              opacity: 0.22,
              filter: "blur(80px)",
            }}
          />

          {/* Bottom-right blur blob */}
          <div
            className="absolute bottom-16 -right-20 w-[520px] h-[460px] rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(160deg, #7CB342 22%, #4A90E2 72%)",
              opacity: 0.18,
              filter: "blur(120px)",
            }}
          />

          {/* Top-right blue triangle */}
          <div
            className="absolute -top-10 -right-20 md:top-0 md:right-0 pointer-events-none"
            style={{
              width: 0,
              height: 0,
              borderStyle: "solid",
              borderWidth: "0 220px 240px 0",
              borderColor:
                "transparent rgba(0,142,255,0.5) transparent transparent",
            }}
          />

          {/* Bottom-left green arc */}
          <div
            className="absolute -bottom-80 -left-80 md:-bottom-40 md:-left-44 w-[520px] h-[520px] rounded-full pointer-events-none"
            style={{ background: "rgba(73,194,77,0.5)" }}
          />
          {/* Bottom-left green arc */}
          {/* <div
            className="absolute top-28 left-44 w-[520px] h-[520px] rounded-full "

          ><Image src={greenArc} alt="Green Arc" /></div> */}

          {/* Yellow rotated pill */}
          <div
            className="absolute -bottom-40 -right-60 md:-bottom-10 md:right-30 w-[400px] h-[178px] rounded-[90px] pointer-events-none"
            style={{
              background: "rgba(255,228,0,0.5)",
              transform: "rotate(51deg)",
            }}
          />
        </div>

        <div className="relative z-10 flex items-center gap-1.5 bg-white border border-[#49C24C] rounded-full px-4 py-1.5 md:py-2 mb-5 md:mb-10 shadow-[0_4px_8px_rgba(0,0,0,0.12)] cursor-pointer hover:-translate-y-0.5 transition-transform">
          <StarIcon />
          {/* <StarIcon />
          <StarIcon />
          <StarIcon /> */}
          {/* <StarIcon filled={false} /> */}
          <span className="text-[#626161] text-[14px] font-semibold md:text-[16px] ml-1">
            100% Trusted
          </span>
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            className="ml-1"
          >
            <path
              d="M4 3.5l3.5 3L4 9.5"
              stroke="#49C24C"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="relative z-10">
          <h1
            className="text-[28px] md:text-[48px] leading-[1.4] md:leading-[1.05] tracking-[-0.03em] mb-4 md:mb-6 px-5 text-center"
            style={{ fontFamily: "var(--font-display)", fontWeight: 900 }}
          >
            বিশ্বাসযোগ্য অনলাইন ব্যবসা খুঁজে নিন
          </h1>
          <p className="text-[18px] md:text-[24px] leading-relaxed text-[#626161] mb-4 md:mb-10 mx-auto px-5 text-center">
            নিরাপদ কেনাকাটার জন্য যাচাইকৃত ব্যবসা
          </p>
          <div className="px-5 text-center">
            <div ref={searchBoxRef} className="relative max-w-[730px] mx-auto mb-5">
              <div className="flex items-center gap-3 bg-white border border-[#BEBEBE] rounded-[40px] py-2 pl-5 pr-2 shadow-[0_2px_12px_rgba(0,0,0,0.06)] focus-within:shadow-[0_4px_20px_rgba(0,192,133,0.18)] focus-within:border-[#00C085] transition-all">
                {/* <div className="flex-1"> */}
                  <input
                    type="text"
                    className=" flex-1 w-full bg-transparent  border-none outline-none text-[16px] md:text-[18px] text-[#0B1906] placeholder:text-[#AEAEAE]"
                    placeholder="Company/Facebook page/Website"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                  />
                {/* </div> */}
                {/* <div className=""> */}
                  <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="flex justify-center items-center gap-1.5 shrink-0 bg-[#00C085] text-white rounded-[28px] px-3 py-3 md:px-6 text-[16px] font-semibold hover:bg-[#009e6e] hover:-translate-y-0.5 transition-all box-content cursor-pointer"
                  >
                    <IoSearch className="size-[20px]" />
                    <span className="hidden md:block">Search</span>
                  </button>
                {/* </div> */}
              </div>

              {showDropdown && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-popover border border-[#BEBEBE] dark:border-border rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] text-left overflow-hidden">
                  {isLoading && (
                    <div className="px-5 py-4 text-[15px] text-[#AEAEAE] dark:text-muted-foreground">
                      Searching…
                    </div>
                  )}

                  {!isLoading && hasError && (
                    <div className="px-5 py-4 text-[15px] text-[#AEAEAE] dark:text-muted-foreground">
                      Something went wrong. Please try again.
                    </div>
                  )}

                  {!isLoading && !hasError && results.length === 0 && (
                    <div className="px-5 py-4 text-[15px] text-[#AEAEAE] dark:text-muted-foreground">
                      No results found for &ldquo;{query.trim()}&rdquo;
                    </div>
                  )}

                  {!isLoading && !hasError && results.length > 0 && (
                    <ul className="max-h-[360px] overflow-y-auto divide-y divide-[#F0F0F0] dark:divide-border">
                      {results.map((business) => (
                        <li key={business.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setIsOpen(false);
                              router.push(`/businesses/${business.id}`);
                            }}
                            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#F9F9F4] dark:hover:bg-accent transition-colors cursor-pointer"
                          >
                            <div className="w-[40px] h-[40px] shrink-0 border border-[#DDD] dark:border-border rounded-[6px] flex items-center justify-center overflow-hidden bg-white dark:bg-popover">
                              {business.logo ? (
                                <img
                                  src={business.logo}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <LogoPlaceholder />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[15px] font-medium text-[#0B1906] dark:text-popover-foreground truncate">
                                {business.name}
                              </p>
                              <p className="text-[13px] text-[#AEAEAE] dark:text-muted-foreground truncate">
                                {business.category.name}
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Rating badge ── */}
        {false && (
          <div className="relative z-10 flex items-center gap-1.5 bg-white border border-[#49C24C] rounded-full px-4 py-1.5 md:py-2 mb-5 md:mb-10 shadow-[0_4px_8px_rgba(0,0,0,0.12)] cursor-pointer hover:-translate-y-0.5 transition-transform">
            <StarIcon />
            {/* <StarIcon />
          <StarIcon />
          <StarIcon /> */}
            {/* <StarIcon filled={false} /> */}
            <span className="text-[#626161] text-[14px] font-semibold md:text-[16px] ml-1">
              100% Trusted
            </span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              className="ml-1"
            >
              <path
                d="M4 3.5l3.5 3L4 9.5"
                stroke="#49C24C"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* px-6  */}
        {/* ── Headline ── */}
        {false && (
          <div className="relative z-10 text-center px-6 max-w-[1060px]">
            <h1
              className="text-[28px] md:text-[48px] leading-[1.4] md:leading-[1.05] tracking-[-0.03em] mb-4 md:mb-6"
              style={{ fontFamily: "var(--font-display)", fontWeight: 900 }}
            >
              বিশ্বাসযোগ্য অনলাইন ব্যবসা খুঁজে নিন
            </h1>

            <p className="text-[18px] md:text-[24px] leading-relaxed text-[#626161] mb-4 md:mb-10 mx-auto">
              নিরাপদ কেনাকাটার জন্য যাচাইকৃত ব্যবসা
            </p>

            {/* Search bar */}
            <div className="relative z-10 flex items-center gap-3 bg-white border border-[#BEBEBE] rounded-[40px] py-2 pl-5 pr-2 max-w-[730px] mx-auto mb-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] focus-within:shadow-[0_4px_20px_rgba(0,192,133,0.18)] focus-within:border-[#00C085] transition-all">
              <input
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-[16px] md:text-[18px] text-[#0B1906] placeholder:text-[#AEAEAE]"
                placeholder="Company/Facebook page/Website"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="flex justify-center items-center gap-1.5 shrink-0 bg-[#00C085] text-white rounded-[28px] px-3 py-3 md:px-6 text-[16px] font-semibold hover:bg-[#009e6e] hover:-translate-y-0.5 transition-all">
                <IoSearch className="size-[20px]" />
                <span className="hidden md:block">Search</span>
              </button>
            </div>

            
          </div>
        )}

        {/* Decorative large background text */}
        {/* <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none z-[1]">
          <p
            className="text-[clamp(72px,13vw,140px)] font-black text-[#2D2D2D] opacity-[0.04] whitespace-nowrap text-center tracking-[-0.03em] leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            OnlinetrustPoint Reviews Bangladesh
          </p> */}
        {/* </div> */}
      </section>

      {/* ─── FILTER BAR ──────────────────────────────────────────────────── */}
      {/* <section className="bg-[#F9F9F4] px-6 pb-10 relative z-10">
        <div className="max-w-[810px] mx-auto bg-white border border-[#BEBEBE] rounded-full h-[71px] flex items-center px-6 gap-2 overflow-x-auto scrollbar-none shadow-sm"> */}

      {/* Search icon */}
      {/* <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
            <circle cx="7.5" cy="7.5" r="5" stroke="#AEAEAE" strokeWidth="1.5"/>
            <path d="M11.5 11.5L15 15" stroke="#AEAEAE" strokeWidth="1.5" strokeLinecap="round"/>
          </svg> */}

      {/* Cities */}
      {/* {FILTER_CITIES.map((city, i) => (
            <span key={city} className="flex items-center gap-2 shrink-0">
              {i > 0 && <span className="text-[#E0E0E0] text-sm">·</span>}
              <button className="text-[13px] text-[#AEAEAE] px-2 py-1 rounded-full hover:text-[#0B1906] transition-colors whitespace-nowrap">
                {city}
              </button>
            </span>
          ))}

          <span className="text-[#E0E0E0] text-sm shrink-0">·</span> */}

      {/* Categories */}
      {/* {FILTER_CATS.map((cat, i) => (
            <span key={cat} className="flex items-center gap-2 shrink-0">
              {i > 0 && <span className="text-[#E0E0E0] text-sm">·</span>}
              <button className="text-[13px] text-[#AEAEAE] px-2 py-1 rounded-full hover:text-[#0B1906] transition-colors whitespace-nowrap">
                {cat}
              </button>
            </span>
          ))} */}

      {/* Search CTA */}
      {/* <button className="ml-auto shrink-0 bg-[#00C085] text-white rounded-full px-6 py-2.5 text-[14px] font-semibold flex items-center gap-2 hover:bg-[#009e6e] transition-colors">
            Search
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8.5 3.5L12 7l-3.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section> */}
    </>
  );
}
