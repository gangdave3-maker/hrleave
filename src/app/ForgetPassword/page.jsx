'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { MatchedEmployee, sendEmail } from '../Components/My-function'

function ForgetPassword() {
  const [email,setEmail] = useState("")
  
  const sendingEmail=async()=>{
    const theEmployee = await MatchedEmployee(email)
    if(theEmployee){
      //console.log(theEmployee)
      const result = await sendEmail(theEmployee)
      if(result){
        Swal.fire({
          title:"Info",
          text:"Our system sent the password reset link to your email. Please check it.",
          icon:"info"
        })
      }
    }
  }

  return (
    <div className='container bg-white/85 min-h-screen'>
      
      <h1 className='underline text-center pt-8! pb-2! md:pb-3! md:pt-4'>Forget Password</h1>
      <div className='flex justify-center items-center'>
        <div className='my-2'>
            <div className='flex flex-col md:flex-row items-center gap-2'>
                <label htmlFor="Email">Email:</label>
                <input 
                  id='Email' type="email" className='form-control w-full'
                  value={email} onChange={(e)=>setEmail(e.target.value)}
                />
                <button className='btn btn-outline-primary glow font-bold! text-xl! text-nowrap'
                  onClick={()=>sendingEmail()}
                >
                  Send Link
                </button>
            </div>
        </div>
      </div>

    </div>
  )
}

export default ForgetPassword
