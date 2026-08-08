"use client";

import { useState, useTransition } from "react";
import { Mail, RotateCw } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/actions/newsletter-action";

interface NewsletterFormProps {
  variant?: "compact" | "full";
}

export function NewsletterForm({ variant = "compact" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await subscribeNewsletter(email);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
        return;
      }
      setMessage({ type: "success", text: "Subscribed! Thanks for joining." });
      setEmail("");
    });
  }

  const isCompact = variant === "compact";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      <div className={`flex ${isCompact ? "flex-col" : "flex-col sm:flex-row"} gap-2.5`}>
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            type="email"
            required
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`pl-9 h-11 rounded-[10px] ${isCompact ? "bg-white" : "bg-white/95 border-none"}`}
          />
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 rounded-[10px] bg-[#00C085] hover:bg-[#00a874] text-white px-6 shrink-0"
        >
          {isPending ? <RotateCw className="w-4 h-4 animate-spin" /> : "Subscribe"}
        </Button>
      </div>
      {message && (
        <p
          className={`text-xs font-medium ${
            isCompact
              ? message.type === "success"
                ? "text-[#00C085]"
                : "text-red-500"
              : "text-white/90"
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
