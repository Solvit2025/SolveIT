import { Blog } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";

const SingleBlog = ({ blog }: { blog: Blog }) => {
  const { slug, title, image, paragraph, author, tags, publishDate } = blog;

  return (
    <div className="group shadow-one hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark relative overflow-hidden rounded-md bg-white transition duration-300">
      <Link
        href={`/blog-details/${slug}`}
        className="relative block aspect-[16/9] w-full"
      >
        <span className="bg-primary absolute top-5 right-5 z-20 rounded-full px-4 py-1.5 text-xs font-semibold text-white capitalize shadow-md">
          {tags[0]}
        </span>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-t-md"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </Link>

      <div className="p-6 sm:p-8">
        <h3>
          <Link
            href={`/blog-details/${slug}`}
            className="text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl mb-3 block transition"
          >
            {title}
          </Link>
        </h3>

        <p className="line-clamp-1 text-body-color mb-6 border-b pb-6 text-base font-medium border-body-color/10 dark:border-white/10">
          {paragraph}
        </p>


        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image src={author.image} alt={author.name} fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-medium text-dark dark:text-white">
                {author.name}
              </p>
              <span className="text-xs text-body-color dark:text-gray-400">
                {author.designation}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-dark dark:text-white">Date</p>
            <span className="text-xs text-body-color dark:text-gray-400">
              {publishDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
