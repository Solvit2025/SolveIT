'use client';

import Link from "next/link";
import { userRegister, companyRegister, login } from "@/lib/apis";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignupPage = () => {
  const router = useRouter();
  const [tab, setTab] = useState<"user" | "company">("user");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    user_phone_number: "",
    domain: "",
    business_phone_number: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        ...(tab === "user"
          ? { user_phone_number: form.user_phone_number }
          : {
              domain: form.domain,
              business_phone_number: form.business_phone_number,
            }),
      };
      const res = tab === "user"
        ? await userRegister(payload)
        : await companyRegister(payload);
      const loginRes = await login(form.email, form.password);
      setToken(loginRes.access_token);
      router.push(tab === "user" ? "/dashboard-user" : "/dashboard-company");
    } catch (err) {
      console.error(err);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three dark:bg-dark mx-auto max-w-[500px] rounded-sm bg-white px-6 py-10 sm:p-[60px]">
              <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl dark:text-white">
                Create your account
              </h3>
              <p className="text-body-color mb-11 text-center text-base font-medium">
                It’s totally free and super easy
              </p>

              <div className="mb-8 flex items-center justify-center">
                <span className="bg-body-color/50 hidden h-[1px] w-full max-w-[60px] sm:block" />
                <p className="text-body-color w-full px-5 text-center text-base font-medium">
                  Or, register with your email
                </p>
                <span className="bg-body-color/50 hidden h-[1px] w-full max-w-[60px] sm:block" />
              </div>

              <div className="mb-8 flex justify-center">
                <button
                  onClick={() => setTab("user")}
                  type="button"
                  className={`px-6 py-2 text-base font-medium border rounded-l-md ${tab === "user" ? "bg-primary text-white" : "bg-white text-gray-600 border-gray-300"}`}
                >
                  User Account
                </button>
                <button
                  onClick={() => setTab("company")}
                  type="button"
                  className={`px-6 py-2 text-base font-medium border rounded-r-md ${tab === "company" ? "bg-primary text-white" : "bg-white text-gray-600 border-gray-300"}`}
                >
                  Company Account
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-8">
                  <label className="text-dark mb-3 block text-sm dark:text-white">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-6 py-3 border rounded-xs bg-[#f8f8f8] dark:bg-[#2C303B] text-base"
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-8">
                  <label className="text-dark mb-3 block text-sm dark:text-white">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-6 py-3 border rounded-xs bg-[#f8f8f8] dark:bg-[#2C303B] text-base"
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-8">
                  <label className="text-dark mb-3 block text-sm dark:text-white">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-6 py-3 border rounded-xs bg-[#f8f8f8] dark:bg-[#2C303B] text-base"
                    required
                  />
                </div>

                {/* User Fields */}
                {tab === "user" && (
                  <div className="mb-8">
                    <label className="text-dark mb-3 block text-sm dark:text-white">User Phone Number</label>
                    <input
                      type="text"
                      name="user_phone_number"
                      value={form.user_phone_number}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full px-6 py-3 border rounded-xs bg-[#f8f8f8] dark:bg-[#2C303B] text-base"
                    />
                  </div>
                )}

                {/* Company Fields */}
                {tab === "company" && (
                  <>
                    <div className="mb-8">
                      <label className="text-dark mb-3 block text-sm dark:text-white">Domain</label>
                      <input
                        type="text"
                        name="domain"
                        value={form.domain}
                        onChange={handleChange}
                        placeholder="e.g., example.com"
                        className="w-full px-6 py-3 border rounded-xs bg-[#f8f8f8] dark:bg-[#2C303B] text-base"
                      />
                    </div>

                    <div className="mb-8">
                      <label className="text-dark mb-3 block text-sm dark:text-white">Business Phone Number</label>
                      <input
                        type="text"
                        name="business_phone_number"
                        value={form.business_phone_number}
                        onChange={handleChange}
                        placeholder="Enter business phone number"
                        className="w-full px-6 py-3 border rounded-xs bg-[#f8f8f8] dark:bg-[#2C303B] text-base"
                      />
                    </div>
                  </>
                )}

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {/* Submit Button */}
                <div className="mb-6">
                  <button type="submit" className="w-full bg-primary text-white px-9 py-4 text-base font-medium rounded-xs hover:bg-primary/90 transition">
                    Sign up as {tab === "user" ? "User" : "Company"}
                  </button>
                </div>
              </form>

              <p className="text-body-color text-center text-base font-medium">
                Already using Startup?{" "}
                <Link href="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
