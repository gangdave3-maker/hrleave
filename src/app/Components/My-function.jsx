'use client'
import React from 'react'
import Swal from 'sweetalert2'

export async function getCred() {
    const res = await fetch('/api/get-cred')
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export function isEmailValid(email) {
  /*
  Basic custom email pattern ถ้าเราใช้Functionนี้ในการตรวจสอบ Email เราก็ไม่จำเป็นต้องมาเช็คแล้วว่าตัวอีเมล์มีความยาวตั้งแต่8ตัวอักษรหรือไม่
  /^คือตัวเริ่ม $/คือตัวจบ จึงหมายถึง [เริ่มด้วย aถึงz หรือAถึงZ หรือ0ถึง9 หรือ. _ % + -] ถัดมา +ที่ตามหลังกรอบ[]คือให้เชื่อมด้วย ตามด้วยคำว่า @ โดยที่@ต้องตามด้วยค่าในกรอบ [a-zA-Z0-9.-] 
 ซึ่งคือ a-z, A-Z, 0-9, ., - จากนั้นให้เชื่อมด้วย . (+แปลว่าเชื่อม \. คือให้ใช้สัญลักษณ์ .) จากนั้น [a-zA-Z]{2,}หมายถึง หลัง.ให้ตามด้วยค่าในกรอบ[] คือ a-z, A-Z, จำนวน 2 อักขระขึ้นไป({2,})
  */
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

export function isPasswordValid(password) {
  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
  /*
  (?=.*[a-z]) requires at least one lowercase letter.
  (?=.*[A-Z]) requires at least one uppercase letter.
  (?=.*\d) requires at least one digit.
  (?=.*[@$!%*?&#+\-_)(]) requires at least one special character from the set @$!%*?&#+-_)(.
  [A-Za-z\d@$!%*?&#+\-_)(]{8,} defines the allowed characters for the password and enforces a minimum length of 8.
  */
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-_)(])[A-Za-z\d@$!%*?&#+\-_)(]{8,}$/;
  return passwordPattern.test(password);
}

export function clientRefresh() {
    // Equivalent to hitting F5 / Cmd+R
    window.location.reload();
}

export async function MatchedEmployee(email) {
  //console.log(email)
    const res = await fetch('/api/email-match',
      {
        method: 'POST', // Usually POST for sending data
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(email), // Wrap in an object and stringify
      }
    )
  if (!res.ok){
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch match');
  }
  return res.json()
}

export async function sendEmail(theEmployee) {
    const res = await fetch('/api/send-email',
      {
        method: 'POST', // Usually POST for sending data
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(theEmployee), // Wrap in an object and stringify
      }
    )

  if (!res.ok){
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch match');
  }
        
  return res.json()
}

export async function updatePassword(cred) {
    const res = await fetch('/api/update-password',{
      method:'POST',
      headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cred),
    })

  // 1. Parse the JSON body FIRST to get the data inside
  const data = await res.json();

  if (!res.ok) throw new Error(data.message||'Failed to fetch')
  return data
}

export async function updateStatus(leaveChunk) {
    const res = await fetch('/api/update-status',{
      method:'POST',
      headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leaveChunk),
    })

  // 1. Parse the JSON body FIRST to get the data inside
  const data = await res.json();

  if (!res.ok) throw new Error(data.message||'Failed to fetch')
  if(data){
    await Swal.fire({
                      title:"Congratulations",
                      text:"Leave Status Updated",
                      icon:"success"
                    }).then(()=>clientRefresh())
    
    return data
  }
}

export function easyDate(theDate){
  const formattedDate = new Date(theDate).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return formattedDate
}

export async function reportTo(empID){
  const res = await fetch(`/api/report-to/${empID}`)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export async function leaveBegin(empID){
  const res = await fetch(`/api/leave-begin/${empID}`)
  if (!res.ok) throw new Error('Failed to fetch')
  if(res){
    //ต้องใช้ await เพราะข้อมูล respond เป็นข้อมุลแบบ asynchronous
    const data = await res.json()
    //console.log(data)
    return data
  }
}

export async function requestLeave(leaveData) {
    const res = await fetch('/api/insert-leave',{
      method:'POST',
      headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leaveData),
    })

  // 1. Parse the JSON body FIRST to get the data inside
  const data = await res.json();

  if (!res.ok) throw new Error(data.message||'Failed to fetch')
  if(data){

    await Swal.fire({
                title:"Info",
                text:"Submit request successfully.",
                icon:"success"
             })
    clientRefresh()
  }
  return data
}

export async function servitor(empID){
  const res = await fetch(`/api/henchman/${empID}`)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export async function deleteLeave(id) {
    const res = await fetch('/api/del-leave',{
      method:'POST',
      headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(id),
    })

  // 1. Parse the JSON body FIRST to get the data inside
  const data = await res.json();

  if (!res.ok) throw new Error(data.message||'Failed to fetch')
  if(data){
    await Swal.fire({
                      title:"Congratulations",
                      text:"Delete leave request successfully.",
                      icon:"success"
                    }).then(()=>clientRefresh())
    return data
  }
  
}