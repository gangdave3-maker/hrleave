import { NextResponse } from 'next/server'
const nodeMailer = require("nodemailer");

export async function POST(request) {
  // 1. Extract the data from the request body
  const theEmployee = await request.json();
  const employeeID=theEmployee.employee_id
  const theEmail=theEmployee.email
  //console.log(theEmployee)
  try {
    let transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "gangdave3@gmail.com",
        pass: "hocw azrd xaxl kupm",
      },
    });

    let mailOption = {
      from: "gangdave3@gmail.com",
      to: theEmail,
      subject: "Reset Password",
      text: `Please click the following link to reset your password -- https://daveleave.vercel.app/ResetPassword/${employeeID}`,
    };

    let info = await transporter.sendMail(mailOption);
    if (info) {
      return NextResponse.json(
      { 
        notification: "Mail Sent: ", 
        info 
      }, 
      { 
        status: 200 
      }
    );
    }
  } catch (error) {
    return NextResponse.json(
      { 
        notification: "Warning: ", 
        error 
      }, 
      { 
        status: 500 
      }
    );
  }
}
