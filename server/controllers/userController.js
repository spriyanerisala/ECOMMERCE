import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'



//userRegister : /api/user/register
export const register = async(req,res)=>{
  try{
      const {name,email,password} = req.body;
      if(!email || !password || !name){
        return res.json({success:false,message:"Fill the All Details"})
      }

      const  existingUser = await User.findOne({email})
      if(existingUser){
       return res.json({success:false,message:"User Already Exists"})
      }

      const hashedPassword = await bcrypt.hash(password,10)
      const user = await User.create({name,email,password:hashedPassword})

      const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn : '7d'})
      res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:process.env.NODE_ENV === 'production' ? 'none' :'strict',
        maxAge:7*24*60*60*1000,//cookie expiration time
      })

      return res.json({success:true,user:{email:user.email,name:user.email}})
     
  }catch(err){
    return res.json({success:false,message:err.message})
  }
}

//userLogin : /api/user/login
export const login = async(req,res)=>{
     try{

        const {email,password} = req.body;
        if(!email || !password){
             return res.json({success:false,message:"Fill the All Details"})
        }
        const  user = await User.findOne({email})
      if(!user){
       return res.json({success:false,message:"Please, Sign Up !"})
      }

      const isMatch = await bcrypt.compare(password,user.password)
      if(!isMatch){
        return res.json({success:false,message:"Invalid email or  password!"})
      }

       const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn : '7d'})
      res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:process.env.NODE_ENV === 'production' ? 'none' :'strict',
        maxAge:7*24*60*60*1000,//cookie expiration time
      })

       return res.json({success:true,user:{email:user.email,name:user.email}})
     
     }catch(err){
        return res.json({success:false,message:err.message})
     }
}



//check Auth : /api/user/is-auth
export const isAuth = async (req,res)=>{
 try{
const userId =req.userId;

const user = await User.findById(userId).select('-password')
return res.json({success:true,user})

 }catch(err){
  console.log(err.message)
  return res.json({success:false,message:err.message})
 }
}


//userLogout : /api/user/logout

export const logout = async(req,res)=>{
   try{
    res.clearCookie('token',{
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