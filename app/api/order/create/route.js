import { inngest } from "@/config/inngest";
import Product from "@/models/product";
import User from "@/models/user";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function POST(request) {
  try{

    const { userId } = await auth()
    const { address, items} = await request.json()

    if(!address || items.length === 0){
      return NextResponse.json({ success: false, message: "Address and items are required to create an order" })
    }

    //calculate amount using items
    const amount = await items.reduce(async (acc, item)=> {
      const product = await Product.findById(item.product)
      return acc + product.offerPrice * item.quantity
    }, 0)

    await inngest.send({ 
      name: 'order/created', 
      data: {
        userId,
        address,
        items,
        amount: amount + Math.floor(amount * 0.02),
        date: Date.now()
        
      }

    })

    // clear cart items from request body
    const user = await User.findById(userId)
    user.cartItems = {}
    await user.save()

    return NextResponse.json({ success: true, message: "Order Placed" })  


  } catch(error){
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}