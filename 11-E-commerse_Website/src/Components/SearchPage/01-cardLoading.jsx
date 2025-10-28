export function SearchPageCardLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4  lg:grid-cols-4 xl:grid-cols-5 place-items-center  gap-2 space-y-4 bg-white">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="relative w-[48vw] h-[45vh]  md:w-[24vw] md:h-[50vh] lg:w-[24vw] xl:w-[13vw] xl:h-[40vh]  flex-shrink-0 font-normal space-y-2 border p-4 shadow-lg border-gray-200 rounded-xl flex flex-col justify-between cursor-pointer animate-pulse"
        >
          {/* Image Placeholder */}
          <div className="flex justify-center mb-3">
            <div className="w-[40vw] sm:w-[28vw] md:w-[20vw] lg:w-[20vw] h-[20vh] bg-gray-200 rounded-lg" />
          </div>

          {/* Text Lines */}
          <div className="space-y-2">
            <div className="bg-gray-200 h-3 w-20 rounded-md"></div>
            <div className="bg-gray-200 h-4 w-3/4 rounded-md"></div>
            <div className="bg-gray-200 h-4 w-1/2 rounded-md"></div>
          </div>

          {/* Bottom Buttons/Price Skeleton */}
          <div className="flex justify-between items-center mt-3">
            <div className="bg-gray-200 h-4 w-1/4 rounded-md"></div>
            <div className="bg-gray-200 h-8 w-16 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
