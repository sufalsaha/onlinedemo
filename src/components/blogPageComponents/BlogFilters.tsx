"use client";

import { useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogFiltersProps {
  search: string;
  category: string;
  tag: string;
  sort: string;
  categories: { category: string; count: number }[];
  tags: string[];
}

export function BlogFilters({
  search,
  category,
  tag,
  sort,
  categories,
  tags,
}: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchInput, setSearchInput] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function pushQuery(next: {
    q?: string;
    category?: string;
    tag?: string;
    sort?: string;
  }) {
    const query = new URLSearchParams();
    const q = next.q ?? search;
    const cat = next.category ?? category;
    const tg = next.tag ?? tag;
    const st = next.sort ?? sort;
    if (q) query.set("q", q);
    if (cat && cat !== "all") query.set("category", cat);
    if (tg && tg !== "all") query.set("tag", tg);
    if (st && st !== "latest") query.set("sort", st);
    router.push(`${pathname}?${query.toString()}`);
  }

  function handleSearchChange(value: string) {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushQuery({ q: value });
    }, 400);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
        <Input
          placeholder="Search articles by title..."
          className="pl-9 h-11 rounded-[10px] border-[#E3DBDB]"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      <Select value={category || "all"} onValueChange={(value) => pushQuery({ category: value })}>
        <SelectTrigger className="h-11 w-full sm:w-44 rounded-[10px] border-[#E3DBDB]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.category} value={c.category}>
              {c.category} ({c.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={tag || "all"} onValueChange={(value) => pushQuery({ tag: value })}>
        <SelectTrigger className="h-11 w-full sm:w-40 rounded-[10px] border-[#E3DBDB]">
          <SelectValue placeholder="Tag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tags</SelectItem>
          {tags.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort || "latest"} onValueChange={(value) => pushQuery({ sort: value })}>
        <SelectTrigger className="h-11 w-full sm:w-44 rounded-[10px] border-[#E3DBDB]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Latest</SelectItem>
          <SelectItem value="popular">Most Popular</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
