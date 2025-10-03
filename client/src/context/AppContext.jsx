/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from 'react-hot-toast'
import axios from 'axios'

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL


export const AppContext=createContext()

export const AppContextProvider = ({children})=>{
     const navigate=useNavigate()
     const [user,setUser]=useState(false)
     const [isSeller,setIsSeller]=useState(false)
     const [showUserLogin,setShowUserLogin]=useState(false)
     const [products,setProducts] =useState([])
    const [cartItems,setCartItems]=useState({})
    const [searchQuery,setSearchQuery] = useState({})


     const fetchSeller = async ()=>{
      try{
      const {data}  =await axios.get('/api/seller/is-auth')
      if(data.success){
        setIsSeller(true)
      }else{
        setIsSeller(false)
      }
      }catch(err){
               setIsSeller(false)
      }
     }
  

     const currency=import.meta.env.VITE_CURRENCY;

   //fetch user auth status ,user data and cart items

   const fetchUser = async()=>{
    try{
      const {data} =await axios.get('/api/user/is-auth')
      if(data.success){
        setUser(data.user)
        setCartItems(data.user.cartItems)
      }
    }catch(err){
        setUser(null)
    }
   }


     //fetch all products
     const fetchProducts = async()=>{
      try{
      const {data} = await axios.get('/api/product/list')
      if(data.success){
          setProducts(data.products)
      }else{
        toast.error(data.message)
      }
      }catch(err){
            toast.error(err.message)
      }
     }


    
     //add product to cart
     const addToCart =(itemId)=>{
      let cartData=structuredClone(cartItems);
      if(cartData[itemId]){
        cartData[itemId] += 1;
      }else{
        cartData[itemId] = 1;
      }


      setCartItems(cartData)
      toast.success("Added To Cart")
     }

     //update cart item quantity

     const updateCartItem = (itemId,quantity)=>{
      let cartData = structuredClone(cartItems)
      cartData[itemId] =quantity;
      setCartItems(cartData)
      toast.success("Cart Updated")
     }


    //  const removeFromCart = (itemId)=>{
    //   let cartData = structuredClone(cartItems)
    //   if(cartData[itemId]){
    //     cartData[itemId] -= 1;
    //     if(cartData[itemId] === 0){
    //       delete cartData[itemId];
    //     }
    //   }
    //   toast.success("Removed  From Cart")
    //  }


    const removeFromCart = (itemId)=>{
      setCartItems((prev) => {
    const newCart = { ...prev };
    delete newCart[itemId];
    return newCart;
  });
      toast.success("Removed  From Cart")
     }


      //get cart item count

      const getCartCount =()=>{
        let totalCount =0;
        for(const item in cartItems){
          totalCount += cartItems[item];
        }
        return totalCount;
      }


      //get cart total amount

      const getCartAmount =()=>{
        let totalAmount=0;
        for(const items in cartItems){
          let itemInfo = products.find((product)=> product._id === items)
          if(cartItems[items] > 0){
            totalAmount += itemInfo.offerPrice * cartItems[items];
          }
          return Math.floor(totalAmount * 100)/100;
        }
      }
     useEffect(()=>{
      fetchUser()
      fetchSeller()
      fetchProducts()
     },[])
     

     useEffect(()=>{
      const updateCart = async ()=>{
        try{
         const {data} = await axios.post('/api/cart/update',{cartItems})
         if(!data.success){
          toast.error(data.message)
         }
        }catch(err){
             toast.error(err.message)
        }
      }
    

      if(user){
        updateCart()
      }


     },[cartItems])
    const value = {
      navigate,user,setUser,isSeller,setIsSeller,
      showUserLogin,setShowUserLogin,products,
      setProducts,currency,
      addToCart,updateCartItem,removeFromCart,cartItems,
      searchQuery,setSearchQuery,
      getCartAmount,getCartCount,
      axios,fetchProducts,setCartItems,
    
    }


  return <AppContext.Provider value={value}>
    {children}
  </AppContext.Provider>
}


export const useAppContext=()=>{
    return useContext(AppContext)
}