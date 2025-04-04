import { useCallback, useEffect, useRef } from 'react'

export const useSound = (src: string, volume: number = 1) => {
  const audioCtx = useRef<AudioContext | null>(null);
  const audioBuffer = useRef<AudioBuffer | null>(null);
  const audioBufferNode = useRef<AudioBufferSourceNode | null>(null);

  const prepareAudioBufferNode = useRef(() => {
    if (audioCtx.current == null) {
      return;
    }
    audioBufferNode.current = audioCtx.current.createBufferSource();
    audioBufferNode.current.buffer = audioBuffer.current;
    audioBufferNode.current.connect(audioCtx.current.destination);
  });

  useEffect(() => {
    const initialAudio = async() => {
      audioCtx.current = new AudioContext();
      const response = await fetch(`${window.location.href}${src}`)
      const responseBuffer = await response.arrayBuffer();

      audioBuffer.current = await audioCtx.current.decodeAudioData(responseBuffer);
      prepareAudioBufferNode.current();
    };

    initialAudio();
  }, [src, volume]);

  const play = useCallback(() => {
    audioBufferNode.current?.start(0);
    prepareAudioBufferNode.current();
  }, []);


  return { play };
}
