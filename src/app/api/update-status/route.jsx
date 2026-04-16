import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
    const leaveChunk = await request.json()
    try{
      const currentDateTime = new Date()

      const updateStatus = await prisma.leave_requests.update({
        where: { request_id: parseInt(leaveChunk.request_id) },
        data: {
          status:leaveChunk.status.toLowerCase(),
          created_at:currentDateTime,
        },
      })
      
      if(updateStatus){
        return NextResponse.json(
            { 
                notification: "Status Updated: ", 
                updateStatus
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
