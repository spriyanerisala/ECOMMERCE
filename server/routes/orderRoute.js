import express from 'express'
import { getUserOrders, placeOrderCOD ,getAllOrders} from '../controllers/orderController.js'
import authUser from '../middlewares/authUser.js'
const orderRouter = express.Router()


orderRouter.post('/cod',authUser,placeOrderCOD)
orderRouter.get('/user',authUser,getUserOrders)
orderRouter.get('/seller',authUser,getAllOrders)


export default orderRouter