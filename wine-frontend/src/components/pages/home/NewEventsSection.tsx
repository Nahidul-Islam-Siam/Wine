import Image from "next/image";

export default function NewEventsHero() {
  return (
    <section className="py-12 md:py-24 w-full min-h-[600px] md:h-[700px] container mx-auto px-4">
      <div className="flex flex-col md:flex-row h-full  overflow-hidden shadow-xl">
        {/* Left Section - Gold Background */}
        <div className="w-full md:w-1/2 bg-[#AF6900] flex flex-col items-center justify-center p-8 md:p-12">
          <h1 className="text-3xl font-abhaya md:text-5xl font-extrabold text-white mb-6 text-center">
            New Events
          </h1>
          <p className="text-lg md:text-2xl font-normal  text-white leading-relaxed text-center mb-8 max-w-md">
            WE WANT TO MAKE YOUR JOURNEY OF DISCOVERY AS ENJOYABLE AS POSSIBLE SO WE DESIGNED OUR WINE CLUB WITH YOU IN MIND.
          </p>
          <button className="bg-white text-[#9E845C] md:text-xl font-semibold px-6 py-3 md:px-10 md:py-3 rounded-md hover:bg-gray-100 transition-colors">
            Scheduling
          </button>
        </div>

        {/* Right Section - Dark Background with Image */}
        <div className="w-full md:w-1/2 h-96 md:h-full relative">
          <Image
            src="/e.png"
            alt="Woman celebrating with champagne and gold balloons"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}