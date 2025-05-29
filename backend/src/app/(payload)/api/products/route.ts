import { NextRequest } from "next/server";
import { handleDELETE } from "./handlers/delete";
import { handleGET } from "./handlers/get";
import { handlePOST } from "./handlers/post";
import { handleOPTIONS } from "./handlers/options";

export async function GET(req: NextRequest) {
  return handleGET(req);
}

export async function POST(req: NextRequest) {
  return handlePOST(req);
}

export async function DELETE(req: NextRequest) {
  return handleDELETE(req);
}

export async function OPTIONS(req: NextRequest) {
  return handleOPTIONS(req);
}
