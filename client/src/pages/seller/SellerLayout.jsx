
// import React from "react";
// import { assets } from "../../assets";
// import { useAppContext } from "../../context/AppContext";
// import { Link,NavLink,Outlet } from "react-router-dom";
// const SellerLayout= () => {
      
//   const {setIsSeller} =useAppContext();
//     const logout=async()=>{
//       setIsSeller(false)
//     }
//     const sidebarLinks = [
//         { name: "Add Product", path: "/seller", icon: assets.add_icon },
//         { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
//         { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
//     ];

//     return (
//         <>
//             <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white ">
//                 <Link to={'/'}>
//                     <img src={assets.veg_shop_logo} className="cursor-pointer w-30 h-20 md:w-30" />
//                 </Link>
//                 <div className="flex items-center gap-5 text-gray-500">
//                     <p>Hi! Admin</p>
//                     <button onClick={logout} className='border rounded-full text-sm px-4 py-1'>Logout</button>
//                 </div>
//             </div>

//             <div>
//              <div className="md:w-64 w-16 border-r h-[550px] text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
//                 {sidebarLinks.map((item) => (
//                     <NavLink to={item.path} key={item.name} end={item.path === "/seller"}
//                         className={({isActive})=>`flex items-center py-3 px-4 gap-3 
//                             ${isActive ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-green-500 text-green-500"
//                                 : "hover:bg-gray-100/90 border-white "
//                             }`
//                         }
//                     >
//                        <img src={item.icon} className="w-7 h-7" />
//                         <p className="md:block hidden text-center">{item.name}</p>
//                     </NavLink>
//                 ))}
//             </div>

//              <div className="flex-1 p-4 overflow-y-auto">
//               <Outlet/>
//               </div>

//             <Outlet/>
//             </div>
           
//         </>
//     );
// };

// export default SellerLayout


import React from "react";
import { assets } from "../../assets";
import { useAppContext } from "../../context/AppContext";
import { Link, NavLink, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

const SellerLayout = () => {
  const { axios,navigate } = useAppContext();

  const logout = async () => {
    try{
   const {data } =await axios.get('/api/seller/logout')
   if(data.success){
    toast.success(data.message)
     navigate('/')
   }else{
    toast.error(data.message)
   }
    }catch(err){
       toast.error(err.message)
    }
  };

  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <Link to={'/'}>
          <img
            src={assets.veg_shop_logo}
            className="cursor-pointer w-30 h-20 md:w-30"
            alt="Logo"
          />
        </Link>
        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! Admin</p>
          <button onClick={logout} className="border rounded-full text-sm px-4 py-1">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="md:w-64 w-16 border-r text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/seller"}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 gap-3 
                 ${isActive
                    ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-green-500 text-green-500"
                    : "hover:bg-gray-100/90 border-white"}`
              }
            >
              <img src={item.icon} className="w-7 h-7" alt="" />
              <p className="md:block hidden text-center">{item.name}</p>
            </NavLink>
          ))}
        </div>

        {/* Page Content Rendered Here */}
        <div className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SellerLayout;
