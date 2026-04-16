import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
  const {id} = await params
  
  // 2. ตรวจสอบว่า id มีค่าและเป็นตัวเลขที่ถูกต้องหรือไม่
  const employeeId = parseInt(id);

  if (isNaN(employeeId)) {
    return NextResponse.json(
      { error: "Invalid Employee ID" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.leave_requests.findMany({
                 where: {
                          employee_id: parseInt(employeeId),
                          //status: 'approved',
                        },
                 include: {
    // ระบุชื่อ Relation ที่คุณกำหนดไว้ใน schema.prisma 
    // (สมมติว่าตั้งชื่อ relation ว่า leave_types)
                            leave_types: true, 
                          },
                  orderBy: {
                            created_at: 'desc',
                           },
                 });

    // แปลง Object เดียวให้กลายเป็น Array ที่มีสมาชิก 1 ตัว
    //const userArray = user ? [user] : [];
    return NextResponse.json(user);

  } catch (error) {
    console.error("🔥 PRISMA ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }

}