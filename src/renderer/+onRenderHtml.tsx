export default onRenderHtml;

import React from "react";
import { renderToString } from "react-dom/server";
import { dangerouslySkipEscape, escapeInject } from "vike/server";

async function onRenderHtml(pageContext) {
  const { Page } = pageContext;
  /*
   * Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:
   * - A server/client branch `if (typeof window !== 'undefined')`.
   * - Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
   * - Date formatting in a user's locale which doesn't match the server.
   * - External changing data without sending a snapshot of it along with the HTML.
   * - Invalid HTML tag nesting.
   *
   * It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.
   */
  // ↓のようにPage以外に追加で書いたりしていると↑のようなエラーが出る
  //  const viewHtml = dangerouslySkipEscape(
  //    renderToString(
  //      <>
  //        <div>hoge</div>
  //        <Page />
  //      </>,
  //    ),
  //  );

  const viewHtml = dangerouslySkipEscape(
    renderToString(
      <Page />,
    ),
  );
  const title = pageContext.config.title || "default title";
  const description = pageContext.config.description || "default description";

  return escapeInject`<!DOCTYPE html>
    <html>
        <title>${title}</title>
        <meta name="description" content="${description}">
        <body>
            <div id="root">${viewHtml}</div>
        </body>
    </html>`;
}
