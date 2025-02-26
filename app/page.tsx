"use client"

import { useState, useEffect } from "react"
import PodcastGenerator from "@/app/components/podcast-generator"
import TabsAndCards from "@/app/components/tabs-and-cards"
import AudioPlayerCard from "@/app/components/audio-player-card"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { signIn, signOut, useSession } from "next-auth/react"

const Page = () => {
  const { status } = useSession()
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    if (status === "authenticated") {
      setIsSignedIn(true)
      // TODO: add a function that gets the email from the session and checks if the user has a row in the db (it should create one if not)
    } else {
      setIsSignedIn(false)
    }
  }, [status])

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

