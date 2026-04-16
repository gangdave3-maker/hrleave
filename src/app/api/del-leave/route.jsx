import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
    const request_id = await request.json()
    //console.log(request_id)
    try{
      //const currentDateTime = new Date()

      const deleteLeave = await prisma.leave_requests.delete({
        where: { request_id: parseInt(request_id) }, 
      })
      
      if(deleteLeave){
        return NextResponse.json(
            { 
                notification: "The leave is deleted.", 
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
