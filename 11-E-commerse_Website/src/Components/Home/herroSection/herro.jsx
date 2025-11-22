 import { LuArrowRight, LuSparkles } from "react-icons/lu";
import "./h.css";

const HeroBanner = () => {
  return (
    <section className="
      relative overflow-hidden 
      rounded-2xl md:rounded-3xl 
      bg-green-600 
      p-6 sm:p-8 md:p-12 lg:p-16 
      text-white shadow-2xl
    ">

      {/* 🔹 Shimmer Layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse" />

      {/* 🔹 DOT GRID (ANIMATED) */}
      <div
        className="absolute inset-0 opacity-30 animate-dotFlow"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.25) 1px, transparent 0)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* 🔹 Floating Shapes — RESPONSIVE POSITIONS */}
      <div
        className="absolute top-10 sm:top-16 right-10 sm:right-24 
        w-10 h-10 sm:w-14 sm:h-14 
        border-4 border-white/30 
        rounded-xl rotate-12 animate-bounce"
        style={{ animationDuration: "3s" }}
      />

      <div
        className="absolute bottom-16 sm:bottom-28 right-20 sm:right-40 
        w-8 h-8 sm:w-12 sm:h-12 
        bg-white/20 rounded-full animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="
        absolute top-28 sm:top-36 right-32 sm:right-56 
        w-5 h-5 sm:w-8 sm:h-8 
        bg-white/30 rounded-lg rotate-45
      " />

      {/* 🔹 Main Content */}
      <div className="relative max-w-xl sm:max-w-2xl lg:max-w-3xl">

        {/* 🔹 Badge */}
        <div className="
          inline-flex items-center gap-2 
          rounded-full bg-white/20 backdrop-blur-md 
          px-3 sm:px-4 py-1.5 sm:py-2 
          text-xs sm:text-sm font-semibold mb-6 
          shadow border border-white/30 animate-fade-in
        ">
          <LuSparkles className="w-4 h-4" />
          Now Serving You Online
        </div>

        {/* 🔹 Heading */}
        <h1
          className="
            text-3xl sm:text-5xl md:text-6xl lg:text-7xl 
            font-bold mb-5 sm:mb-6 leading-tight 
            animate-fade-in
          "
          style={{ animationDelay: "0.1s" }}
        >
          Fresh Groceries
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
            Delivered to Your Door
          </span>
        </h1>

        {/* 🔹 Subtext */}
        <p
          className="
            text-base sm:text-xl md:text-2xl 
            text-white/95 mb-6 sm:mb-8 
            max-w-md sm:max-w-xl font-light 
            animate-fade-in
          "
          style={{ animationDelay: "0.25s" }}
        >
          Shop from 10,000+ products across all categories. Get same-day delivery on all orders.
        </p>

        {/* 🔹 Button */}
        <button
          className="
            bg-white text-green-600 
            px-6 sm:px-8 py-3 sm:py-4 md:py-5 
            font-semibold text-sm sm:text-base 
            rounded-xl shadow-2xl 
            hover:bg-white/90 transition-all 
            hover:scale-105 hover:-translate-y-1 
            gap-2 flex items-center animate-fade-in group
          "
          style={{ animationDelay: "0.35s" }}
        >
          Shop Now
          <LuArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 🔹 Sunrise Glow — Made Responsive */}
      <div className="absolute right-5 bottom-5 md:right-10 md:bottom-10 hidden sm:block">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52">
          <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl animate-pulse" />
          <div className="absolute inset-6 rounded-full bg-white/30 blur-xl" />
          <div className="absolute inset-12 rounded-full bg-white/40" />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
