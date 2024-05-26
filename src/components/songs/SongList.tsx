"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Menu, Item, Separator, Submenu, useContextMenu } from 'react-contexify';
import '@/app/context-menu.css'
import { db } from "@/features/db.model"
import { useLiveQuery } from "dexie-react-hooks"
import { range, secondsToMinSec } from "@/utils/utils"
import PlayButton from "./PlayButton"
import { usePlayer } from "@/features/player"
import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"
import { toastCloseAction } from '@/utils/utils'

let timeOfClick = 0

export default function SongList() {
    const [player, setSong, setTime, setVolume, setPlaylistSongs, setShuffle, setRepeat] = usePlayer()
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const songs = useLiveQuery(() => db.song.toArray())
    const { show } = useContextMenu({
        id: 'cm-row',
    });

    const handleContextMenu = (event: any, index: number) => {
        if (selectedRows.indexOf(index) === -1) {
            setSelectedRows([index])
        }

        show({
            id: 'cm-row',
            event
        })
    }

    const handleDelete = ({ id, event }: any) => {
        for (const selectedRow of selectedRows) {
            const song = songs?.at(selectedRow)
            if (song) {
                db.song.delete(song.id).then(() => {
                    toast.success(`Song deleted: ${song.title}`, {
                        action: {
                            label: 'Undo',
                            onClick: () => {db.song.add(song)}
                        }
                    })
                }).catch((error) => {
                    toast.error(`There was an error deleting the song: ${error}`, toastCloseAction)
                })
            }
        }
        setSelectedRows([])
    }

    const handleRowClick = (event: any, index: number) => {
        if (event.shiftKey) {
            const lastRow = selectedRows.at(-1)
            if (lastRow) {
                const newRows = range(index, lastRow)
                setSelectedRows([...selectedRows, ...newRows])
                
            } else {
                setSelectedRows([index])
            }
        } else if (selectedRows.indexOf(index) === -1) {
            if (event.ctrlKey) {
                setSelectedRows([...selectedRows, index])
            } else {
                timeOfClick = event.timeStamp
                setSelectedRows([index])
            } 
        } else {
            if (event.ctrlKey) {
                setSelectedRows(selectedRows.filter((row) => row !== index))
            } else {
                const elapsedTime = event.timeStamp - timeOfClick
                if (elapsedTime < 500) {
                    const song = songs?.at(index)
                    if (song) {
                        setSong(song)
                    }
                }
                setSelectedRows([])
            }
        }
    }

    useEffect(() => {
        if (songs && songs !== player.playlistSongs) {
            setPlaylistSongs(songs)
        }
    }, [songs, player.song])

    return <>
        <Menu id="cm-row">
            {(selectedRows.length === 1)? <Item id="edit" onClick={() => {}}>Edit</Item> : null}
            {(selectedRows.length === 1)? <Separator /> : null}
            <Item id="delete" onClick={handleDelete}>Delete</Item>
        </Menu>
        <Table>
            <TableHeader className="bg-card">
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {songs?.map((song, index) => (
                    <TableRow 
                        key={index}
                        onClick={(event) => handleRowClick(event, index)}
                        onContextMenu={(event) => handleContextMenu(event, index)}
                        className={"group " 
                            + (player?.song?.id === song.id ? "text-primary" : "") 
                            + (selectedRows.includes(index) ? " bg-muted hover:bg-muted" : "")}
                    >
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{song.title}</TableCell>
                        <TableCell>{song.artist}</TableCell>
                        <TableCell>{secondsToMinSec(song.duration ?? 0)}</TableCell>
                        <TableCell className="h-[60px]">
                            <div className="group-hover:block hidden ">
                                <PlayButton 
                                    playing={player?.song?.id === song.id && player?.playing} 
                                    small 
                                    onClick={() => {setSong(song)}}
                                />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </>
}
