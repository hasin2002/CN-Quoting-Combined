import { createRouter } from "src/app/lib/create-app";

import * as routes from "./lead.route";
import * as handlers from "./lead.handler";

const router = createRouter().openapi(
  routes.createLead,
  handlers.createLeadHandler
);

export default router;
