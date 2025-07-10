'use client'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`)
    } else if (adminOnly && session.user.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [session, status, router, adminOnly, pathname])

  if (status === 'loading' || !session || (adminOnly && session.user.role !== 'admin')) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return children
}
