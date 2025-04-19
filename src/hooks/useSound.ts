import { useCallback, useEffect, useRef } from 'react'

export const useSound = (src: string, volume: number = 1) => {
  const audioCtx = useRef<AudioContext | null>(null);
  const audioBuffer = useRef<AudioBuffer | null>(null);
  const audioBufferNode = useRef<AudioBufferSourceNode | null>(null);
  const lastAudioBufferNode = useRef<AudioBufferSourceNode | null>(null);

  const prepareAudioBufferNode = useRef(() => {
    if (audioCtx.current == null) {
      return;
    }
    audioBufferNode.current = audioCtx.current.createBufferSource();
    audioBufferNode.current.buffer = audioBuffer.current;
    const gainNode = audioCtx.current.createGain();
    gainNode.gain.value = volume;
    audioBufferNode.current.connect(gainNode);
    gainNode.connect(audioCtx.current.destination);
  });

  useEffect(() => {
    const initialAudio = async() => {
      audioCtx.current = new AudioContext();
      const response = await fetch(`${import.meta.env.BASE_URL}${src}`)
      const responseBuffer = await response.arrayBuffer();

      audioBuffer.current = await audioCtx.current.decodeAudioData(responseBuffer);
      prepareAudioBufferNode.current();
    };

    initialAudio();
  }, [src, volume]);

  const play = useCallback(() => {
    audioBufferNode.current?.start(0);
    lastAudioBufferNode.current = audioBufferNode.current;
    prepareAudioBufferNode.current();
  }, []);

  const stop = useCallback(() => {
    lastAudioBufferNode.current?.stop(0);
  }, []);


  return { play, stop };
}
