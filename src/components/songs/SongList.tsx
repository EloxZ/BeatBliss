"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Menu, Item, Separator, useContextMenu } from "react-contexify"
import '@/app/context-menu.css'
import { db } from "@/features/db.model"
import { useLiveQuery } from "dexie-react-hooks"
import { range, secondsToMinSec } from "@/utils/utils"
import PlayButton from "@/components/player/PlayButton"
import { usePlayer } from "@/features/player"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { toastCloseAction } from "@/utils/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

let timeOfClick = 0

export default function SongList() {
    const playlists = useLiveQuery(() => db.playlist.toArray())
    const {player, togglePlay, setSong, setPlaylistSongs} = usePlayer()
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [editSongDialog, setEditSongDialog] = useState({
        id: 0,
        title: "",
        artist: "",
        open: false,
    })
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

    const handleDeleteSong = ({ id, event }: any) => {
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

    const handleEditSong = () => {
        const song = songs?.at(selectedRows[0])
        if (song) {
            setEditSongDialog({
                id: song.id!,
                title: song.title,
                artist: song.artist,
                open: true
            })
        }
    }

    const confirmEditSong = () => {
        db.song.update(editSongDialog.id, {
            title: editSongDialog.title,
            artist: editSongDialog.artist
        })
        setEditSongDialog({
            ...editSongDialog,
            open: false
        })
    }

    useEffect(() => {
        if (songs && songs !== player.playlistSongs) {
            setPlaylistSongs(songs)
        }
    }, [songs, player.song])

    return <>
        <Menu id="cm-row">
            {(selectedRows.length === 1)? <Item id="edit" onClick={() => handleEditSong()}>Edit</Item> : null}
            {(selectedRows.length === 1)? <Separator /> : null}
            <Item id="delete" className="delete-item" onClick={handleDeleteSong}>Delete</Item>
        </Menu>
        <Dialog 
            open={editSongDialog.open} 
            onOpenChange={(value) => setEditSongDialog({...editSongDialog, open: value})}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Playlist</DialogTitle>
                </DialogHeader>
                <fieldset className="flex gap-4 items-center mt-4">
                    <label className="Label" htmlFor="title">
                        Title
                    </label>
                    <Input 
                        className="Input" 
                        id="title" 
                        value={editSongDialog.title} 
                        onKeyDown={(event: any) => event.key === "Enter" && confirmEditSong()}
                        onChange={(event: any) => setEditSongDialog({...editSongDialog, title: event.target.value})} 
                    />
                </fieldset>
                <fieldset className="flex gap-4 items-center mb-4">
                    <label className="Label" htmlFor="artist">
                        Artist
                    </label>
                    <Input 
                        className="Input" 
                        id="artist" 
                        value={editSongDialog.artist} 
                        onKeyDown={(event: any) => event.key === "Enter" && confirmEditSong()}
                        onChange={(event: any) => setEditSongDialog({...editSongDialog, artist: event.target.value})} 
                    />
                </fieldset>
                <DialogFooter>
                    <Button onClick={confirmEditSong}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
                                    onClick={() => {player?.song?.id === song.id ? togglePlay() : setSong(song)}}
                                />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </>
}
