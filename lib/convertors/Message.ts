import { db } from "@/firebase";
import { IMessage } from "@/types";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  collectionGroup,
  doc,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

const messageConvertor: FirestoreDataConverter<IMessage> = {
  toFirestore: function (message: IMessage): DocumentData {
    return {
      input: message.input,
      timestamp: message.timestamp,
      user: message.user,
    };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): IMessage {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      input: data.input,
      timestamp: data.timestamp?.toDate(),
      translated: data.translated,
      user: data.user,
    };
  },
};

export const messageRef = (chatId: string) =>
  collection(db, "chats", chatId, "messages").withConverter(messageConvertor);

export const limitedMessagesRef = (chatId: string) =>
  query(messageRef(chatId), limit(25));

export const sortedMessagesRef = (chatId: string) =>
  query(messageRef(chatId), orderBy("timestamp", "asc"));

export const limitedSortedMessagesRef = (chatId: string) =>
  query(query(messageRef(chatId), limit(1)), orderBy("timestamp", "desc"));
