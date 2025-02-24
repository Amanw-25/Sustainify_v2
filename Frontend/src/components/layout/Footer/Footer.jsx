import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../../assets/images/Sustainify_logo.png'
import { socialLinks } from './sections/content'
import { quickLinks01 } from './sections/content'
import { quickLinks02 } from './sections/content'
import { quickLinks03 } from './sections/content'

const Footer = () => {
  
  const year = new Date().getFullYear();
  return (
    <footer className='pb-16 pt-10'>
      <div className="container">
        <div className='flex justify-between flex-col md:flex-row flew-wrap gap-[30px] '>
          <div>
            <img src={logo} className="w-[120px] h-[150px] ml-[-20px] mb-[-50px] " alt="" />

            <p className='text-[16px] leading-7 font-[400] text-textColor mt-4'>
              Copyright © {year} <br />
               Developed By  <b>Aman Wairagkar</b> <br />
                All Right Reserved.
            </p>

            <div className='flex items-center gap-3 mt-4'>
              {socialLinks.map((link, index) => (
                <Link 
                 to={link.path}
                 key={index}
                 className='w-9 h-9 border border-solid border-[#181A1E] rounded-full flex items-center justify-center group hover:bg-primaryColor hover:border-none'
                 >
                  {link.icon}
                </Link>
              ))}
            </div>

          </div>
          <div className='mt-12'>
            <h2 className='text-[20px] leading-[30px] font-[700] mb-3 text-headingColor'>
              Quick Links
            </h2>
            <ul>
              {quickLinks01.map((item , index ) => ( 
               <li key={index} className='mb-4'>
                <Link
                  to={item.path}
                className='text-[16px] leading-7 font-[400] text-textColor'
                > 
                  {item.display}
                </Link>
                </li>
                ))}
            </ul>
          </div>
          <div className='mt-12'>
            <h2 className='text-[20px] leading-[30px] font-[700] mb-6 text-headingColor'>
              I Want To 
            </h2>
            <ul>
              {quickLinks02.map((item , index ) => ( 
               <li key={index} className='mb-4'>
                <Link
                  to={item.path}
                className='text-[16px] leading-7 font-[400] text-textColor'
                > 
                  {item.display}
                </Link>
                </li>
                ))}
            </ul>
          </div>
          <div  className='mt-12'>
            <h2 className='text-[20px] leading-[30px] font-[700] mb-6 text-headingColor'>
              Support
            </h2>
            <ul>
              {quickLinks03.map((item , index ) => ( 
               <li key={index} className='mb-4'>
                <Link
                  to={item.path}
                className='text-[16px] leading-7 font-[400] text-textColor'
                > 
                  {item.display}
                </Link>
                </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer