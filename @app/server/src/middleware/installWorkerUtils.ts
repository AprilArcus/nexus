import { type Express } from "express";
import { makeWorkerUtils, type WorkerUtils } from "graphile-worker";

import { getRootPgPool } from "./installDatabasePools";

export function getWorkerUtils(app: Express): WorkerUtils {
  return app.get("workerUtils");
}

export default async (app: Express) => {
  const workerUtils = await makeWorkerUtils({
    pgPool: getRootPgPool(app),
  });

  app.set("workerUtils", workerUtils);
};
