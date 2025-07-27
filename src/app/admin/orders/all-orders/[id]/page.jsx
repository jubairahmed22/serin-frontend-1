"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import CustomerInfoForm from "../../../../components/OrderDetails/CustomerInfoForm";
import OrderItemsTable from "../../../../components/OrderDetails/OrderItemsTable";
import EditItemModal from "../../../../components/OrderDetails/EditItemModal";
import OrderActions from "../../../../components/OrderDetails/OrderActions";
import AddProductModal from "../../../../components/OrderDetails/AddProductModal";
import AddInventoryProductModal from "../../../../components/OrderDetails/AddInventoryProductModal";
import PaymentConfirmationModal from "../../../../components/OrderDetails/PaymentConfirmationModal";
import OrderPaymentDetails from "../../../../components/OrderDetails/OrderPaymentDetails";
import OrderInvoice from "../../../../components/OrderDetails/OrderInvoice";

const EditOrders = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;

  // State management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    method: "",
    status: "",
    cart: [],
    deliveryCharge: 0,
    total: 0,
    productTotal: 0,
    method: "",
    dueTotal: "",
    method: "",
    transactionId: "",
    PaymentAmount: "",
    paymentDate: "",
    invoiceId: "",
    _id:"",
    createdAt: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddInventoryProductModalOpen, setIsAddInventoryProductModalOpen] =
    useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentCartItem, setCurrentCartItem] = useState({
    productId: "",
    title: "",
    price: 0,
    quantity: 1,
  });
  const [currentCartIndex, setCurrentCartIndex] = useState(null);

  // Fetch initial data
  const fetchOrderData = async () => {
    try {
      if (orderId) {
        const orderResponse = await axios.get(
          `https://books-server-001.vercel.app/api/admin/all-order/${orderId}`
        );
        const order = orderResponse.data;

        setFormData({
          name: order.name || "",
          email: order.email || "",
          phone: order.phone || "",
          address: order.address || "",
          method: order.method || "",
          status: order.status || "",
          cart: order.cart || [],
          deliveryCharge: order.deliveryCharge || 0,
          total: order.total || 0,
          productTotal: order.productTotal || 0,
          PaymentAmount: order.PaymentAmount || 0,
          transactionId: order.transactionId || "",
          dueTotal: order.dueTotal || 0,
          paymentDate: order.paymentDate || "",
          invoiceId: order.invoiceId || "",
          _id: order._id,
          createdAt: order.createdAt,
        });
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      toast.error("Failed to load order data");
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [orderId]);

  // Handle cart item edit
  const handleEditClick = (item, index) => {
    setCurrentCartItem(item);
    setCurrentCartIndex(index);
    setIsEditModalOpen(true);
  };

  // Handle add product button click
  const handleAddProductClick = () => {
    setIsAddProductModalOpen(true);
  };

  const handleAddInventoryProductClick = () => {
    setIsAddInventoryProductModalOpen(true);
  };

  // Handle cart item changes in modal
  const handleCartItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentCartItem((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    }));
  };

  // Save edited cart item
  const handleSaveCartItem = async () => {
    // if (!currentCartItem.productId || !currentCartItem.title) {
    //   toast.error("Product ID and Title are required");
    //   return;
    // }

    try {
      // Make API call to update the cart item
      const response = await fetch(
        `https://books-server-001.vercel.app/api/admin/update-cart-orders/${orderId}/items/${currentCartItem.productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentCartItem),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update cart item");
      }

      const data = await response.json();

      // Update local state only after successful API call
      setFormData((prev) => {
        const updatedCart = [...prev.cart];
        updatedCart[currentCartIndex] = currentCartItem;
        return {
          ...prev,
          cart: updatedCart,
        };
      });

      setIsEditModalOpen(false);
      toast.success("Cart item updated successfully");
    } catch (error) {
      console.error("Error updating cart item:", error);
      toast.error("Failed to update cart item");
    }
  };

  // Add new product to cart
  const handleAddProductToCart = async (product) => {
    try {
      setIsLoading(true);

      // Prepare the product data for the API
      const productData = {
        productId: product.productId,
        title: product.title,
        price: product.price,
        quantity: product.quantity || 1,
        stock: product.stock || 0,
        numberOfPages: product.numberOfPages || null,
        weight: product.weight || null,
        singleImage: product.singleImage || "",
        deliveryCharge: product.deliveryCharge || 0,
        discountedPrice: product.discountedPrice || product.price,
        discountValue: product.discountValue,
        discountType: product.discountType,
        ...(product.categoryId ? { categoryId: product.categoryId } : {}),
        ...(product.subCategoryId
          ? { subCategoryId: product.subCategoryId }
          : {}),
        ...(product.childCategoryId
          ? { childCategoryId: product.childCategoryId }
          : {}),
        ...(product.publisherId ? { publisherId: product.publisherId } : {}),
        ...(product.authorId ? { authorId: product.authorId } : {}),
      };

      // Make API call to add the product
      const response = await axios.post(
        `https://books-server-001.vercel.app/api/admin/orders/${orderId}/add-product`,
        productData
      );

      // Update local state with the response from the server
      setFormData((prev) => ({
        ...prev,
        cart: response.data.order.cart,
      }));

      toast.success("Product added to order successfully");
      setIsAddProductModalOpen(false);
      setIsAddInventoryProductModalOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(
        error.response?.data?.error || "Failed to add product to order"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Form submission (for the main order form)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        method: formData.method,
        status: formData.status,
      };

      console.log("Payload to be submitted:", payload);

      const response = await axios.put(
        `https://books-server-001.vercel.app/api/admin/update/all-orders/${orderId}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      Swal.fire({
        title: "Success!",
        text: "Order updated successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push(`/admin/orders/all-orders`);
      });
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(error.response?.data?.error || "Order Update Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculate total
  const calculateTotal = () => {
    return formData.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const handleRemoveCartItem = async (index) => {
    try {
      const itemToRemove = formData.cart[index];
      if (!itemToRemove) {
        toast.error("Item not found");
        return;
      }

      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!",
      });

      if (result.isConfirmed) {
        setIsLoading(true);

        // Call the new delete API endpoint
        await axios.delete(
          `https://books-server-001.vercel.app/api/admin/orders/${orderId}/items/${
            itemToRemove.productId || itemToRemove._id
          }`
        );

        // Update local state
        setFormData((prev) => ({
          ...prev,
          cart: prev.cart.filter((_, i) => i !== index),
        }));

        toast.success("Item removed successfully");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error(error.response?.data?.error || "Failed to remove item");
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh order data after payment confirmation
  const refreshOrderData = async () => {
    await fetchOrderData();
  };

  const handleBack = () => {
    router.back();
  };

  const [activeTab, setActiveTab] = useState("orderDetails"); // State for active tab


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="p-6">
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to order list
          </button>
          <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8 mt-5">
            <button
              onClick={() => setActiveTab("orderDetails")}
              className={`py-2 px-1 cursor-pointer border-b-2 font-medium text-sm ${
                activeTab === "orderDetails"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Order Details
            </button>
            <button
              onClick={() => setActiveTab("invoice")}
              className={`py-2 px-1 cursor-pointer border-b-2 font-medium text-sm ${
                activeTab === "invoice"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Invoice
            </button>
            {/* <button
              onClick={() => setActiveTab("email")}
              className={`py-4 px-1 cursor-pointer border-b-2 font-medium text-sm ${
                activeTab === "email"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Email Customer
            </button> */}
          </nav>
        </div>

        </div>
        <div>
          {activeTab === "orderDetails" && 
          <div>
             <form onSubmit={handleSubmit} id="orderForm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-xl bg-white shadow-md p-5">
              <CustomerInfoForm
                formData={formData}
                handleChange={handleChange}
              />
              <OrderActions
                isLoading={isLoading}
                onCancel={() => router.push("/admin/orders/all-orders")}
                onSubmit={handleSubmit}
              />
            </div>
            <OrderItemsTable
              cartItems={formData.cart}
              handleEditClick={handleEditClick}
              handleRemoveCartItem={handleRemoveCartItem}
              calculateTotal={calculateTotal}
              onAddProduct={handleAddProductClick}
              onAddInventory={handleAddInventoryProductClick}
            />
          </div>
        </form>
         <div className="flex justify-end items-start w-full h-full mt-5 gap-5">
          <OrderPaymentDetails paymentData={formData}></OrderPaymentDetails>

          <div className="flex flex-col gap-5">
            <div className="w-[400px] pr-12 bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {formData.productTotal?.toFixed(2)} tk
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="font-medium">
                      {formData.deliveryCharge?.toFixed(2)} tk
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
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className={`px-4 py-2  rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                formData.payment
                  ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
                  : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              Add Payment
            </button>
          </div>
          {/* <div className="w-[300px]"></div> */}
        </div>
          </div>
          }
          {activeTab === "invoice" && 
            <OrderInvoice formData={formData} paymentData={formData} cartItems={formData.cart}></OrderInvoice>
          }
          {/* {activeTab === "email" && "3"} */}
        </div>
        
        
      </div>

      {/* Modals */}
      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentCartItem={currentCartItem}
        handleCartItemChange={handleCartItemChange}
        handleSave={handleSaveCartItem}
      />

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={handleAddProductToCart}
      />

      <AddInventoryProductModal
        isOpen={isAddInventoryProductModalOpen}
        onClose={() => setIsAddInventoryProductModalOpen(false)}
        onAddProduct={handleAddProductToCart}
      />

      <PaymentConfirmationModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderId={orderId}
        refreshOrder={refreshOrderData}
        existingPayment={formData.payment}
        formData={formData}
      />
    </div>
  );
};

export default EditOrders;
