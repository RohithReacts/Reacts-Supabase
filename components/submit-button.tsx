"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@/components/ui/button";
import { SpinnerButton } from "@/components/ui/spinner-button";

interface SubmitButtonProps extends ButtonProps {
  loadingText?: string;
}

export function SubmitButton({
  children,
  loadingText,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  if (pending) {
    return <SpinnerButton>{loadingText}</SpinnerButton>;
  }

  return <Button {...props}>{children}</Button>;
}
