import authAdmin from "@/lib/authAdmin";
import Product from "@/models/product";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";


export async function GET(request) {
  try{

    const { userId} = await auth()

    const isAdmin = await authAdmin(userId)

    if(!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized Access" }); 
    }

    await connectDB()

    const products = await Product.find({})
    return NextResponse.json({ success: true, products })

  }catch (error) {
    return NextResponse.json({ success: false, message: error.message })  
  }
}