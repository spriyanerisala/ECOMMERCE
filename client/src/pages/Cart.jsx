/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets} from "../assets";
import toast from 'react-hot-toast'
const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItem,
    navigate,
    getCartAmount,
    axios,
    user,
    setCartItems,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses,setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddress, setShowAddress] = useState(false);
  const [paymentOption, setPaymentOption] = useState("COD");

  const getCart = () => {
    const tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      if (product) {
        // avoid mutating original product
        tempArray.push({ ...product, quantity: cartItems[key] });
      }
    }
    setCartArray(tempArray);
  };

  const getUserAddress = async ()=>{
    try{
      
     const {data} = await axios.get(`/api/address/get?userId=${user._id}`)
     if(data.success){
      setAddress(data.addresses)
      if(data.addresses.length > 0){
        setSelectedAddress(data.addresses[0])
      }else{
        toast.error(data.message)
      }
     }
    }catch(err){
 toast.error(err.message)
    }
  }

  useEffect(() => {
    if ( products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);


  useEffect(()=>{
   if(user){
    getUserAddress()
   }
  },[user])

  // Safely compute amounts
  const total = typeof getCartAmount === "function" ? getCartAmount() : 0;
  const tax = total * 0.02;
  const totalWithTax = total + tax;

  const placeOrder =async () => {
    if (!selectedAddress) {
     
      return toast.error("Please select an address")
    }

    
    if (paymentOption === "COD") {
  const { data } = await axios.post(
    "/api/order/cod",
    {
      items: cartArray.map(item => ({
        product: item._id,
        quantity: item.quantity,
      })),
      address: selectedAddress._id,  // send only id
    },
    { withCredentials: true }
  );

  if (data.success) {
    toast.success(data.message);
    setCartItems({});
    navigate("/my-orders");
  } else {
    toast.error(data.message);
  }
}

   

    const orderDetails = {
      items: cartArray,
      totalAmount: totalWithTax,
      address: selectedAddress,
      paymentMethod: paymentOption,
      createdAt: new Date().toISOString(),
    };
   toast.success("Order Placed Successfully")
    navigate("/my-orders");
  };

  // If products or cartItems not ready, show fallback
  if (!Array.isArray(products) || products.length === 0) {
    return <div className="py-20 text-center">Loading products...</div>;
  }
  if (!cartItems || Object.keys(cartItems).length === 0) {
    return <div className="py-20 text-center">Your cart is empty.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row py-16 mt-16">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-green-500">{getCartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(`/product/${product._id}`);
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
              >
                {product.image && product.image[0] ? (
                  <img
                    className="max-w-full h-full object-cover"
                    src={product.image[0]}
                    alt={product.name}
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full" />
                )}
              </div>

              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>Weight : <span>{product.weight || "N/A"}</span></p>
                  <div className="flex items-center mt-1">
                    <p className="mr-2">Qty:</p>
                    <select
                      className="outline-none border rounded"
                      value={product.quantity}
                      onChange={(e) =>
                        updateCartItem(product._id, Number(e.target.value))
                      }
                    >
                      {Array(product.quantity > 9 ? product.quantity : 9)
                        .fill("")
                        .map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center">
              {currency}
              {product.offerPrice * product.quantity}
            </p>

            <button
              onClick={() => {
                const currentQty = cartItems[product._id];
    if (currentQty > 1) {
      updateCartItem(product._id, currentQty - 1);
    } else {
      removeFromCart(product._id);
    }
              }}
              className="cursor-pointer mx-auto"
            >
              <img
                src={assets.remove_icon}
                alt="remove"
                className="inline-block w-6 h-6"
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-green-500 font-medium"
        >
          <img
            className="group-hover:-translate-x-1 transition"
            src={assets.arrow_right_icon_colored}
            alt="arrow"
          />
          Continue Shopping
        </button>
      </div>

      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-green-500 hover:underline cursor-pointer ml-2"
            >
              Change
            </button>
          </div>

          {showAddress && (
            <div className="mt-2 border border-gray-200 rounded">
              {addresses.map((addr, i) => (
                <p
                  key={i}
                  onClick={() => {
                    setSelectedAddress(addr);
                    setShowAddress(false);
                  }}
                  className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {addr.street}, {addr.city}, {addr.state}, {addr.country}
                </p>
              ))}
              <p
                onClick={() => navigate("/add-address")}
                className="text-green-500 text-center cursor-pointer p-2 hover:bg-indigo-500/10"
              >
                Add address
              </p>
            </div>
          )}
        </div>

        <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
        <select
          onChange={(e) => setPaymentOption(e.target.value)}
          className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          value={paymentOption}
        >
          <option value="COD">Cash On Delivery</option>
          <option value="Online">Online Payment</option>
        </select>

        <hr className="border-gray-300 mt-6" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>{currency}{total.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>{currency}{tax.toFixed(2)}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>{currency}{totalWithTax.toFixed(2)}</span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-green-500 text-white font-medium hover:bg-green-600 transition"
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed to Pay"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
