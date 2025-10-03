import { handle } from "hono/vercel";
import createApp from "src/app/lib/create-app";
import configureOpenApi from "src/app/lib/configure-openapi";
import addresses from "src/app/routes/addresses/addresses.index";
import btQuote from "src/app/routes/quoting/bt/quote.index";
import coltQuote from "src/app/routes/quoting/colt/colt-quote.index";
import zohoLeads from "src/app/routes/zoho/leads/lead.index";

const app = createApp().basePath("/api");

configureOpenApi(app);

const routes = [addresses, btQuote, coltQuote, zohoLeads];

routes.forEach((route) => {
  app.route("/", route);
});

export const GET = handle(app);
export const POST = handle(app);
export const HEAD = handle(app);
export const OPTIONS = handle(app);

