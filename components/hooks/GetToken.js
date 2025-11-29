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
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");

        if (!storedToken) {
          setIsLoading(false);
          router.push("/login");
          return;
        }

        // Verify token via API using axios
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


          console.log(response , "token response")
          // Token is valid
          console.log("Token is valid");
          setToken(storedToken);
          setUserId(storedUserId);
          setIsValid(true);
        } catch (error) {
          // Token is invalid or API error
          console.log("Token is invalid or verification failed");
          localStorage.clear();
          router.push("/login");
        } finally {
          setIsLoading(false);
        }
      }
    };

    verifyToken();
  }, [router]);

  return [token, userId, isLoading, isValid];
};
