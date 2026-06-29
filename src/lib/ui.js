/** Shared Tailwind class bundles — use instead of globals.css utility classes */

export const PAGE_CONTAINER =
  "page-container w-full max-w-page mx-auto pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:pl-[max(1.25rem,env(safe-area-inset-left))] sm:pr-[max(1.25rem,env(safe-area-inset-right))]";

export const PAGE_SECTION =
  "page-section relative z-20 py-8 sm:py-10 lg:py-12";

export const PAGE_SECTION_TIGHT_TOP = "page-section--tight-top pt-5 sm:pt-6";

export const PAGE_SECTION_BORDERED = "page-section--bordered border-t border-orange/10";

export const SECTION_EYEBROW =
  "section-eyebrow inline-block max-w-full text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-orange";

export const SECTION_TITLE =
  "section-title font-display text-balance break-words font-bold leading-tight tracking-tight text-ink text-[clamp(1.375rem,6vw,1.875rem)] sm:text-[clamp(1.625rem,3.5vw+0.5rem,2.75rem)] [hyphens:auto]";

export const SECTION_LEAD =
  "section-lead text-pretty font-normal leading-relaxed text-muted text-[clamp(0.9375rem,1.2vw+0.5rem,1.0625rem)]";

export const PAGE_HERO_TITLE =
  "page-hero-title font-sans text-balance break-words font-bold leading-[1.1] tracking-tight text-ink text-[clamp(1.75rem,7vw,2.25rem)] sm:text-[clamp(2rem,5vw+0.5rem,3.75rem)] [hyphens:auto]";

export const PAGE_HERO_TITLE_COMPACT =
  "page-hero-title--compact text-[clamp(1.65rem,4vw+0.4rem,2.75rem)]";

export const REVEAL =
  "reveal opacity-0 translate-y-8 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.in]:translate-y-0 [&.in]:opacity-100";

export const REVEAL_LEFT =
  "reveal reveal-left opacity-0 -translate-x-6 translate-y-8 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] sm:-translate-x-8 [&.in]:translate-x-0 [&.in]:translate-y-0 [&.in]:opacity-100";

export const REVEAL_RIGHT =
  "reveal reveal-right opacity-0 translate-x-6 translate-y-8 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] sm:translate-x-8 [&.in]:translate-x-0 [&.in]:translate-y-0 [&.in]:opacity-100";

export const REVEAL_ZOOM =
  "reveal reveal-zoom opacity-0 translate-y-4 scale-[0.92] transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] [&.in]:translate-x-0 [&.in]:translate-y-0 [&.in]:scale-100 [&.in]:opacity-100";

export const GLASS =
  "glass border border-ink/[0.08] bg-white/[0.88] shadow-card backdrop-blur-[20px] backdrop-saturate-[1.4] transition-[border-color,box-shadow,transform] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-orange/30 hover:shadow-[0_16px_48px_rgba(var(--orange-rgb),0.1),0_4px_16px_rgba(var(--orange-rgb),0.06),0_1px_0_rgba(255,255,255,0.75)_inset] dark:border-orange/15 dark:bg-[rgba(20,16,28,0.92)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35),0_1px_3px_rgba(0,0,0,0.2)] dark:hover:border-orange/30 dark:hover:shadow-[0_12px_40px_rgba(var(--orange-rgb),0.1),0_4px_16px_rgba(0,0,0,0.25)]";

export const BG_ATMOSPHERE =
  "relative flex min-h-dvh flex-col bg-bg dark:bg-bg";

export const GRID_OVERLAY =
  "pointer-events-none absolute inset-0 z-[1] bg-[length:48px_48px] bg-[linear-gradient(to_right,rgba(26,16,40,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,16,40,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(245,240,232,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,240,232,0.04)_1px,transparent_1px)]";

export const FILTER_PILLS =
  "filter-pills -mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:overflow-x-visible md:px-0 md:pb-0";

