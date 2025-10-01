import jwt from 'jsonwebtoken'

const authSeller = async (req, res, next) => {
    const {sellerToken} = req.cookies;
    if(!sellerToken){
        return res.json({success:false,message:"Not Authorized Admin"})
    }
     try{
      const tokenDecode = jwt.verify(sellerToken,process.env.JWT_SECRET)
      if(tokenDecode.email === process.env.SELLER_EMAIL){
        req.userId=tokenDecode.id
      }else{
        return res.json({success:false,message:"Not Authorized Admin"})
      }
      next()

     }catch(err){
          return res.json({success:false,message:err.message})
     }
    
}

export default authSeller