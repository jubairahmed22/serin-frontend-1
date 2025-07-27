"use client";

import React from "react";

const InvoicePaymentDetails = ({ paymentData }) => {
  if (!paymentData?.PaymentAmount) return null;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status badge styling
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case "success":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "due":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "pending":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-blue-100 text-blue-800`;
    }
  };

  return (
    <div className="bg-white  h-full w-full overflow-hidden">
    
      
      <div className="h-full">
        <div className="space-y-1">
          {paymentData.transactionId && (
            <div className="flex justify-between items-center pb-1 border-b border-b-gray-300">
              <span className="text-sm text-gray-500">Transaction ID: </span>
              <span className="text-sm font-medium text-gray-800 break-all max-w-[200px] text-right">
                {paymentData.transactionId}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center pb-1 border-b border-b-gray-300">
            <span className="text-sm text-gray-500">Payment Method: </span>
            <span className="text-sm font-medium text-gray-800">
              {paymentData.method || "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center pb-1 border-b border-b-gray-300">
            <span className="text-sm text-gray-500">Amount Paid: </span>
            <span className="text-sm font-medium text-gray-800">
              {paymentData.PaymentAmount?.toFixed(2)} tk
            </span>
          </div>

          <div className="flex justify-between items-center pb-1 border-b border-b-gray-300">
            <span className="text-sm text-gray-500">Payment Status: </span>
            <span className={getStatusBadge(paymentData.status)}>
              {paymentData.status?.toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between items-center ">
            <span className="text-sm text-gray-500">Payment Date: </span>
            <span className="text-sm font-medium text-gray-800">
              {formatDate(paymentData.paymentDate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePaymentDetails;