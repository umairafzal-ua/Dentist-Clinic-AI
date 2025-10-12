import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignUpButton, SignedOut, SignedIn, SignOutButton } from "@clerk/nextjs";
export default function Home() {
  return (
    <div>
      <Button>Click me </Button>
      <SignedOut>
        <SignUpButton mode="modal" />
      </SignedOut>

      <SignedIn>
        
      </SignedIn>
    </div>
  );
}
