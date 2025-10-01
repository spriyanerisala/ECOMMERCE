// /* eslint-disable no-undef */
// /* eslint-disable no-unused-vars */
// import React, { useState } from 'react'
// import { assets } from '../assets'
// import { useAppContext } from '../context/AppContext'
// import { useEffect } from 'react'
// import toast from 'react-hot-toast'


// const InputField = ({ type, placeholder, name, handleChange, address }) => (
//   <input
//     type={type}
//     placeholder={placeholder}
//     onChange={handleChange}
//     name={name}
//     value={address[name] || ""} // ensure value is never undefined
//     required
//     className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 w-full"
//   />
// );


// const AddAddress = () => {
//    const {axios,navigate,user} = useAppContext()
//     const [address,setAddress]=useState({
//         firstName: "",
//     lastName: "",
//     email: "",
//     street: "",
//     city: "",
//     state: "",
//     zipcode: "",    
//     country: "",
//     phone: "",
//     })
    
//     const handleChange = (e)=>{
//         const {name,value} =e.target;
//         setAddress((prevAddress)=>(
//             {
//                 ...prevAddress,
//                 [name]:value,
//             }
//         ))
//     }
    
//     const onSubmitHandler =async(e)=>{
//         e.preventDefault()
//     try{
//         const payload = {...address,userId:user._id}
//         const {data} =await axios.post('/api/address/add',payload)
//         if(data.success){
//             toast.success(data.message)
//             navigate('/cart')
//         }else{
//                   toast.error(data.message)
//         }

//     }catch(err){
//       toast.error(err.message)
//     }
// }

// useEffect(()=>{
// if(!user){
//     navigate('/cart')
// }
// },[user,navigate])
//   return (
//     <div className='mt-16 pb-16'>
//         <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping<span className='font-semibold text-primary'> Address</span></p>
//         <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
//             <div className='flex-1 max-w-md'>
//                 <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm' >
//                     <div className='grid grid-cols-2 gap-4'>
//                         <InputField handleChange={handleChange} address={address} name='firstName' type='text' placeholder='First Name' />
//                         <InputField handleChange={handleChange} address={address} name='lastName' type='text' placeholder='Last Name' />
//                     </div>

                    
//                       <InputField handleChange={handleChange} address={address} name='email' type='email' placeholder='Email Address' />
//                       <InputField handleChange={handleChange} address={address} name='street' type='text' placeholder='Street' />
                    
                    
//                       <div className='grid grid-cols-2 gap-4'>
//                          <InputField handleChange={handleChange} address={address} name='city' type='text' placeholder='City' />
//                           <InputField handleChange={handleChange} address={address} name='state' type='text' placeholder='State' />
//                       </div>
//                       <div className='grid grid-cols-2 gap-4'>
//                          <InputField handleChange={handleChange} address={address} name='zipcode' type='text' placeholder='Zip Code' />
//                           <InputField handleChange={handleChange} address={address} name='country' type='text' placeholder='Country' />
//                       </div>
//                       <InputField handleChange={handleChange} address={address} name='phone' type='text' placeholder='Phone Number' />
//                        <button className='w-full mt-6 bg-green-500 text-white py-3 hover:bg-green-600 transition cursor-pointer uppercase'>Save Address</button>
//                 </form> 
//             </div>
//             <img className='md:mr-16 mb-16 md:mt-0' src={assets.add_address_iamge} alt='Add Address' />


//         </div>
//     </div>
//   )
// }

// export default AddAddress

/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { assets } from '../assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    type={type}
    placeholder={placeholder}
    name={name}
    value={address[name] || ""} // ensures controlled input
    onChange={handleChange}
    required
    className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 w-full"
  />
);

const AddAddress = () => {
  const { axios, navigate, user } = useAppContext();

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",   // must match backend schema
    country: "",
    phone: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit address
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("User not logged in");

    try {
      const payload = { ...address, userId: user._id };
      const { data } = await axios.post('/api/address/add', payload);

      if (data.success) {
        toast.success(data.message);
        navigate('/cart');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Redirect if user not logged in
  useEffect(() => {
    if (!user) navigate('/cart');
  }, [user, navigate]);

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping<span className="font-semibold text-primary"> Address</span>
      </p>

      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="firstName"
                type="text"
                placeholder="First Name"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="lastName"
                type="text"
                placeholder="Last Name"
              />
            </div>

            <InputField
              handleChange={handleChange}
              address={address}
              name="email"
              type="email"
              placeholder="Email Address"
            />
            <InputField
              handleChange={handleChange}
              address={address}
              name="street"
              type="text"
              placeholder="Street"
            />

            {/* City & State */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="city"
                type="text"
                placeholder="City"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="state"
                type="text"
                placeholder="State"
              />
            </div>

            {/* Zipcode & Country */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                address={address}
                name="zipcode"
                type="text"
                placeholder="Zip Code"
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name="country"
                type="text"
                placeholder="Country"
              />
            </div>

            {/* Phone */}
            <InputField
              handleChange={handleChange}
              address={address}
              name="phone"
              type="text"
              placeholder="Phone Number"
            />

            <button className="w-full mt-6 bg-green-500 text-white py-3 hover:bg-green-600 transition cursor-pointer uppercase">
              Save Address
            </button>
          </form>
        </div>

        <img
          className="md:mr-16 mb-16 md:mt-0"
          src={assets.add_address_iamge}
          alt="Add Address"
        />
      </div>
    </div>
  );
};

export default AddAddress;
