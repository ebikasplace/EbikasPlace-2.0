import connectDB from "@/config/db";
import User from "@/models/user";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request){
  try{

    const { userId } = await auth(request)

    await connectDB()
    const user = await User.findById(userId)

    const {cartitems} = user

    return NextResponse.json({success: true, cartitems})

  } catch(error){
     NextResponse.json({success: false, message: error.message})
  }
}