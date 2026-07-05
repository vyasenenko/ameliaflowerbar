"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { GALLERY, GalleryItem } from "./gallery-data";
import { BRANDS, CONTACT, COPY, Lang } from "./i18n";

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

type CatKey = GalleryItem["cat"] | "all";

const PAGE_SIZE = 24;
const DESKTOP_STORY_VIDEO = "/hero-scrub.mp4";
const MOBILE_PORTRAIT_STORY_VIDEO = "/hero-scrub-portrait.mp4";
const MOBILE_LANDSCAPE_STORY_VIDEO = "/hero-scrub.mp4";
const LANDSCAPE_POSTER = "/hero-poster.jpg";
const PORTRAIT_POSTER = "/hero-poster-portrait.jpg";

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function selectStoryVideoSrc() {
  const coarse = window.matchMedia(
    "(hover: none) and (pointer: coarse)"
  ).matches;
  if (!coarse) return DESKTOP_STORY_VIDEO;

  const portrait = window.matchMedia("(orientation: portrait)").matches;
  return portrait ? MOBILE_PORTRAIT_STORY_VIDEO : MOBILE_LANDSCAPE_STORY_VIDEO;
}

function clearLocationHash() {
  if (!window.location.hash) return;
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}`
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cat, setCat] = useState<CatKey>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const t = COPY[lang];

  const NAV_LINKS = [
    { href: "#inicio", label: t.nav.inicio },
    { href: "#sobre", label: t.nav.sobre },
    { href: "#servicos", label: t.nav.servicos },
    { href: "#galeria", label: t.nav.galeria },
    { href: "#contactos", label: t.nav.contactos },
  ];

  const CATEGORIES: { key: CatKey; label: string }[] = [
    { key: "all", label: t.gallery.filters.all },
    { key: "weddings", label: t.gallery.filters.weddings },
    { key: "commercial", label: t.gallery.filters.commercial },
  ];

  const filtered =
    cat === "all" ? GALLERY : GALLERY.filter((g) => g.cat === cat);
  const filteredCount = filtered.length;
  const shown = filtered.slice(0, visibleCount);

  const selectCat = (key: CatKey) => {
    setCat(key);
    setVisibleCount(PAGE_SIZE);
  };

  // Restore saved language, honour the browser locale on first visit.
  useEffect(() => {
    const saved = window.localStorage.getItem("lang") as Lang | null;
    if (saved === "en" || saved === "pt") {
      setLang(saved);
    } else if (navigator.language.toLowerCase().startsWith("pt")) {
      setLang("pt");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem("lang", lang);
  }, [lang]);

  const goTo = useCallback((e: React.MouseEvent, href: string) => {
    e.preventDefault();
    clearLocationHash();

    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    let top: number;
    if (id === "inicio") {
      top = 0;
    } else if (el.classList.contains("chapter")) {
      const rect = el.getBoundingClientRect();
      top =
        window.scrollY +
        rect.top +
        rect.height / 2 -
        window.innerHeight / 2;
    } else {
      top = window.scrollY + el.getBoundingClientRect().top - 72;
    }
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, []);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    clearLocationHash();

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  const stepLightbox = useCallback(
    (dir: number) => {
      setLightbox((cur) =>
        cur === null ? cur : (cur + dir + filteredCount) % filteredCount
      );
    },
    [filteredCount]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") stepLightbox(1);
      if (e.key === "ArrowLeft") stepLightbox(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, stepLightbox]);

  useEffect(() => {
    const video = videoRef.current;
    const story = storyRef.current;
    if (!video || !story) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarse = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;

    // iOS Safari refuses to paint frames (or honor currentTime seeks) on a
    // video that has never entered playback: play one tick, then pause.
    let primed = false;
    const prime = () => {
      if (primed) return;
      const p = video.play();
      if (p) {
        p.then(() => {
          primed = true;
          video.pause();
        }).catch(() => {
          /* blocked (e.g. Low Power Mode) — retried on first touch */
        });
      }
    };

    let currentVideoSrc = "";
    const syncVideoSource = () => {
      const nextVideoSrc = selectStoryVideoSrc();
      if (currentVideoSrc === nextVideoSrc) return;

      currentVideoSrc = nextVideoSrc;
      video.poster =
        nextVideoSrc === MOBILE_PORTRAIT_STORY_VIDEO
          ? PORTRAIT_POSTER
          : LANDSCAPE_POSTER;
      video.src = nextVideoSrc;
      video.load();
      // a freshly loaded source must be primed again before iOS paints it
      primed = false;
      video.addEventListener("loadeddata", prime, { once: true });
    };
    syncVideoSource();

    const fxEls = story.querySelectorAll<HTMLElement>(
      ".chapter, [data-card]"
    );

    if (reduced) {
      // Honor reduced motion: hold the still poster frame (closed buds) and
      // reveal every card at once — no looping bloom that would pop on repeat.
      fxEls.forEach((c) => c.style.setProperty("--r", "1"));
      return;
    }

    video.pause();
    let duration = 0;
    const onMeta = () => {
      duration = video.duration;
    };
    if (video.readyState >= 1) onMeta();
    else video.addEventListener("loadedmetadata", onMeta);

    const touchPrime = () => prime();
    if (video.readyState >= 2) prime();
    window.addEventListener("touchstart", touchPrime, {
      once: true,
      passive: true,
    });

    let target = 0;
    let raf = 0;

    const update = () => {
      syncVideoSource();

      const vh = window.innerHeight;
      const rect = story.getBoundingClientRect();
      const span = rect.height - vh;
      const progress = clamp01(-rect.top / span);
      if (duration > 0) target = progress * (duration - 0.08);

      if (progressRef.current) {
        const total =
          document.documentElement.scrollHeight - vh;
        progressRef.current.style.transform = `scaleX(${clamp01(
          window.scrollY / total
        )})`;
      }

      document.body.classList.toggle("scrolled", window.scrollY > 40);

      fxEls.forEach((c) => {
        const r = c.getBoundingClientRect();
        const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        const denom = Math.min(r.height, vh * 0.85);
        const raw = clamp01(visible / denom);
        const eased = raw * raw * (3 - 2 * raw);
        c.style.setProperty("--r", String(eased));
      });
    };

    const tick = () => {
      if (duration > 0) {
        const diff = target - video.currentTime;
        if (Math.abs(diff) > 1 / 48) {
          video.currentTime += diff * 0.16;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    /* ===== Section snapping (story region only) ===== */
    const chapterEls = Array.from(
      story.querySelectorAll<HTMLElement>(".chapter")
    );
    let snapRaf = 0;
    let animating = false;
    let cooldownUntil = 0;
    let settleTimer = 0;

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Snap targets: page top, each chapter centered, then the gallery top
    // (the "exit" of the story). Beyond the exit, scrolling is native.
    const snapTargets = () => {
      const vh = window.innerHeight;
      const list = chapterEls.map((c, i) => {
        if (i === 0) return 0;
        const r = c.getBoundingClientRect();
        return Math.round(
          window.scrollY + r.top + r.height / 2 - vh / 2
        );
      });
      const gal = document.getElementById("galeria");
      const exit = gal
        ? Math.round(window.scrollY + gal.getBoundingClientRect().top - 72)
        : list[list.length - 1];
      return { list, exit };
    };

    const animateTo = (to: number, dur = 800) => {
      const from = window.scrollY;
      if (Math.abs(to - from) < 2) return;
      cancelAnimationFrame(snapRaf);
      animating = true;
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        window.scrollTo({
          top: from + (to - from) * easeInOutCubic(p),
          behavior: "instant" as ScrollBehavior,
        });
        if (p < 1) {
          snapRaf = requestAnimationFrame(step);
        } else {
          animating = false;
          cooldownUntil = performance.now() + 350;
        }
      };
      snapRaf = requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      const { list, exit } = snapTargets();
      const vh = window.innerHeight;
      const pos = window.scrollY;
      const inStory = pos < exit - vh * 0.4;

      if (!inStory) {
        // Scrolling up from the very top of the gallery re-enters the story.
        if (e.deltaY < 0 && pos <= exit + 40 && !animating) {
          e.preventDefault();
          animateTo(list[list.length - 1]);
        }
        return;
      }

      e.preventDefault();
      if (animating || performance.now() < cooldownUntil) return;
      if (Math.abs(e.deltaY) < 10) return;

      const all = [...list, exit];
      let cur = 0;
      let best = Infinity;
      all.forEach((tg, i) => {
        const d = Math.abs(tg - pos);
        if (d < best) {
          best = d;
          cur = i;
        }
      });
      const dir = e.deltaY > 0 ? 1 : -1;
      const next = Math.min(all.length - 1, Math.max(0, cur + dir));
      if (next !== cur) animateTo(all[next]);
    };

    // Touch/keyboard: settle firmly onto the nearest chapter once
    // native scrolling stops (the wheel path never reaches here).
    const scheduleSettle = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        if (animating) return;
        const { list, exit } = snapTargets();
        const pos = window.scrollY;
        if (pos >= exit - window.innerHeight * 0.4) return;
        let bestT = list[0];
        let bd = Infinity;
        for (const tg of list) {
          const d = Math.abs(tg - pos);
          if (d < bd) {
            bd = d;
            bestT = tg;
          }
        }
        if (bd > 2) animateTo(bestT, 600);
      }, 140);
    };

    // On touch devices native CSS mandatory snap handles the locking,
    // so the JS settle only runs for mouse/scrollbar scrolling.
    const onScroll = () => {
      update();
      if (!coarse) scheduleSettle();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("wheel", onWheel, { passive: false });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", touchPrime);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("loadeddata", prime);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(snapRaf);
      window.clearTimeout(settleTimer);
    };
  }, []);

  const LangToggle = ({ className = "" }: { className?: string }) => (
    <div className={`lang-toggle ${className}`.trim()} role="group" aria-label="Language">
      <button
        className={lang === "en" ? "active" : ""}
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
      >
        EN
      </button>
      <span aria-hidden>/</span>
      <button
        className={lang === "pt" ? "active" : ""}
        aria-pressed={lang === "pt"}
        onClick={() => setLang("pt")}
      >
        PT
      </button>
    </div>
  );

  return (
    <>
      <video
        ref={videoRef}
        className="bg-video"
        muted
        playsInline
        preload="auto"
        poster="/hero-poster.jpg"
      />
      <div className="overlay" />
      <div ref={progressRef} className="scroll-progress" />

      <header className="site-header">
        <a
          href="#inicio"
          className="logo"
          onClick={(e) => goTo(e, "#inicio")}
        >
          <span className="logo-mark">D. Amélia</span>
          <span className="logo-sub">Flower Bar</span>
        </a>

        <nav className="main-nav">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => goTo(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-right">
          <LangToggle className="lang-desktop" />
          <a
            href="#contactos"
            className="btn-outline"
            onClick={(e) => goTo(e, "#contactos")}
          >
            {t.headerCta}
            <ArrowRight size={16} strokeWidth={1.5} />
          </a>
          <button
            className="menu-toggle"
            aria-label={t.openMenu}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={26} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <button
          className="close-btn"
          aria-label={t.closeMenu}
          onClick={() => setMenuOpen(false)}
        >
          <X size={28} strokeWidth={1.5} />
        </button>
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => {
              setMenuOpen(false);
              goTo(e, link.href);
            }}
          >
            {link.label}
          </a>
        ))}
        <LangToggle className="lang-mobile" />
      </div>

      {/* ===== Scroll-driven story ===== */}
      <div ref={storyRef} className="story" id="inicio">
        <section className="chapter chapter-hero">
          <div className="hero-text" data-card>
            <p className="hero-subtitle">{t.hero.eyebrow}</p>
            <h1 className="hero-heading">
              {t.hero.headingTop}
              <br />
              {t.hero.headingBottom}
            </h1>
            <p className="hero-paragraph">{t.hero.paragraph}</p>
            <a
              href="#galeria"
              className="btn-primary"
              onClick={(e) => goTo(e, "#galeria")}
            >
              {t.hero.cta}
              <ArrowRight size={18} strokeWidth={1.5} />
            </a>
          </div>

          <div className="hero-signature" aria-hidden="true">
            <span className="hero-signature-text">{t.hero.signature}</span>
            <span className="hero-signature-since">{t.hero.since}</span>
          </div>

          <div className="scroll-indicator">
            <span className="scroll-icon">
              <ArrowDown size={18} strokeWidth={1.5} />
            </span>
            <span className="scroll-text">{t.hero.scroll}</span>
          </div>
        </section>

        <section className="chapter" id="sobre">
          <div className="glass-card card-about" data-card>
            <div className="card-about-text">
              <p className="card-label">{t.about.label}</p>
              <h2 className="card-heading">{t.about.heading}</h2>
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <div className="about-clients">
                <span className="about-clients-label">{t.clients.label}</span>
                <div className="about-clients-list">
                  {BRANDS.map((b) => (
                    <span key={b}>{b}</span>
                  ))}
                </div>
              </div>
            </div>
            <Image
              src="/about/sisters.jpg"
              alt={t.about.imgAlt}
              width={1024}
              height={1536}
              className="card-about-img"
            />
          </div>
        </section>

        <section className="chapter chapter-tall" id="servicos">
          <div className="services-panel glass-card" data-card>
            <p className="services-eyebrow">{t.services.label}</p>
            <div className="services-list">
              {t.services.items.map((s, i) => (
                <div key={s.title} className="service-row">
                  <span className="service-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="service-body">
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="chapter chapter-quote">
          <div className="quote-block" data-card>
            <h2 className="quote-text">
              {t.quote.line1}
              <br />
              <em>{t.quote.em}</em>
            </h2>
            <p className="quote-sub">{t.quote.sub}</p>
          </div>
        </section>
      </div>

      {/* ===== Solid sections ===== */}
      <div className="page-sections">
        <section className="section" id="galeria">
          <p className="section-label">{t.gallery.label}</p>
          <h2 className="section-heading">{t.gallery.heading}</h2>
          <p className="gallery-intro">{t.gallery.intro}</p>

          <div className="filter-row">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                className={`filter-btn${cat === c.key ? " active" : ""}`}
                onClick={() => selectCat(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {shown.map((item, i) => (
              <button
                key={item.src}
                className="gallery-item"
                onClick={() => setLightbox(i)}
                aria-label={t.gallery.zoom}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt=""
                  width={item.w}
                  height={item.h}
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          {visibleCount < filteredCount && (
            <div className="load-more-row">
              <button
                className="btn-primary"
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
              >
                {t.gallery.loadMore(filteredCount - visibleCount)}
              </button>
            </div>
          )}
        </section>

        <section className="contact-section" id="contactos">
          <div className="section">
            <div className="contact-grid">
              <div>
                <p className="section-label">{t.contact.label}</p>
                <h2 className="section-heading">{t.contact.heading}</h2>
                <p>{t.contact.text}</p>
                <ul className="contact-list">
                  <li>
                    <MapPin size={20} strokeWidth={1.5} />
                    <div>
                      <span>
                        {t.contact.addressLines[0]}
                        <br />
                        {t.contact.addressLines[1]}
                      </span>
                      <a
                        className="map-link"
                        href={CONTACT.maps}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t.contact.viewMap}
                        <ArrowRight size={15} strokeWidth={1.5} />
                      </a>
                    </div>
                  </li>
                  <li>
                    <Phone size={20} strokeWidth={1.5} />
                    <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
                  </li>
                  <li>
                    <Mail size={20} strokeWidth={1.5} />
                    <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                  </li>
                </ul>
                <div className="social-row">
                  <a
                    href={CONTACT.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                </div>
              </div>
              <Image
                src="/about/hero.jpg"
                alt={t.contact.imgAlt}
                width={1600}
                height={1067}
              />
            </div>
          </div>
        </section>

        <footer className="site-footer">
          {t.footer(new Date().getFullYear())}
          <span className="footer-credit"> · by 2for1Design</span>
        </footer>
      </div>

      {lightbox !== null && filtered[lightbox] && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button
            className="lb-close"
            aria-label={t.lightbox.close}
            onClick={() => setLightbox(null)}
          >
            <X size={28} strokeWidth={1.5} />
          </button>
          <button
            className="lb-nav lb-prev"
            aria-label={t.lightbox.prev}
            onClick={(e) => {
              e.stopPropagation();
              stepLightbox(-1);
            }}
          >
            <ChevronLeft size={32} strokeWidth={1.5} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={filtered[lightbox].src}
            alt=""
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lb-nav lb-next"
            aria-label={t.lightbox.next}
            onClick={(e) => {
              e.stopPropagation();
              stepLightbox(1);
            }}
          >
            <ChevronRight size={32} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </>
  );
}
