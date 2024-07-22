"use client";

import { subscriptionRef } from "@/lib/convertors/Subscription";
import { useSubscriptionStore } from "@/store/store";
import { onSnapshot } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const setSubscription = useSubscriptionStore(
    (state) => state.setSubscription
  );

  useEffect(() => {
    if (!session) return;
    return onSnapshot(
      subscriptionRef(session?.user.id),
      (snapshot) => {
        if (snapshot.empty) {
          console.log("User has NO subscription");

          //set NO Subscription
          setSubscription(null);
        } else {
          console.log("User has subscription");

          console.log(snapshot.docs[0].data());
          //set Subscription
          setSubscription(snapshot.docs[0].data());
        }
      },
      (error) => {
        console.error(`Error getting document ${error}`);
      }
    );
  }, [session, setSubscription]);

  return <>{children}</>;
}

export default SubscriptionProvider;
