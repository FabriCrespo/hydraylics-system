import { createElement } from "lucide";

/** Serializa un icono Lucide (nodo) a HTML para usar en `innerHTML` del cliente. */
export function lucideToHtml(
  icon: Parameters<typeof createElement>[0],
  attrs: Record<string, string | number> = {},
): string {
  const el = createElement(icon, {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    ...attrs,
  });
  return el.outerHTML;
}
