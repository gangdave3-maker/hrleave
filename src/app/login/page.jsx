'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCred, easyDate } from '../Components/My-function'
import Cookies from 'js-cookie'
import { Eye,EyeClosed } from 'lucide-react'

export default function Page() {
  var data = {
    employee_id: 0,
    title_of_courtesy:"",
    first_name: "",
    last_name: "",
    address:"",
    city:"",
    region:"",
    postal_code:"",
    country:"",
    home_phone:"",
    birth_date:"",
    hire_date:"",
    title:"",
    extension:"",
    reports_to:0,
    notes:"",
  }
  const [hallData,setHallData] = useState(data)
  const [allCred,setAllCred] = useState([])
  const [cred,setCred] = useState({
    username:'',
    password:'',
  })
  
  const [togglePassword,setTogglePassword] = useState(false)
  const swapPassword=()=>{
    setTogglePassword(!togglePassword)
  }

  useEffect(() => {
    const fetchUser = async () => {
      const users = await getCred()
      if (Array.isArray(users)){
        setAllCred(users)
      }
    }
    fetchUser()
  }, [])
//ความสามารถของ .find สามารถสร้างเงื่อนไขในการค้นหาให้มีค่าตรงกันกับที่เรา fill in เข้ามาจาก input box ก็ได้
  const theEmployee = allCred.find(item =>
  item.first_name + "-" + item.last_name === cred.username &&
  item.password === cred.password
)
//.some เป็นการค้นหา โดยถ้าหาเจอจะมีค่าเป็น true แต่ถ้าหาไม่เจอ จะมีค่าเป็น false
  const isValid = allCred.some(item=>
    item.first_name + "-" + item.last_name === cred.username && item.password === cred.password
  )

  useEffect(()=>{
    if(theEmployee){
      //เราสร้างแบบ Session Cookies ดีที่สุด ไม่ต้องระบุ expire ทั้งสิ้น จะทำให้เวลาปิดทุกแท็บใน browser จะส่งผลให้ Cookies ถูกลบทิ้งอัตโนมัติ
      Cookies.set("employeeID",theEmployee.employee_id.toString())

      const easyBirthDate = easyDate(theEmployee.birth_date)
      const easyHireDate = easyDate(theEmployee.hire_date)

      setHallData(prev=>({
        ...prev,
        employee_id: theEmployee.employee_id,
        title_of_courtesy: theEmployee.title_of_courtesy,
        first_name:theEmployee.first_name,
        last_name: theEmployee.last_name,
        address:theEmployee.address,
        city:theEmployee.city,
        region:theEmployee.region,
        postal_code:theEmployee.postal_code,
        country:theEmployee.country,
        home_phone:theEmployee.home_phone,
        birth_date:easyBirthDate,
        hire_date:easyHireDate,
        title:theEmployee.title,
        extension:theEmployee.extension,
        reports_to:theEmployee.reports_to,
        notes:theEmployee.notes,
      }))
    }
  },[theEmployee])

  return (
    <div className='flex min-w-screen items-center justify-center min-h-screen'>
      <div className="card bg-white/75!">
            <div className="card-body">
              <table>
                <tbody>
                  <tr>
                    <th className="mt-1 mb-1">
                      <div className="mt-3">Username:&nbsp;&nbsp;</div>
                    </th>
                    <td>
                      <div className="mt-3">
                        <input 
                        className="form-control mt-1 mb-1" 
                        type="text"
                        value={cred.username}
                        onChange={(e)=>{
                          setCred(prev=>({...prev,username:e.target.value}))
                        }}
                        />
                      </div>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <th className="mt-1 mb-1">
                      Password:&nbsp;&nbsp;
                    </th>
                    <td className='flex items-center'>
                      <input 
                      className="form-control mt-1 mb-1" 
                      type={togglePassword?"text":"password"}
                      value={cred.password}
                      onChange={(e)=>{
                        setCred(prev=>({
                          ...prev,password:e.target.value
                        }))
                      }}
                      />
                    </td>
                    <td className='pl-5!'>
                      <span onClick={()=>swapPassword()}>{togglePassword?<EyeClosed/>:<Eye/>}</span>
                    </td>
                  </tr>
                  <tr>
                    <th className="mt-2 mb-2"></th>
                    <td className="mt-2 mb-2 ">
                      
                    </td>
                  </tr>
                  
                </tbody>
              </table>
              
              <div className='flex items-center justify-between'>
                <div className="mt-3 mb-3">
                  <Link className="text-nowrap" href={`/ForgetPassword`}>Forget Password</Link>
                </div>

                <div className="mt-3 mb-3">
                  <button 
                    className="btn btn-primary"
                    disabled={!isValid}
                  ><Link 
                      href={'/Hall'} 
                      className="text-white"
                      onClick={() => {localStorage.setItem('employee', JSON.stringify(hallData));}}
                    >Log In
                   </Link>
                  </button>
                </div>

                <div className="mt-3 mb-3">
                  <button 
                    className="btn btn-success"
                    disabled={!isValid}
                  ><Link 
                      href={'/Boss'} 
                      className="text-white"
                      onClick={() => {localStorage.setItem('employee', JSON.stringify(hallData));}}
                    >Boss
                   </Link>
                  </button>
                </div>

              </div>

            </div>
          </div>
      
    </div>
  )
}
