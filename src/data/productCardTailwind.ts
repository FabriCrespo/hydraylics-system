/**
 * Clases Tailwind compartidas para tarjetas de producto (SSR + grid dinámico en productos.astro).
 * Mantener selectores JS: .producto-card, .producto-imagen, .producto-imagen-img, .cantidad-control, etc.
 */
export const pc = {
  card: "producto-card group/producto-card relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#e8e8e8] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)]",

  imagenWrap:
    "producto-imagen relative flex aspect-[4/3] w-full items-center justify-center border-b border-[#e8e8e8] bg-[#f0f0f2] px-4 py-4 max-sm:aspect-square max-sm:p-3.5",

  imgContainer: "producto-imagen-container relative h-full w-full",

  img: "producto-imagen-img absolute inset-0 h-full w-full scale-100 object-contain opacity-0 transition-[opacity,transform] duration-300 [&.active]:z-[1] [&.active]:opacity-100",

  navPrev:
    "producto-imagen-nav producto-imagen-prev absolute left-1.5 top-1/2 z-12 flex size-[30px] -translate-y-1/2 items-center justify-center rounded-full border-0 bg-white/95 text-tertiary opacity-0 shadow-md transition-[opacity,background,color,transform] duration-200 hover:-translate-y-1/2 hover:bg-secondary hover:text-white group-hover/producto-card:opacity-100 max-sm:opacity-[0.88]",

  navNext:
    "producto-imagen-nav producto-imagen-next absolute right-1.5 top-1/2 z-12 flex size-[30px] -translate-y-1/2 items-center justify-center rounded-full border-0 bg-white/95 text-tertiary opacity-0 shadow-md transition-[opacity,background,color,transform] duration-200 hover:-translate-y-1/2 hover:bg-secondary hover:text-white group-hover/producto-card:opacity-100 max-sm:opacity-[0.88]",

  indicators: "absolute bottom-1.5 left-1/2 z-12 flex -translate-x-1/2 gap-1.5",

  indicator:
    "producto-imagen-indicator h-1.5 w-1.5 shrink-0 rounded-full border-0 bg-white/55 p-0 transition-all duration-200 [&.active]:w-[18px] [&.active]:rounded-sm [&.active]:bg-secondary",

  info: "producto-info flex min-h-0 flex-1 flex-col gap-2 bg-white px-[1.15rem] pb-5 pt-[1.15rem] max-sm:px-4 max-sm:pb-4 max-sm:pt-4",

  marca: "producto-marca m-0 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-secondary",

  nombre:
    "producto-nombre m-0 line-clamp-2 text-[1.05rem] font-extrabold leading-tight text-[#1a1a1a] max-sm:text-base",

  descripcion:
    "producto-descripcion m-0 mt-0.5 line-clamp-2 shrink-0 text-[0.8125rem] leading-snug text-[#6b6b6b]",

  compat:
    "producto-compat m-0 mt-0.5 line-clamp-1 text-[11px] leading-tight text-gray-400",

  precioRow:
    "producto-precio-row mt-2.5 flex items-baseline justify-between gap-3 border-t border-[#f0f0f0] pt-2.5",

  precioBloque: "producto-precio-bloque flex min-w-0 flex-wrap items-baseline gap-1.5",

  precio:
    "producto-precio text-xl font-extrabold tracking-tight text-[#111] max-sm:text-lg",

  precioMeta:
    "producto-precio-meta text-[11px] font-medium uppercase tracking-wide text-gray-400",

  infoBtn:
    "producto-info-button shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[0.65rem] font-extrabold uppercase tracking-widest text-secondary underline decoration-2 underline-offset-[3px] transition-colors hover:text-secondary-dark",

  cantidadFila:
    "producto-cantidad-fila mt-3 flex items-center justify-between gap-3 max-sm:flex-wrap",

  cantidadLabel:
    "producto-cantidad-label text-[11px] font-bold uppercase tracking-wide text-gray-500",

  cantidadControl:
    "cantidad-control inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 py-0.5 pl-1.5 pr-1.5 max-sm:ml-auto",

  cantidadBtn:
    "cantidad-btn flex size-7 items-center justify-center rounded-full border-0 bg-white text-sm font-bold text-gray-700 shadow-sm transition-colors hover:bg-secondary hover:text-white",

  cantidadInput:
    "cantidad-input w-9 border-0 bg-transparent text-center text-[13px] font-bold text-gray-900 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",

  actions: "producto-actions mt-auto pt-3.5",

  btnCarrito:
    "btn-agregar-carrito flex w-full items-center justify-center rounded border-0 bg-secondary px-4 py-3.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_2px_8px_rgba(225,51,44,0.28)] transition-[background,transform,box-shadow] duration-200 hover:-translate-y-px hover:bg-secondary-dark hover:shadow-[0_4px_14px_rgba(193,46,39,0.35)]",
} as const;
