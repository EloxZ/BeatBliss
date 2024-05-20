"use client"

import { isValidAudioFormat } from '@/utils/utils'
import Dropzone from 'react-dropzone'
import { useState } from 'react'
import { db, Song } from '@/features/db.model'

export default function SongDropzone() {
    const [msg, setMsg] = useState("")
    const [error, setError] = useState(false)
    const onSongsDrop = (songFiles: File[]) => {
        let successNumber = 0
        for (const songFile of songFiles) {
            if (isValidAudioFormat(songFile)) {
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
                        }
                    }

                    if (success) {
                        successNumber += 1
                        setMsg(`File uploaded correctly (${successNumber}/${songFiles.length})`)
                        setError(false)
                    } else {
                        setMsg("There was an error uploading the file")
                        setError(true)
                    }
                }
            } else {
                setMsg("The selected file must be an audio file")
                setError(true)
            }
        }
    }

    return <Dropzone onDrop={acceptedFiles => onSongsDrop(acceptedFiles)}>
        {({getRootProps, getInputProps}) => (
            <section>
                <div className='border-2 border-dashed border-gray-300 p-16 text-center rounded-sm' {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag &apos;n&apos; drop your songs here, or click to select files</p>
                    <p className={'h-4 ' + (error ? 'text-red-300' : 'text-green-300')}>{msg}</p>
                </div>
            </section>
        )}
    </Dropzone>
}