"use client"

import { Slider } from "@/components/ui/slider"
import { usePlayer } from "@/features/player"
import { useState, useEffect } from "react"
import { secondsToMinSec } from "@/utils/utils"
import PlayButton from "./PlayButton"
import Speaker from "./Speaker"
import NextButton from "./NextButton"
import PrevButton from "./PrevButton"
import RepeatButton from "./RepeatButton"
import ShuffleButton from "./ShuffleButton"

export default function Player() {
    const {
        player, 
        setSong, 
        setTime, 
        setVolume,
        setShuffle, 
        setRepeat, 
        playNextSong, 
        playPrevSong
    } = usePlayer()
    const [selectedTime, setSelectedTime] = useState<number | null>(null)
    const [displayedVolume, setDisplayedVolume] = useState<number>(0)

    const handlePlayButton = () => {        
        if (player?.song) {
            setSong(player.song)
        }
    }

    const handleNextButton = () => {
        playNextSong()
    }

    const handlePrevButton = () => {
        if (player) {
            if (player.currentTime >= 3) {
                setTime(0)
            } else {
                playPrevSong()
            }
        }
    }

    const handleVolumeWheel = (event: any) => {
        event.preventDefault()
        const sensitivity = 0.1
        const delta = Math.sign(event.deltaY) * -sensitivity
        let newVolume = displayedVolume + delta
        newVolume = Math.max(0, Math.min(1, newVolume))
        setVolume(newVolume);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "MediaPlayPause") {
                event.preventDefault()
                handlePlayButton()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [player.playing])

    useEffect(() => {
        setDisplayedVolume(player.volume)
    }, [player.volume])

    const currentTimeDisplayed = selectedTime ?? (Math.floor(player?.currentTime ?? 0))

    return <nav className="fixed bottom-0 z-50 w-full bg-card border-t h-[80px] flex justify-between">
        <div className="w-32 flex-initial"></div>
        <div
            className="w-full max-w-[500px] flex flex-col pb-4 justify-between items-center flex-initial"
        >   

            <div className="-mt-7 flex gap-4">
                <div className="mt-9">
                    <ShuffleButton onClick={() => setShuffle(!player.shuffle)} isActive={player.shuffle}/>
                </div>
                <div className="mt-[0.32rem]">
                    <PrevButton onClick={handlePrevButton}/>
                </div>
                <PlayButton playing={player?.playing} onClick={handlePlayButton}/>
                <div className="mt-[0.32rem]">
                    <NextButton onClick={handleNextButton}/>
                </div>
                <div className="mt-9">
                    <RepeatButton onClick={() => setRepeat(!player.repeat)} isActive={player.repeat}/>
                </div>

            </div>
            
            <div className="w-full flex flex-row gap-4 px-4">
                <span>{secondsToMinSec(currentTimeDisplayed)}</span>
                <Slider
                    min={0}
                    max={Math.floor(player?.song?.duration ?? 0)}
                    value={[currentTimeDisplayed]}
                    onValueChange={(value) => {
                        setSelectedTime(value[0])
                    }}
                    onValueCommit={
                        (value) => {
                            setSelectedTime(null)
                            setTime(value[0])
                        }
                    }
                />
                <span>{secondsToMinSec(player?.song?.duration ?? 0)}</span>
            </div>
        </div>

        <div className="flex-initial flex items-center gap-4">
            <Speaker volume={displayedVolume}/>
            <div className="w-28 mr-4">
                <Slider
                    onWheel={handleVolumeWheel}
                    min={0}
                    max={1}
                    step={0.01}
                    value={[displayedVolume]}
                    onValueChange={(value) => {
                        setVolume(value[0])
                    }}
                />
            </div>
        </div>
    </nav>
}
