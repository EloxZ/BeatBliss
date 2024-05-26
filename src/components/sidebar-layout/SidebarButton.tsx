import Link from "next/link"

export default function SidebarButton({href, className, text, icon, onContextMenu}: {href: string, className?: string, text?: string, icon?: React.ReactNode, onContextMenu?: (event: any) => void}) {
    return <li onContextMenu={onContextMenu}>
        <Link href={href} className={"flex items-center p-2 transition-colors duration-200 rounded-md hover:bg-accent " + className}>
            {icon}
            <span className="ms-3">{text}</span>
        </Link>
    </li>
}