export const FILTER_PILL =
  "filter-pill border border-ink/[0.14] bg-ink/[0.05] text-ink transition-[border-color,background,color,box-shadow] duration-300 hover:border-orange/40 dark:border-[var(--border)] dark:bg-[var(--chip-bg)] dark:hover:border-orange/35 dark:hover:bg-orange/[0.08]";

export const FIELD_SURFACE =
  "field-surface w-full border border-orange/[0.12] bg-orange/[0.04] text-ink transition-[border-color,box-shadow,background] duration-300 placeholder:text-subtle placeholder:opacity-100 hover:border-orange/35 focus:border-orange focus:bg-transparent focus:outline-none focus:ring-[3px] focus:ring-orange/15 dark:border-[var(--border)] dark:bg-[var(--input-bg)] dark:focus:bg-white/[0.06] dark:focus:ring-orange/[0.18]";

export const SURFACE_BADGE =
  "surface-badge border border-orange/25 bg-white/[0.72] shadow-[0_2px_12px_rgba(var(--orange-rgb),0.06)] backdrop-blur-xl dark:border-[var(--border-strong)] dark:bg-[var(--chip-bg)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)]";

export const SECTION_MUTED = "section-muted bg-muted";

const BTN_SHINE =
  "relative overflow-hidden before:pointer-events-none before:absolute before:top-0 before:-left-[130%] before:h-full before:w-[55%] before:skew-x-[-20deg] before:transition-[left] before:duration-[650ms] before:ease-[cubic-bezier(0.16,1,0.3,1)] before:content-[''] before:bg-[linear-gradient(105deg,transparent,rgba(255,255,255,0.32),transparent)] hover:before:left-[160%]";

export const BTN_GOLD = `btn-gold btn-shine ${BTN_SHINE} rounded-full border-0 bg-[linear-gradient(135deg,var(--orange)_0%,#e8a05a_50%,var(--orange)_100%)] bg-[length:200%_auto] text-[0.8rem] font-medium uppercase tracking-[0.08em] text-white shadow-[0_4px_20px_rgba(var(--orange-rgb),0.32)] transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:bg-[position:right_center] hover:shadow-[0_10px_32px_rgba(var(--orange-rgb),0.42)] hover:brightness-[1.04] active:scale-[0.99] active:translate-y-[-1px] hover:-translate-y-[3px]`;

export const BTN_GOLD_OUTLINE = `btn-gold-outline btn-shine ${BTN_SHINE} rounded-full border-0 bg-orange text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_4px_20px_rgba(var(--orange-rgb),0.28)] transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:shadow-[0_10px_32px_rgba(var(--orange-rgb),0.38)] hover:brightness-[1.06] hover:-translate-y-[3px]`;

export const BTN_PRIMARY = `btn-primary btn-shine ${BTN_SHINE} rounded-full border-0 bg-[linear-gradient(135deg,var(--orange)_0%,#e8a05a_45%,var(--orange-dark)_100%)] bg-[length:200%_auto] text-[0.8rem] font-medium uppercase tracking-[0.08em] text-white shadow-[0_4px_20px_rgba(var(--orange-rgb),0.32)] transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:bg-[position:right_center] hover:shadow-[0_10px_32px_rgba(var(--orange-rgb),0.42)] active:scale-[0.99] active:translate-y-[-1px] hover:-translate-y-[3px]`;

export const BTN_GHOST =
  "btn-ghost rounded-full border-[1.5px] border-orange/35 bg-white/45 text-[0.8rem] font-medium uppercase tracking-[0.06em] text-ink backdrop-blur-sm transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:border-orange/65 hover:bg-orange/[0.08] hover:text-orange hover:shadow-[0_8px_24px_rgba(var(--orange-rgb),0.12)] dark:border-orange/35 dark:bg-transparent dark:text-[rgba(245,240,232,0.9)] dark:hover:border-orange/55 dark:hover:bg-orange/10 dark:hover:text-orange";

export const BTN_MOBILE =
  "btn-mobile max-sm:py-[0.8rem] max-sm:text-[0.6875rem] max-sm:tracking-[0.05em]";

