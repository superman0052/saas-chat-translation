import { Session } from "next-auth";
import { Subscription } from "./Subscription";
import { Dispatch, SetStateAction } from "react";
import { SetState } from "zustand";

interface IUserAvatarProps {
  name?: string | null | undefined;
  image?: string | null | undefined;
  className?: string;
}

interface IUserSession {
  session: Session | null;
}

interface IPricingCardsProps {
  redirect: boolean;
}

interface IPricingCardsTiers {
  name: string;
  id: string | null;
  href: string;
  priceMonthly: string | null;
  description: string;
  features: string[];
}

interface IChatPageProps {
  params: {};
  searchParams: {
    error: string;
  };
}

interface ICreateChatButtonProps {
  isLarge?: boolean;
}

interface IChatMember {
  userId: string;
  email: string;
  timestamp: Date | null;
  isAdmin: boolean;
  chatId: string;
  image: string;
}

interface IChatMembersList {
  initialChats: IChatMember[];
}

interface IUser {
  id: string;
  email: string;
  name: string;
  image: string;
}

interface IMessage {
  id?: string;
  input: string;
  timestamp: Date;
  user: IUser;
  translated?: { [K in LanguageSupported]?: string };
}

interface ILanguageState {
  language: LanguageSupported;
  setLanguage: (language: LanguageSupported) => void;
  getLanguages: (isPro: boolean) => LanguageSupported[];
  getNonSupportedLangugages: (isPro: boolean) => LanguageSupported[];
}

interface SubscriptionState {
  subscription: Subscription | null | undefined;
  setSubscription: (subscription: Subscription | null) => void;
}

type LanguageSupported =
  | "en"
  | "es"
  | "de"
  | "fr"
  | "hi"
  | "ja"
  | "la"
  | "ru"
  | "zh"
  | "ar";

interface IChatInputProps {
  chatId: string;
}

interface IUserChatPageProps {
  params: {
    chatId: string;
  };
}

interface IChatMessagesProps {
  chatId: string;
  initialMessages: IMessage[];
  session: Session | null;
}

interface IChatMembersBadgesProps {
  chatId: string;
}
interface IChatAdminControlsProps {
  chatId: string;
}
interface IAdminControlsInviteUserProps {
  chatId: string;
}

interface IAdminControlsDeleteChatButtonProps {
  chatId: string;
}

interface IShareLinkProps {
  isOpen: boolean;
  chatId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
