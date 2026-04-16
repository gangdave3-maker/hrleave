import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
    const data = await request.json()
    try{
      //const currentDateTime = new Date()

      const updatePassword = await prisma.employees.update({
        where: { employee_id: parseInt(data.employeeID) },
        data: {
          password:data.password,
        },
      })
      
      if(updatePassword){
        return NextResponse.json(
            { 
                notification: "Password Reset: ", 
                updatePassword 
            }, 
            { 
                status: 200 
            }
        )
      }
    }catch(err){
      return NextResponse.json(
        { message: `Internal Server Error: \n` + err.message },
        { status: 500 }
      )
    }
}
