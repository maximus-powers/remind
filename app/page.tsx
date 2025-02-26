"use client"

import PodcastGenerator from "@/components/podcast-generator"
import TabsAndCards from "../components/tabs-and-cards"
import AudioPlayerCard from "../components/audio-player-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { signIn } from "next-auth/react"

const Page = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button className="" onClick={() => signIn("google")}>Sign in with Google</button>
        <ThemeToggle />
      </div>
      <AudioPlayerCard />
      <PodcastGenerator />
      <TabsAndCards />
    </div>
  )
}

export default Page

