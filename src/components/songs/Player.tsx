"use client"

import { Slider } from "@/components/ui/slider"
import { usePlayer } from "@/features/player"
import { useState, useEffect } from "react"
import { secondsToMinSec } from "@/utils/utils"
import PlayButton from "./PlayButton"

export default function Player() {
    const [player, setSong, setTime] = usePlayer()
    const [selectedTime, setSelectedTime] = useState<number | null>(null)

    const handlePlayButton = () => {        
        if (player?.song) {
            setSong(player.song)
        }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.code === "Space" || event.code === "MediaPlayPause") {
            event.preventDefault()
            handlePlayButton()
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [player.playing]);

    const currentTimeDisplayed = selectedTime ?? (Math.floor(player?.currentTime ?? 0))

    return <nav className="fixed bottom-0 z-50 w-full bg-card border-t h-[80px] flex justify-between">
        <div></div>
        <div
            className="w-full max-w-[500px] flex flex-col pb-4 justify-between items-center"
        >   
            <div className="-mt-7">
                <PlayButton playing={player?.playing} onClick={handlePlayButton}/>
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

        <div></div>
    </nav>
}
