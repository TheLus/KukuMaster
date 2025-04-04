import { useCallback, useEffect, useState } from 'react'

export const useSound = (src: string, volume: number = 1) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioTag = new Audio(`${window.location.href}${src}`);
    audioTag.volume = volume;
    setAudio(audioTag)
  }, [src, volume]);

  const play = useCallback(() => {
    if (audio == null) {
      return;
    }
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }, [audio]);

  return { play };
}
