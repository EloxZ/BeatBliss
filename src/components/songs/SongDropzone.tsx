"use client"

import { isValidAudioFormat } from '@/utils/utils'
import Dropzone from 'react-dropzone'
import { useState } from 'react'
import { db, Song } from '@/features/db.model'
import { toast } from "sonner"
import { toastCloseAction } from '@/utils/utils'
import { tryUploadSong } from '@/features/songs'

export default function SongDropzone() {
    const onSongsDrop = (songFiles: File[]) => {
        let successNumber = 0
        for (const songFile of songFiles) {
            if (isValidAudioFormat(songFile)) {
                tryUploadSong(songFile, uploadCallback)
            } else {
                toast.error(`The selected file must be an audio file`, toastCloseAction)
            }
        }
    }

    const uploadCallback = (success: number, songTitle: string) => {
        if (success) {
            toast.success(`Song uploaded correctly: ${songTitle}`, toastCloseAction)
        } else {
            toast.error(`There was an error uploading the song: ${songTitle}`, toastCloseAction)
        }
    }

    return <Dropzone onDrop={acceptedFiles => onSongsDrop(acceptedFiles)}>
        {({getRootProps, getInputProps}) => (
            <section>
                <div className='border-2 border-dashed border-gray-300 p-16 text-center rounded-sm' {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag &apos;n&apos; drop your songs here, or click to select files</p>
                </div>
            </section>
        )}
    </Dropzone>
}