"use client"

import { useState, useEffect } from "react"
import PodcastGenerator from "@/app/components/podcast-generator"
import TabsAndCards from "@/app/components/tabs-and-cards"
import AudioPlayerCard from "@/app/components/audio-player-card"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { signIn, signOut, useSession } from "next-auth/react"
import type { User } from "next-auth"

const Page = () => {
  const { status, data: session } = useSession()
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      setIsSignedIn(true)
      storeUserEmail(session)
    } else {
      setIsSignedIn(false)
    }
  }, [status, session])

  const storeUserEmail = async (session: { user?: User }) => {
    const email = session?.user?.email
    if (email) {
      localStorage.setItem("userEmail", email)
      try {
        await fetch('/api/data/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
      } catch (error) {
        console.error('Failed to store user email:', error);
      }
    }
    console.log(email);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        {isSignedIn ? (
          <button className="" onClick={() => signOut()}>Sign out</button>
        ) : (
          <button className="" onClick={() => signIn("google")}>Sign in with Google</button>
        )}
        <ThemeToggle />
      </div>
      {isSignedIn && (
        <>
          <AudioPlayerCard />
          <PodcastGenerator />
          <TabsAndCards />
        </>
      )}
    </div>
  )
}

export default Page

