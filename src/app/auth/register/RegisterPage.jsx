"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import axios from "../../../lib/axios";
import Link from "next/link";
import { signIn, useSession, getSession } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const handledGoogleSignup = useRef(false);
  const searchParams = useSearchParams()

  // Read the callback URL from query or default to dashboard
  const callbackUrl = searchParams.get('callbackUrl') || '/products'
  // Helper to wait briefly for session updates
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  // ✅ Google sign-up flow
  // useEffect(() => {
  //   const registerWithGoogle = async () => {
  //     if (!session?.user || handledGoogleSignup.current) return;
  //     handledGoogleSignup.current = true;

  //     try {
  //       const { name, email } = session.user;

  //       await axios.post("/api/auth/register", { name, email });
  //       toast.success("Google sign-up successful! Redirecting...");

  //       await wait(500);
  //       const updatedSession = await getSession();

  //       setRedirecting(true);
  //       if (updatedSession?.user?.role === "admin") {
  //         router.push("/admin");
  //       } else {
  //         router.push("/products");
  //       }
  //     } catch (error) {
  //       if (error.response?.status === 409) {
  //         toast.error("Email already registered. Redirecting to login...");
  //         router.push("/auth/login");
  //       } else {
  //         toast.error(
  //           error?.response?.data?.message || "Google sign-up failed."
  //         );
  //       }
  //     }
  //   };

  //   if (status === "authenticated" && pathname === "/auth/register") {
  //     registerWithGoogle();
  //   }
  // }, [session, status, pathname, router]);

  // ✅ Manual register + auto-login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/auth/register", { name, email, password });
      toast.success("Registration successful! Logging you in...");

      const loginResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginResult?.error) {
        toast.error(loginResult.error);
        return;
      }

      await wait(100);
      const updatedSession = await getSession();

      setRedirecting(true);
      if (updatedSession?.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/products");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Email already exists. Try logging in.");
        router.push("/auth/login");
      } else {
        toast.error(error?.response?.data?.message || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl })
  }

  // ✅ Prevent login page flash
  if (redirecting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="py-20">
        <div className="max-w-md mx-auto p-5 fontPoppins bg-white rounded-xl shadow-lg">
  <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Create Your Account</h1>

  <form onSubmit={handleSubmit} className="space-y-6">
    <div className="space-y-2">
      <label className="block text-gray-700 font-medium" htmlFor="name">
        Full Name
      </label>
      <input
        type="text"
        id="name"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Enter your full name"
      />
    </div>

    <div className="space-y-2">
      <label className="block text-gray-700 font-medium" htmlFor="email">
        Email Address
      </label>
      <input
        type="email"
        id="email"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="your@email.com"
      />
    </div>

    <div className="space-y-2">
      <label className="block text-gray-700 font-medium" htmlFor="password">
        Password
      </label>
      <input
        type="password"
        id="password"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="••••••••"
      />
    </div>

    <button
      type="submit"
      className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${loading ? 'bg-emerald-400' : 'bg-[#414143] hover:bg-emerald-600'} shadow-md hover:shadow-lg`}
      disabled={loading}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Creating account...
        </span>
      ) : (
        'Register Now'
      )}
    </button>
  </form>

  <div className="flex items-center my-6">
    <div className="flex-grow border-t border-gray-300"></div>
    <span className="flex-shrink mx-4 text-gray-500">or</span>
    <div className="flex-grow border-t border-gray-300"></div>
  </div>

  <button
    onClick={handleGoogleSignIn}
    className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
  >
    <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
    Continue with Google
  </button>

  <div className="mt-6 text-center">
    <span className="text-gray-600">Already have an account? </span>
    <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-800 font-medium hover:underline transition-colors">
      Sign in here
    </Link>
  </div>
</div>
    </div>
  );
}
