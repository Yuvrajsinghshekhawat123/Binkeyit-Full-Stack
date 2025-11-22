 import HeroBanner from "../Components/Home/herroSection/herro";
import { Category } from "../Components/Home/category";
import TrustBadges from "../Components/Home/trustedBadge/truestBadge";

export function Home() {
  return (
    <>
      <section className="lg:mx-8 lg:my-8 mx-2 my-2">

        {/*✨ Hero Section (Banner) */}
        <HeroBanner />
        <TrustBadges/>

        {/* Categories */}
        <Category />

      </section>
    </>
  );
}
