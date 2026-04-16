'use client'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useEffect, useState,use } from 'react'
import Nav from '../Components/Nav'
import { easyDate } from '../Components/My-function'

function Detail({params}) {
  // const employeeID = Cookies.get('employeeID')
  // const customerID = use(params).id

  const [report,setReport] = useState([])

  useEffect(()=>{
    const grabReport=async()=>{
      const data = await JSON.parse(localStorage.getItem('leaveInfo'));
      if(data){
        setReport(data);
      }
    }

    grabReport()
  },[])

  //useEffect(()=>{console.log(report[0]?.leave_types?.type_name)},[report])
  //ในหน้านี้ข้อมูลแต่ละคอลัมน์สั้นๆ เราเลยลองใช้ row, col ของ bootstrap ดู
  return (
    <div>
      <Nav/>
      <div className='h-10!'></div>
      <div className='min-h-screen px-10!'>
        
            {/* HEADER */}
            <div className="row d-none d-md-flex text-center align-items-center fw-bold py-2 bg-light">
              <div className="col-1"><span className='md:pl-5!'>ID</span></div>
              <div className="col-1"><span className='md:pl-5!'>Type</span></div>
              <div className="col-2"><span className='md:pl-5!'>Reason</span></div>
              <div className="col-2"><span className='md:pl-1!'>Start Date</span></div>
              <div className="col-2"><span className='md:pr-2!'>End Date</span></div>
              <div className="col-2"><span className='md:pr-3!'>Status</span></div>
              <div className="col-2"><span className='md:pr-5!'>Submit Date</span></div>
            </div>

        {report.map((item) => (
          <div key={item.request_id} className="row text-center align-items-center py-2">

            {/* Desktop */}
            <div className="d-none d-md-flex w-100 text-center align-items-center">
              <div className="col-1">{item.request_id}</div>
              <div className="col-1">{item.leave_types?.type_name}</div>
              <div className="col-2">{item.reason}</div>
              <div className="col-2">{easyDate(item.start_date)}</div>
              <div className="col-2">{easyDate(item.end_date)}</div>
              <div className="col-2">{item.status}</div>
              <div className="col-2">{easyDate(item.created_at)}</div>
            </div>

            {/* Mobile (แสดงแบบ card) */}
            <div className="d-block d-md-none text-start">
              <div><strong>ID:</strong> {item.request_id}</div>
              <div><strong>Type:</strong> {item.leave_types?.type_name}</div>
              <div><strong>Reason:</strong> {item.reason}</div>
              <div><strong>Start:</strong> {easyDate(item.start_date)}</div>
              <div><strong>End:</strong> {easyDate(item.end_date)}</div>
              <div><strong>Status:</strong> {item.status}</div>
              <div><strong>Submit Date:</strong> {easyDate(item.created_at)}</div>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}

export default Detail
