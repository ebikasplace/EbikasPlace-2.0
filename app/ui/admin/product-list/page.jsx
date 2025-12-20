'use client'
import React, { useEffect, useState } from "react";
import { assets, productsDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/app/ui/components/admin/Footer";
import Loading from "@/app/ui/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";

const ProductList = () => {
  
  const handleDeleteProduct = async (productId) => {
    try {
      const token = await getToken();

      const { data } = await axios.delete(
        "/api/product/delete",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { productId },
        }
      );

      if (data.success) {
        setProducts(products.filter((p) => p._id !== productId));
        toast.success("Product deleted successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const { router, getToken, user } = useAppContext()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAdminProduct = async () => {

    try{

      const token = await getToken()

      const { data } = await axios.get('/api/product/admin-list',{headers:{Authorization:`Bearer ${token}`}})

      if(data.success){
        setProducts(data.products)
        setLoading(false)
      }else{
        toast.error(data.message)
      }

    } catch(error){
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if(user){
      fetchAdminProduct();
    }
  }, [user])

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? <Loading /> : <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium text-black">All Product</h2>
        <div className="flex flex-col items-center max-w-4xl w-full glow-border">
          <table className=" table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate text-black">Product</th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden text-black">Category</th>
                <th className="px-4 py-3 font-medium truncate text-black">
                  Price
                </th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden text-black">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {products.map((product, index) => (
                <tr key={index} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate text-gray-800">
                    <div className="bg-gray-500/10 rounded p-2">
                      <Image
                        src={product.image[0]}
                        alt="product Image"
                        className="w-16"
                        width={1280}
                        height={720}
                      />
                    </div>
                    <span className="truncate w-full">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden text-gray-800">{product.category}</td>
                  <td className="px-4 py-3 text-gray-800">₵{product.offerPrice}</td>
                  <td className="px-2 py-3 max-sm:hidden">
                    <div className="flex items-center gap-1 -ml-4">
                      <button onClick={() => router.push(`/ui/admin/product-edit/${product._id}`)} className="flex items-center justify-center gap-1 px-3 py-2.5 bg-blue-600 text-white rounded-md w-16">
                        <span className="hidden md:block">Edit</span>
                        <Image
                          className="h-3.5"
                          src={assets.pencil_icon}
                          alt="edit_icon"
                        />
                      </button>
                      <button onClick={() => router.push(`/ui/product/${product._id}`)} className="flex items-center justify-center gap-1 px-3 py-2.5 bg-orange-600 text-white rounded-md w-16">
                        <span className="hidden md:block">Visit</span>
                        <Image
                          className="h-3.5"
                          src={assets.redirect_icon}
                          alt="redirect_icon"
                        />
                      </button>
                      <button onClick={() => handleDeleteProduct(product._id)} className="flex items-center justify-center gap-1 px-3 py-2.5 bg-red-600 text-white rounded-md w-16">
                        <span className="hidden md:block">Delete</span>
                        <Image
                          className="h-3.5"
                          src={assets.delete_icon}
                          alt="delete_icon"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
      <Footer />
    </div>
  );
};

export default ProductList;