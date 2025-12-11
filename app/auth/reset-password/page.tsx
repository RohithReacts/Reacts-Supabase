import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPassword } from "../actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function ResetPasswordPage(props: {
  searchParams: Promise<{ message: string; error: string }>;
}) {
  const searchParams = await props.searchParams;
  return (
   <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">Set new password</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Success Message */}
          {searchParams?.message && (
            <Alert className="border-green-500 text-green-700 bg-green-50">
              <AlertDescription>{searchParams.message}</AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {searchParams?.error && (
            <Alert variant="destructive">
              <AlertDescription>{searchParams.error}</AlertDescription>
            </Alert>
          )}

          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Re-enter password"
              />
            </div>

            <CardFooter className="px-0">
              <Button className="w-full" formAction={resetPassword}>
                Update password
              </Button>
            </CardFooter>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}
