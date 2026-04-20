'use client'
import React from 'react'
import Nav from '../Components/Nav'

function Contact() {
  return (
    <div>
        <Nav/>
        <div className='h-8'></div>
        <div>
          <div className='container'>
            <div className='min-h-screen'>
              <h1 className='text-center underline pb-3!'>About Us</h1>
              <p className='md:text-2xl'>
                {`\u2001`}{`\u2001`}{`\u2001`}My name is Pichaiyut Sirianantawong. I am a developer using Javascript, HTML, 
                CSS, REACT, Next.JS and REACT Native. I used to be .Net programmer before. However, I found out that Javascript
                and its library and framework are more interesting than dot Net. That&apos;s why I switch to learn the subjects.
                Finally, I need to create a web application using Next.JS for my graduation project.<br/><br/>
                
                {`\u2001`}{`\u2001`}{`\u2001`}After finishing my education, I would like to be a freelance to make website both static website
                and web application. Firstly, I would like to work on Freelancer.com. In fact, I will try to be a freelance on the other
                platforms too. Thank you for checking out my graduation project. I hope you enjoy testing it.<br/><br/>
                {`\u2001`}{`\u2001`}{`\u2001`}Best Regards,<br/>
                {`\u2001`}{`\u2001`}{`\u2001`}Pichaiyut Sirianantawong
              </p>
            </div>
          </div>
        </div>
        
    </div>
    
  )
}

export default Contact
