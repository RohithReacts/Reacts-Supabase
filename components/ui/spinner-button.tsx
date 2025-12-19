import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SpinnerButton({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button disabled size="sm">
        <Spinner />
        {children || "Loading..."}
      </Button>
    </div>
  );
}
