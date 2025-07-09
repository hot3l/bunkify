"use client";
import { useEffect, useRef } from "react";

export default function GoogleAuthPage() {
  const googleButtonRef = useRef(null);
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      const google = window.google as { accounts?: { id?: { initialize: Function; renderButton: Function } } };
      if (
        google &&
        google.accounts &&
        google.accounts.id
      ) {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          scope: "profile email https://www.googleapis.com/auth/drive.appdata",
        });
        google.accounts.id.renderButton(
          googleButtonRef.current,
          { theme: "outline", size: "large" }
        );
      }
    };
    return () => {
      document.body.removeChild(script);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GOOGLE_CLIENT_ID]);

  function handleCredentialResponse(response: { credential: string }) {
    const userObject = parseJwt(response.credential);
    const userInfo = {
      name: userObject.name,
      email: userObject.email,
      picture: userObject.picture,
    };
    localStorage.setItem("user", JSON.stringify(userInfo));
    window.location.href = "/dashboard";
  }

  function parseJwt(token: string) {
    if (!token) return {};
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return {};
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <h1>Sign in with Google</h1>
      <div ref={googleButtonRef} id="g_id_signin" className="mt-4"></div>
    </div>
  );
} 