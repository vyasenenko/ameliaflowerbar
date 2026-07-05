import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sendTelegramMessage } from "./lib/telegram";

const VISIT_COOKIE = "visit_notified";
const SITE_NAME = "D. Amélia Flower Bar";

function isPageNavigation(request: NextRequest): boolean {
  if (request.method !== "GET") {
    return false;
  }

  const fetchDest = request.headers.get("sec-fetch-dest");
  if (fetchDest && fetchDest !== "document") {
    return false;
  }

  const accept = request.headers.get("accept") ?? "";
  if (!accept.includes("text/html")) {
    return false;
  }

  return true;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function scheduleBackgroundTask(task: Promise<void>): void {
  const runtime = globalThis as typeof globalThis & {
    waitUntil?: (promise: Promise<unknown>) => void;
  };

  if (typeof runtime.waitUntil === "function") {
    runtime.waitUntil(task);
    return;
  }

  task.catch((error) => {
    console.error("Visit notification failed:", error);
  });
}

export function proxy(request: NextRequest) {
  if (!isPageNavigation(request)) {
    return NextResponse.next();
  }

  if (request.cookies.get(VISIT_COOKIE)?.value === "1") {
    return NextResponse.next();
  }

  const time = new Date().toLocaleString("pt-PT", {
    timeZone: "Europe/Lisbon",
  });
  const path = request.nextUrl.pathname || "/";
  const siteUrl = `${request.nextUrl.origin}${path}`;
  const referer = request.headers.get("referer") ?? "direct";
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  const message = [
    "🌸 Новый визит на сайт",
    "",
    `🌐 ${SITE_NAME}`,
    `🔗 ${siteUrl}`,
    `🕐 ${time}`,
    `↩️ ${referer}`,
    `📍 ${ip}`,
    `🖥 ${userAgent.slice(0, 160)}`,
  ].join("\n");

  scheduleBackgroundTask(sendTelegramMessage(message));

  const response = NextResponse.next();
  response.cookies.set(VISIT_COOKIE, "1", {
    maxAge: 60 * 30,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)",
  ],
};
