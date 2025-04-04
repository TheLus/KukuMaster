import { useSpVh } from '@/hooks/useSpVh';

// Applies to all pages (cannot be overridden)
export function Head() {
  useSpVh();

  return (<>
    <style>{`
      html {
        touch-action: manipulation;
      }
      body {
        margin: 0;
      }
      #root {
        position: relative;
        height: calc(var(--vh, 1vh) * 100);
      }
    `}</style>
  </>);
}
