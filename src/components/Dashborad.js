import { use, useState } from "react";
import {
  Search,
  Calendar,
  MapPin,
  Hotel,
  Plane,
  Train,
  Bus,
  Car,
  CreditCard,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import GenericContent from "./GenericContent";
import SidebarItem from "./SidebarItem";
import FlightsContent from "./FlightsContent";
import HotelsContent from "./HotelsContent";
import BusesContent from "./BusesContent";
import TrainsContent from "./TrainsContent";
import Account from "./Account";
import Modal from "./Modal";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function TravelDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("flights");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", body: "" });
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const openFeatureModal = (title, body) => {
    setModalContent({ title, body });
    setIsModalOpen(true);
  };
  useEffect(() => {
    if (isFeaturesOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed z-50 p-2 text-white bg-blue-600 rounded-md lg:hidden top-4 left-4"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:relative lg:translate-x-0 z-40 h-full transition-transform duration-300 ease-in-out bg-white shadow-lg `}
      >
        <div className="flex flex-col h-full ">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 ">
            <div className="flex justify-center items-center mb-4">
              <img
                src="/logo (1).png"
                alt="Logo"
                className="w-16 h-12 mr-4 rounded-md"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto ">
            <div className="space-y-1 ">
              <SidebarItem
                icon={<Plane />}
                text="Flights"
                active={activeTab === "flights"}
                onClick={() => setActiveTab("flights")}
              />
              <SidebarItem
                icon={<Hotel />}
                text="Hotels"
                active={activeTab === "hotels"}
                onClick={() => setActiveTab("hotels")}
              />
              <SidebarItem
                icon={<Train />}
                text="Trains"
                active={activeTab === "trains"}
                onClick={() => setActiveTab("trains")}
              />
              <SidebarItem
                icon={<Bus />}
                text="Buses"
                active={activeTab === "buses"}
                onClick={() => setActiveTab("buses")}
              />
              <SidebarItem
                icon={<Car />}
                text="Car Rental"
                active={activeTab === "cars"}
                onClick={() => setActiveTab("cars")}
              />
            </div>

            <div className="pt-6 mt-6 border-t border-gray-200">
              <h3 className="px-2 mb-3 text-xs font-semibold text-gray-500 uppercase">
                Account
              </h3>
              <div className="space-y-1">
                <SidebarItem
                  icon={<User />}
                  text="Profile"
                  active={activeTab === "profile"}
                  onClick={() => setActiveTab("profile")}
                />

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/");
                  }}
                  className="flex items-center w-full px-2 py-3 space-x-3 transition-colors rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  <div className="text-gray-500">
                    <LogOut />
                  </div>
                  Logout
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="px-6 py-4 bg-white shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-blue-700">
              {getTabTitle(activeTab)}
            </h2>
            <div className="flex items-center space-x-4">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search
                  className="absolute text-gray-400 top-2 right-3"
                  size={20}
                />
              </div>

              {/* Features Dropdown */}
              <div className="relative">
                <button
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-haspopup="true"
                  aria-expanded={isFeaturesOpen}
                  onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                >
                  Features
                </button>
                {isFeaturesOpen && (
                  <div
                    className="absolute right-0 z-10 w-48 py-2 mt-2 text-sm bg-white border border-gray-200 rounded-lg shadow-md"
                    role="menu"
                  >
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      role="menuitem"
                      onClick={() => {
                        openFeatureModal(
                          "Weather Info",
                          "Here you can check the current weather conditions of your destination."
                        );
                        setIsFeaturesOpen(false);
                      }}
                    >
                      🌤️ Weather Info
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      role="menuitem"
                      onClick={() => {
                        openFeatureModal(
                          "Travel Guide",
                          "Explore detailed travel guides for popular destinations."
                        );
                        setIsFeaturesOpen(false);
                      }}
                    >
                      📘 Travel Guide
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      role="menuitem"
                      onClick={() => {
                        openFeatureModal(
                          "Explore Destinations",
                          "Discover new destinations with curated travel insights."
                        );
                        setIsFeaturesOpen(false);
                      }}
                    >
                      🗺️ Explore Destinations
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      role="menuitem"
                      onClick={() => {
                        openFeatureModal(
                          "Packing Checklist",
                          "Use our smart packing checklist to ensure you carry everything important."
                        );
                        setIsFeaturesOpen(false);
                      }}
                    >
                      � Packing Checklist
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      role="menuitem"
                      onClick={() => {
                        openFeatureModal(
                          "Travel Help",
                          "Get emergency travel support and tips."
                        );
                        setIsFeaturesOpen(false);
                      }}
                    >
                      🆘 Travel Help
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalContent.title}
        >
          <p>{modalContent.body}</p>
        </Modal>

        <main className="p-6">
          {activeTab === "flights" && <FlightsContent />}
          {activeTab === "hotels" && <HotelsContent />}
          {activeTab === "trains" && <TrainsContent />}
          {activeTab === "buses" && <BusesContent />}
          {activeTab === "cars" && <GenericContent title="Car Rentals" />}
          {activeTab === "profile" && <Account />}
        </main>
      </div>

      <div className="fixed bottom-4 right-4 z-30">
        <button
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          className="fixed bottom-4 right-4 w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg"
        >
          {isChatbotOpen ? "❌" : "💬"}
        </button>

        {isChatbotOpen && (
          <div className="fixed bottom-16 right-4 z-50 bg-gray-900 rounded-xl shadow-lg p-4 w-full sm:w-96 max-w-[calc(100vw-2rem)] h-[60vh] sm:h-[500px]">
            <iframe
              src="https://www.chatbase.co/chatbot-iframe/WFstMZKdEyyuwbjxfxKei"
              className="w-full h-full rounded-lg border border-gray-700 bg-slate-400"
              frameBorder="0"
            ></iframe>
          </div>
        )}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-600"
            style={{
              fontSize: `${Math.random() * 25 + 10}px`,
              top: `${Math.random() * 90 + 5}%`,
              left: `${Math.random() * 90 + 5}%`,
              opacity: Math.random() * 0.2 + 0.1,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          >
            <i
              className={`fas fa-${
                ["plane", "mountain", "map-marker-alt", "compass", "ship"][
                  Math.floor(Math.random() * 5)
                ]
              }`}
            ></i>
          </motion.div>
        ))}
        <div className="absolute bottom-0 left-0 w-full h-40 flex justify-center items-end pointer-events-none z-20 opacity-50">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 150"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,100 C360,180 1080,20 1440,100 L1440,150 L0,150 Z"
              fill="rgba(59, 130, 246, 0.3)"
              stroke="rgba(59, 130, 246, 0.8)"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function getTabTitle(tab) {
  const titles = {
    flights: "Flight Bookings",
    hotels: "Hotel Reservations",
    trains: "Train Tickets",
    buses: "Bus Tickets",
    cars: "Car Rentals",
    profile: "My Profile",
  };
  return titles[tab] || "Dashboard";
}
