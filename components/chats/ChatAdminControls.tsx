import { IChatAdminControlsProps } from "@/types";
import DeleteChatButton from "../admincontrols/DeleteChatButton";
import InviteUser from "../admincontrols/InviteUser";

function ChatAdminControls({ chatId }: IChatAdminControlsProps) {
  return (
    <div className="flex justify-end space-x-2 m-5 mb-0">
      <InviteUser chatId={chatId} />
      <DeleteChatButton chatId={chatId} />
    </div>
  );
}

export default ChatAdminControls;
