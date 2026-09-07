/**
 * Single wiring point for everything that leaves the browser.
 *
 * `destinations`, `trips`, `expenses`, `checklist`, `memories` and `adventures` all
 * talk to the FastAPI backend through `lib/api.ts`; point them somewhere else with
 * NEXT_PUBLIC_API_BASE_URL. `travel` (flights, hotels, geocoding) is still a mock
 * because the backend has no endpoints for it.
 *
 *   import { trips, destinations } from "@/services";
 */
import type { TravelDataService } from "./types";
import { travelMock } from "./travel.mock";

export { destinations } from "./destinations";
export { trips, addActivityInstruction, replaceActivityInstruction } from "./trips";
export { expenses } from "./expenses";
export { checklist } from "./checklist";
export { memories } from "./memories";
export { adventures } from "./adventures";

export const travel: TravelDataService = travelMock;

export { ApiError, API_BASE_URL } from "@/lib/api";
export * from "./types";
