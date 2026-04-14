import type { GraphileApp } from "@app/lib" with {
  "resolution-mode": "import",
};
import { Express } from "express";
import { createServer } from "http";
import next from "next";

import { getUpgradeHandlers } from "../app";

if (!process.env.NODE_ENV) {
  throw new Error("No NODE_ENV envvar! Try `export NODE_ENV=development`");
}

const isDev = process.env.NODE_ENV === "development";

export default async function installSSR(app: Express) {
  const fakeHttpServer = createServer();
  const nextApp = next({
    dev: isDev,
    dir: `${__dirname}/../../../client/src`,
    quiet: !isDev,
    // Don't specify 'conf' key

    // Trick Next.js into adding its upgrade handler here, so we can extract
    // it. Calling `getUpgradeHandler()` is insufficient here: in Next
    // custom-server mode it follows the inherited server handleUpgrade path,
    // while dev HMR uses the upgrade handler returned by getRequestHandlers()
    // and wired onto httpServer.
    httpServer: fakeHttpServer,
  });
  const handlerPromise = (async () => {
    await nextApp.prepare();
    return nextApp.getRequestHandler();
  })();
  handlerPromise.catch((e) => {
    console.error("Error occurred starting Next.js; aborting process");
    console.error(e);
    process.exit(1);
  });
  app.get("*", async (req, res) => {
    const handler = await handlerPromise;
    const graphileApp: GraphileApp = {
      CSRF_TOKEN: req.csrfToken(),
      ROOT_URL: process.env.ROOT_URL || "http://localhost:5678",
      ...(process.env.T_AND_C_URL && { T_AND_C_URL: process.env.T_AND_C_URL }),
    };
    (req as any).graphileApp = graphileApp;
    handler(req, res);
  });

  // Next.js wires its custom-server websocket listener lazily the first time
  // its request handler runs. Register our dispatcher entry now, then read the
  // listener from the fake server when a matching upgrade arrives.
  let nextJsUpgradeHandler: ReturnType<typeof fakeHttpServer.listeners>[number];
  const upgradeHandlers = getUpgradeHandlers(app);
  upgradeHandlers.push({
    name: "Next.js",
    check(req) {
      if (req.url == null) return false;
      return req.url.includes("/_next/");
    },
    upgrade(req, socket, head) {
      nextJsUpgradeHandler ??= fakeHttpServer.listeners("upgrade")[0];
      if (typeof nextJsUpgradeHandler === "function") {
        nextJsUpgradeHandler(req, socket, head);
      } else {
        console.error(
          `Next.js websocket upgrade handler was not installed before an upgrade request for ${req.url ?? "<unknown URL>"}.`
        );
        socket.destroy();
      }
    },
  });
}
