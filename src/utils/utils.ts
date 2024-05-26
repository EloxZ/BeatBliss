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

const range = (x: number, y: number): number[] => {
    let numbers = []
    if (x < y) {
        for (let i = x; i < y; i++) {
            numbers.push(i)
        }
    } else {
        for (let i = x; i > y; i--) {
            numbers.push(i)
        }
    }
    return numbers;
}

const toastCloseAction = {
    action: {
      label: 'Close',
      onClick: () => {}
    }
}

export {
    isPhoneMediaQuery,
    isValidAudioFormat,
    secondsToMinSec,
    toastCloseAction,
    range
}