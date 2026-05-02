import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export const logoutUser = async () => {
  try {
    // Firebase logout
    await signOut(auth);

    // Clear local storage
    localStorage.removeItem("user");

    // Trigger update across tabs/components
    window.dispatchEvent(new Event("storage"));

    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};