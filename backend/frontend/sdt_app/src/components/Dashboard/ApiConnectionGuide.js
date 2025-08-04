import React from 'react';

const ApiConnectionGuide = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 mt-6 text-white">
      <h3 className="text-xl font-bold mb-4">🔗 Connect to Your Cosmos DB</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">1. Update the API endpoint:</h4>
          <code className="bg-black bg-opacity-30 px-3 py-1 rounded text-sm block">
            const response = await fetch('YOUR_AZURE_FUNCTION_URL/api/getStudentData');
          </code>
        </div>
        <div>
          <h4 className="font-semibold mb-2">2. Replace mock data with real data:</h4>
          <code className="bg-black bg-opacity-30 px-3 py-1 rounded text-sm block">
            const result = await response.json();
          </code>
        </div>
      </div>
    </div>
  );
};

export default ApiConnectionGuide;