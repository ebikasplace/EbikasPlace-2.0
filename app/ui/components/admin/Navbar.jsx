import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'
import Link from 'next/link'

const Navbar = () => {

  const { router } = useAppContext()

  return (
    <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b border-purple-600/50'>
      <Image onClick={()=>router.push('/')} className='w-28 lg:w-32 cursor-pointer' src={assets.logo} alt="" />
      
      <div className='flex items-center gap-6'>
        <Link href="/" className='hover:text-purple-400 transition text-white text-sm'>
          Back to Store
        </Link>
      </div>

      <button className='bg-purple-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-purple-700 transition'>Logout</button>
    </div>
  )
}

export default Navbar