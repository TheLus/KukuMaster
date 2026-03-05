// Applies to all pages (cannot be overridden)
export function Head() {
  return (<>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
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
