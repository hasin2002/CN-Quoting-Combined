import { createRouter } from "src/app/lib/create-app";

import * as routes from "./quote.route";
import * as handlers from "./quote.handler";

const router = createRouter().openapi(
  routes.btQuote,
  handlers.btQuotingHandler
);

export default router;
