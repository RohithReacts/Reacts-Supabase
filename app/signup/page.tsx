import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signup } from "../auth/actions";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SignupPage(props: {
  searchParams: Promise<{ error: string }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="relative min-h-screen bg-[radial-gradient(60%_80%_at_50%_0%,#0b1220_0%,#0a0a0b_60%,#060607_100%)] text-zinc-100">
      {/* Background Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 
        bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_20%),linear-gradient(to_right,rgba(255,255,255,0.03),transparent_20%)]
        mask-[radial-gradient(ellipse_at_center,black_60%,transparent_100%)]"
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center p-4">
        {/* ⭐ SHADCN CARD */}
        <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.45)] text-zinc-100">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-xl font-semibold">
              Create your account
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Start using rohithreacts in seconds
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form action={signup} className="space-y-4">
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-300">Name</label>
                <Input
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="bg-zinc-900/70 text-zinc-100 ring-1 ring-white/10 placeholder:text-zinc-500 focus:ring-blue-500/60"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-300">Email</label>
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="you@domain.com"
                  className="bg-zinc-900/70 text-zinc-100 ring-1 ring-white/10 placeholder:text-zinc-500 focus:ring-blue-500/60"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-300">Password</label>
                <PasswordInput
                  name="password"
                  required
                  placeholder="Create a strong password"
                  className="bg-zinc-900/70 text-zinc-100 ring-1 ring-white/10 placeholder:text-zinc-500 focus:ring-blue-500/60"
                />
              </div>

              {/* Button */}
              <Button type="submit" className="w-full">
                Create account
              </Button>

              {/* Sign-in link */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-zinc-400">
                  Already have an account?
                </p>
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-100 hover:text-blue-300 transition"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>

          <CardFooter className="border-t border-white/10 bg-black/20 text-xs text-zinc-500">
            By continuing you agree to our terms.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
