import { useState } from "react";
import type { MysteryPack } from "../../engine/types";

interface BootLoginProps {
  mystery: MysteryPack;
  onDone: () => void;
}

export const BootLogin = ({ mystery, onDone }: BootLoginProps): JSX.Element => {
  const [phase, setPhase] = useState<"boot" | "login">("boot");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = mystery.manifest.boot.login;

  if (phase === "boot") {
    return (
      <div className="boot-screen">
        <pre>{mystery.manifest.boot.lines.join("\n")}</pre>
        <button onClick={() => setPhase("login")}>Continue to Login</button>
      </div>
    );
  }

  return (
    <div className="boot-screen">
      <pre>login: {login.username}</pre>
      <label>
        {login.prompt}
        <input
          autoFocus
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (login.acceptedPasswords.includes(password.trim().toLowerCase())) {
                onDone();
              } else {
                setError("Access denied.");
              }
            }
          }}
        />
      </label>
      <button
        onClick={() => {
          if (login.acceptedPasswords.includes(password.trim().toLowerCase())) {
            onDone();
          } else {
            setError("Access denied.");
          }
        }}
      >
        Log In
      </button>
      <p>{error}</p>
    </div>
  );
};
