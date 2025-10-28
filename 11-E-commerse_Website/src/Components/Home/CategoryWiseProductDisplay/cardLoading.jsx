 import "../../../index.css"; // <-- import your CSS here
 
 export function CardLoading() {
  return (
    <div className=" flex w-full gap-4 p-2 ">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
           className="relative   w-[60vw]  h-[45vh] xs:w-full   md:w-[25vw] md:h-[48vh] lg:w-[20vw]  lg:h-[44vh]  xl:w-[17vw] 2xl:w-[14vw] xl:h-[38vh]  flex-shrink-0 font-normal space-y-2 border p-4 shadow-lg border-gray-200 rounded-xl flex flex-col justify-between cursor-pointer animate-pulse"
        >
          {/* Image Placeholder */}
          <div className="flex justify-center mb-3">
            <div className="w-[40vw] sm:w-[28vw] md:w-[20vw] lg:w-[15vw] 2xl:w-[10vw] h-[20vh] 2xl:h-[15vh] bg-gray-200 rounded-lg" />
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
