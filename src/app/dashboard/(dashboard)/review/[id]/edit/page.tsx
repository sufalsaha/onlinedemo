// src/app/maintainer/reviews/[id]/edit/page.tsx

import AddReviewForm from "@/components/dashboard/forms/AddReviewForm";
import  { prisma } from "@/lib/prisma"; 

import { notFound } from "next/navigation";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditReviewPage({ params }: EditPageProps) {
  const { id } = await params;

  // ১. ডাটাবেজ থেকে এডিট করার জন্য নির্দিষ্ট রিভিউটি খুঁজে বের করুন
  const review = await prisma.review.findUnique({
    where: { id },
    select: {
      id: true,
      businessId: true,
      reviewerName: true,
      authorLocation: true,
      email: true,
      title: true,
      status: true,
      rating: true,
      message: true,
    }
  });

  if (!review) {
    notFound();
  }

  // ২. সিলেক্ট ড্রপডাউনের জন্য সব বিজনেসের লিস্ট নিয়ে আসুন
  const businesses = await prisma.business.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      {/* আমরা এখানে আপনার ফর্মটি কল করছি এবং review ডেটা পাস করে দিচ্ছি */}
      <AddReviewForm 
        businesses={businesses} 
        review={review} 
        asDialog={false} // যেহেতু পেইজে দেখাচ্ছি, তাই false
      />
    </div>
  );
}