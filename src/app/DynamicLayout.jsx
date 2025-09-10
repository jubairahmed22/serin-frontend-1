// app/DynamicLayout.tsx
'use client'

import { usePathname } from 'next/navigation'
import Navbar from './components/Navbar'
import NavInfo from './components/NavbarInfo'
import NavbarSerin from './components/NavbarSerin'
import NavCartIcon from './components/NavCartIcon'
import "../styles/globals.css";
import Footer from "./components/Footer"

export default function DynamicLayout({ children }) {
  const pathname = usePathname()
  
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>
  }

  if (pathname?.startsWith('/dashboard')) {
    return <>{children}</>
  }

  return (
    <>
      {/* <NavInfo></NavInfo> */}
      {/* <Navbar /> */}
      <NavbarSerin></NavbarSerin>
      <NavCartIcon></NavCartIcon>
      <main className="bg-white">
        {children}
      </main>
        {/* <Footer></Footer> */}
    </>
  )
}