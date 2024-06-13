import { Button } from "@/components/ui/button"
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid"

export default function PlayButton({
    playing=false,
    small=false,
    onClick
}: {
    playing: boolean
    small?: boolean
    onClick: () => void
}) {
    return <Button className={"rounded-full bg-primary text-black p-1 " + (small ? "w-10 h-10" : "w-[55px] h-[55px]")} variant="outline" onClick={(e) => {e.stopPropagation(); onClick()}}>
        {playing ? <PauseIcon className="h-6 w-6"/> : <PlayIcon className="h-6 w-6"/>}
    </Button>
}
