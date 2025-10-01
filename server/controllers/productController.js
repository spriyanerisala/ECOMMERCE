import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Product from "../models/Product.js";

// Add Product Controller
// export const addProduct = async (req, res) => {
//   try {
//     console.log("files:", req.files);
//     console.log("body:", req.body);

//     // Parse product data from frontend
//     const productData = JSON.parse(req.body.productData);
//     console.log(productData);

//     const images = req.files;

//     // Upload images to Cloudinary using unsigned preset (no signature needed)
//     const imagesUrl = await Promise.all(
//       images.map(async (file) => {
//         const result = await cloudinary.uploader.upload(file.path, {
//           resource_type: "image",
//           upload_preset: "product_unsigned"
//         });
//         // Delete local file after upload
//         fs.unlinkSync(file.path);
//         return result.secure_url;
//       })
//     );

//     console.log("image urls:", imagesUrl);

//     // Save product in DB
//     const product = await Product.create({ ...productData, image: imagesUrl });
//     console.log(product);

//     return res.json({ success: true, message: "Product Added", product });
//   } catch (err) {
//     console.log(err.message);
//     return res.json({ success: false, message: err.message });
//   }
// };
// export const addProduct = async (req, res) => {
//   try {
//     // Debug: files and body
//     console.log("files:", req.files);
//     console.log("body:", req.body);

//     // Parse product data
//     const productData = JSON.parse(req.body.productData);
//     console.log("productData:", productData);

//     const images = req.files;

//     // Upload images to Cloudinary
//     const imagesUrl = await Promise.all(
//       images.map(async (file) => {
//         const result = await cloudinary.uploader.upload(file.path, {
//           resource_type: "image", // signed upload
//         });

//         // Delete temp file
//         fs.unlinkSync(file.path);

//         return result.secure_url;
//       })
//     );

//     console.log("image urls:", imagesUrl);

//     // Create product in MongoDB
//     const product = await Product.create({
//       ...productData,
//       image: imagesUrl,
//     });

//     return res.json({
//       success: true,
//       message: "Product Added Successfully",
//       product,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };export const addProduct = async (req, res) => {

export const addProduct = async (req, res) => {
  try {
    console.log("Files:", req.files);
    console.log("Body:", req.body);

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ success: false, message: "No images uploaded" });

    // Parse product data from frontend
    const productData = JSON.parse(req.body.productData);
     productData.price = Number(productData.price);
  productData.offerPrice = Number(productData.offerPrice);
    console.log("Parsed productData:", productData);

    // Upload images to Cloudinary (signed upload)
    const imagesUrl = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image", // SIGNED upload
        });
        fs.unlinkSync(file.path); // remove temp file
        return result.secure_url;
      })
    );

    // Create product in MongoDB
    const product = await Product.create({ ...productData,image: imagesUrl });
     await product.save()
    return res.json({ success: true, message: "Product Added Successfully", product });
  } catch (err) {
    console.error("Error in addProduct:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

//Get Product : /api/product/list
export const productList  = async (req,res)=>{
  try{
  const products = await Product.find()
  res.json({success:true,products})
  }catch(err){
console.log(err.message)
  return res.json({success:false,message:err.message})
  }
}


//Get Single Product : /api/product/id
export const productById  = async (req,res)=>{
try{
  const {id} = req.body;
  const product = await Product.findById(id)
  res.json({success:true,product})
}catch(err){
    console.log(err.message)
  return res.json({success:false,message:err.message})
}
}


//Change Product : /api/product/stock
export const changeStock  = async (req,res)=>{
try{
     const {id,inStock} = req.body
     await Product.findByIdAndUpdate(id,{inStock})
     res.json({success:true,message:"Stock Updated"})

}catch(err){
     console.log(err.message)
  return res.json({success:false,message:err.message})
}
}


