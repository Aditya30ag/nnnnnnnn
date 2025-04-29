import { useState, useEffect } from 'react';

const PackingChecklist = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('clothing');
  const [tripName, setTripName] = useState('My Trip');
  const [isEditingName, setIsEditingName] = useState(false);

  // Load saved checklist from localStorage
  useEffect(() => {
    const savedChecklist = JSON.parse(localStorage.getItem('packingChecklist')) || [];
    const savedTripName = localStorage.getItem('tripName') || 'My Trip';
    setItems(savedChecklist);
    setTripName(savedTripName);
  }, []);

  // Save checklist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('packingChecklist', JSON.stringify(items));
    localStorage.setItem('tripName', tripName);
  }, [items, tripName]);

  const addItem = () => {
    if (newItem.trim() === '') return;
    
    const newItemObj = {
      id: Date.now(),
      name: newItem.trim(),
      category,
      packed: false,
      important: false
    };

    setItems([...items, newItemObj]);
    setNewItem('');
  };

  const togglePacked = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, packed: !item.packed } : item
    ));
  };

  const toggleImportant = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, important: !item.important } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all items?')) {
      setItems([]);
    }
  };

  const categories = [
    { value: 'clothing', label: '👕 Clothing' },
    { value: 'toiletries', label: '🧴 Toiletries' },
    { value: 'electronics', label: '📱 Electronics' },
    { value: 'documents', label: '📄 Documents' },
    { value: 'miscellaneous', label: '🧳 Miscellaneous' }
  ];

  const filteredItems = (category) => {
    return items.filter(item => item.category === category);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        {isEditingName ? (
          <div className="flex items-center">
            <input
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-blue-500 flex-1"
              autoFocus
            />
            <button
              onClick={() => setIsEditingName(false)}
              className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
          </div>
        ) : (
          <h2 
            className="text-2xl font-bold cursor-pointer hover:text-blue-600"
            onClick={() => setIsEditingName(true)}
          >
            {tripName} Packing List
          </h2>
        )}
        <p className="text-gray-500 text-sm">
          {items.filter(item => item.packed).length} of {items.length} items packed
        </p>
      </div>

      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex mb-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add an item..."
            className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 border-l-0 px-2 py-2 focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <button
            onClick={addItem}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
          >
            Add
          </button>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                category === cat.value 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          filteredItems(cat.value).length > 0 && (
            <div key={cat.value} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 font-medium">
                {cat.label} ({filteredItems(cat.value).length})
              </div>
              <ul className="divide-y divide-gray-200">
                {filteredItems(cat.value).map((item) => (
                  <li key={item.id} className="px-4 py-3 flex items-center">
                    <input
                      type="checkbox"
                      checked={item.packed}
                      onChange={() => togglePacked(item.id)}
                      className="h-5 w-5 text-blue-500 rounded focus:ring-blue-400"
                    />
                    <span
                      className={`ml-3 flex-1 ${item.packed ? 'line-through text-gray-400' : ''} ${
                        item.important ? 'font-medium text-red-600' : ''
                      }`}
                    >
                      {item.name}
                    </span>
                    <button
                      onClick={() => toggleImportant(item.id)}
                      className={`ml-2 p-1 rounded-full ${
                        item.important ? 'text-red-500 hover:text-red-700' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {item.important ? '❗' : '!'}
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="ml-2 text-gray-400 hover:text-red-500 p-1"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-6 flex justify-between">
          <button
            onClick={clearAll}
            className="text-red-500 hover:text-red-700 px-3 py-1 border border-red-300 rounded"
          >
            Clear All
          </button>
          <div className="text-sm text-gray-500">
            Packed: {items.filter(item => item.packed).length} / {items.length}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>Your packing list is empty</p>
          <p className="text-sm mt-1">Add items to get started</p>
        </div>
      )}
    </div>
  );
};

export default PackingChecklist;