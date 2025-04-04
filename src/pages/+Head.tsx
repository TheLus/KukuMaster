// Applies to all pages (cannot be overridden)
export function Head() {
  return (<>
    <style>{`
      html {
        touch-action: manipulation;
      }
    `}</style>
  </>);
}
