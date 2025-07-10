import React from 'react';
import logo from '../../assets/book_forest.png';
import '../../styles/footer.css';

const Footer = () => {
    return (
        <div className='bg-[#282828] w-full fontPoppins '>
              <div className='max-w-[1400px] h-[313px] py-10 flex flex-row justify-between mx-auto'>
                 <div className=' flex flex-col '>
                     <img className='w-[182px] h-[180px] ' src={logo.src} alt=''></img>
                     <p className='text-[12px] text-[#848484]'>Sector-06, Uttara, Dhaka - 1230</p>
                 </div>
                 <div className='border-l pl-10 border-[#444444]'>
                    <h1 className='text-white text-[17px] font-semibold fontPoppins'>Need Help</h1>
                    <h1 className='text-[32px] font-bold mt-4 text-[#50C878]'>+880-1763427561</h1>
                    <div className='mt-2 flex flex-col gap-3'>
                        <h1 className='text-[16px] font-medium  text-[#8F8F8F]'>Sunday - Friday: 9:00 - 20:00</h1>
                        <h1 className='text-[16px] font-medium  text-[#8F8F8F]'>Saturday: 11:00 - 15:00</h1>
                    </div>
                 </div>
                 <div>
                    <h1 className='text-white text-[17px] font-semibold fontPoppins'>Explore</h1>
                    <div className='mt-4 flex flex-col gap-3'>
                        <h1 className='text-[16px] font-medium  text-[#8F8F8F]'>About us</h1>
                        <h1 className='text-[16px] font-medium  text-[#8F8F8F]'>Sitemap</h1>
                        <h1 className='text-[16px] font-medium  text-[#8F8F8F]'>Bookmarks</h1>
                        <h1 className='text-[16px] font-medium  text-[#8F8F8F]'>Sign in/Join</h1>
                    </div>
                 </div>
                 <div>
                    <h1 className='text-white text-[17px] font-semibold fontPoppins'>Our Service</h1>
                    <div className='mt-4 flex flex-col gap-3'>
                        <h1 className='text-[16px] font-medium  text-[#8F8F8F]'>Help Center</h1>
                        <h1 className='text-[16px] font-medium  text-[#8F8F8F]'>Returns</h1>
                        <h1 className='text-[16px] font-medium  text-[#8F8F8F]'>Product Recalls</h1>
                        <h1 className='text-[16px] font-medium  text-[#8F8F8F]'>Accessibility</h1>
                        <h1 className='text-[16px] font-medium  text-[#8F8F8F]'>Contact Us</h1>
                        <h1 className='text-[16px] font-medium  text-[#8F8F8F]'>Store Pickup</h1>
                    </div>
                 </div>
                 <div>
                    <h1 className='text-white text-[17px] font-semibold fontPoppins'>Categories</h1>
                    <div className='mt-4 flex flex-col gap-3'>
                        <h1 className='text-[16px] font-medium  text-[#8F8F8F]'>Action</h1>
                        <h1 className='text-[16px] font-medium  text-[#8F8F8F]'>Comedy</h1>
                        <h1 className='text-[16px] font-medium  text-[#8F8F8F]'>Drama</h1>
                        <h1 className='text-[16px] font-medium  text-[#8F8F8F]'>Horror</h1>
                        <h1 className='text-[16px] font-medium  text-[#8F8F8F]'>Kids</h1>
                    </div>
                 </div>
              </div>
              <div className='w-full border-t border-t-[#444444]'>
                <div className='max-w-[1400px] h-[110px] py-5   flex flex-row justify-between mx-auto'>
                  <h1 className='text-[17px] text-white'>Copyright 2025 <span className='text-[#50C878]'>Bookforrest</span>. All rights reserved. </h1>
              </div>
              </div>
        </div>
    );
};

export default Footer;