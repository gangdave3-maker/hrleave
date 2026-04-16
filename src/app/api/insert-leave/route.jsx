import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
    const leaveData = await request.json()
    // ฟังก์ชันสำหรับแปลง 'mm/dd/yyyy' เป็น UTC Date ที่ไม่เคลื่อน
    const toUTCDate = (dateStr) => {
        if (!dateStr) return null;
        
        // แยก string '10/03/2026' ด้วย /
        const [month, day, year] = dateStr.split('/');
        
        // ใช้ Date.UTC(year, monthIndex, day) 
        // *หมายเหตุ: month ใน JS เริ่มจาก 0 (Jan = 0, Oct = 9) จึงต้อง -1
        return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    };
    try{
      const currentDateTime = new Date()
      // บวกเพิ่ม 7 ชั่วโมง (7 * 60 * 60 * 1000 มิลลิวินาที)
      const thaiTime = new Date(currentDateTime.getTime() + (7 * 60 * 60 * 1000));
      
      const createLeaveRequest = await prisma.leave_requests.create({
        data: {
          employee_id:leaveData.employee_id,
          leave_type_id:leaveData.leave_type_id,
          start_date:toUTCDate(leaveData.start_date),
          end_date:toUTCDate(leaveData.end_date),
          reason:leaveData.reason,
          status:leaveData.status,
          created_at:thaiTime
        },
      })
      return NextResponse.json(createLeaveRequest)
    }catch(err){
      return NextResponse.json(
        { message: `Internal Server Error: \n` + err.message },
        { status: 500 }
      )
    }
}
