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

export async function PUT(request) {
  try {
    const { userId } = await auth();

    const isAdmin = await authAdmin(userId)

    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized Access" }); 
    }

    const formData = await request.formData();

    const productId = formData.get("productId");
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");
    const category = formData.get("category");
    const files = formData.getAll("images");

    if (
      !productId ||
      !name ||
      !description ||
      !price ||
      !offerPrice ||
      !category
    ) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    await connectDB();

    // Find the product to verify ownership
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
        message: "Unauthorized to edit this product",
      });
    }

    // Upload new images to Cloudinary if provided
    let imageUrls = product.image || [];

    if (files && files.length > 0) {
      // Delete old images from Cloudinary first
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

      // Upload new images
      const result = await Promise.all(
        files.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)

          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { resource_type: 'auto' },
              (error, result) => {
                if (error) {
                  reject(error)
                } else {
                  resolve(result)
                }
              }
            )
            stream.end(buffer);
          })
        })
      )
      imageUrls = result.map(res => res.secure_url)
    }

    // Update product fields
    const updateData = {
      name,
      description,
      price: Number(price),
      offerPrice: Number(offerPrice),
      category,
      image: imageUrls,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
