
"use client"

import { useRef, useEffect, Children } from "react"

export default function SidebarDropdown({
    children,
    className,
    text,
    icon,
    onContextMenu,
    onClickEmpty,
    isOpen,
    setIsOpen,
}: {
    children: React.ReactNode, 
    className?: string, 
    text?: string, 
    icon?: React.ReactNode,
    onContextMenu?: (event: any) => void,
    onClickEmpty?: () => void,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, 
}) {
    const listRef = useRef<HTMLUListElement>(null)
    const isEmpty = Children.count(children) === 0

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
              if (listRef.current) {
                listRef.current.style.overflow = 'scroll'
              }
            }, 200);
          } else {
            if (listRef.current) {
              listRef.current.style.overflow = ''
            }
          }
    }, [isOpen])

    return <li>
        <button
            onContextMenu={onContextMenu}
            onClick={() => {
              if (isEmpty && onClickEmpty) {
                onClickEmpty()
              } else {
                setIsOpen(!isOpen)
              }
            }} 
            type="button" 
            className={"flex items-center p-2 transition-colors duration-200 rounded-md hover:bg-accent w-full " + className}
        >
            {icon}
            <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{text}</span>
            <svg className={"w-3 h-3 transition-rotate duration-200 " + (isOpen ? "" : "rotate-90 ") + (isEmpty? "hidden" : "")} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"></path>
            </svg>
        </button>
        <ul
            ref={listRef}
            className={"dropdown-transition duration-200 space-y-2 " + (isOpen ? "max-h-[500px] py-2" : "max-h-0 overflow-hidden")}>
            {children}
        </ul>
    </li>
}
