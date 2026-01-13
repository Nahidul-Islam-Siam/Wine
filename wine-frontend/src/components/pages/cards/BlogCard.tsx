// components/cards/BlogCard.tsx
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  des: string;
  images: string[];
  views: number;
  createdAt: string;
  admin: {
    id: string;
    name: string;
    photo: string;
  };
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return {
      day: date.getDate(),
      month: date.toLocaleString("en-US", { month: "short" }),
    };
  };

  const { day, month } = formatDate(post.createdAt);

  const imageSrc =
    post.images && post.images.length > 0
      ? post.images[0]
      : "/images/b1.png";

  return (
    <Link
      href={`/blog/${post.id}`}
      className="w-full h-[420px] flex flex-col rounded-lg overflow-hidden hover:bg-white hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <Image
          src={imageSrc}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3 border-b border-gray-100 pb-3">
          {/* Date badge */}
          <div className="bg-[#AF6900] text-white px-3 py-2 text-center flex-shrink-0 rounded">
            <span className="block text-base font-bold leading-none">
              {day}
            </span>
            <span className="block text-[10px] font-medium uppercase">
              {month}
            </span>
          </div>

          {/* Title + Meta */}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm md:text-base font-medium text-[#444444] mb-2 line-clamp-2 break-words">
              {post.title}
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] sm:text-xs text-[#968F8F]">
              <span className="flex items-center gap-1 truncate">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="12"
                  viewBox="0 0 11 14"
                  fill="currentColor"
                >
                  <path d="M5.5 7a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0 1.4c-2.4 0-5.5 1.2-5.5 3.5V14h11v-2.1c0-2.3-3.1-3.5-5.5-3.5Z" />
                </svg>
                {post.admin.name}
              </span>

              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="currentColor"
                >
                  <path d="M7 2C3.5 2 1 7 1 7s2.5 5 6 5 6-5 6-5-2.5-5-6-5Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                </svg>
                {post.views} views
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#1E1E21] leading-relaxed line-clamp-3 mt-auto break-words">
          {post.des}
        </p>
      </div>
    </Link>
  );
}
