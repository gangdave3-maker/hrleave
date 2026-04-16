'use client'

import React, { use, useEffect, useState } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { updatePassword } from '@/app/Components/My-function'
import { Eye,EyeClosed } from 'lucide-react'

const ResetPassword=({params})=>{

  const employeeID = use(params).id
  const [toggleIcon,setToggleIcon]=useState({
                                              iconNew:false,
                                              iconConfirm:false,
                                           })
  
  const toggleButton=(iconName)=>{
  
    switch(iconName){
      case "iconNew":
        setToggleIcon((prev)=>({
        ...prev,iconNew:!toggleIcon.iconNew
        }))
      break

      case "iconConfirm":
        setToggleIcon((prev)=>({
        ...prev,iconConfirm:!toggleIcon.iconConfirm
        }))
      break

      default: console.log("There is no case matched.")
    }
  }

  const data={
    newPassword:"",
    confirmPassword:"",
  }
  const [thePass,setThePass] = useState(data)

  const changePassword=async()=>{
    if(thePass.newPassword===thePass.confirmPassword){
      try{
        const result= await updatePassword({
                              employeeID:employeeID,
                              password:thePass.newPassword,
                            })
        if(result){
          Swal.fire({
            title:"Congratulations.",
            text:"Update password successfully.",
            icon:"success"
          })
        }
      }catch(err){
        console.log(err)
      }
    }else{
      Swal.fire({
        title:"Error",
        text:"Password mismatch",
        icon:"error"
      })
    }
  }

  return (
    <div className='container bg-white/85 min-h-screen'>

      <h1 className='underline text-center pt-8! pb-2! md:pb-3! md:pt-4'>Reset Password</h1>

      <div className='flex justify-center items-center'>

        <div className='my-2'>
          
            <div className='flex flex-col md:flex-row md:justify-between items-center gap-2'>
                <label htmlFor="Email" className='text-nowrap'>New Password: </label>
                <div className='flex flex-row items-center gap-2'>
                  <input 
                    id='Email' type={toggleIcon.iconNew?"text":"password"} className='form-control w-full'
                    value={thePass.newPassword} onChange={(e)=>{
                      setThePass(prev=>({
                        ...prev,newPassword:e.target.value
                      }))
                    }}
                  />
                  
                  <span onClick={()=>toggleButton("iconNew")}>{toggleIcon.iconNew?<EyeClosed/>:<Eye/>}</span>
                </div>
                
            </div>

            <div className='flex flex-col md:flex-row md:justify-between items-center gap-2 my-2'>
                <label htmlFor="Email" className='text-nowrap'>Confirm Password: </label>
                <div className='flex flex-row items-center gap-2'>
                  <input 
                    id='Email' type={toggleIcon.iconConfirm?"text":"password"} className='form-control w-full'
                    value={thePass.confirmPassword} onChange={(e)=>{
                      setThePass(prev=>({
                        ...prev,confirmPassword:e.target.value
                      }))
                    }}
                  />
                  
                  <span onClick={()=>toggleButton("iconConfirm")}>{toggleIcon.iconConfirm?<EyeClosed/>:<Eye/>}</span>
                </div>
                
            </div>

            <div className='flex justify-center items-center my-5!'>
              <button className='btn btn-danger glow font-bold! text-xl! mr-2!' 
              >
                <Link href={'/'} className='text-white!'>Home</Link>
              </button>
              <button className='btn btn-outline-primary glow font-bold! text-xl! ml-2!' 
                onClick={()=>changePassword()}
              >
                Reset
              </button>
            </div>
        </div>

      </div>

    </div>
  )
}

export default ResetPassword
