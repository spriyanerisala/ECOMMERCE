import jwt from 'jsonwebtoken'

//login : /api/seller/login

export const sellerLogin =async (req,res)=>{
  try{
      const {email,password} =req.body;
    if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
        const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'7d'})

        res.cookie('sellerToken',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:process.env.NODE_ENV === 'production' ? 'none' :'strict',
        maxAge:7*24*60*60*1000,//cookie expiration time
      })

      return res.json({success:true,message:"Login Successfully"})
    }else{
        return res.json({success:false,message:"Invalid Credentials"})
    }

  }catch(err){
    return res.json({success:false,message:"Server Error"})
  }
}

//seller isAuth : /api/seller/is-auth
export const isSellerAuth = async (req,res)=>{
 try{
return res.json({success:true})

 }catch(err){
  console.log(err.message)
  return res.json({success:false,message:err.message})
 }
}



//sellerLogout : /api/seller/logout

export const sellerLogout = async(req,res)=>{
   try{
    res.clearCookie('sellerToken',{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite :process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    })

    res.json({success:true,message:"Logged Out"})
   }catch(err){
    console.log(err.message)
    return res.json({success:false,message:err.message})
   }
}