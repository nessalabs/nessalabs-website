"use client";

import * as React from "react";
import { Button, Input } from "@/components/nessa-ui";

export function Subscribe() {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);

  return (
    <form
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        if (!email) return;
        setSent(true);
      }}
    >
      <Input
        prompt="$"
        type="email"
        required
        aria-label="Email address"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" variant="solid" size="md">
        {sent ? "on the list" : "request access"}
      </Button>
    </form>
  );
}
