"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/app/supabase-provider";
import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";
import Field from "@/app/components/ui/Field";
import PageHeading from "@/app/components/ui/PageHeading";
import Toast, { ToastRef } from "@/app/components/ui/Toast";
import Link from "next/link";

export default function Login() {
  const { supabase } = useSupabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const loginToast = useRef<ToastRef>(null);
  const loginErrorToast = useRef<ToastRef>(null);
  const [error, setError] = useState("Unknown Error");

  const router = useRouter();

  const handleLogin = async () => {
    setIsPending(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error logging in:", error.message);
      setError(error.message);
      loginErrorToast.current?.publish();
    } else if (data) {
      console.log("User logged in:", data);
      loginToast.current?.publish();
      router.replace("/");
    }
    setIsPending(false);
  };

  return (
    <main>
      <section className="w-full min-h-screen h-full outline-none flex flex-col gap-5 items-center justify-center p-6">
        <PageHeading title="Login" subtitle="Welcome back" />
        <Card className="max-w-md w-full p-5 sm:p-10 text-left">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="flex flex-col gap-2"
          >
            <Field
              name="email"
              required
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Field
              name="password"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <div className="flex flex-col items-center justify-center mt-2 gap-2">
              <Button isLoading={isPending}>Login</Button>
              <Link href="/signup">Dont have an account? Sign up</Link>
            </div>
          </form>
        </Card>
      </section>
      <Toast variant="success" ref={loginToast}>
        Logged In Successfully
      </Toast>
      <Toast variant="danger" ref={loginErrorToast}>
        {error}
      </Toast>
    </main>
  );
}