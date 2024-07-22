"use client";
import { IAdminControlsDeleteChatButtonProps } from "@/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import useAdminId from "@/hooks/useAdminId";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

function DeleteChatButton({ chatId }: IAdminControlsDeleteChatButtonProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const adminId = useAdminId({ chatId });

  async function handleDelete() {
    toast({
      title: "Deleting Chat",
      description: "Please wait!!! while we delete the chat",
    });

    console.log("Deleting ::", chatId);

    await fetch("/api/chat/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId: chatId }),
    })
      .then((res) => {
        toast({
          title: "Success",
          description: "Your chat has been deleted!!!",
          className: "bg-green-600 text-white",
          duration: 3000,
        });
        router.replace("/chat");
      })
      .catch((err) => {
        console.log(err.message);
        toast({
          title: "Error",
          description: "There was an error deleting your chat!",
          variant: "destructive",
        });
      })
      .finally(() => setOpen(false));
  }

  return (
    session?.user.id === adminId && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive"> Delete Chat</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will delete the chat for all users.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 space-x-2">
            <Button variant={"destructive"} onClick={handleDelete}>
              Delete
            </Button>
            <Button variant={"outline"} onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}

export default DeleteChatButton;
