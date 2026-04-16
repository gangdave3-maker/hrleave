'use client'
import { useState } from 'react'
import Link from 'next/link'
import { delCookies } from '../api/del-cookies/route'
import { Menu, X } from 'lucide-react'

function Nav() {
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    delCookies()
    setOpen(false)
  }

  return (
    <nav className="w-full overflow-hidden whitespace-nowrap!">
     
        <div className="hidden md:flex justify-around items-center whitespace-nowrap pt-5!">
          <Link href={'/Hall'} className='md:text-4xl font-bold text-black hover:text-blue-700!'>Main</Link>
          <Link href={'/Boss'} className='md:text-4xl font-bold text-black hover:text-blue-700!'>Boss</Link>
          <Link href={'/About'} className='md:text-4xl font-bold text-black hover:text-blue-700!'>Developer</Link>
          <Link href={'/'} className='md:text-4xl font-bold text-black hover:text-blue-700!' onClick={()=>handleLogout()}>Logout</Link>
        </div>

      

      {/* Mobile Menu */}
      <div className="container flex items-start! mt-3! justify-start">
        {/* Hamburger Button (Mobile) */}
        <button
          className="md:hidden text-black left-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={32} className='text-start'/> : <Menu size={32} />}
        </button>

        {open && (
          <div className="md:hidden bgc border-t border-white/10 z-10!">
            <div className="flex flex-col items-center gap-6 py-6">

              <Link
                href="/Hall"
                className="text-2xl font-bold text-blue-700! pl-15!"
                onClick={() => setOpen(false)}
              >
                Main
              </Link>

              <Link
                href="/Boss"
                className="text-2xl font-bold text-blue-700! pl-15!"
                onClick={() => setOpen(false)}
              >
                Boss
              </Link>

              <Link
                href="/About"
                className="text-2xl font-bold text-blue-700!"
                onClick={() => setOpen(false)}
              >
                Developer
              </Link>

              <Link
                href="/"
                className="text-2xl font-bold text-blue-700! pl-8!"
                onClick={handleLogout}
              >
                Logout
              </Link>

            </div>
          </div>
        )}
        
      </div>
    </nav>

  )
}

export default Nav

// 1. วิเคราะห์ปัญหา
// ในโค้ดของคุณ โครงสร้างเป็นแบบนี้:

// JavaScript
// <div className="flex ... justify-start">
//   {open && ( <div>...Mobile Menu...</div> )} {/* Element ที่ 1 */}
//   <button>...</button>                      {/* Element ที่ 2 */}
// </div>
// เมื่อ open เป็น true:

// Mobile Menu (รายการ Link ต่างๆ) จะถูกวาดขึ้นมาเป็น Element แรก ทางซ้ายสุด

// ปุ่ม X จะถูกดันไปต่อท้าย (ทางขวา) ของเมนูนั้นทันที ตามระเบียบของ flex และ justify-start
