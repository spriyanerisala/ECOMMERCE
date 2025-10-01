/* eslint-disable no-unused-vars */
import React from 'react'

import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom';
import { categories } from '../assets';
import ProductCard from '../components/ProductCard';
const ProductCategory = () => {
const {products} =useAppContext();
const {category:categoryParam} =useParams()
const searchCategory = categories.find((item)=>item.path.toLowerCase() === categoryParam.toLowerCase())
const filteredProducts = products.filter((product)=>product.category.toLowerCase() === categoryParam.toLowerCase()) 
  return (
    <div className='mt-16'>
        {
            searchCategory && (
                <div className='flex flex-col items-end  w-max'>
                  <p>{searchCategory.text.toUpperCase()}</p>
                  <div className='w-16 h-0.5 bg-primary rounded-full'></div>
                 </div>   
            )
        }

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

       {filteredProducts.length === 0 && (
        <div className='flex items-center justify-center h-[60vh]'>
             <p className='text-2xl font-medium text-green-500'>No Products found in this category</p>

      </div>
       )}
 </div> 
 
 )
}



export default ProductCategory