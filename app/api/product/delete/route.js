import { v2 as cloudinary } from "cloudinary";
import Product from "@/models/product";
import connectDB from "@/config/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authAdmin from "@/lib/authAdmin";

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function DELETE(request) {
  try {
    const { userId } = await auth();

    const isAdmin = await authAdmin(userId)

    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized Access" }); 
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({
        success: false,
        message: "Product ID is required",
      });
    }

    await connectDB();

    // Find the product to verify ownership and get images
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found",
      });
    }

    // Verify the product belongs to the admin user
    if (product.userId !== userId) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized to delete this product",
      });
    }

    // Delete images from Cloudinary
    if (product.image && product.image.length > 0) {
      await Promise.all(
        product.image.map(async (imageUrl) => {
          try {
            // Extract public_id from Cloudinary URL
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (error) {
            console.log('Error deleting image from Cloudinary:', error);
          }
        })
      );
    }

    // Delete the product
    await Product.findByIdAndDelete(productId);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
