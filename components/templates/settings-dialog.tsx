"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  updateProfile,
  updatePassword,
  uploadAvatar,
  deleteAvatar,
} from "@/app/auth/actions";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

interface SettingsDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({
  user,
  open,
  onOpenChange,
}: SettingsDialogProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleProfileUpdate = async (formData: FormData) => {
    const result = await updateProfile(formData);
    if (result?.error) toast.error(result.error);
    else {
      toast.success(result.message);
      onOpenChange(false);
      router.refresh();
    }
  };

  const handlePasswordUpdate = async (formData: FormData) => {
    const result = await updatePassword(formData);
    if (result?.error) toast.error(result.error);
    else {
      toast.success(result.message);
      onOpenChange(false);
      router.refresh();
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    const result = await uploadAvatar(formData);
    setIsUploading(false);

    if (result?.error) {
      toast.error(result.error);
      setAvatarPreview(null);
    } else {
      toast.success(result.message);
      setAvatarPreview(null);
      router.refresh();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);

    handleAvatarUpload(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-[95vw]
          max-w-[95vw]
          sm:max-w-md
          md:max-w-lg
          lg:max-w-md
          max-h-[90vh]
          overflow-y-auto
          p-4 sm:p-6
          dark:bg-black
        "
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg sm:text-xl">
            Account Settings
          </DialogTitle>
          <DialogDescription className="text-sm">
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger className="cursor-pointer" value="profile">Profile</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="avatar">Avatar</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="security">Security</TabsTrigger>
          </TabsList>

          {/* ---------------- Profile Tab ---------------- */}
          <TabsContent value="profile">
            <form action={handleProfileUpdate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  defaultValue={user.user_metadata.full_name || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user.email || ""}
                />
              </div>

              <Button type="submit" className="w-full sm:w-fit">
                Save Changes
              </Button>
            </form>
          </TabsContent>

          {/* ---------------- Avatar Tab ---------------- */}
          <TabsContent value="avatar">
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <Label>Profile Picture</Label>

                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <Avatar className="h-20 w-20 border rounded-md mx-auto sm:mx-0">
                    <AvatarImage
                      src={avatarPreview || user?.user_metadata?.avatar_url}
                    />
                    <AvatarFallback className="text-xl">
                      {user?.email?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="w-full">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleAvatarUpload(file);
                      }}
                      className={`rounded-lg border-2 border-dashed p-4 text-center cursor-pointer transition
                        ${
                          isDragging
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                            : "border-gray-300 hover:border-gray-400 dark:border-gray-700"
                        }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {isUploading ? (
                        <div className="flex justify-center gap-2 text-sm">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-6 w-6 text-gray-400" />
                          <p className="text-sm text-muted-foreground">
                            Tap or drag image to upload
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {user?.user_metadata?.avatar_url && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="w-full cursor-pointer sm:w-fit"
                    onClick={deleteAvatar}
                  >
                    Remove Avatar
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ---------------- Security Tab ---------------- */}
          <TabsContent value="security">
            <form action={handlePasswordUpdate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input name="password" type="password" required />
              </div>

              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input name="confirmPassword" type="password" required />
              </div>

              <Button type="submit" className="w-full sm:w-fit">
                Update Password
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
