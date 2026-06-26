"use client";

import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Card, Separator, Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const SignInPage = () => {
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signIn.email({
      email: user.email,
      password: user.password,
    });

    if (error) {
      toast.error(error.message || "Sign in failed. Please try again.");
      return;
    }

    if (data) {
      // Also sign in to Express server to get JWT for API calls
      try {
        const expressRes = await fetch("http://localhost:5000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, password: user.password }),
        });
        const expressData = await expressRes.json();
        if (expressRes.ok && expressData.token) {
          localStorage.setItem("express_token", expressData.token);
        }
      } catch (err) {
        console.error("Express login sync failed:", err);
      }

      toast.success("Signed in successfully.");
      router.push("/");
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (error) {
      toast.error(error.message || "Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl py-10">
      <div className="text-center mb-6">
        <h1 className="font-bold text-3xl">Sign In</h1>
        <p className="text-gray-600">Welcome back to PromptVerse</p>
      </div>

      <Card className="border p-6 w-full max-w-md mx-auto">
        <Form onSubmit={onSubmit} className="flex flex-col gap-4">
          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) =>
              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                ? null
                : "Please enter a valid email address"
            }
          >
            <Label>Email</Label>
            <Input placeholder="admin@example.com" />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="password"
            type="password"
          >
            <Label>Password</Label>
            <Input placeholder="Enter your password" />
            <FieldError />
          </TextField>

          <Button type="submit" className="w-full rounded-none">
            Sign In
          </Button>
        </Form>

        <div className="flex items-center justify-center gap-2 my-4">
          <Separator className="w-50" />
          <span className="text-xs text-gray-500">Or</span>
          <Separator className="w-50" />
        </div>

        <Button onClick={handleGoogleSignIn} className="w-full rounded-none">
          <FcGoogle className="mr-2" /> Sign in with Google
        </Button>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/auth/signup")}
            className="text-blue-600 cursor-pointer"
          >
            Create one
          </span>
        </p>
      </Card>
    </div>
  );
};

export default SignInPage;
