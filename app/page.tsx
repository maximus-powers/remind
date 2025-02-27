"use client"

import { useState, useEffect } from "react"
import PodcastGenerator from "@/app/components/podcast-generator"
import TabsAndCards from "@/app/components/tabs-and-cards"
import AudioPlayerCard from "@/app/components/audio-player-card"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { signIn, signOut, useSession } from "next-auth/react"
import type { User } from "next-auth"
import InfoTooltip from "@/app/components/info-tooltip"
import { Button } from "@/app/components/ui/button"
import { Skeleton } from "@/app/components/ui/skeleton"
import { Card, CardContent } from "@/app/components/ui/card"
import { Play, SkipForward, SkipBack, Volume2, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import gifImage from "@/public/hero-gif.gif"

const Page = () => {
  const { status, data: session } = useSession()
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [reloadAudioPlayer, setReloadAudioPlayer] = useState(false)

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
        await fetch("/api/data/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })
      } catch (error) {
        console.error("Failed to store user email:", error)
      }
    }
    console.log(email)
  }

  const handlePodcastGenerated = () => {
    setReloadAudioPlayer(!reloadAudioPlayer)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <InfoTooltip className="mr-2" />
          <ThemeToggle />
        </div>
        {isSignedIn ? (
          <Button variant="outline" onClick={() => signOut()}>
            Sign out
          </Button>
        ) : (
          <Button variant="outline" onClick={() => signIn("google")}>
            Sign in
          </Button>
        )}
      </div>

      {isSignedIn ? (
        <>
          <AudioPlayerCard key={String(reloadAudioPlayer)} />
          <PodcastGenerator onPodcastGenerated={handlePodcastGenerated} />
          <TabsAndCards />
        </>
      ) : (
        <div className="mt-8 space-y-8">
          {/* hero section */}
          <div className="text-center space-y-4">
            <Image src={gifImage} alt="Hero GIF" width={300} height={200} className="mx-auto" />
            <h1 className="text-4xl font-bold">Remember More</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-5">
              Create personal podcasts to remind you of facts you&apos;ve added to your knowledge base.
            </p>
            <Button
              size="lg"
              className="mt-6 mx-auto bg-white text-gray-500 border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
              onClick={() => signIn("google")}
            >
              <Image src="google-logo.svg" alt="Google logo" width={18} height={18} className="mr-2" />
              Continue with Google
            </Button>
          </div>
          <hr className="my-8" />


        {/* how it works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Organize Your Facts</h3>
              <p className="text-muted-foreground">Create tabs and cards to organize your favorite facts.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Play className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Generate Podcasts</h3>
              <p className="text-muted-foreground">Facts are curated based on which were least-recently included in a podcast, and which fit a podcast&apos;s theme. </p>
            </div>
          </div>
          <hr className="my-8" />

          {/* preview */}
          <div className="text-center">
            <h2 className="text-3xl font-bold">Preview</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-5">
              Here&apos;s what your dashboard will look like after you sign in and add a few facts.
            </p>
          </div>
          <div className="space-y-5 mt-20">
            <Card className="w-full max-w-lg mx-auto bg-background shadow-lg rounded-lg overflow-hidden mt-4 mb-2">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-primary">Your daily byte</h2>
                    <Skeleton className="h-4 w-24" />
                  </div>

                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <Skeleton className="h-2 w-1/3" />
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" size="icon" disabled>
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" disabled>
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" disabled>
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <Skeleton className="h-2 w-full rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mx-auto p-1 mb-5">
              <Button disabled className="w-full bg-primary">
                Generate Podcast
              </Button>
            </div>

            <div className="p-1">
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {["Quotes", "Psychology", "History"].map((tabName, index) => (
                  <div
                    key={index}
                    className={`bg-${index === 0 ? "red" : index === 1 ? "blue" : "green"}-500 text-white py-2 px-5 rounded-lg ${
                      index === 0 ? "font-bold shadow-lg" : "opacity-70"
                    }`}
                  >
                    {tabName}
                  </div>
                ))}
                <Button variant="outline" className="flex-grow rounded-lg" disabled>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button variant="outline" className="w-full mb-4" disabled>
                <Plus className="mr-2 h-4 w-4" /> Add Card
              </Button>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold flex-grow">J.D. Salinger</h3>
                      <Button variant="ghost" size="icon" className="text-muted-foreground flex-shrink-0" disabled>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground">&quot;I don&apos;t exactly know what I mean by that, but I mean it.&quot;</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold flex-grow">Oscar Wilde</h3>
                      <Button variant="ghost" size="icon" className="text-muted-foreground flex-shrink-0" disabled>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground">&quot;I can resist everything except temptation.&quot;</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className=" font-semibold flex-grow">Yogi Berra</h3>
                      <Button variant="ghost" size="icon" className="text-muted-foreground flex-shrink-0" disabled>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground">&quot;Nobody goes there anymore. It&apos;s too crowded.&quot;</p>
                  </CardContent>
                </Card>
              </div>

              <Button variant="destructive" className="mt-4" disabled>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Tab
              </Button>
            </div>
          </div>


        </div>
      )}
    </div>
  )
}

export default Page

