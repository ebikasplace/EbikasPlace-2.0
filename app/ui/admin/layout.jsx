'use client'
import Navbar from '@/app/ui/components/admin/Navbar'
import Sidebar from '@/app/ui/components/admin/Sidebar'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className='flex w-full'>
        <Sidebar />
        {children}
      </div>
    </div>
  )
}

export default Layout