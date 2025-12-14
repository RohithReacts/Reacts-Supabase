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

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;

  const updates: { email?: string; data?: { full_name: string } } = {};

  if (email) {
    updates.email = email;
  }
  if (fullName) {
    updates.data = { full_name: fullName };
  }

  const { data, error } = await supabase.auth.updateUser(updates);

  if (error) {
    console.error("Update profile error:", error);
    return { error: error.message };
  }

  revalidatePath("/", "layout");

  if (email && data.user.email !== email) {
    return {
      success: true,
      message:
        "Profile updated. Please check your email to verify the new address.",
    };
  }

  return { success: true, message: "Profile updated successfully" };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error("Update password error:", error);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true, message: "Password updated successfully" };
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();

  const file = formData.get("avatar") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    return {
      error: "Invalid file type. Please upload a JPG, PNG, or WebP image.",
    };
  }

  // Validate file size (2MB max)
  const maxSize = 2 * 1024 * 1024; // 2MB in bytes
  if (file.size > maxSize) {
    return { error: "File size too large. Maximum size is 2MB." };
  }

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "User not authenticated" };
  }

  // Delete old avatar if exists
  const oldAvatarUrl = user.user_metadata?.avatar_url;
  if (oldAvatarUrl) {
    const oldPath = oldAvatarUrl.split("/").pop();
    if (oldPath) {
      await supabase.storage.from("avatars").remove([`${user.id}/${oldPath}`]);
    }
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return { error: uploadError.message };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(fileName);

  // Update user metadata
  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      avatar_url: publicUrl,
    },
  });

  if (updateError) {
    console.error("Update user metadata error:", updateError);
    return { error: updateError.message };
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    message: "Avatar updated successfully",
    avatarUrl: publicUrl,
  };
}

export async function deleteAvatar() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "User not authenticated" };
  }

  // Get avatar URL from metadata
  const avatarUrl = user.user_metadata?.avatar_url;
  if (!avatarUrl) {
    return { error: "No avatar to delete" };
  }

  // Extract file path from URL
  const filePath = avatarUrl.split("/").pop();
  if (filePath) {
    const { error: deleteError } = await supabase.storage
      .from("avatars")
      .remove([`${user.id}/${filePath}`]);

    if (deleteError) {
      console.error("Delete avatar error:", deleteError);
      return { error: deleteError.message };
    }
  }

  // Update user metadata to remove avatar_url
  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      avatar_url: null,
    },
  });

  if (updateError) {
    console.error("Update user metadata error:", updateError);
    return { error: updateError.message };
  }

  revalidatePath("/", "layout");
  return { success: true, message: "Avatar removed successfully" };
}
