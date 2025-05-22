import { notFound } from "next/navigation";
import blogData from "@/components/Blog/blogData";
import Image from "next/image";

export function generateStaticParams() {
  return blogData.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const blog = blogData.find((item) => item.slug === slug);

  if (!blog) return notFound();

  return (
    <section className="pt-28 pb-28 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container max-w-3xl mx-auto px-6 md:px-0">
        {/* Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-700 transition"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight">
          {blog.title}
        </h1>

        {/* Featured Image */}
        <div className="relative w-full h-[400px] md:h-[450px] mb-10 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Blog Content */}
        <article className="prose prose-lg prose-blue dark:prose-invert max-w-none mb-12">
          <p>{blog.paragraph}</p>
          {/* You can extend this section with more paragraphs or rich content */}
        </article>

        {/* Author Info */}
        <div className="flex items-center gap-4 border-t border-gray-300 dark:border-gray-700 pt-6">
          <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-md">
            <Image
              src={blog.author.image}
              alt={blog.author.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <p className="font-semibold text-lg text-gray-900 dark:text-white">
              {blog.author.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {blog.author.designation}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
