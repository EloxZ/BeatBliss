"use client"

import SidebarButton from "./SidebarButton"
import { RectangleStackIcon } from '@heroicons/react/24/solid'
import { RectangleStackIcon as RectangleStackIconOutline } from '@heroicons/react/24/outline'
import { QueueListIcon } from '@heroicons/react/24/solid'
import { QueueListIcon as QueueListIconOutline } from '@heroicons/react/24/outline'
import { MusicalNoteIcon } from '@heroicons/react/24/solid'
import { MusicalNoteIcon as MusicalNoteIconOutline } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import SidebarDropdown from "./SidebarDropdown"
import { useState } from "react"

export default function Sidebar({isOpen}: {isOpen: boolean}) {
    const pathname = usePathname()
    const [playlistDropwdownOpen, setPlaylistDropwdownOpen] = useState(false)

    return <aside id="logo-sidebar" className={"fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full border-r bg-card" + (isOpen ? " translate-x-0" : "")} aria-label="Sidebar">
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
                    text="Playlists"
                    className={pathname.includes("/playlist") ? "bg-accent" : ""}
                    icon={pathname.includes("/playlist") ? <QueueListIcon className="size-6"/> : <QueueListIconOutline className="size-6"/>}
                >
                    <SidebarButton
                        href="/playlist/pop"
                        className={"pl-4 " + (pathname.includes("/playlist/pop") ? "bg-accent" : "")}
                        text="Pop"
                        icon={pathname.includes("/playlist/pop") ? <MusicalNoteIcon className="size-6"/> : <MusicalNoteIconOutline className="size-6"/>}
                    />
                    <SidebarButton
                        href="/playlist/jazz"
                        className={"pl-4 " + (pathname.includes("/playlist/jazz") ? "bg-accent" : "")}
                        text="Jazz"
                        icon={pathname.includes("/playlist/jazz") ? <MusicalNoteIcon className="size-6"/> : <MusicalNoteIconOutline className="size-6"/>}
                    />
                </SidebarDropdown>
            </ul>
        </div>
    </aside>
}
