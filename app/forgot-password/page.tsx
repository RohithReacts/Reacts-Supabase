import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { forgotPassword } from "../auth/actions";
import { headers } from "next/headers";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default async function ForgotPasswordPage(props: {
  searchParams: Promise<{ message: string; error: string }>;
}) {
  const searchParams = await props.searchParams;
  const headersList = await headers();
  const origin = headersList.get("origin");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 bg-[radial-gradient(60%_80%_at_50%_0%,#0b1220_0%,#0a0a0b_60%,#060607_100%)] text-zinc-100">
      <div className="w-full max-w-md bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_20%),linear-gradient(to_right,rgba(255,255,255,0.03),transparent_20%)] mask-[radial-gradient(ellipse_at_center,black_60%,transparent_100%)]">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Reset your password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email and we’ll send you a reset link.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-6">
              {/* Success Message */}
              {searchParams?.message && (
                <Alert className="border-green-600/40 text-green-700 bg-green-50">
                  <AlertDescription>{searchParams.message}</AlertDescription>
                </Alert>
              )}

              {/* Error Message */}
              {searchParams?.error && (
                <Alert className="border-red-600/40 text-red-700 bg-red-50">
                  <AlertDescription>{searchParams.error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                />
              </div>

              <Button formAction={forgotPassword} className="w-full">
                Send reset link
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
