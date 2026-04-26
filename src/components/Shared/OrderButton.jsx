"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function OrderButton({ cakeId }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleOrder = () => {
    if (!user) {
      alert("For Order you need to login first");
      router.push(`/login?redirect=/order/${cakeId}`);
    } else {
      router.push(`/order/${cakeId}`);
    }
  };

  return (
    <Button
      size="lg"
      onClick={handleOrder}
      className="bg-pink-500 hover:bg-pink-600 text-white px-8"
    >
      Order Now
    </Button>
  );
}
