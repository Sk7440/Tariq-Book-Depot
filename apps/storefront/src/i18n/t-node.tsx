import { Fragment, type ReactNode } from "react";
import type { Lang } from "./config";
import type { DictKey } from "./dictionaries";
import { t } from "./t";

/** Like t(), but placeholders can be React nodes (e.g. a price in an LTR span). */
export function tNode(lang: Lang, key: DictKey, nodes: Record<string, ReactNode>): ReactNode {
  const marker = "\u0000";
  const text = t(lang, key, Object.fromEntries(Object.keys(nodes).map((k) => [k, `${marker}${k}${marker}`])));
  const parts = text.split(marker);
  return parts.map((part, i) => {
    const isPlaceholder = i % 2 === 1;
    return <Fragment key={i}>{isPlaceholder ? nodes[part] : part}</Fragment>;
  });
}
