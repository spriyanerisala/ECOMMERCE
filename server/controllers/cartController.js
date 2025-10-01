import User from '../models/User.js'

//update User CartData : /api/cart/update

export const updateCart = async(req,res)=>{
    try{
     const {userId,cartItems} = req.body
     await User.findByIdAndUpdate(userId,{cartItems})
     res.json({success:true,message:"Cart Updated"})

    }catch(err){
     console.log(err.message)
     return res.json({success:false,message:err.message})
    }
}