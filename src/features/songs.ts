import { db, Song } from '@/features/db.model'

const tryUploadSong = (songFile: File, callback: (success: number, songTitle: string) => void) => {
    const reader = new FileReader()
    reader.readAsDataURL(songFile)
    reader.onload = async () => {
        const base64 = reader.result
        let success = 0

        if (typeof base64 === 'string') {
            let titleTokens = songFile.name.split(".")
            titleTokens.pop()
            titleTokens = titleTokens.join(".").split("-")
            const artist = titleTokens.at(0)?.trim() ?? "Unknown"
            titleTokens.splice(0, 1)
            const title = titleTokens.join("-").trim()

            const duration: number = await new Promise((resolve, reject) => {
                const audio = new Audio(base64)
                audio.onloadedmetadata = () => {
                    if (audio.duration === Infinity) {
                        audio.currentTime = 1e101
                        setTimeout(() => {
                            resolve(audio.duration)
                        }, 1000)
                    } else {
                        resolve(audio.duration)
                    }  
                }
            })

            if (duration !== Infinity) {
                const song: Song = {
                    title: title,
                    artist: artist,
                    duration: duration,
                    name: songFile.name,
                    data: base64
                }

                success = await db.song.add(song)
                callback(success, song.title)
            }
        }
    }
}

export {
    tryUploadSong
}