"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error);
    return redirect("/login?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/", "layout");
  redirect("/?toast=Signed in successfully");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    console.error("Signup error:", error);
    return redirect("/signup?error=" + encodeURIComponent(error.message));
  }

  return redirect(
    "/verify-email?toast=Check your email to verify your account"
  );
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login?toast=Signed out successfully");
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const headersList = await headers();
  const origin = headersList.get("origin");
  const callbackUrl =
    origin || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!callbackUrl) {
    console.error("Could not determine origin for password reset");
    return redirect("/forgot-password?error=Could not determine origin");
  }

  console.log(
    "Sending password reset to:",
    email,
    "with callback:",
    callbackUrl
  );

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${callbackUrl}/auth/callback?next=/auth/reset-password`,
  });

  if (error) {
    console.error("Forgot password error:", error);
    return redirect(
      "/forgot-password?error=" + encodeURIComponent(error.message)
    );
  }

  return redirect(
    "/forgot-password?message=Check your email for a password reset link"
  );
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return redirect("/auth/reset-password?error=Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error("Reset password error:", error);
    return redirect(
      "/auth/reset-password?error=" + encodeURIComponent(error.message)
    );
  }

  return redirect("/login?message=Password updated successfully");
}
