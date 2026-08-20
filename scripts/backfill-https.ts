/**
 * One-off migration: rewrite stored Cloudinary URLs from http:// to https://.
 *
 * Run with:  npx tsx scripts/backfill-https.ts
 *
 * Why this is needed: uploadFile() used to resolve Cloudinary's `url` (http)
 * instead of `secure_url`, and next.config.ts whitelists only
 * `protocol: "https"` for res.cloudinary.com. next/image rejects every stored
 * http asset with a 400, and browsers block it as mixed content on an https
 * deploy. src/actions/image-action.ts now returns secure_url, so this script
 * only has to clean up rows written before that fix.
 *
 * Safe to re-run: it is idempotent and matches nothing once complete.
 *
 * Everything goes through Prisma's $runCommandRaw rather than mongoose:
 *   - Prisma's updateMany can only assign a static value, so it cannot derive
 *     each new URL from the old one. An aggregation-pipeline update can.
 *   - `images`/`imagescopies` are mongoose-owned and absent from schema.prisma,
 *     so they are unreachable through the typed Prisma API at all.
 */
import { prisma } from "../src/lib/prisma";

const FIND = "http://res.cloudinary.com";
const REPLACEMENT = "https://res.cloudinary.com";

/** Anchored: only rewrite URLs that *start* http://res.cloudinary.com. */
const MATCH = { $regex: "^http://res\\.cloudinary\\.com" };

type Target = {
  collection: string;
  field: string;
  /** imagescopies.image is String[]; every other field is a plain string. */
  array?: boolean;
};

/**
 * Deliberately not a blanket `http://` rewrite. blogs.authorAvatar is a
 * free-text URL input, so it can hold an unrelated external host that has no
 * https endpoint — forcing that to https would break it.
 */
const TARGETS: Target[] = [
  { collection: "images", field: "image" },
  { collection: "imagescopies", field: "image", array: true },
  { collection: "businesses", field: "logo" },
  { collection: "blogs", field: "coverImage" },
  { collection: "blogs", field: "authorAvatar" },
  { collection: "reviews", field: "image" },
  { collection: "User", field: "image" },
];

function rewrite(field: string, array: boolean) {
  const replaceOne = (input: string) => ({
    $replaceOne: { input, find: FIND, replacement: REPLACEMENT },
  });

  // $map so a document with a mix of http and https entries keeps the https
  // ones untouched — $replaceOne returns its input unchanged on no match.
  return array
    ? { $map: { input: `$${field}`, as: "url", in: replaceOne("$$url") } }
    : replaceOne(`$${field}`);
}

async function countMatching({ collection, field }: Target) {
  const res = (await prisma.$runCommandRaw({
    count: collection,
    query: { [field]: MATCH },
  })) as { n?: number };

  return res.n ?? 0;
}

async function migrate(target: Target) {
  const { collection, field, array = false } = target;

  const res = (await prisma.$runCommandRaw({
    update: collection,
    updates: [
      {
        q: { [field]: MATCH },
        u: [{ $set: { [field]: rewrite(field, array) } }],
        multi: true,
      },
    ],
  })) as { nModified?: number; writeErrors?: unknown[] };

  if (res.writeErrors?.length) {
    throw new Error(
      `${collection}.${field}: ${JSON.stringify(res.writeErrors)}`,
    );
  }

  return res.nModified ?? 0;
}

async function main() {
  console.log("Rewriting http://res.cloudinary.com -> https://\n");

  let migrated = 0;

  for (const target of TARGETS) {
    const label = `${target.collection}.${target.field}`;
    const before = await countMatching(target);

    if (before === 0) {
      console.log(`  ${label}: nothing to do`);
      continue;
    }

    const modified = await migrate(target);
    migrated += modified;
    console.log(`  ${label}: ${modified} modified (matched ${before})`);
  }

  // Re-count from scratch rather than trusting nModified — a silently skipped
  // document would otherwise look like a clean run.
  let remaining = 0;
  for (const target of TARGETS) {
    const left = await countMatching(target);
    if (left > 0) {
      console.error(`  FAILED ${target.collection}.${target.field}: ${left} left`);
      remaining += left;
    }
  }

  console.log(`\n${migrated} document(s) migrated, ${remaining} remaining.`);

  if (remaining > 0) process.exit(1);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
