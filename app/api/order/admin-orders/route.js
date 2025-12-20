import authAdmin from "@/lib/authAdmin"
import Address from "@/models/Address";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";




export async function GET(request) {
  try{

    const {userId} = await auth()

    const isAdmin = await authAdmin(userId)

    if(!isAdmin){
      return NextResponse.json({ success:false, message:"Unauthorized" })
    }

    await connectDB()

    Address.length
    const orders = await Order.find({}).populate('userId address items.product').sort({ createdAt: -1 })
    return NextResponse.json({ success:true, orders })

  }catch(error){
    return NextResponse.json({ success:false, message:error.message })
  }

}