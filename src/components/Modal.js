import WeatherInfo from "./features/WeatherInfo";
import TravelGuide from "./features/TravelGuide";
import LocationExplorer from "./features/ExporeLocation";
import PackingChecklist from "./features/PackingChecklist";
import EmergencySOS from "./features/TravelHelper";

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
  
    const renderFeatureContent = () => {
      switch (title) {
        case "Weather Info":
          return <><WeatherInfo/></>;
        case "Travel Guide":
          return <><TravelGuide/></>;
        case "Explore Destinations":
          return <><LocationExplorer/></>;
        case "Packing Checklist":
          return <><PackingChecklist/></>;
        case "Travel Help":
          return <><EmergencySOS/></>;
        default:
          return children || <p>No additional information available.</p>;
      }
    };
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <div>{renderFeatureContent()}</div>
        </div>
      </div>
    );
  }
  