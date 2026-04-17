import { type GraphileApp } from "@app/common";

type GraphileAppWindow = Window & {
  __GRAPHILE_APP__?: GraphileApp;
};

export function setGraphileApp(incoming: GraphileApp): void {
  const existing = (window as GraphileAppWindow).__GRAPHILE_APP__;
  if (existing) {
    if (
      existing.CSRF_TOKEN === incoming.CSRF_TOKEN &&
      existing.ROOT_URL === incoming.ROOT_URL &&
      existing.T_AND_C_URL === incoming.T_AND_C_URL
    ) {
      return;
    } else {
      throw new Error("window.__GRAPHILE_APP__ has already been set.");
    }
  }
  (window as GraphileAppWindow).__GRAPHILE_APP__ = incoming;
}

export function getGraphileApp(): GraphileApp {
  const graphileApp = (window as GraphileAppWindow).__GRAPHILE_APP__;
  if (!graphileApp)
    throw new Error("window.__GRAPHILE_APP__ has not been set.");
  return graphileApp;
}
