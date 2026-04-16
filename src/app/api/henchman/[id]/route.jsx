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
    const servant = await prisma.employees.findMany({
      where: { 
        reports_to: employeeId // ส่งค่าที่ Parse เป็น Int แล้วเข้าไป
      },
    });

    if (!servant) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    //console.log("✅ SUCCESS:", user);
    return NextResponse.json(servant);

  } catch (error) {
    console.error("🔥 PRISMA ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }

}