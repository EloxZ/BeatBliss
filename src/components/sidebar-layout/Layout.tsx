"use client"

import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import { isPhoneMediaQuery } from "@/utils/utils"
import { RecoilRoot } from "recoil";
import Player from "@/components/songs/Player";

export default function Layout({children}: {children: React.ReactNode}) {
    const [isOpen, setIsOpen] = useState(true)

    const handleClose = () => {
        if (isPhoneMediaQuery(window)) {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        handleClose()
    }, [])

    return <RecoilRoot>
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen}/>
        <Sidebar isOpen={isOpen} />
        <Player/>

        <div className={"p-4 bg-black " + (isOpen ? "sm:ml-64" : "")} onClick={handleClose}>
            <div className="p-4 mt-16 mb-20">
                {children}
            </div>
        </div>
    </RecoilRoot>
}
