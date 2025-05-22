'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/apis";
import { setToken } from "@/lib/auth";

const SigninPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login(form.email, form.password);
      setToken(res.access_token);

      // Redirect based on the role from API response
      if (res.role === "user") {
        router.push("/dashboard-user");
      } else if (res.role === "company") {
        router.push("/dashboard-company");
      } else {
        setError("Unknown user role. Please contact support.");
      }
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three dark:bg-dark mx-auto max-w-[500px] rounded-sm bg-white px-6 py-10 sm:p-[60px]">
              <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl dark:text-white">
                Sign in to your account
              </h3>
              <p className="text-body-color mb-11 text-center text-base font-medium">
                Login to access the AI Call Center dashboard.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <label htmlFor="email" className="text-dark mb-3 block text-sm dark:text-white">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-3 border rounded-xs bg-[#f8f8f8] dark:bg-[#2C303B] text-base"
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="password" className="text-dark mb-3 block text-sm dark:text-white">
                    Your Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-3 border rounded-xs bg-[#f8f8f8] dark:bg-[#2C303B] text-base"
                  />
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="mb-6">
                  <button
                    type="submit"
                    className="w-full bg-primary text-white px-9 py-4 text-base font-medium rounded-xs hover:bg-primary/90 transition"
                  >
                    Sign in
                  </button>
                </div>
              </form>
              <p className="text-body-color text-center text-base font-medium">
                Don’t have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SigninPage;
