import { NextRequest } from "next/server";
import { handleOptionsRequest } from "../../_shared/cors";

/**
 * Handle CORS preflight requests
 * Explicitly allow all the methods we use in this API
 */
export function handleOPTIONS(req: NextRequest) {
  console.log("OPTIONS /api/products: Handling preflight request");
  
  // Use the improved handleOptionsRequest that detects the specific headers needed
  return handleOptionsRequest(req, ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]);
}
