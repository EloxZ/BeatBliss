import 'client-only'

import { atom, useRecoilState } from 'recoil'
import { Song } from '@/features/db.model'

interface PlayerState {
    song?: Song
    playing: boolean
    currentTime: number
    volume: number,
    playlistSongs: Song[],
    shuffle: boolean
    repeat: boolean,
    prevSongs?: Song[]
}

const PREV_SONGS_BUFFER_SIZE = 100

let defaultVolume = 0.5
let defaultShuffle = false
let defaultRepeat = false
let songAudio: HTMLAudioElement | null = null
if (typeof window !== 'undefined') {
    songAudio = new Audio();
    const savedVolume = localStorage.getItem("volume")
    if (savedVolume) {
        defaultVolume = Number(savedVolume)
    }

    defaultShuffle = localStorage.getItem("shuffle") === "true"
    defaultRepeat = localStorage.getItem("repeat") === "true"
}

let timeEvent: NodeJS.Timeout | null = null

const playerState = atom({
    key: 'PlayerState',
    default: {
        song: undefined,
        playing: false,
        currentTime: 0,
        volume: defaultVolume,
        playlistSongs: [],
        shuffle: defaultShuffle,
        repeat: defaultRepeat,
        prevSongs: []
    } as PlayerState,
})

const usePlayer = (): [
    PlayerState, (song: Song) => void, 
    (time: number) => void, 
    (volume: number) => void, 
    (playlistSongs: Song[]) => void, 
    (shuffle: boolean) => void, 
    (repeat: boolean) => void,
    () => void,
    () => void
] => {
    const [player, setPlayer] = useRecoilState(playerState)

    const updateCurrentTime = () => {
        if (songAudio) {
            setPlayer(prevPlayer => ({
                ...prevPlayer,
                playing: !songAudio.paused,
                currentTime: songAudio.currentTime
            } as PlayerState))
        }

        if (songAudio && songAudio.ended) {
            playNextSong()
        }
    }

    if (!timeEvent && songAudio) {
        timeEvent = setInterval(updateCurrentTime, 1000)
    }

    const getNextSong = (player: PlayerState): Song | undefined => {
        let nextSong = undefined
        if (player.song) {
            nextSong = player.song
            if (!player.repeat && player.playlistSongs.length > 0) {
                if (player.shuffle && player.playlistSongs.length > 1) {
                    while (player.song.id === nextSong.id) {
                        const randomIndex = Math.floor(Math.random() * player.playlistSongs.length)
                        nextSong = player.playlistSongs[randomIndex]
                    }
                } else {
                    const index = player.playlistSongs.findIndex(song => song.id === player.song?.id)
                    nextSong = (index < player.playlistSongs.length - 1)?
                        player.playlistSongs[index + 1] :
                        player.playlistSongs[0]
                }
            }
        }

        return nextSong
    }

    const playNextSong = () => {
        let nextSong = undefined
        let isRepeat = false
        setPlayer(prevPlayer => {
            nextSong = getNextSong(prevPlayer)
            isRepeat = prevPlayer.repeat
            return prevPlayer
        })

        if (nextSong) {
            setSong(nextSong, false, isRepeat)
        }
    }

    const playPrevSong = () => {
        let prevSong = undefined

        setPlayer(prevPlayer => {
            if (prevPlayer.prevSongs && prevPlayer.prevSongs.length > 0) {
                prevSong = prevPlayer.prevSongs.at(-1)
            }
            return prevPlayer
        })

        if (prevSong) {
            setSong(prevSong, true)
        }
    }

    const setSong = (song: Song, isPrevious = false, isRepeat = false) => {
        if (song) {
            if (song.id !== player.song?.id || isRepeat) {
                setPlayer(prevPlayer => {
                    let newPrevSongs = prevPlayer.prevSongs ?? []
                    if (prevPlayer.song && !isPrevious) {
                        newPrevSongs = newPrevSongs.slice(-(PREV_SONGS_BUFFER_SIZE-1))
                        if (!isRepeat) {
                            newPrevSongs.push(prevPlayer.song)
                        }
                    } else if (isPrevious) {
                        newPrevSongs = newPrevSongs.slice(0, newPrevSongs.length-1)
                    }

                    return {
                        ...prevPlayer,
                        song: song,
                        prevSongs: newPrevSongs,
                        playing: true,
                        currentTime: 0
                    }
                })

                if (songAudio) {
                    songAudio.pause()
                    songAudio.src = song.data
                    songAudio.currentTime = 0
                    songAudio.volume = player.volume
                    songAudio.oncanplaythrough = () => {
                        songAudio.play().catch(error => {
                            if (error.name === 'AbortError') {
                                console.error('Playback was aborted.');
                            } else {
                                console.error('Error playing audio:', error);
                            }
                        })
                    }
                    songAudio.load()
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

    const setVolume = (volume: number) => {
        localStorage.setItem("volume", volume.toString())
        if (songAudio) {
            songAudio.volume = volume
        }
        setPlayer(prevPlayer => ({
            ...prevPlayer,
            volume
        }))
    }

    const setPlaylistSongs = (playlistSongs: Song[]) => {
        setPlayer(prevPlayer => ({
            ...prevPlayer,
            playlistSongs
        }))
    }

    const setShuffle = (shuffle: boolean) => {
        setPlayer(prevPlayer => ({
            ...prevPlayer,
            shuffle
        }))
    }

    const setRepeat = (repeat: boolean) => {
        setPlayer(prevPlayer => ({
            ...prevPlayer,
            repeat
        }))
    }

    return [
        player, 
        setSong, 
        setTime, 
        setVolume, 
        setPlaylistSongs, 
        setShuffle, 
        setRepeat, 
        playNextSong, 
        playPrevSong
    ]
}

export {
    usePlayer
}