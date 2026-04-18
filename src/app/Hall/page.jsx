'use client'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Nav from '../Components/Nav'
import Image from 'next/image'
import { reportTo, leaveBegin, easyDate, requestLeave, clientRefresh } from '../Components/My-function'
import Link from 'next/link'
import path from "path"

function Hall() {
  const [mounted, setMounted] = useState(false)
  const [employeeID, setEmployeeID] = useState(null)
  const [employee,setEmployee] = useState()
  const [pictName,setPictName]=useState("")
  const [sup,setSup] = useState()
  const [leaveBeginInit,setLeaveBeginInit] = useState([])
  const [remain,setRemain]=useState({
                                      Sick:0,
                                      Private:0,
                                      Summer:0,
                                    })
  const leaveData={
    employee_id:0,
    leave_type_id:0,
    start_date:'12/31/1999',
    end_date:'12/31/1999',
    reason:'',
    status:'pending',
    created_at:'12/31/1999',
  }
  const [empLeave,setEmpLeave] = useState(leaveData)

  useEffect(() => {
    const grabEmployee=()=>{
      const data = JSON.parse(localStorage.getItem('employee'));
      if(data){
        setEmployee(data);
      }
      
    }
    grabEmployee()
  }, []);

  useEffect(() => {
    const recheck=()=>{
      setMounted(true)
      setEmployeeID(Cookies.get("employeeID") || null)
    }
    recheck()
  }, [])

  useEffect(()=>{
    const grabPictName = async()=>{
      if(employee){
        //const myDate = new Date().toLocaleDateString()
        //if(myDate){
            setEmpLeave(prev=>({
            ...prev,
            employee_id:employee.employee_id,
            //created_at:myDate
          }))
        //}
        
        setPictName(`${employee.first_name}_${employee.last_name}.jpg`)
        const head =await reportTo(employee.reports_to)
        if(head){
          setSup(head)
        }

        const leaveData = await leaveBegin(employee.employee_id)
        if(leaveData){
          setLeaveBeginInit(leaveData)
        }
      }
    }
    grabPictName()
  },[employee])

  const BUCKET_URL = "https://nxsomhontjaubdsnnvmp.supabase.co/storage/v1/object/public/images";
  
/*************************************************************************************************************** */
  useEffect(()=>{
    if(leaveBeginInit.length>0){
        const maxLeave={
                        sick:30,
                        private:3,
                        summer:6,
                       }
        const summary = leaveBeginInit.reduce((acc, curr) => { //acc คือ object แน่นอนว่าข้อมูลแต่ละชุดจะมีค่า key: value
          // ตรวจสอบให้แน่ใจว่าค่าที่ได้คือ 'Sick', 'Private', หรือ 'Summer'
          const typeName = curr.leave_types?.type_name; 
          if (typeName) {
            acc[typeName] = (acc[typeName] || 0) + 1;
          }
  
          return acc;
        }, {});

        const grabAvailable=()=>{
          // 2. คำนวณค่าที่เหลือแบบ Dynamic
          // ใช้ค่าจาก maxLeave เป็นตัวตั้ง แล้วลบด้วยค่าที่มีใน summary (ถ้าไม่มีให้เป็น 0)
          setRemain({
            Sick: maxLeave.sick - (summary.Sick || 0),
            Private: maxLeave.private - (summary.Private || 0),
            Summer: maxLeave.summer - (summary.Summer || 0),
          });
        }

        if(summary){
          grabAvailable()
        }
    }else{
      const maxLeave={
                      sick:30,
                      private:3,
                      summer:6,
                     }
      const summary = {
        Private:0,
        Sick:0,
        Summer:0,
      }

      const grabAvailable=()=>{
        setRemain(prev=>({
          ...prev,
          Private: maxLeave.private - summary.Private,
          Sick: maxLeave.sick - summary.Sick,
          Summer: maxLeave.summer - summary.Summer
        }))
      }

      grabAvailable()
      
    }
  },[leaveBeginInit])
/*************************************************************************************************************** */
  const handleSubmit = (e) => {
    e.preventDefault(); // สำคัญมาก: กันไม่ให้หน้าเว็บ Refresh
    requestLeave(empLeave); // ส่ง State ปัจจุบันไปทำงาน
  };

  //useEffect(()=>{console.log(leaveBeginInit)},[leaveBeginInit])

  if (!mounted) return null // ⬅️ hydration-safe
/*ปัญหาเรื่องการแสดงผล table การสร้างตารางเทียมให้เกิด responsive มีสองวิธี คือใช้ col, row ของ bootstrap ซึ่งจะเหมาะกับการแสดงผลข้อมูลที่ไม่เยอะ และมีไม่กี่คอลัมน์ แต่จะมีปัญหากับการแสดงผลข้อมูลที่เยอะหรือยาว หรือมีหลายๆคอลัมน์
ซึ่งในหน้า Hall นี้ข้อมูลมีเยอะ และยาว แถมมีหลายคอลัมน์ เราจุึงต้องใช้วิธีที่สองในการสร้างตารางเทียม ซึ่งก็คือ Tailwind CSS ดังต่อไปนี
สำหรับ parent <div className="grid grid-cols-1 md:grid-cols-12 gap-x-26 py-2 w-fit">
สำหรับ ลูกๆ แถวละ 3 คอลัมน์ <div className="col-span-4">
                          <span className="fw-bold">ID:</span> {employee.employee_id}
                        </div>
จึงจะสามารถแก้ปัญหาได้ สรุปคือ เราพยายามใช้ tailwind ในการสร้างตารางเทียมดีกว่า เพราะรองรับตั้งแต่การแสดงผลข้อมูลสั้นๆ
ไปจนถึงข้อมูลยาวๆได้ ไม่จำกัด
*/
  return (
    <div>
      <Nav/>
      <div className='container'>
        
        <div className='h-10!'></div>
        <div className='min-h-screen'>
        <div className='flex flex-col md:flex-row justify-center items-center mb-3'>
          {
            pictName && <Image 
                          src={`${BUCKET_URL}/employees/${pictName}`} 
                          alt='Employee Name' 
                          width={150} height={225}
                          className='object-contain!'
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading="eager"
                          unoptimized
                        />
          }
        </div>
        {
          employeeID && employee && pictName && sup && remain &&
          <>
            <div className="product-con">
              
                    <div>
                      <div className='flex flex-col md:flex-row'>

                        {/* Desktop */}
                        <div className="d-block w-100 align-items-center">

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-26 py-2 w-fit">

                            <div className="col-span-4">
                              <span className="fw-bold">ID:</span> {employee.employee_id}
                            </div>

                            <div className="col-span-4">
                              <span className="fw-bold">Name:</span> {employee.title_of_courtesy} {employee.first_name} {employee.last_name}
                            </div>

                            <div className="col-span-4 md:text-nowrap flex justify-between">
                              <span className="fw-bold mr-1!">Address:</span> {employee.address}, {employee.city}, {employee.region}, {employee.country}
                            </div>

                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-26 py-2 text-nowrap w-100">

                            <div className="col-span-4">
                              <span className="fw-bold">Title:</span> {employee.title}
                            </div>

                            <div className="col-span-4">
                              <span className="fw-bold">Phone:</span> {employee.home_phone}
                            </div>

                            <div className="col-span-4">
                              <span className="fw-bold">Ext:</span> {employee.extension}
                            </div>

                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-26 py-2 text-nowrap w-100">

                            <div className="col-span-4">
                              <span className="fw-bold">Birth Date:</span> {employee.birth_date}
                            </div>

                            <div className="col-span-4">
                              <span className="fw-bold">Hire Date:</span> {employee.hire_date}
                            </div>

                            <div className="col-span-4">
                              <span className="fw-bold">Report To: </span>
                              {
                                employeeID.toString()===sup.employee_id.toString()?"No Boss.":sup.title_of_courtesy+sup.first_name+" "+sup.last_name
                              } 
                            </div>

                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 md:gap-x-26 py-2 w-100">

                            <div className="col-span-12 flex justify-between">
                              <span className="fw-bold mr-1!">Detail:</span> <span className='text-wrap'>{employee.notes}</span>
                            </div>

                          </div>
                          
                        </div>

                      </div>

                      <br/>

                      <hr className="w-full"/>
                      <br />

                      <div className='w-full'>
                        <h3 className='underline text-nowrap'>Available Leave Balance</h3>
                        <br />
                        <p>
                          <span className='font-bold text-xl'>Sick Leave: </span>
                          <span className='text-orange-700'>{remain.Sick} days</span>
                        </p>
                        <p>
                          <span className='font-bold text-xl'>Private Leave: </span>
                          <span className='text-orange-700'>{remain.Private} days</span>
                        </p>
                        <p>
                          <span className='font-bold text-xl'>Summer Leave: </span>
                          <span className='text-orange-700'>{remain.Summer} days</span>
                        </p>
                      </div>

                      <br/>
                      <hr className="w-full"/>
                      <br />

                      <form onSubmit={handleSubmit}>
                        <h3 className='underline'>Leave Form</h3>
                        <br/>
                        
                        <div className='flex flex-col md:flex-row'>
                        {/* Desktop */}
                        <div className="d-block w-100 align-items-center">

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-26 py-2 text-nowrap w-fit">

                            <div className="col-span-4">
                              <span className="fw-bold mr-2!">Type:</span>
                              <select 
                                name="Leave Type" 
                                id="Leave Dropdown" 
                                className='p-2 bg-white rounded-md focus:outline-none'
                                onChange={(e)=>{
                                  setEmpLeave(prev=>({
                                    ...prev,
                                    leave_type_id:parseInt(e.target.value)
                                  }))
                                }}
                              >
                                <option value="">-- Leave Types --</option>
                                <option value="1">Sick</option>
                                <option value="2">Private</option>
                                <option value="3">Summer</option>
                              </select>
                            </div>

                            <div className="col-span-4 flex items-center py-2 md:py-0">
                              <span className="fw-bold mr-2!">Start Date:</span>
                              <input 
                                type="text" 
                                className='form-control w-7/10! lg:w-fit!' placeholder='mm/dd/yyyy'
                                value={empLeave.start_date}
                                onChange={(e)=>{
                                  setEmpLeave(prev=>({
                                    ...prev,
                                    start_date:e.target.value
                                  }))
                                }}
                              />
                            </div>

                            <div className="col-span-4 flex items-center">
                              <span className="fw-bold mr-2!">End Date:</span>
                              <input 
                                type="text" 
                                className='form-control w-auto!' placeholder='mm/dd/yyyy'
                                value={empLeave.end_date}
                                onChange={(e)=>{
                                  setEmpLeave(prev=>({
                                    ...prev,
                                    end_date:e.target.value
                                  }))
                                }}
                              />
                            </div>

                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-26 md:py-2 text-nowrap w-100">

                            <div className="col-span-4 flex items-center">
                              <span className="fw-bold mr-2!">Reason:</span>
                              <input 
                                type="text" 
                                className='form-control w-auto!' placeholder='Reason'
                                value={empLeave.reason}
                                onChange={(e)=>{
                                  setEmpLeave(prev=>({
                                    ...prev,
                                    reason:e.target.value
                                  }))
                                }}
                              />
                            </div>

                            <div className="col-span-4 flex items-center pt-2 md:pt-0">
                              <span className="fw-bold mr-2!">Status:</span>
                              <label htmlFor="Status" className='form-control w-fit!'>{empLeave.status}</label>
                            </div>

                            <div className="col-span-4"></div>

                          </div>

                        </div>

                      </div>

                        <div className='py-3'></div>

                        <div className='flex! justify-center! md:w-7xl gap-3'>
                          
                          <button 
                            className='btn btn-success'
                            onClick={()=>localStorage.setItem('leaveInfo', JSON.stringify(leaveBeginInit))}
                            type='button'
                          >
                            <Link
                              href={'/Detail'}
                              className='no-underline! text-white'
                            >
                              Report
                            </Link>
                            
                          </button>

                          <button 
                            className='btn btn-primary'
                            type='submit'
                            disabled={!empLeave.leave_type_id || !empLeave.start_date || !empLeave.end_date || !empLeave.reason}
                          >
                            Submit
                          </button>
                        </div>

                      </form>

                    </div>
                    
            </div>
          </>
        }
        </div>
      </div>
      <div className='h-20'></div>
    </div>
  )
}

export default Hall
