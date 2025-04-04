// Applies to all pages (cannot be overridden)
export function Head() {
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
        height: 100dvh;
      }
    `}</style>
  </>);
}
