"use client";

import PodcastGenerator from "@/components/podcast-generator"
import React from 'react';
import TabsAndCards from './components/TabsAndCards';
import AudioPlayerCard from "../components/audio-player-card"

const Home = () => {
  return (
    <>
      <PodcastGenerator/>
      <AudioPlayerCard />
      <TabsAndCards />
    </>
  );
};

export default Home;