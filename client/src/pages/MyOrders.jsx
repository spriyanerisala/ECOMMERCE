/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import {useAppContext} from '../context/AppContext'
import {  dummyOrders } from '../assets';
import toast from 'react-hot-toast';
const MyOrders = () => {

    const [myOrders,setMyOrders] =useState([])
    const {currency,axios,user} =useAppContext();
   
    const fetchMyOrders = async ()=>{
        try{

            const {data} = await axios.get('/api/order/user')
            if(data.success){
                setMyOrders(data.orders)
            }
        }catch(err){
              toast.error(err.message)
        }
    }

    useEffect(()=>{
        if(user){
fetchMyOrders()
        }
        
    },[user])

  return (
    <div>
        <div className='flex flex-col items-end w-max'>
            <p className='text-2xl font-medium uppercase mt-10'>My Orders</p>
            <div className='w-16 h-0.5 bg-green-500 rounded-full'></div>
        </div>
        {
            myOrders.map((order,index)=>(
                <div key={index} className='border border-gray-300  rounded-lg mb-10 p-4 py-5 max-w-4xl mt-10'>
                    <p className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col'>
                        <span>Order Id : {order._id}</span>
                        <span>Payment : {order.paymentType}</span>
                        <span>Total Amount : {currency} {order.amount}</span>
                    </p>
                    {order.items.map((item,index)=>(

                        <div key={index} className={`relative bg-white text-gray-500/70 ${order.items.length !== index+1 && "border-b" } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}>
                        <div className='flex items-center mb-4 md:mb-0'>
                            <div className='bg-green-500/10 p-4 rounded-2xl'>
                                <img className='w-16 h-16' src={item.product.image[0]} alt='' />
                            </div>
                            <div className='ml-4'>
                                <h2 className='text-xl font-medium text-gray-800'>{item.product.name}</h2>
                                <p >Category :  {item.product.category}</p>
                            </div>
                           </div>

                            <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>


                            <p>Quantity : {item.quantity || "1"} </p>
                            <p>Status : {order.status}</p>
                            <p>Date : {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>

                      <p className='text-green-500 text-lg font-medium'>
 Amount : {currency} {item.product.offerPrice * item.quantity}
                      </p>
                     
                        </div>

                      
                        
                    ))}
                </div>
            ))
        }

      
        
    </div>
  )
}

export default MyOrders