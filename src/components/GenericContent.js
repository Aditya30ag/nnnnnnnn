export default function GenericContent({ title }) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="mb-4 text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600">
          This section is currently under development. Please check back soon for updates!
        </p>
      </div>
    );
  }