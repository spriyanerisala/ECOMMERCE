import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import connectDB from './configs/db.js';
import userRouter from './routes/userRoute.js'
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
dotenv.config()

const app = express()

const port = process.env.PORT || 4000


await connectDB()
await connectCloudinary()

const allowedOrigins = process.env.FRONTEND_ORIGIN;

//middlewares

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:allowedOrigins,credentials:true, methods:["GET","POST","PUT","DELETE"],
}))

app.get('/',(req,res)=>{
    res.send("API is Working...")
})

app.use('/api/user',userRouter)
app.use('/api/seller',sellerRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)

app.listen(port,()=>{
    console.log(`Server Running on the port ${port}`)
})
