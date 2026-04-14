"use client";

import { $api } from "@/lib/api/api";
import { useAuth } from "@/providers/auth-provider";
import { components } from "@/lib/api/v1";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleLoginButton from "../../components/google-login-button";
import Cookies from "js-cookie";

type LoginRequest = components["schemas"]["Login"];

type LoginFormValues = {
  identifier: string;
  password: string;
};

function getErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return "Unable to login. Please check your credentials.";
  }

  const detail = (error as { detail?: unknown }).detail;
  if (typeof detail === "string") {
    return detail;
  }

  const nonFieldErrors = (error as { non_field_errors?: unknown })
    .non_field_errors;
  if (Array.isArray(nonFieldErrors) && typeof nonFieldErrors[0] === "string") {
    return nonFieldErrors[0];
  }

  return "Unable to login. Please check your credentials.";
}

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const loginMutation = $api.useMutation("post", "/api/auth/login/");

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  const serverError = useMemo(
    () => getErrorMessage(loginMutation.error),
    [loginMutation.error],
  );

  const onSubmit = handleSubmit(async (values) => {
    const identifier = values.identifier.trim();
    const isEmail = identifier.includes("@");
    const payload: LoginRequest = {
      password: values.password,
      ...(isEmail ? { email: identifier } : { username: identifier }),
    };

    await loginMutation.mutateAsync({
      body: payload,
      headers: {
        "X-CSRFToken": (Cookies.get("csrftoken")) || "",
      },
    });
    await queryClient.invalidateQueries({
      queryKey: ["get", "/api/auth/user/"],
    });
    router.replace("/");
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full h-full justify-center items-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              <Button variant="link">Sign Up</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="identifier">Username or Email</Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="username or m@example.com"
                    autoComplete="username"
                    {...register("identifier", {
                      required: "Username or email is required",
                    })}
                  />
                  {errors.identifier ? (
                    <p className="text-sm text-red-600">
                      {errors.identifier.message}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password ? (
                    <p className="text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  ) : null}
                </div>
                {loginMutation.isError ? (
                  <p className="text-sm text-red-600">{serverError}</p>
                ) : null}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <GoogleLoginButton />
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
