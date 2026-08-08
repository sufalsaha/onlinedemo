import AddBlogForm from "@/components/dashboard/forms/AddBlogForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;

  const blog = await prisma.blog.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      category: true,
      tags: true,
      authorName: true,
      authorAvatar: true,
      readingTime: true,
      featured: true,
      status: true,
    },
  });

  if (!blog) {
    notFound();
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <AddBlogForm blog={blog} asDialog={false} />
    </div>
  );
}
