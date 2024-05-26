import { BackwardIcon } from "@heroicons/react/24/solid"

export default function PrevButton({onClick}: {onClick: () => void}) {
    return <div onClick={onClick}
        className="w-11 h-11 bg-white rounded-full flex items-center justify-center 
            text-black cursor-pointer hover:bg-accent hover:text-white transition">
        <BackwardIcon className="h-6 w-6"/>
    </div>
}