/**
 * Pure presentation — props in, SVG out. Lives in its own module rather than in
 * BusinessHero so that LatestReviews ("use client") can import it: BusinessHero
 * is an async Server Component that reaches getCurrentUser -> prisma, and
 * bundling is per-module, so importing from there pulled next/headers and `dns`
 * into the browser bundle and broke the build.
 *
 * Deliberately no "use client" — with no hooks it renders in either
 * environment, and the directive would force it into the client bundle for
 * BusinessHero's own server-rendered use too.
 */
export function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const boxSize = size === "sm" ? "w-[18px] h-[18px]" : "w-[22px] h-[22px]";
  const starSize = size === "sm" ? 16 : 18;

  return (
    <div className={`flex ${size === "sm" ? "gap-0.5" : "gap-1"}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(rating);
        const halfFilled = !filled && star - 0.5 <= rating;

        // হাফ-স্টারের জন্য ইউনিক আইডি গ্রাডিয়েন্ট
        const bgGradientId = `bg-half-${star}-${size}`;
        const starGradientId = `star-half-${star}-${size}`;

        return (
          <div
            key={star}
            className={`${boxSize} rounded-[2.5px] flex items-center justify-center relative overflow-hidden`}
            style={{
              background: filled
                ? "#45C646"
                : halfFilled
                  ? `linear-gradient(90deg, #45C646 50%, #ddd 50%)`
                  : "#ddd",
            }}
          >
            <svg
              width={starSize}
              height={starSize}
              viewBox="0 0 11 11"
              fill="none"
            >
              <defs>
                {/* হাফ-স্টারের ভেতরের আইকনের জন্য গ্রাডিয়েন্ট */}
                <linearGradient id={starGradientId}>
                  <stop offset="50%" stopColor="#FEFEFE" />
                  <stop offset="50%" stopColor="#bbb" />
                </linearGradient>
              </defs>
              <path
                d="M5.5 1l1.2 2.6 2.8.4-2 2 .5 2.8L5.5 7.4l-2.5 1.4.5-2.8-2-2 2.8-.4z"
                fill={
                  filled
                    ? "#FEFEFE"
                    : halfFilled
                      ? `url(#${starGradientId})`
                      : "#bbb"
                }
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
