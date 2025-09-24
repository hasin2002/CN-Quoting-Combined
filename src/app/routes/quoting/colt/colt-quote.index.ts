import { createRouter } from "src/app/lib/create-app";

import * as routes from "./colt-quote.route";
import * as handlers from "./colt-quote.handler";

const router = createRouter().openapi(
  routes.coltQuote,
  handlers.coltQuotingHandler
);

export default router;
