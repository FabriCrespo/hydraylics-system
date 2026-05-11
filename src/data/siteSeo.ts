/**
 * SEO y datos del negocio. Las URLs canónicas usan `site` de `astro.config.mjs`.
 * Ajusta `SITE_ORIGIN` si el dominio público difiere del configurado en build.
 */

export const business = {
  name: "Hydraulic Sistem",
  alternateName: "HYDRAULICS SISTEM",
  description:
    "Repuestos hidráulicos, reparación de cilindros, bombas y motores hidráulicos en Santa Cruz, Bolivia. Importadores y servicio técnico para maquinaria agrícola y equipo pesado.",
  email: "hydraulicssistem@gmail.com",
  phoneDisplay: "+591 70405030",
  phoneE164: "+59170405030",
  addressLocality: "Santa Cruz de la Sierra",
  addressRegion: "Santa Cruz",
  addressCountry: "BO",
  geo: { latitude: -17.396015, longitude: -63.213059 },
} as const;

/** Meta keywords base (Bolivia + hidráulica + maquinaria). */
export const keywordsBase =
  "repuestos hidráulicos Bolivia, repuestos hidráulicos Santa Cruz, importadores hidráulica Bolivia, bombas hidráulicas, motores hidráulicos, cilindros hidráulicos, válvulas hidráulicas, reparación hidráulica Santa Cruz, servicio técnico hidráulico, maquinaria agrícola Bolivia, equipo pesado, Parker, Rexroth, Eaton, cosechadoras, tractores, comandos hidráulicos, Hydraulic Sistem";

export const SEO_HOME = {
  title:
    "Repuestos hidráulicos en Bolivia | Hydraulic Sistem — Santa Cruz",
  description:
    "Repuestos hidráulicos e importación en Santa Cruz, Bolivia. Reparación de bombas, motores y cilindros hidráulicos; repuestos para cosechadoras, tractores y equipo pesado. Cotiza por WhatsApp.",
  keywords: `${keywordsBase}, inicio Hydraulic Sistem`,
} as const;

export const SEO_PRODUCTOS = {
  title:
    "Catálogo de repuestos hidráulicos | Bombas, motores y componentes — Bolivia",
  description:
    "Catálogo de componentes y repuestos hidráulicos en Bolivia: bombas, motores, válvulas y más para maquinaria agrícola y equipo pesado. Hydraulic Sistem, Santa Cruz.",
  keywords: `${keywordsBase}, catálogo repuestos hidráulicos, comprar repuestos hidráulicos Bolivia`,
} as const;

export const SEO_SERVICIOS = {
  title:
    "Servicio de reparación hidráulica en Santa Cruz | Cilindros y bombas — Bolivia",
  description:
    "Reparación y mantenimiento de sistemas hidráulicos en Bolivia: cilindros, bombas, motores y comandos. Taller en Santa Cruz, atención a maquinaria agrícola y equipo pesado.",
  keywords: `${keywordsBase}, taller hidráulico Santa Cruz, mantenimiento hidráulico Bolivia`,
} as const;

export const SEO_NOSOTROS = {
  title:
    "Nosotros | Hydraulic Sistem — Ingeniería hidráulica en Bolivia",
  description:
    "Conoce a Hydraulic Sistem: equipo técnico e instalaciones en Santa Cruz, Bolivia. Especialistas en repuestos y reparación hidráulica para el sector agrícola e industrial.",
  keywords: `${keywordsBase}, empresa hidráulica Bolivia, nosotros Hydraulic Sistem`,
} as const;

export const SEO_CONTACTO = {
  title:
    "Contacto | Repuestos hidráulicos Santa Cruz — Hydraulic Sistem Bolivia",
  description:
    "Contáctanos en Santa Cruz, Bolivia: WhatsApp, correo y ubicación. Repuestos hidráulicos, cotizaciones y servicio técnico. Hydraulic Sistem.",
  keywords: `${keywordsBase}, contacto repuestos hidráulicos Santa Cruz, WhatsApp Hydraulic Sistem`,
} as const;

export const SEO_ADMIN = {
  title: "Administración | Hydraulic Sistem",
  description: "Acceso interno al panel de administración.",
} as const;
