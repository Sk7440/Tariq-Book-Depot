"use client";

import { usePathname } from "next/navigation";
import { NotFoundView } from "@/components/chrome/not-found-view";
import { isLang } from "@/i18n/config";

/** 404 inside /en or /ur. not-found.tsx gets no params, so the language comes from the path. */
export default function LangNotFound() {
  const segment = usePathname().split("/")[1] ?? "";
  return <NotFoundView lang={isLang(segment) ? segment : "en"} />;
}
