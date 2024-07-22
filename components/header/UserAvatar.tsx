import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { IUserAvatarProps } from "@/types";
import Image from "next/image";
export default function UserAvatar({
  name,
  image,
  className,
}: IUserAvatarProps) {
  return (
    <Avatar className={(cn("bg-white text-black"), className)}>
      {image && (
        <Image
          src={image || ""}
          alt={name || "UserName"}
          width={40}
          height={40}
          className="rounded-full"
        />
      )}
      {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
      <AvatarFallback
        delayMs={1000}
        className="dark:bg-white dark:text-black text-lg"
      >
        {name
          ?.split(" ")
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}
