// GetToken.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export const useToken = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      if (typeof window === "undefined") return;

      const storedToken = localStorage.getItem("token");
      const storedUserId = localStorage.getItem("userId");

      if (!storedToken) {
        setIsLoading(false);
        router.push("/login");
        return;
      }

      try {
        const response = await axios.post(
          "https://lmsapi.eduden.io/api/verify-token/",
          { token: storedToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Check if token is valid based on API response
        if (response.data?.result) {
          console.log("Token is valid");
          setToken(storedToken);
          setUserId(storedUserId);
          setIsValid(true);
        } else {
          console.log("Token is invalid");
          localStorage.clear();
          router.push("/login");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.clear();
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [router]);

  return [token, userId, isLoading, isValid];
};
