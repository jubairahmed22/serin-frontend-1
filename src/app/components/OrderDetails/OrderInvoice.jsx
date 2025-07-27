"use client";

import React, { useEffect, useRef, useState } from "react";
import InvoicePaymentDetails from "../../components/OrderDetails/InvoicePaymentDetails";
import "../../../styles/globals.css";
import logo from "../../../assets/book_forest.png";

const OrderInvoice = ({ cartItems, formData, paymentData }) => {
  const [configData, setConfigData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://books-server-001.vercel.app/api/get-configuration"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setConfigData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to calculate the discounted price for an item
  const calculateItemTotal = (item) => {
    if (item.discountValue > 0) {
      if (item.discountType === "percentage") {
        const discountAmount = item.price * (item.discountValue / 100);
        return (item.price - discountAmount) * item.quantity;
      } else {
        // Fixed discount
        return (item.price - item.discountValue) * item.quantity;
      }
    }
    return item.price * item.quantity;
  };

  // Function to get the discounted unit price
  const getDiscountedPrice = (item) => {
    if (item.discountValue > 0) {
      if (item.discountType === "percentage") {
        const discountAmount = item.price * (item.discountValue / 100);
        return (item.price - discountAmount).toFixed(2);
      } else {
        // Fixed discount
        return (item.price - item.discountValue).toFixed(2);
      }
    }
    return item.price.toFixed(2);
  };

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

  const printRef = useRef();

  const fetchStyles = async () => {
    const styles = [];

    // Inline <style> tags
    document.querySelectorAll("style").forEach((style) => {
      styles.push(style.innerHTML);
    });

    // Inline <link> tags (external stylesheets)
    const linkPromises = Array.from(
      document.querySelectorAll('link[rel="stylesheet"]')
    ).map(async (link) => {
      try {
        const response = await fetch(link.href, { mode: "cors" });
        if (response.ok) {
          const cssText = await response.text();
          styles.push(cssText);
        } else {
          console.warn("Failed to fetch stylesheet:", link.href);
        }
      } catch (err) {
        console.warn("Error fetching stylesheet:", link.href, err);
      }
    });

    await Promise.all(linkPromises);
    return styles.join("\n");
  };

  const handlePrint = async () => {
    try {
      const styles = await fetchStyles();

      const printFrame = document.createElement("iframe");
      printFrame.style.position = "fixed";
      printFrame.style.right = "0";
      printFrame.style.bottom = "0";
      printFrame.style.width = "0";
      printFrame.style.height = "0";
      printFrame.style.border = "0";
      printFrame.style.visibility = "hidden";
      document.body.appendChild(printFrame);

      const printDoc =
        printFrame.contentDocument || printFrame.contentWindow?.document;
      if (!printDoc) throw new Error("Failed to create print document");

      // Clone only the printRef content
      const contentClone = printRef.current.cloneNode(true);

      printDoc.open();
      printDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${formData._id?.slice(-6) || "N/A"}</title>
          <meta charset="utf-8">
          <style>
            /* Reset styles for printing */
            body, html {
              margin: 0 !important;
              padding: 0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @page {
              size: auto;
              margin: 10mm;
            }
            * {
              visibility: visible !important;
            }
            .no-print, header, nav, aside, footer {
              display: none !important;
            }
            .print-content {
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            ${styles}
          </style>
        </head>
        <body>
          ${contentClone.innerHTML}
        </body>
      </html>
    `);
      printDoc.close();

      printFrame.onload = function () {
        setTimeout(() => {
          printFrame.contentWindow?.focus();
          printFrame.contentWindow?.print();
          setTimeout(() => {
            document.body.removeChild(printFrame);
          }, 1000);
        }, 500);
      };
    } catch (error) {
      console.error("Print error:", error);
      // Fallback to regular print
      window.print();
    }
  };

  const [clientEmail, setClientEmail] = useState(formData?.email || "");
  const [emailSubject, setEmailSubject] = useState("Your Order Invoice");

  const handleSendEmail = async () => {
    // Destructure formData to get all required fields
    const {
      email: formEmail,
      name: formName,
      number: formNumber,
      address: formAddress,
      _id: formId,
      createdAt: formCreatedAt,
      deliveryCharge: deliveryCharges,
      status: paymentStatus,
      method: paymentMethod,
      PaymentAmount: paymentAmount,
      phone: phoneNumber,
      invoiceId: InvoiceId,
      transactionId: TransactionId
    } = formData;

    // Validate required data before sending
    if (!clientEmail || !emailSubject) {
      alert("Client email and subject are required");
      return;
    }

    try {
      const response = await fetch(
        "https://books-server-001.vercel.app/api/sent-order-details",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: clientEmail,
            subject: emailSubject,
            cartItems: cartItems,
            formData: {
              // Group form-related data together
              name: formName,
              email: formEmail,
              number: formNumber,
              address: formAddress,
              deliveryCharge: deliveryCharges,
              status: paymentStatus,
              method: paymentMethod,
              PaymentAmount: paymentAmount,
              phone: phoneNumber,
              invoiceId: InvoiceId,
              transactionId: TransactionId,
              id: formId,
              createdAt: formCreatedAt,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        alert(result.message || "Email sent successfully!");
      } else {
        alert(result.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert(error.message || "Failed to send email. Please try again later.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!configData) return <div>No data found</div>;

  return (
    <div className="flex justify-center items-center flex-col fontPoppins w-[1250px]">
      <div className="w-full mb-5 flex justify-start">
        <button
          onClick={handlePrint}
          className="px-6 py-2 rounded-full bg-indigo-500 text-white  text-sm text-wt-md font-jost"
        >
          Download Pdf
        </button>
      </div>
      <div className="flex flex-row justify-between gap-10">
      <div
        ref={printRef}
        className="w-[620px] h-[1020px] print-container z-50 bg-white flex flex-col justify-between"
      >
        {/* <div
          className="w-full h-5 bg-green-700"
          style={{
            backgroundImage: `
      linear-gradient(45deg, #16a34a 25%, transparent 25%),
      linear-gradient(-45deg, #16a34a 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #16a34a 75%),
      linear-gradient(-45deg, transparent 75%, #16a34a 75%)
    `,
            backgroundSize: "10px 10px",
            backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
          }}
        ></div> */}
        <div className="w-full p-10 flex flex-col h-full">
          {/* header */}
          <div className="border-b border-green-700 pb-1 flex justify-between font-semibold text-green-900">
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row items-center gap-2">
                <img src={logo.src} className="w-28 h-28" alt=""></img>
                <div className="flex flex-col gap-1">
                  <h1 className="font-semibold text-green-900">BOOK FOREST</h1>

                  <h1 className="text-sm font-light text-green-900">
                    Email: {configData.contactEmail}
                  </h1>
                  <h1 className="text-sm font-light text-green-900">
                    Phone: {configData.contactPhone}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          {/* Information */}
          <div className="pb-1 mt-10 flex justify-between text-green-900">
            <div>
              <h1>Invoice to</h1>
              <h1 className="text-2xl font-bold">{formData.name}</h1>
              <h1>Phone : {formData.phone}</h1>
              <h1>Email : {formData.email}</h1>
              <h1>Address : {formData.address}</h1>
            </div>
            <div>
              <h1 className="text-green-900 text-sm">
                <span className="text-sm font-semibold">Invoice No :</span>{" "}
                {formData.invoiceId}
              </h1>
              <h1 className="text-green-900 text-sm">
                <span className="text-sm font-semibold">Invoice Date :</span>{" "}
                {formatDate(formData.createdAt)}
              </h1>
            </div>
          </div>
          {/* cart item */}
          <div className=" rounded-xl overflow-hidden mt-2">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-green-200">
                <thead className="bg-green-700 rounded-2xl text-white">
                  <tr>
                    <th
                      scope="col"
                      className="pl-3 pr-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Qty
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Discount
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200  bg-white">
                  {cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                      <tr
                        key={item.productId || index}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            {item.image && (
                              <div className="h-10 w-10 flex-shrink-0 mr-4">
                                <img
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={item.image}
                                  alt={item.title}
                                />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900">
                                {item.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.discountValue > 0 ? (
                            <div className="flex flex-col">
                              <span className="line-through text-gray-400">
                                {item.price.toFixed(2)} tk
                              </span>
                              <span className="text-gray-900 font-medium">
                                {getDiscountedPrice(item)} tk
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-900 font-medium">
                              {item.price.toFixed(2)} tk
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.discountValue > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                              {item.discountValue}
                              {item.discountType === "percentage" ? "%" : " tk"}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4   text-sm font-medium text-gray-900">
                          {calculateItemTotal(item).toFixed(2)} tk
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                            />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No items in this order
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Start adding products to see them here.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* payment details */}
          <div className="flex flex-row gap-5 mt-5 py-2 border-t border-green-700">
            {/* terms and conditions */}
            <div className=" w-full space-y-2">
              <h1 className="text-md text-green-900 font-semibold">
                Payment Info
              </h1>
              <InvoicePaymentDetails
                paymentData={paymentData}
              ></InvoicePaymentDetails>
            </div>
            {/* total info */}
            <div className="border-l pl-2 border-green-100 w-full">
              <div className="flex flex-col gap-5">
                <div className="">
                  <div className="">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          {formData.productTotal} tk
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery:</span>
                        <span className="font-medium">
                          {formData.deliveryCharge} tk
                        </span>
                      </div>

                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-gray-800">
                            Total:
                          </span>
                          <span className="text-lg font-bold text-indigo-600">
                            {formData.total?.toFixed(2)} tk
                          </span>
                        </div>
                        {formData?.PaymentAmount ? (
                          <div className="flex justify-between mt-2">
                            <span className="text-gray-600">Pay :</span>
                            <span className="font-medium">
                              {formData.PaymentAmount?.toFixed(2)} tk
                            </span>
                          </div>
                        ) : (
                          ""
                        )}
                        <div>
                          {formData?.dueTotal ? (
                            <div className="flex justify-between mt-2">
                              <span className="text-gray-600">Due :</span>
                              <span className="font-medium">
                                {formData.dueTotal?.toFixed(2)} tk
                              </span>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* terms and conditions */}
          <h1 className="text-md text-green-900 font-semibold mt-5">
            Terms and Conditions
          </h1>
          <div
            className="prose text-sm  text-green-900"
            dangerouslySetInnerHTML={{ __html: configData.termsAndConditions }}
          />
        </div>

        {/* footer part */}

        {/* <div
          className="w-full h-20 bg-green-700"
          style={{
            backgroundImage: `
      linear-gradient(45deg, #16a34a 25%, transparent 25%),
      linear-gradient(-45deg, #16a34a 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #16a34a 75%),
      linear-gradient(-45deg, transparent 75%, #16a34a 75%)
    `,
            backgroundSize: "10px 10px",
            backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
          }}
        ></div> */}
      </div>
      {/* email sent */}
      <div className=" w-[612px] h-56 mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
    <input
      type="email"
      value={clientEmail}
      onChange={(e) => setClientEmail(e.target.value)}
      placeholder="Client Email"
      className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-[280px] transition-all"
    />
    <input
      type="text"
      value={emailSubject}
      onChange={(e) => setEmailSubject(e.target.value)}
      placeholder="Email Subject"
      className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-[280px] transition-all"
    />
    <button
      onClick={handleSendEmail}
      className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-sm w-full sm:w-auto transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      Send Email
    </button>
  </div>
</div>
      </div>
    </div>
  );
};

export default OrderInvoice;
