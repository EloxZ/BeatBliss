"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { db } from "@/features/db.model"
import { useLiveQuery } from "dexie-react-hooks"
import { secondsToMinSec } from "@/utils/utils"
import PlayButton from "./PlayButton"
import { usePlayer } from "@/features/player"

export default function SongList() {
    const [player, setSong] = usePlayer()
    const songs = useLiveQuery(() => db.song.toArray())

    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="w-[80px]"></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {songs?.map((song) => (
                <TableRow className={"group " + (player?.song?.id === song.id ? "bg-muted" : "") }>
                    <TableCell>{song.title}</TableCell>
                    <TableCell>{song.artist}</TableCell>
                    <TableCell>{secondsToMinSec(song.duration ?? 0)}</TableCell>
                    <TableCell className="h-[60px]">
                        <div className="group-hover:block hidden ">
                            <PlayButton 
                                playing={player?.song?.id === song.id && player?.playing} 
                                small 
                                onClick={() => setSong(song)}
                            />
                        </div>

                    </TableCell>
                </TableRow>
            ))} 
        </TableBody>
    </Table>
}
