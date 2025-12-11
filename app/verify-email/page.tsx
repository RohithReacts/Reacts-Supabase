import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md border border-border/60 shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-center text-2xl font-semibold">
            Check your email
          </CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent you an email with a link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            Please check your inbox (and spam folder) and click the link to
            activate your account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
