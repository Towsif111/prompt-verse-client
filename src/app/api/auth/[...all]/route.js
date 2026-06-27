import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export async function POST(request, context) {
  const { POST } = toNextJsHandler(getAuth());
  return POST(request, context);
}

export async function GET(request, context) {
  const { GET } = toNextJsHandler(getAuth());
  return GET(request, context);
}
