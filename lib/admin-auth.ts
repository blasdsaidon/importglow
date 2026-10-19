import { headers } from "next/headers";
import { getChatGPTUser, type ChatGPTUser } from "@/app/chatgpt-auth";

export async function getAdminUser(): Promise<ChatGPTUser | null> {
  const user = await getChatGPTUser();
  if (user) return user;

  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "";
  if (process.env.NODE_ENV === "development" && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) {
    return { displayName: "Administrador local", email: "local@importglow.test", fullName: "Administrador local" };
  }
  return null;
}

export async function isAdminRequest(): Promise<boolean> {
  return Boolean(await getAdminUser());
}
