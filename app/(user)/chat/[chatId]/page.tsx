import { authOptions } from "@/auth";
import ChatAdminControls from "@/components/chats/ChatAdminControls";
import ChatInput from "@/components/chats/ChatInput";
import ChatMembersBadges from "@/components/chats/ChatMembersBadges";
import ChatMessages from "@/components/chats/ChatMessages";
import { chatMembersRef } from "@/lib/convertors/ChatMembers";
import { sortedMessagesRef } from "@/lib/convertors/Message";
import { IUserChatPageProps } from "@/types";
import { getDocs } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function ChatPage({ params: { chatId } }: IUserChatPageProps) {
  const session = await getServerSession(authOptions);

  const initialMessages = (await getDocs(sortedMessagesRef(chatId))).docs.map(
    (doc) => doc.data()
  );

  const hasAccess = (await getDocs(chatMembersRef(chatId))).docs
    .map((doc) => doc.id)
    .includes(session?.user.id!);

  if (!hasAccess) redirect("/chat?error=permission");

  return (
    <>
      {/* Admin Controls */}
      <ChatAdminControls chatId={chatId} />
      {/* Chat members badge */}
      <ChatMembersBadges chatId={chatId} />

      {/* Chat Messages */}
      <div className="flex-1">
        <ChatMessages
          chatId={chatId}
          session={session}
          initialMessages={initialMessages}
        />
      </div>

      {/* Chat input */}
      <ChatInput chatId={chatId} />
    </>
  );
}

export default ChatPage;
