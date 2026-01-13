import Image from "next/image";

interface Testimonial {
  id: number;
  quote: string;
  excerpt: string;
  rating: number;
  name: string;
  avatar: string;
}

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center justify-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-lg ${i < Math.floor(rating) ? 'text-[#FFC107]' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
        <span className="ml-2 text-sm md:text-base font-medium text-black">{testimonial.rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="text-center p-6 sm:p-8 hover:bg-white hover:shadow-lg">
      {/* Rating */}
      {renderStars(testimonial.rating)}

      {/* Quote */}
      <blockquote className="text-xl md:text-2xl font-normal font-marcellus text-black mb-4 leading-relaxed">
        “{testimonial.quote}”
      </blockquote>

      {/* Excerpt */}
      <p className="text-sm md:text-base text-[#868686] mb-6 leading-relaxed max-w-md mx-auto line-clamp-4">
        {testimonial.excerpt}
      </p>

      {/* Avatar + Name */}
      <div className="flex flex-col items-center">
        <Image
          width={200}
          height={200}
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-[#D9A35F] mb-3"
        />
        <span className="text-sm font-semibold text-[#482817]">{testimonial.name}</span>
      </div>
    </div>
  );
}