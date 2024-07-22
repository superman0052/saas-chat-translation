import ChatLists from "@/components/chats/ChatLists";
import ChatPermissionError from "@/components/chats/ChatPermissionError";
import { IChatPageProps } from "@/types";

function ChatsPage({ searchParams: { error } }: IChatPageProps) {
  return (
    <div>
      {/* Chat Permission chat */}
      {error && (
        <div className="m-2">
          <ChatPermissionError />
        </div>
      )}
      {/* ChatLists */}
      <ChatLists />
    </div>
  );
}

export default ChatsPage;
