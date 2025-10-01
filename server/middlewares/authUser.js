import jwt from 'jsonwebtoken'

const authUser =(req,res,next)=>{
    const {token} = req.cookies;

    if(!token){
        return res.json({success:false,message:'Not Authorized'})
    }

    try{
    const tokenDecode = jwt.verify(token,process.env.JWT_SECRET)
   
    if(tokenDecode.id){
         console.log(tokenDecode)
        req.userId=tokenDecode.id;
    }else{
         return res.json({success:false,message:'Not Authorized'})
    }
   next()
    }catch(err){
        return res.json({success:false,message:"Server Error"})
    }
    
}

export default authUser