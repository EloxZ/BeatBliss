import 'client-only'

import { atom, useRecoilState } from 'recoil'
import { Song } from '@/features/db.model';

interface PlayerState {
    song?: Song
    playing: boolean
    currentTime: number
}

const playerState = atom({
    key: 'PlayerState',
    default: {
        song: undefined,
        playing: false,
        currentTime: 0
    } as PlayerState,
})

let songAudio: HTMLAudioElement | null = null
if (typeof window !== 'undefined') {
    songAudio = new Audio();
}

let timeEvent: NodeJS.Timeout | null = null
let currentSong: Song | null = null

const usePlayer = (): [PlayerState, (song: Song) => void, (time: number) => void] => {
    const [player, setPlayer] = useRecoilState(playerState)

    const updateCurrentTime = () => {
        if (songAudio && !songAudio.paused) {
            setPlayer(prevPlayer => ({
                ...prevPlayer,
                currentTime: songAudio.currentTime
            } as PlayerState))

        } else if (songAudio) {
            setPlayer(prevPlayer => ({
                ...prevPlayer,
                currentTime: songAudio.currentTime,
                playing: false
            } as PlayerState))

            if (timeEvent) {
                clearInterval(timeEvent)
                timeEvent = null
            }
        }
    }

    if (!timeEvent && songAudio) {
        timeEvent = setInterval(updateCurrentTime, 1000)
    }

    const setSong = (song: Song) => {
        if (song) {
            if (song.id !== player.song?.id) {
                currentSong = song
                setPlayer({song: song, playing: true, currentTime: 0})
                if (songAudio) {
                    songAudio.src = song.data
                    songAudio.currentTime = 0
                    songAudio.play()
                }
            } else {
                if (player.playing) {
                    songAudio?.pause()
                } else {
                    songAudio?.play()
                }
    
                setPlayer(prevPlayer => ({
                    ...prevPlayer,
                    playing: !player.playing
                }))
            }
        }
    }

    const setTime = (time: number) => {
        if (songAudio) {
            songAudio.currentTime = time
        }
        setPlayer(prevPlayer => ({
            ...prevPlayer,
            currentTime: time
        }))
    }

    return [player, setSong, setTime]
}



export {
    usePlayer
}