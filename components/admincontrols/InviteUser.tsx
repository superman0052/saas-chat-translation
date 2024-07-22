"use client";
import { IAdminControlsInviteUserProps } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { addChatRef, chatMembersRef } from "@/lib/convertors/ChatMembers";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { getUserByEmailRef } from "@/lib/convertors/User";
import useAdminId from "@/hooks/useAdminId";
import { PlusCircleIcon } from "lucide-react";
import { useSubscriptionStore } from "@/store/store";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import ShareLink from "./ShareLink";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

function InviteUser({ chatId }: IAdminControlsInviteUserProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const adminID = useAdminId({ chatId });
  const subscription = useSubscriptionStore((state) => state.subscription);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openInviteLink, setOpenInviteLink] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user.id) return;
    toast({
      title: "Sending Invite",
      description: "Please wait!!! While we are sending the invite...",
    });

    // We need to get the users current chats to check if they are about to exceed the PRO plan

    const noOfUsersInChat = (await getDocs(chatMembersRef(chatId))).docs.map(
      (doc) => doc.data()
    );

    // check if the user is about to exceed the PRO plan which is 3 Chats

    const isPro =
      subscription?.role === "pro" && subscription?.status === "active";

    if (!isPro && noOfUsersInChat.length >= 2) {
      toast({
        title: "Free Plan Limit Exceeded",
        description:
          "You've exceeded the limit of users in a single chat for the FREE plan. Please upgrade to PRO to continue adding users to chats!!!",
        variant: "destructive",

        action: (
          <ToastAction
            altText="Upgrade"
            onClick={() => router.push("/register")}
          >
            UPGRADE TO PRO!!!
          </ToastAction>
        ),
      });
      return;
    }

    const getIfUserExists = await getDocs(getUserByEmailRef(values.email));

    if (getIfUserExists.empty) {
      toast({
        title: "User not Found",
        description:
          "Please enter an email address of a registered user OR resend the invitation onve they have signed up!!!",
        variant: "destructive",
      });
      return;
    } else {
      const user = getIfUserExists.docs[0].data();
      await setDoc(addChatRef(chatId, user.id), {
        userId: user.id!,
        email: user.email!,
        timestamp: serverTimestamp(),
        chatId: chatId,
        isAdmin: false,
        image: user.image || "",
      })
        .then(() => {
          setOpen(false);
          toast({
            title: "Added to chat",
            description: "The user has been added to the chat successfully!!!",
            className: "bg-green-600 text-white",
            duration: 3000,
          });
          setOpenInviteLink(true);
        })
        .catch(() => {
          toast({
            title: "ERROR!!!",
            description:
              "Whoops... there was an error adding the user to the chat!!!",
            variant: "destructive",
          });
          setOpen(false);
        });
    }
    form.reset();
  }
  return (
    adminID === session?.user.id && (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              {" "}
              <PlusCircleIcon className="mr-1" />
              Add User To Chat
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add User to Chat</DialogTitle>
              <DialogDescription>
                Simply enter another users email address to invite them to this
                chat!{" "}
                <span className="text-indigo-600 font-bold">
                  (NOTE: THEY MUST BE REGISTERED!!)
                </span>
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-2"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="john@doe.com" {...field} />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="ml-auto sm:w-fit w-full">
                  Add to Chat
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <ShareLink
          isOpen={openInviteLink}
          chatId={chatId}
          setIsOpen={setOpenInviteLink}
        />
      </>
    )
  );
}

export default InviteUser;
