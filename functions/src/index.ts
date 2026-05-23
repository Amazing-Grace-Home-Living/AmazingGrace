import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";

setGlobalOptions({ maxInstances: 10 });

export const ping = onRequest((req, res) => {
  res.send("pong");
});

// export * from "./genkit-sample.js";
