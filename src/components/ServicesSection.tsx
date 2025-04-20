import { services } from "@/data/services";
import { cn } from "@/lib/utils";

export const ServicesSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 font-sans">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 md:p-12 text-white mb-12 text-center shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
          Professional services to meet all your home and business needs
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {services.slice(0, 6).map((service) => (
          <div 
            key={service.id}
            className="bg-white rounded-xl p-6 md:p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center mb-6 gap-4">
              {service.image && (
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50">
                  <img src={service.image} alt={service.name} className="w-8 h-8" />
                </div>
              )}
              <h2 className="text-xl font-semibold">{service.name}</h2>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {service.description}
            </p>
            <button className="border-2 border-blue-500 text-blue-500 px-4 py-2 rounded font-medium hover:bg-blue-500 hover:text-white transition-colors">
              Learn More
            </button>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-8 md:p-12 text-white text-center shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-8 opacity-90">
          Connect with our team of professionals today
        </p>
        <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded hover:bg-blue-50 transition-all duration-300 hover:scale-105">
          Contact Us
        </button>
      </div>
    </div>
  );
};
