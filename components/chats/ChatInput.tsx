"use client";
import { IChatInputProps, IUser } from "@/types";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { limitedMessagesRef, messageRef } from "@/lib/convertors/Message";
import { useSubscriptionStore } from "@/store/store";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { useRouter } from "next/navigation";
const formSchema = z.object({
  input: z.string().max(1000),
});

function ChatInput({ chatId }: IChatInputProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const subscription = useSubscriptionStore((state) => state.subscription);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { input: "" },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user) return;
    if (values.input.length === 0) return;

    //TODO: check if user is pro and limit them creating new chat
    const messages = (await getDocs(limitedMessagesRef(chatId))).docs.map(
      (doc) => doc.data()
    ).length;

    const isPro =
      subscription?.role === "pro" && subscription?.status === "active";

    if (!isPro && messages >= 20) {
      toast({
        title: "Free Plan Limit Exceeded",
        description:
          "You've exceeded the FREE plan limit of 20 messages per chat.UPGRADE to PRO for UNLIMITED Chat Messages!",
        variant: "destructive",
        action: (
          <ToastAction
            altText="UPGRADE"
            onClick={() => router.push("/register")}
          >
            UPGRADE to PRO
          </ToastAction>
        ),
      });
      return;
    }

    const userToStore: IUser = {
      id: session.user.id!,
      name: session.user.name!,
      email: session.user.email!,
      image: session.user.image || "",
    };

    addDoc(messageRef(chatId), {
      input: values.input,
      timestamp: serverTimestamp(),
      user: userToStore,
    });

    form.reset();
  }
  return (
    <div className="sticky bottom-0">
      <Form {...form}>
        <form
          className="flex space-x-2 p-2 rounded-t-xl max-w-4xl mx-auto bg-white border dark:bg-slate-800"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="input"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    className="border-none bg-transparent dark:placeholder:text-white/78"
                    placeholder="Enter message in ANY Language..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-violet-600 text-white">
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default ChatInput;
