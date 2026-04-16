import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const user = await prisma.employees.findMany({
      orderBy: {
        employee_id: 'asc',
      },
    })

    //console.log("✅ SUCCESS:", user)

    return NextResponse.json(user)

  } catch (error) {
    console.error("🔥 PRISMA ERROR:", error)

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}