import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "../auth/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function LoginPage(props: {
  searchParams: Promise<{ message: string; error: string }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="relative min-h-screen bg-[radial-gradient(60%_80%_at_50%_0%,#0b1220_0%,#0a0a0b_60%,#060607_100%)] text-zinc-100">
      {/* Overlay grid + lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_20%),linear-gradient(to_right,rgba(255,255,255,0.03),transparent_20%)] mask-[radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center p-4">
        <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.45)] text-zinc-100">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-xl font-semibold tracking-tight">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Welcome back. Please enter your credentials.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            {/* Success Message */}
            {searchParams?.message && (
              <div className="text-sm rounded-md border border-green-500/40 bg-green-900/40 p-3 text-green-200">
                {searchParams.message}
              </div>
            )}

            {/* Error Message */}
            {searchParams?.error && (
              <div className="text-sm rounded-md border border-red-500/40 bg-red-900/40 p-3 text-red-200">
                {searchParams.error}
              </div>
            )}

            <form className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@domain.com"
                  className="bg-zinc-900/70 border-white/10 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-zinc-300">
                    Password
                  </Label>
                  <a
                    href="/forgot-password"
                    className="text-xs text-zinc-100 hover:text-blue-300"
                  >
                    Forgot password?
                  </a>
                </div>

                <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="bg-zinc-900/70 border-white/10 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>

              {/* Submit Button */}
              <Button
                formAction={login}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign in
              </Button>
            </form>

            <p className="mt-4 mx-auto text-center text-sm text-zinc-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-zinc-100 hover:text-blue-300"
              >
                Create account
              </Link>
            </p>
          </CardContent>

          <CardFooter className="border-t border-white/10 bg-black/20 text-xs text-zinc-500 justify-center">
            By continuing you agree to our terms.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
