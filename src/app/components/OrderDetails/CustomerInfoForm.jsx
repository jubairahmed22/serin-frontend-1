"use client";

const CustomerInfoForm = ({ formData, handleChange }) => {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Customer Information
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5">
         <div>
            <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Payment Method
            </label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Method</option>
              <option value="BKash Mobile Banking">BKash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cash On Delivery">Cash On Delivery</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="success">Success</option>
            </select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            required
          />
        </div>
        
      </div>
         </div>
         
      </div>
       <div className="mt-4 rounded-lg overflow-hidden border border-gray-300" style={{ height: "300px" }}>
  {formData.address ? (
    <iframe
      width="100%"
      height="100%"
      frameBorder="0"
      style={{ border: 0 }}
      src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.address)}&output=embed`}
      allowFullScreen
      aria-label="Google Maps location"
    >
    </iframe>
  ) : (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500 p-4">
      <svg 
        className="w-12 h-12 mb-3 text-gray-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="1.5" 
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="1.5" 
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      <p className="text-sm font-medium">No address provided</p>
      <p className="text-xs mt-1 text-center text-gray-400">
        Enter a valid address to view the location on map
      </p>
    </div>
  )}
        </div>
    </div>
  );
};

export default CustomerInfoForm;
