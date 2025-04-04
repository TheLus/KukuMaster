import React from "react";
import ReactDOM from "react-dom/client";
import type { PageContextBuiltInClient } from "vike";

export { render as onRenderClient };

async function render(pageContext: PageContextBuiltInClient) {
  const { Page } = pageContext;
  const root = document.getElementById("root")!;
  // [vike][Wrong Usage] pageContext.pageProps isn't defined on the client-side, see https://vike.dev/passToClient#error
  // ↓だと↑のようなエラーが起きる
  //  const { Page, pageProps } = pageContext;
  const pageProps = "pageProps" in pageContext && pageContext.pageProps;

  ReactDOM.hydrateRoot(
    root,
    <React.StrictMode>
      <Page {...pageProps} />
    </React.StrictMode>,
  );
}
