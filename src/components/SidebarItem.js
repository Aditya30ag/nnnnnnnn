export default function SidebarItem({ icon, text, active = false, onClick }) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center w-full px-2 py-3 space-x-3 transition-colors rounded-lg ${
          active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
        }`}
      >
        <div className={`${active ? 'text-blue-700' : 'text-gray-500'}`}>{icon}</div>
        <span className="text-sm font-medium">{text}</span>
        {active && <div className="w-1 h-8 ml-auto bg-blue-700 rounded-full"></div>}
      </button>
    );
  }