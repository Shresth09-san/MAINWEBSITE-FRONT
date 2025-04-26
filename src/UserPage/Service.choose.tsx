import React, { useState, useRef, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { allServices, serviceCategories } from '@/data/allServices';
import { services } from '@/data/services';
import SearchBar from "@/components/Navbar/SearchBar";
import gsap from "gsap";
import Cookies from 'js-cookie';
import { toast } from "react-hot-toast"; 
import { 
  Wrench, Plug, Hammer, Shield, 
  Home, Brush, Cog, Car, Smartphone, Calendar,
  Shirt, Settings, Lock
} from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Map service names to Lucide icons
const iconMap = {
  "CLEANING SERVICE": Home,
  "PLUMBING SERVICES": Wrench,
  "ELECTRICAL SERVICES": Plug,
  "CARPENTRY SERVICES": Hammer,
  "HOME APPLIANCE REPAIR": Wrench,
  "PAINTING SERVICES": Brush,
  "PEST CONTROL": Cog,
  "GARDENING & LANDSCAPING": Home,
  "HOME RENOVATION SERVICES": Settings,
  "AC & HVAC SERVICES": Cog,
  "HANDYMAN SERVICES": Wrench,
  "HOME SECURITY SERVICES": Lock,
  "MOVING & RELOCATION": Car,
  "LAUNDRY SERVICES": Shirt,
  "VEHICLE SERVICES": Car,
  "SMART HOME SERVICES": Smartphone,
  "IT & TECHNICAL SUPPORT": Settings,
  "EVENT SUPPORT SERVICES": Calendar,
  "SPECIALIZED SERVICES": Settings,
  "WELLNESS & LIFESTYLE": Shield
};

// Helper function to get the appropriate icon component
const getIconComponent = (serviceName) => {
  // Default to Settings icon if no match found
  return iconMap[serviceName.toUpperCase()] || Settings;
};

export const ServiceChoose = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef(null);
  const scrollRef = useRef(null);

  const isAuthenticated = async () => {
    const token = Cookies.get('token');
    
    try {
      const response = await axios.post(
        `${API_URL}/api/getusers/login`,
        {},
        { 
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.status === 200;
    } catch (error) {
      console.error('Authentication check failed:', error);
      return false;
    }
  };

  // Function to redirect to prebooking site
  const redirectToPrebooking = async () => {
    if (!await isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    window.location.href = 'https://prebooking.d0lt.com/login';
  };

  // Map service names to categories for robust filtering
  const serviceToCategory = useMemo(() => {
    const mapping = {};
    allServices.forEach(service => {
      if (service.name && service.category) {
        mapping[service.name] = service.category;
      }
    });
    return mapping;
  }, []);

  const getSubservicesForService = (serviceName) => {
    const service = allServices.find(s => s.name === serviceName);
    return service?.subServices || [];
  };

  // Reset scroll position and apply loading state
  const handleSearchChange = (query) => {
    setIsLoading(true);
    setSearchQuery(query);
    if (scrollRef.current) {
      gsap.set(scrollRef.current, { x: 0 });
    }
    setTimeout(() => setIsLoading(false), 300);
  };

  // Category filter: show only matching cards
  const handleCategoryChange = (category) => {
    setIsLoading(true);
    setSelectedCategory(category);
    if (scrollRef.current) {
      gsap.set(scrollRef.current, { x: 0 });
    }
    setTimeout(() => setIsLoading(false), 300);
  };

  // Filter services: only show cards matching selected category (unless "All")
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const serviceCategory = service.category || serviceToCategory[service.name] || "Other";
      // If "All", show all; else, show only matching category
      const matchesCategory = selectedCategory === "All" || serviceCategory === selectedCategory;
      if (!searchQuery) return matchesCategory;
      const searchLower = searchQuery.toLowerCase().trim();
      const nameMatch = service.name.toLowerCase().includes(searchLower);
      const descMatch = service.description && service.description.toLowerCase().includes(searchLower);
      const categoryMatch = serviceCategory.toLowerCase().includes(searchLower);
      return matchesCategory && (nameMatch || descMatch || categoryMatch);
    });
  }, [selectedCategory, searchQuery, serviceToCategory]);

  // Enhanced GSAP infinite scroll
  useEffect(() => {
    if (!scrollRef.current || !scrollContainerRef.current) return;
    
    const cleanup = () => {
      if (scrollRef.current) {
        gsap.killTweensOf(scrollRef.current);
      }
    };
    
    try {
      gsap.killTweensOf(scrollRef.current);
      
      const existingClones = scrollRef.current.querySelectorAll('.clone-item');
      existingClones.forEach(clone => clone.remove());
      
      if (selectedCategory === "All" && searchQuery === "" && filteredServices.length > 3) {
        const originalItems = Array.from(scrollRef.current.children);
        const itemCount = originalItems.length;
        
        if (itemCount < 10 && itemCount > 0) {
          originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            clone.classList.add('clone-item');
            
            // Properly attach event handlers to clones
            const button = clone.querySelector('button');
            if (button) {
              button.onclick = redirectToPrebooking;
            }
            
            scrollRef.current.appendChild(clone);
          });
        }
        
        const totalWidth = scrollRef.current.scrollWidth;
        const visibleWidth = scrollContainerRef.current.offsetWidth;
        
        if (totalWidth > visibleWidth) {
          gsap.fromTo(
            scrollRef.current,
            { x: 0 },
            { 
              x: `-${Math.min(totalWidth / 2, 2000)}px`,
              duration: Math.min(totalWidth / 80, 30),
              ease: "linear",
              repeat: -1,
              repeatRefresh: true,
              onRepeat: () => {
                if (scrollRef.current) {
                  gsap.set(scrollRef.current, { x: "0" });
                }
              }
            }
          );
        }
      } else {
        gsap.set(scrollRef.current, { x: 0 });
      }
    } catch (error) {
      console.error("Error in scroll animation:", error);
      if (scrollRef.current) {
        gsap.set(scrollRef.current, { x: 0 });
      }
    }
    
    return cleanup;
  }, [filteredServices.length, selectedCategory, searchQuery]);

  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <span key={index} className="bg-yellow-200 text-yellow-800">{part}</span> : 
        part
    );
  };

  return (
    <div className="h-screen bg-transparent flex flex-col overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl flex-grow flex flex-col">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col flex-grow">
          {/* Header with search and filters */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-4 px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">Service.</span>
            </h1>
            
            <div className="max-w-3xl mx-auto mt-2">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                <SearchBar 
                  onFilterChange={handleCategoryChange} 
                  onSearchChange={handleSearchChange} 
                  value={searchQuery}
                  placeholder="Search services..."
                />
                
                <div className="flex mt-2 relative overflow-x-auto hide-scrollbar pb-1">
                  <button 
                    onClick={() => handleCategoryChange("All")}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-all flex-shrink-0
                      ${selectedCategory === "All" 
                        ? "bg-white text-yellow-600 shadow-md" 
                        : "bg-white/20 text-white hover:bg-white/30"}`}
                  >
                    All
                  </button>
                  
                  <div className="overflow-x-auto flex gap-2 ml-2 hide-scrollbar">
                    {serviceCategories.map(category => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0
                          ${selectedCategory === category 
                            ? "bg-white text-yellow-600 shadow-md" 
                            : "bg-white/20 text-white hover:bg-white/30"}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mt-1 text-center">
                  <span className="text-white text-xs">
                    {isLoading ? (
                      <span>Filtering services...</span>
                    ) : (
                      <>Found <span className="font-semibold">{filteredServices.length}</span> service{filteredServices.length !== 1 ? 's' : ''}</>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Services display area */}
          <div className="p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 flex-grow overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : (
              <>
                {filteredServices.length > 0 ? (
                  <div 
                    ref={scrollContainerRef}
                    className="relative w-full overflow-hidden"
                    style={{ 
                      maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                      WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
                    }}
                  >
                    <div 
                      ref={scrollRef}
                      className="flex gap-4 py-2"
                      style={{ willChange: 'transform' }}
                    >
                      {filteredServices.map((service, index) => {
                        const serviceCategory = service.category || serviceToCategory[service.name] || "Other";
                        const isMatchedCategory = selectedCategory !== "All" && serviceCategory === selectedCategory;
                        
                        return (
                          <div
                            key={`${service.id || service.name}-${index}`}
                            className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all border
                              flex flex-col w-[220px] h-[280px] flex-shrink-0
                              ${isMatchedCategory ? 
                                "border-yellow-400 ring-2 ring-yellow-300" : "border-gray-100"}`}
                            style={{
                              transform: isMatchedCategory ? "translateY(-5px)" : "none"
                            }}
                          >
                            <div className="p-4 flex flex-col items-center justify-between h-full">
                              <div className="flex flex-col items-center w-full">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-md mb-3">
                                  {(() => {
                                    const IconComponent = getIconComponent(service.name);
                                    return <IconComponent size={22} className="text-white" />;
                                  })()}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">
                                  {searchQuery ? highlightMatch(service.name, searchQuery) : service.name}
                                </h3>
                                <p className="text-gray-500 text-center text-xs mb-4 line-clamp-2 w-full">
                                  {searchQuery && service.description
                                    ? highlightMatch(service.description, searchQuery)
                                    : (service.description || "Professional service available on demand")}
                                </p>
                                <span className={`px-2 py-0.5 rounded-full text-xs mb-2
                                  ${isMatchedCategory ?
                                    "bg-yellow-100 text-yellow-800 font-medium" : "bg-gray-100 text-gray-600"}`}>
                                  {serviceCategory}
                                </span>
                              </div>
                              
                              <Button 
                                className={`w-full font-medium rounded-lg 
                                shadow-md hover:shadow-lg transition-all mt-auto py-1 h-auto text-sm
                                ${isMatchedCategory ? 
                                  "bg-yellow-500 hover:bg-yellow-600 text-white" : 
                                  "bg-yellow-400 hover:bg-yellow-500 text-gray-800"}`}
                                onClick={redirectToPrebooking}
                              >
                                {getSubservicesForService(service.name).length === 0 ? 'Request Service' : 'Select Options'}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/20 p-4 rounded-xl text-center">
                    <div className="text-white text-xl font-medium mb-1">No matching services found</div>
                    <div className="flex gap-2 justify-center mt-3">
                      <Button 
                        className="bg-white text-yellow-600 hover:bg-white/90 py-1 h-auto text-sm"
                        onClick={() => {
                          handleCategoryChange("All");
                          setSearchQuery("");
                        }}
                      >
                        Reset All Filters
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Add these styles to help with scrolling categories
const styles = document.createElement('style');
styles.innerHTML = `
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}`;
document.head.appendChild(styles);

export default ServiceChoose;
