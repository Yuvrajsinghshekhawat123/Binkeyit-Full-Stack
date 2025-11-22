 import { FaTruck, FaShieldAlt, FaHeadphonesAlt } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";

const badges = [
  {
    icon: FaTruck,
    title: "Free Delivery",
    description: "On orders over $50"
  },
  {
    icon: FaShieldAlt,
    title: "100% Secure",
    description: "Safe payment options"
  },
  {
    icon: FaRegClock,
    title: "Same Day Delivery",
    description: "Order before 2 PM"
  },
  {
    icon: FaHeadphonesAlt,
    title: "24/7 Support",
    description: "Always here to help"
  }
];

const TrustBadges = () => {
  return (
    <section className="py-8 font-normal">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 
                       rounded-xl bg-gray-100 hover:bg-gray-200 
                       transition-all duration-300 hover:-translate-y-1 
                       group border border-gray-300"
          >
            <div
              className="w-14 h-14 rounded-full bg-green-100 
                         flex items-center justify-center mb-3
                         group-hover:bg-green-200 
                         transition-all duration-300 transform group-hover:scale-110"
            >
              <badge.icon className="w-7 h-7 text-green-600" />
            </div>

            <h3 className="font-semibold text-gray-900 mb-1">{badge.title}</h3>
            <p className="text-sm text-gray-600">{badge.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBadges;
