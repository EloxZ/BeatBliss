const isPhoneMediaQuery = (window?: Window) => window?.matchMedia('(max-width: 640px)').matches

const VALID_AUDIO_FORMATS = ["mp3", "wav", "mp4", "ogg", "aac", "flac", "wma", "m4a"]
const isValidAudioFormat = (audio: File): boolean => {
    const audioName = audio.name;
    const dotIndex = audioName.lastIndexOf('.');
    if (dotIndex === -1) {
        return false;
    }
    const extension = audioName.slice(dotIndex + 1).toLowerCase();
    return VALID_AUDIO_FORMATS.includes(extension);
}

const secondsToMinSec = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

export {
    isPhoneMediaQuery,
    isValidAudioFormat,
    secondsToMinSec
}