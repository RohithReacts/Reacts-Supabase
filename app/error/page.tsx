import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md border border-border/60 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Something went wrong
          </CardTitle>
          <CardDescription className="text-center">
            Sorry, we couldn&apos;t complete your request.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            Please try again.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
