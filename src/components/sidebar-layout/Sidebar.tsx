"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import SidebarButton from "./SidebarButton"
import { Button } from "../ui/button"
import { RectangleStackIcon } from '@heroicons/react/24/solid'
import { RectangleStackIcon as RectangleStackIconOutline } from '@heroicons/react/24/outline'
import { QueueListIcon } from '@heroicons/react/24/solid'
import { QueueListIcon as QueueListIconOutline } from '@heroicons/react/24/outline'
import { MusicalNoteIcon } from '@heroicons/react/24/solid'
import { MusicalNoteIcon as MusicalNoteIconOutline } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import SidebarDropdown from "./SidebarDropdown"
import { useState } from "react"
import { Playlist, db } from "@/features/db.model"
import { useLiveQuery } from "dexie-react-hooks"
import { toast } from "sonner"
import { toastCloseAction } from "@/utils/utils"
import { Input } from "@/components/ui/input"
import { Menu, Item, Separator, Submenu, useContextMenu } from 'react-contexify';
import '@/app/context-menu.css'

export default function Sidebar({isOpen}: {isOpen: boolean}) {
    const pathname = usePathname()
    const [playlistDropwdownOpen, setPlaylistDropwdownOpen] = useState(false)
    const [playlistDialog, setPlaylistDialog] = useState({
        id: 0,
        open: false,
        name: "New Playlist"
    })
    const playlists = useLiveQuery(() => db.playlist.toArray())
    const { show } = useContextMenu({})

    const handlePlaylistsContextMenu = (event: any) => {
        show({
            id: 'cm-playlists',
            event
        })
    }

    const handlePlaylistContextMenu = (event: any, playlist: Playlist) => {
        show({
            id: 'cm-playlist',
            event,
            props: {
                playlist: playlist
            }
        })
    }

    const handleCreatePlaylist = () => {
        db.playlist.add({
            name: "New Playlist",
            songIds: []
        })
    }

    const handleEditPlaylist = (props: any) => {
        setPlaylistDialog({
            id: props.playlist.id,
            open: true,
            name: props.playlist.name
        })
    }

    const confirmEditPlaylist = () => {
        db.playlist.update(playlistDialog.id, {
            name: playlistDialog.name
        })
        setPlaylistDialog({
            ...playlistDialog,
            open: false
        })
    }

    const handleDeletePlaylist = (props: any) => {
        db.playlist.delete(props.playlist.id)
    }

    return <>
        <Menu id="cm-playlists">
            <Item id="create" onClick={handleCreatePlaylist}>Create Playlist</Item>
        </Menu>
        <Menu id="cm-playlist">
            <Item id="edit" onClick={({props}) => handleEditPlaylist(props)}>Edit</Item>
            <Item id="delete" onClick={({props}) => handleDeletePlaylist(props)}>Delete</Item>
        </Menu>
        <Dialog open={playlistDialog.open} onOpenChange={(value) => setPlaylistDialog({...playlistDialog, open: value})}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Playlist</DialogTitle>
                </DialogHeader>
                <fieldset className="flex gap-4 items-center my-4">
                    <label className="Label" htmlFor="name">
                        Name
                    </label>
                    <Input className="Input" id="name" value={playlistDialog.name} 
                        onKeyDown={(event) => event.key === "Enter" && confirmEditPlaylist()}
                        onChange={(event) => setPlaylistDialog({...playlistDialog, name: event.target.value})} />
                </fieldset>
                <DialogFooter>
                    <Button onClick={confirmEditPlaylist}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <aside id="logo-sidebar" className={"fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform border-r bg-card " + (isOpen ? "translate-x-0" : "-translate-x-full")} aria-label="Sidebar">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-card">
                <ul className="space-y-2 font-medium">
                    <SidebarButton
                        href="/library"
                        className={pathname.includes("/library") ? "bg-accent" : ""}
                        text="Library"
                        icon={pathname.includes("/library") ? <RectangleStackIcon className="size-6"/> : <RectangleStackIconOutline className="size-6"/>}
                    />
                    <SidebarDropdown
                        isOpen={playlistDropwdownOpen}
                        setIsOpen={setPlaylistDropwdownOpen}
                        onContextMenu={handlePlaylistsContextMenu}
                        onClickEmpty={() => toast.info("Right click to create a playlist", toastCloseAction)}
                        text="Playlists"
                        className={pathname.includes("/playlist") ? "bg-accent" : ""}
                        icon={pathname.includes("/playlist") ? <QueueListIcon className="size-6"/> : <QueueListIconOutline className="size-6"/>}
                    >
                        {playlists?.map((playlist, index) => {
                            const path = `/playlist/${playlist.id}`
                            const isActive = pathname.includes(path)

                            return <SidebarButton
                                key={index}
                                onContextMenu={(event) => handlePlaylistContextMenu(event, playlist)}
                                href={path}
                                className={"pl-4 " + ((isActive)? "bg-accent" : "")}
                                text={playlist.name}
                                icon={isActive ? <MusicalNoteIcon className="size-6"/> : <MusicalNoteIconOutline className="size-6"/>}
                            />
                        })}

                    </SidebarDropdown>
                </ul>
            </div>
        </aside>
    </>
}
