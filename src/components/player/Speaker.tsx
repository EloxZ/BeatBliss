import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid"
import SpeakerSmallWaveIcon from "@/components/icons/SpeakerSmallWaveIcon"

export default function Speaker({volume}: {volume: number}) {

    if (volume === 0) {
        return <SpeakerXMarkIcon className="w-6 h-6"/>
    } else if (volume > 0.5) {
        return <SpeakerWaveIcon className="w-6 h-6"/>
    } else {
        return <SpeakerSmallWaveIcon className="w-6 h-6"/>
    }
}
