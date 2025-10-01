// import Product from '../models/Product.js'
// import Order from '../models/Order.js'


// //place order COD : /api/order/cod

// export const placeOrderCOD = async(req,res)=>{
//     try{
//         const {userId,items,address} = req.body
//         if(!address || items.length === 0){
//             return res.json({success:false,message:"Invalid Data"})
//         }
//         //calculate amount using items

//        let amount = 0;
// for (const item of items) {
//   const product = await Product.findById(item.product);
//   amount += product.offerPrice * item.quantity;
// }


//         //Add Tax Chargrt(2%)
//         amount += Math.floor(amount * 0.02)

//         await Order.create({
//             userId,
//             items,
//             amount,
//             address,
//             paymentType:"COD"
//         })
//         return res.json({success:true,message:"Order Placed Successfully"})

//     }catch(err){
//   console.log(err.message)
//   return res.json({success:false,message:err.message})
//     }
// }


// //get orders by userid :/api/order/user

// export const getUserOrders = async (req,res)=>{
//     try{

//         // const {userId} =req.body
//         // const orders = await Order.find({
//         //     userId,
//         //     $or:[{paymentType : "COD"} , { isPaid : true}]
//         // }).populate("items.product address").sqrt({createdAt : -1})
//         const orders = await Order.find({
//    userId: req.user.id,
//    $or: [{ paymentType: "COD" }, { isPaid: true }]
// }).populate("items.product address").sort({ createdAt: -1 });


//       return  res.json({success:true,orders})

//     }catch(err){
//     console.log(err.message)
//   return res.json({success:false,message:err.message})
//     }
// }


// //get all orders (for seller / admin ) : /api/order/seller

// export const getAllOrders = async (req,res)=>{
//     try{

        
//         // const orders = await Order.find({
//         //     userId,
//         //     $or:[{paymentType : "COD"} , { isPaid : true}]
//         // }).populate("items.product address").sort({createdAt : -1})
//         const orders = await Order.find({
//   $or: [{ paymentType: "COD" }, { isPaid: true }]
// }).populate("items.product address").sort({ createdAt: -1 });


//        return res.json({success:true,orders})

//     }catch(err){
//     console.log(err.message)
//   return res.json({success:false,message:err.message})
//     }
// }

import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Place order COD
export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId; // comes from authUser middleware

    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid Data" });
    }

    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }
      amount += product.offerPrice * item.quantity;
    }

    // Add tax (2%)
    amount += Math.floor(amount * 0.02);

  const order=  await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });


   order.save()
    return res.json({ success: true, message: "Order Placed Successfully" });

  } catch (err) {
    console.log(err.message);
    return res.json({ success: false, message: err.message });
  }
};

// Get orders by user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }]
    })
    .populate("items.product address")
    .sort({ createdAt: -1 });

    return res.json({ success: true, orders });

  } catch (err) {
    console.log(err.message);
    return res.json({ success: false, message: err.message });
  }
};

// Get all orders (admin/seller)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }]
    })
    .populate("items.product")
    .populate("address")
    .sort({ createdAt: -1 });

    return res.json({ success: true, orders });

  } catch (err) {
    console.log(err.message);
    return res.json({ success: false, message: err.message });
  }
};
