"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Avatar, Box, Card, Flex, Text } from "@radix-ui/themes";

// Supabase client
const supabase = createClient();

export default function UserCard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    }

    // Load once
    loadUser();

    // Listen to login / logout changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Try all possible metadata fields
  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.username ||
    user?.user_metadata?.display_name ||
    "User";

  const email = user?.email ?? "";

  const avatarSrc =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture || // Google OAuth
    "";

  return (
    <div className="justify-end-safe items-center flex">
      <Box maxWidth="380px">
        <Card>
          <Flex gap="3" align="center">
            <Avatar
              size="3"
              src={avatarSrc || undefined}
              fallback={name.charAt(0).toUpperCase()}
            />
            <Box>
              <Text as="div" size="2" weight="bold">
                {name}
              </Text>
              <Text as="div" size="2" color="gray">
                {email}
              </Text>
            </Box>
          </Flex>
        </Card>
      </Box>
    </div>
  );
}
