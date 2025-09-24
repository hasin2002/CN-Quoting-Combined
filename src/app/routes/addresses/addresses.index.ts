import { createRouter } from "src/app/lib/create-app";
import * as handlers from "./addresses.handlers";
import * as routes from "./addresses.routes";

const router = createRouter().openapi(routes.addresses, handlers.addresses);

export default router;