export const HIGHLIGHT_SHIMMER =
  "highlight-shimmer bg-[linear-gradient(90deg,var(--orange)_0%,var(--golden)_45%,var(--orange)_90%)] bg-[length:200%_auto] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] animate-shimmer dark:bg-[linear-gradient(90deg,#e8a05a_0%,#f0d080_42%,#e8a05a_88%)]";

export const TEXT_GOLD_GRADIENT =
  "text-gold-gradient bg-[linear-gradient(135deg,var(--golden)_0%,#E0C45A_50%,var(--golden)_100%)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] dark:text-orange dark:[background:none] dark:[-webkit-text-fill-color:unset]";

export const TEXT_ACCENT_GRADIENT =
  "text-accent-gradient bg-[linear-gradient(135deg,var(--orange)_0%,var(--orange-light)_50%,var(--orange)_100%)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] dark:text-[var(--lavender)] dark:[background:none] dark:[-webkit-text-fill-color:unset]";

export const POLICY_PROSE = "policy-prose font-normal leading-[1.75] text-ink [&_p+p]:mt-4";

export const TILT =
  "transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] will-change-transform hover:shadow-[0_20px_50px_-12px_rgba(26,16,40,0.15),0_0_0_1px_rgba(212,175,55,0.35)]";

export const INTERACTIVE_CARD =
  "interactive-card transition-[opacity,transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [&.in:hover]:-translate-y-1 dark:[&.in:hover]:border-orange/30";

export const SECTION_ORNAMENT =
  "section-ornament flex items-center justify-center gap-4 py-2 before:flex-1 before:max-w-32 before:h-px before:content-[''] before:bg-[linear-gradient(90deg,transparent,rgba(var(--orange-rgb),0.5),transparent)] after:flex-1 after:max-w-32 after:h-px after:content-[''] after:bg-[linear-gradient(90deg,transparent,rgba(var(--orange-rgb),0.5),transparent)] dark:text-orange";

export const SECTION_HEADER_GLASS =
  "section-header-glass [&_.section-eyebrow]:inline-flex [&_.section-eyebrow]:items-center [&_.section-eyebrow]:gap-1.5 [&_.section-eyebrow]:rounded-full [&_.section-eyebrow]:border [&_.section-eyebrow]:border-orange/25 [&_.section-eyebrow]:bg-white/65 [&_.section-eyebrow]:px-4 [&_.section-eyebrow]:py-1.5 [&_.section-eyebrow]:backdrop-blur-[10px] dark:[&_.section-eyebrow]:border-orange/20 dark:[&_.section-eyebrow]:bg-white/[0.06]";

export const HAIRLINE =
  "hairline h-px w-full bg-[linear-gradient(90deg,transparent,rgba(var(--orange-rgb),0.45),rgba(212,175,55,0.35),rgba(var(--orange-rgb),0.35),transparent)]";

export const SPARKLE_PULSE = "sparkle-pulse inline-block animate-[sparkle-pulse_2.8s_ease-in-out_infinite]";

export const FLOAT_SOFT = "float-soft animate-[float-soft_6s_ease-in-out_infinite]";

export const ANIM_RISE = "anim-rise opacity-0 animate-[rise-in_0.9s_cubic-bezier(0.16,1,0.3,1)_forwards]";

export const MARQUEE_CONTAINER = "marquee-container flex w-full overflow-hidden whitespace-nowrap";

export const MARQUEE_CONTENT =
  "marquee-content inline-flex gap-12 pr-12 animate-[marquee-scroll_25s_linear_infinite] hover:[animation-play-state:paused] max-sm:gap-6 max-sm:text-sm max-sm:animate-[marquee-scroll_35s_linear_infinite]";

export const POPUP_PANEL = "popup-panel animate-slide-up";

export const HOME_BAND_WHITE = "home-band--white bg-white text-ink";

export const HOME_BAND_BRAND = "home-band--brand bg-[var(--home-brand)] text-white";
