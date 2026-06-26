"use client";

import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Card, Separator, Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { Description, Radio, RadioGroup } from "@heroui/react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const SignUpPage = () => {
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signUp.email({
      email: user.email,
      password: user.password,
      name: user.name,
      image: user.image,
      subscription: user.subscription,
      role: "User",
      callbackURL: "/",
    });


    if (error) {
      toast.error(error.message || "Sign up failed. Please try again.");
      return;
    }

    if (data) {
      try {
        const expressRes = await fetch("http://localhost:5000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            password: user.password,
            photoURL: user.image || "",
          }),
        });
        const expressData = await expressRes.json();
        if (expressRes.ok && expressData.token) {
          localStorage.setItem("express_token", expressData.token);
        }
      } catch (err) {
        console.error("Express register sync failed:", err);
      }

      toast.success("Account created successfully.");
      router.push("/");
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/" });

    if (error) {
      toast.error(error.message || "Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl py-10">
      <div className="text-center mb-6">
        <h1 className="font-bold text-3xl">Create Account</h1>
        <p className="text-gray-600">Join the PromptVerse community</p>
      </div>

      <Card className="border p-6 w-full max-w-md mx-auto">
        <Form onSubmit={onSubmit} className="flex flex-col gap-4">
          <TextField isRequired name="name" type="text">
            <Label>Name</Label>
            <Input placeholder="Enter your name" />
            <FieldError />
          </TextField>

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

          <TextField name="image" type="url">
            <Label>Image URL</Label>
            <Input placeholder="Enter your image URL" />
            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 6) return "Password must be at least 6 characters";
              if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
              if (!/[0-9]/.test(value)) return "Password must contain at least one number";
              return null;
            }}
          >
            <Label>Password</Label>
            <Input placeholder="Enter your password" />
            <Description>Must be at least 6 characters with 1 uppercase and 1 number</Description>
            <FieldError />
          </TextField>

          <div className="flex flex-col gap-4">
            <Label>Choose your plan</Label>
            <RadioGroup name="subscription" orientation="horizontal">
              <Radio value="free">
                <Radio.Content>
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  Free
                </Radio.Content>
                <Description>Limit: 5 Prompts</Description>
              </Radio>
              <Radio value="premium">
                <Radio.Content>
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  Premium
                </Radio.Content>
                <Description>Unlock All Prompts</Description>
              </Radio>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full rounded-none">
            Create Account
          </Button>
        </Form>

        <form action="/api/checkout_sessions" method="POST">
          <section>
            <button type="submit" role="link">
              Checkout
            </button>
          </section>
        </form>

        <div className="flex items-center justify-center my-4">
          <Separator className="w-50" />
          <span className="text-xs text-gray-500">Or</span>
          <Separator className="w-50" />
        </div>

        <Button onClick={handleGoogleSignIn} className="w-full rounded-none">
          <FcGoogle className="mr-2" /> Sign Up With Google
        </Button>
      </Card>
    </div>
  );
};

export default SignUpPage;
