"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, Mail, MapPin, RotateCw } from "lucide-react";

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
import { BookingDialog } from "@/components/booking-dialog";
import { contactFormSchema, type ContactFormValues } from "@/lib/schemas/contact";
import { createContactInquiry } from "@/actions/contact-action";

const GOOGLE_BOOKING_URL =
  "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2Lwnt5bsLjm5U7yJK1xJiuXdBDqAfpRbYqf5Ib138hiGjPTnly52RxYnpHN9ud0Rn2lgxTEsLR";

interface ContactSectionProps {
  onSuccess?: () => void;
}

export default function ContactSection({ onSuccess }: ContactSectionProps) {
  const [error, setError] = useState<string | undefined>();
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | undefined>();
  const [showManualLink, setShowManualLink] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [contactInquiryId, setContactInquiryId] = useState<string | null>(null);

  const popupRef = useRef<Window | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
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

  const handleBookNow = async () => {
    setError(undefined);
    setBookingSuccess(undefined);
    setShowManualLink(false);

    // Open a blank popup synchronously, inside the click handler, so browsers
    // (esp. Safari) don't treat the later navigation as a blocked non-gesture popup.
    const popup = window.open("", "gcal-booking", "width=480,height=720");

    const valid = await trigger();
    if (!valid) {
      popup?.close();
      return;
    }

    setBookingLoading(true);
    const result = await createContactInquiry(getValues());
    setBookingLoading(false);

    if (result.error || !result.data?.id) {
      setError(result.error ?? "Failed to save your details. Please try again.");
      popup?.close();
      return;
    }

    setContactInquiryId(result.data.id);
    setBookingSuccess(
      "Your details have been saved. Complete your booking in the window that just opened."
    );

    if (popup && !popup.closed) {
      popup.location.href = GOOGLE_BOOKING_URL;
      popupRef.current = popup;
    } else {
      popupRef.current = window.open(GOOGLE_BOOKING_URL, "_blank");
    }

    if (!popupRef.current) {
      setShowManualLink(true);
      return;
    }

    const interval = setInterval(() => {
      if (popupRef.current?.closed) {
        clearInterval(interval);
        setFollowUpOpen(true);
      }
    }, 1000);
    pollIntervalRef.current = interval;
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
                    disabled={bookingLoading}
                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-xl px-5 py-2 text-xs font-semibold"
                  >
                    {bookingLoading ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Book Now"
                    )}
                  </Button>
                </div>

                {/* Booking Success Display */}
                {bookingSuccess && (
                  <div className="text-sm font-medium p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                    {bookingSuccess}
                    {showManualLink && (
                      <>
                        {" "}
                        <a
                          href={GOOGLE_BOOKING_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-semibold"
                        >
                          Open booking page
                        </a>
                      </>
                    )}
                  </div>
                )}

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

      <BookingDialog
        open={followUpOpen}
        onOpenChange={setFollowUpOpen}
        contactInquiryId={contactInquiryId}
        onDone={() => {
          reset();
          onSuccess?.();
        }}
      />
    </div>
  );
}