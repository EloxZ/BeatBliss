"use client"

import SidebarButton from "@/components/sidebar-layout/SidebarButton"
import { RectangleStackIcon } from '@heroicons/react/24/solid'
import { RectangleStackIcon as RectangleStackIconOutline } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import '@/app/context-menu.css'
import PlaylistsDropdown from "@/components/playlist/PlaylistsDropdown"

export default function Sidebar({isOpen}: {isOpen: boolean}) {
    const pathname = usePathname()

    return <>
        <aside 
            id="logo-sidebar" 
            className={
                "fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform border-r bg-card " + 
                (isOpen ? "translate-x-0" : "-translate-x-full")
            } 
            aria-label="Sidebar"
        >
            <div className="h-full px-3 pb-4 overflow-y-auto bg-card">
                <ul className="space-y-2 font-medium">
                    <SidebarButton
                        href="/library"
                        className={pathname.includes("/library") ? "bg-accent" : ""}
                        text="Library"
                        icon={
                            pathname.includes("/library") ? 
                            <RectangleStackIcon className="size-6"/> : 
                            <RectangleStackIconOutline className="size-6"/>
                        }
                    />
                    <PlaylistsDropdown/>
                </ul>
            </div>
        </aside>
    </>
}
