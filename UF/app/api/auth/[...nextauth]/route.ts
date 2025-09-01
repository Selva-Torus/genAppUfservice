import { handlers } from "@/auth";
import { NextRequest } from "next/server";

const prefixRequest = (req: NextRequest) => {
  
  const baseUrl = new URL(
    (req.headers.get("x-forwarded-proto") ?? "https") +
      "://" +
      (req.headers.get("x-forwarded-host") ?? req.nextUrl.host)
  );
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_PATH}${req.nextUrl.pathname}${req.nextUrl.search}`, baseUrl);
  return new NextRequest(url.toString(), req);
};

export const GET = (req: NextRequest) => handlers.GET(prefixRequest(req));
export const POST = (req: NextRequest) => handlers.POST(prefixRequest(req));
