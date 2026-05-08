"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { uploadImageToCloudinary } from "../utils/cloudinaryUpload";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState("");
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  // 🔐 PASSWORD VALIDATION (NEW ADDED)
  const isStrongPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/.test(
      password,
    );
  };

  // 🔐 REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setFormError("");

    if (!name || !phone || !password || !confirmPassword || !image) {
      setFormError("All required fields must be filled");
      return;
    }

    if (!/^01[3-9]\d{8}$/.test(phone)) {
      setFormError("Enter valid BD mobile number");
      return;
    }

    if (phone.length < 11) {
      setFormError("Phone number must be at least 11 digits");
      return;
    }

    if (!isStrongPassword(password)) {
      setFormError(
        "Password must be 6+ chars, include uppercase, lowercase, number & special character",
      );
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }

      const loginEmail =
        email?.trim() !== "" ? email : `${phone}@cake-heaven.local`;

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        loginEmail,
        password,
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
        photoURL: imageUrl,
      });

      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "register",
          name: name || user.displayName || "",
          email: loginEmail,
          phone: phone,
          image: imageUrl || user.photoURL || "",
          address: address,
          uid: user.uid,
          password: password,
          role: "client",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to save user");
        return;
      }

      // ✅ FIX ADDED HERE
      const finalEmail =
        email?.trim() !== "" ? email : `${phone}@cake-heaven.local`;

      const userData = {
        uid: user.uid,
        name: name || user.displayName,
        email: finalEmail,
        phone: phone,
        image: imageUrl || user.photoURL,
        role: "client",
      };

      localStorage.setItem("user", JSON.stringify(userData));
      window.dispatchEvent(new Event("storage"));

      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Account created successfully 🎉",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "register",
          name: user.displayName || "",
          email: user.email || "",
          phone: "",
          image: user.photoURL || "",
          address: address,
          uid: user.uid,
          password: "",
          role: "client",
        }),
      });

      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        phone: "",
        image: user.photoURL,
        role: "client",
      };

      localStorage.setItem("user", JSON.stringify(userData));
      window.dispatchEvent(new Event("storage"));

      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: finalEmail,
        }),
      });

      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Google signup successful 🎉",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-pink-950 dark:via-black dark:to-rose-950">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <Link href="/">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-pink-500 cursor-pointer">
                Create Account 🎂
              </h1>
            </Link>
            <p className="text-gray-500 text-sm">Join us and order cakes</p>
          </div>

          {formError && (
            <p className="text-red-500 text-sm text-center font-medium">
              {formError}
            </p>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              type="email"
              placeholder="Email (optional)"
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="text"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            />

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setImage(file);
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />

            {preview && (
              <img
                src={preview}
                className="w-24 h-24 object-cover rounded-lg mx-auto border"
              />
            )}

            <Input
              type="text"
              placeholder="Full Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600"
              disabled={loading}
            >
              {loading ? "Creating..." : "Register"}
            </Button>
          </form>

          <Button
            onClick={handleGoogleRegister}
            variant="outline"
            className="w-full"
          >
            Google Signup
          </Button>

          <p className="text-center text-sm text-gray-500">
            Already have account?{" "}
            <Link href="/login" className="text-pink-500">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
