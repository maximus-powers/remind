"use client"

import PodcastGenerator from "@/components/podcast-generator"
import TabsAndCards from "../components/tabs-and-cards"
import AudioPlayerCard from "../components/audio-player-card"
import { ThemeToggle } from "@/components/theme-toggle"

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      <AudioPlayerCard />
      <PodcastGenerator />
      <TabsAndCards />
    </div>
  )
}

export default Home

