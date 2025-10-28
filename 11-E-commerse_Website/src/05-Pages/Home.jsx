import banner from "../assets/banner.jpg";
import banner_mobile from "../assets/banner-mobile.jpg"
import { Category } from "../Components/Home/category";
export function Home() {
  
  return (
    <>
      <section className="lg:mx-8 lg:my-8 mx-2 my-2">
        <section className={`w-full  min-h-44 bg-gray-300  ${(!banner  &&  !banner_mobile)&&  "h-65 animate-pulse"} rounded-2xl`}>
          <img src={banner} alt="banner" className="w-full h-full hidden lg:flex" />
          <img src={banner_mobile} alt="banner" className="w-full min-h-48 lg:hidden " />
        </section>


        <Category/>

2

       
      </section>
    </>
  );
}
