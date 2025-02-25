"use client";

import PodcastGenerator from "@/components/podcast-generator"
import React from 'react';
import TabsAndCards from '../components/tabs-and-cards';
import AudioPlayerCard from "../components/audio-player-card"

const Home = () => {
  return (
    <>
      <AudioPlayerCard />
      <PodcastGenerator/>
      <TabsAndCards />
    </>
  );
};

export default Home;