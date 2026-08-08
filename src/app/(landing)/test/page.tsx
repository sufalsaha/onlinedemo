"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Phone, Mail, MapPin, RotateCw, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

// Validation Schema using Zod
const contactFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  mobileOrWhatsapp: z.string().min(1, "Mobile or WhatsApp number is required"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactSectionProps {
  onSuccess?: () => void;
}

export default function ContactSection({ onSuccess }: ContactSectionProps) {
  const [error, setError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      mobileOrWhatsapp: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setError(undefined);

    try {
      console.log("Submitted Contact Data:", values);
      // TODO: Call your Server Action here (e.g., submitContactForm(values))

      reset();
      alert("আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!");
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  }

  const handleBookNow = () => {
    alert("Book Now clicked!");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 ">
        
        {/* Left Side: Text Info & Contact Details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Have Questions? Let’s Talk
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              আপনার যদি কোনো প্রশ্ন থাকে, কোনো বিষয় বুঝতে অসুবিধা হয়, অথবা আমাদের
              সম্পর্কে আরও ভালোভাবে জানতে চান, তাহলে সরাসরি আমাদের সাথে যোগাযোগ
              করুন। আমরা আপনার কথা শুনতে এবং প্রয়োজনীয় তথ্য দিতে সবসময় প্রস্তুত।
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* WhatsApp Number */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">WhatsApp Number</p>
                <p className="text-sm font-bold text-slate-900">+880 1706 712 993</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Email</p>
                <p className="text-sm font-bold text-slate-900">Onlinetrustpoint@gmail.com</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Address</p>
                <p className="text-sm font-bold text-slate-900">
                  7300, Jhenaidah Sadar, <br />
                  Jhenaidah, Bangladesh
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="lg:col-span-6">
          <Card className="w-full shadow-sm border-slate-200/80 bg-white/90 rounded-2xl p-2 sm:p-4">
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {/* Full Name */}
                <Field>
                  <FieldLabel className="text-slate-400 text-xs font-medium">Full Name</FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="Full Name"
                      aria-invalid={!!errors.fullName}
                      {...register("fullName")}
                    />
                  </FieldContent>
                  {errors.fullName && (
                    <FieldError>{errors.fullName.message}</FieldError>
                  )}
                </Field>

                {/* Email */}
                <Field>
                  <FieldLabel className="text-slate-400 text-xs font-medium">Email</FieldLabel>
                  <FieldContent>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      aria-invalid={!!errors.email}
                      {...register("email")}
                    />
                  </FieldContent>
                  {errors.email && (
                    <FieldError>{errors.email.message}</FieldError>
                  )}
                </Field>

                {/* Mobile or WhatsApp */}
                <Field>
                  <FieldLabel className="text-slate-400 text-xs font-medium">
                    Mobile or WhatsApp
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="Mobile or WhatsApp"
                      aria-invalid={!!errors.mobileOrWhatsapp}
                      {...register("mobileOrWhatsapp")}
                    />
                  </FieldContent>
                  {errors.mobileOrWhatsapp && (
                    <FieldError>{errors.mobileOrWhatsapp.message}</FieldError>
                  )}
                </Field>

                {/* Message */}
                <Field>
                  <FieldLabel className="text-slate-400 text-xs font-medium">Message</FieldLabel>
                  <FieldContent>
                    <Textarea
                      placeholder="Your Message"
                      className="min-h-[100px] resize-y"
                      aria-invalid={!!errors.message}
                      {...register("message")}
                    />
                  </FieldContent>
                  {errors.message && (
                    <FieldError>{errors.message.message}</FieldError>
                  )}
                </Field>

                {/* Book Now Button */}
                <div className="pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBookNow}
                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-xl px-5 py-2 text-xs font-semibold"
                  >
                    Book Now
                  </Button>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="text-sm font-medium p-3 bg-destructive/10 text-destructive rounded-md">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-[#00c885] hover:bg-[#00b577] text-white font-medium py-3 rounded-xl shadow-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}