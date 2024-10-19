"use client";
import React, { ReactNode } from "react";
import {
  LiveblocksProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import { getClerkUser, getDocumentUsers } from "@/lib/actions/users.actions";
import { useUser } from "@clerk/nextjs";
const Provider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser } = useUser();
  return (
    <LiveblocksProvider
      resolveUsers={async ({ userIds }) => {
        const users = await getClerkUser({ userIds });
        return users;
      }}
      authEndpoint="/api/liveblocks-auth"
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const roomUsers = getDocumentUsers({
          roomId,
          currentUser: clerkUser!.emailAddresses[0].emailAddress,
          text,
        });
        return roomUsers;
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;
