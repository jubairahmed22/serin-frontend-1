"use client";

const OrderActions = ({ isLoading, onCancel }) => {
  return (
    <div className="mt-8 flex justify-end space-x-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        className={`px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className={`px-6 py-2 border border-transparent rounded-lg shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? (
          <span className="inline-flex items-center">
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        ) : (
          "Save Changes"
        )}
      </button>
    </div>
  );
};

export default OrderActions;