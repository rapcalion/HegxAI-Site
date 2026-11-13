"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/shared";
import { useBooking } from "@/components/ui/BookingProvider";
import LogoMark from "@/components/ui/LogoMark";
import StarShape from "@/components/ui/StarShape";
import { siteContent } from "@/content/site";

const NAV_LINKS = [
  { label: "ABOUT", href: "/#about", id: "about" },
  { label: "SERVICES", href: "/services", id: "services" },
  { label: "PROCESS", href: "/#process", id: "process" },
  { label: "FAQ", href: "/#faq", id: "faq" },
];

export default function Nav() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { openBooking, preloadBooking, bookingUrl } = useBooking();
  const headerRef = useRef<HTMLElement>(null);

  // Line segment refs
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const mobileLine1Ref = useRef<HTMLDivElement>(null);
  const mobileLine2Ref = useRef<HTMLDivElement>(null);

  // Content fade refs
  const logoContentRef = useRef<HTMLDivElement>(null);
  const navContentRef = useRef<HTMLElement>(null);
  const buttonContentRef = useRef<HTMLDivElement>(null);

  // Mobile menu overlay state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<HTMLDivElement>(null);

  // Active section tracking
  const [activeId, setActiveId] = useState<string>("");
  const currentActiveId = pathname === "/services" ? "services" : activeId;

  // Ref tracking scroll navigation lock to prevent hiding while auto-scrolling
  const isNavScrollingRef = useRef(false);
  const isHiddenRef = useRef(false);

  // Helper functions for show/hide with strict overwrite & ease
  const showHeader = () => {
    if (!headerRef.current) return;
    isHiddenRef.current = false;
    headerRef.current.style.transform = "translateY(0%)";
  };

  const hideHeader = () => {
    if (!headerRef.current) return;
    isHiddenRef.current = true;
    headerRef.current.style.transform = "translateY(-100%)";
  };

  useEffect(() => {
    // 0. Active section tracking (homepage only)
    if (!isHomePage || typeof IntersectionObserver === "undefined") return;

    const heroEl = document.getElementById("hero");
    let heroObserver: IntersectionObserver | null = null;
    if (heroEl) {
      heroObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId("");
          }
        },
        { rootMargin: "0px 0px -40% 0px" }
      );
      heroObserver.observe(heroEl);
    }

    const sectionIds = ["about", "process", "faq"];
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -50% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    return () => {
      heroObserver?.disconnect();
      sectionObserver.disconnect();
    };
  }, [isHomePage]);

  useEffect(() => {
    if (isHomePage && typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      const target = document.querySelector(hash);
      if (target) {
        setTimeout(() => {
          const hStr = getComputedStyle(document.documentElement).getPropertyValue("--header-h").trim();
          const hNum = parseInt(hStr, 10);
          const offset = -(hNum || (window.innerWidth < 768 ? 72 : 92));
          const lenis = (window as unknown as { __lenis?: { scrollTo: (target: Element | string | number, opts: unknown) => void } }).__lenis;
          if (lenis) {
            lenis.scrollTo(target, { offset, duration: 1.0 });
          } else {
            const top = target.getBoundingClientRect().top + window.scrollY + offset;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }, 200);
      }
    }
  }, [isHomePage]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    if (prefersReduced || isMobile) {
      if (headerRef.current) {
        headerRef.current.style.transform = "translateY(0%)";
        headerRef.current.style.opacity = "1";
      }
      return;
    }

    let cancelled = false;

    // 1. Page-load animation: draw in lines from left, then fade up items
    import("gsap").then(({ gsap }) => {
      if (cancelled) return;

      const tl = gsap.timeline();
      const desktopLines = [line1Ref.current, line2Ref.current, line3Ref.current].filter(Boolean);
      const mobileLines = [mobileLine1Ref.current, mobileLine2Ref.current].filter(Boolean);
      const allLines = [...desktopLines, ...mobileLines];

      tl.fromTo(
        allLines,
        { scaleX: 0, transformOrigin: "left" },
        {
          scaleX: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.inOut",
        }
      );

      const fadeTargets = [
        logoContentRef.current,
        navContentRef.current,
        buttonContentRef.current,
      ].filter(Boolean);

      if (fadeTargets.length > 0) {
        tl.fromTo(
          fadeTargets,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
          "-=0.4"
        );
      }
    });

    // 2. Scroll direction detection on desktop
    let lastScroll = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (isNavScrollingRef.current) return;
        const currentScroll = window.scrollY;
        const delta = currentScroll - lastScroll;

        if (currentScroll < 80) {
          showHeader();
        } else if (delta > 4) {
          hideHeader();
        } else if (delta < -4) {
          showHeader();
        }
        lastScroll = currentScroll;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // 3. Force show listeners:
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Home" || e.key === "ArrowUp" || e.key === "PageUp") {
        showHeader();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const handleHashChange = () => {
      showHeader();
    };
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 60) {
        showHeader();
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Smooth scroll handler for nav clicks
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    showHeader();
    closeMobileMenu();

    if (href === "/services") {
      // Direct route navigation to /services; Next.js Link handles it
      return;
    }

    if (isHomePage) {
      const getHeaderOffset = () => {
        if (typeof window === "undefined") return -92;
        const hStr = getComputedStyle(document.documentElement).getPropertyValue("--header-h").trim();
        const hNum = parseInt(hStr, 10);
        return -(hNum || (window.innerWidth < 768 ? 72 : 92));
      };

      if (href === "/" || href === "#") {
        e.preventDefault();
        isNavScrollingRef.current = true;
        const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts: unknown) => void } }).__lenis;
        if (lenis) {
          lenis.scrollTo(0, {
            duration: 1.2,
            onComplete: () => {
              setTimeout(() => {
                isNavScrollingRef.current = false;
              }, 100);
            },
          });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setTimeout(() => {
            isNavScrollingRef.current = false;
          }, 800);
        }
        return;
      }

      const targetHash = href.startsWith("/#") ? href.slice(1) : href;
      const targetEl = document.querySelector(targetHash);
      if (targetEl) {
        e.preventDefault();
        isNavScrollingRef.current = true;
        const offset = getHeaderOffset();

        const lenis = (window as unknown as { __lenis?: { scrollTo: (target: Element | string | number, opts: unknown) => void } }).__lenis;
        if (lenis) {
          lenis.scrollTo(targetEl || targetHash, {
            offset,
            duration: 1.2,
            onComplete: () => {
              // Accordion layout can settle while scrolling; preserve the header clearance.
              if (targetEl) {
                const landing = targetEl.getBoundingClientRect().top;
                if (Math.abs(landing + offset) > 1) {
                  lenis.scrollTo(window.scrollY + landing + offset, { immediate: true });
                }
              }
              setTimeout(() => {
                isNavScrollingRef.current = false;
              }, 100);
            },
          });
        } else {
          const top = targetEl.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: "smooth" });
          setTimeout(() => {
            isNavScrollingRef.current = false;
          }, 800);
        }
        return;
      }
    }

    // On /services or other subpages:
    // Do NOT call e.preventDefault(); allow normal Next.js / browser navigation to /#about, /#process, /#faq, /
  };

  const menuTriggerBtnRef = useRef<HTMLButtonElement>(null);

  // Mobile Menu open/close with Lenis scroll lock
  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
    const lenis = (window as unknown as { __lenis?: { stop: () => void } }).__lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      // Focus first link or close button inside menu
      if (mobileMenuRef.current) {
        const firstFocusable = mobileMenuRef.current.querySelector<HTMLElement>('button, a');
        firstFocusable?.focus();
      }

      if (mobileLinksRef.current) {
        const links = mobileLinksRef.current.children;
        import("gsap").then(({ gsap }) => {
          gsap.fromTo(
            links,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.08,
              ease: "power3.out",
            }
          );
        });
      }
    }, 50);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    const lenis = (window as unknown as { __lenis?: { start: () => void } }).__lenis;
    lenis?.start();
    document.body.style.overflow = "";
    menuTriggerBtnRef.current?.focus({ preventScroll: true });
  };

  // Keyboard navigation & Focus Trap for Mobile Overlay
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMobileMenu();
        return;
      }

      if (e.key === "Tab" && mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Scoped CSS guaranteeing strict desktop/mobile separation and 2-row CSS grid */}
      <style>{`
        .hegxai-desktop-nav-grid {
          display: grid !important;
          grid-template-columns: auto 1fr auto !important;
          grid-template-rows: auto 1px !important;
          column-gap: 12px !important;
          row-gap: 14px !important;
          align-items: center !important;
          padding: 20px 40px 0 !important;
          width: 100% !important;
          height: var(--header-h, 92px) !important;
          box-sizing: border-box !important;
        }
        .hegxai-mobile-nav-grid {
          display: none !important;
        }

        @media (max-width: 767px) {
          .hegxai-desktop-nav-grid {
            display: none !important;
          }
          .hegxai-mobile-nav-grid {
            display: grid !important;
            grid-template-columns: auto auto !important;
            justify-content: space-between !important;
            grid-template-rows: auto 1px !important;
            column-gap: 12px !important;
            row-gap: 12px !important;
            align-items: center !important;
            padding: 14px 20px 0 !important;
            width: 100% !important;
            height: var(--header-h, 72px) !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>

      {/* Top 60px hover zone trigger for desktop */}
      <div
        aria-hidden="true"
        onMouseEnter={showHeader}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          zIndex: 999,
          pointerEvents: "auto",
        }}
      />

      <header
        ref={headerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "var(--header-h, 92px)",
          zIndex: 1000,
          background: "var(--bg, #F4EFE6)", // solid cream
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
        }}
      >
        {/* DESKTOP 2-ROW GRID: Row 1 = [Logo, Nav, Button], Row 2 = [Line 1, Line 2, Line 3] */}
        <div className="hegxai-desktop-nav-grid">
          {/* Row 1, Col 1: Logo */}
          <div ref={logoContentRef} style={{ display: "flex", alignItems: "center" }}>
            <Link
              href="/"
              prefetch={false}
              onClick={(e) => handleLinkClick(e, "/")}
              aria-label="HEGXAI - home"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
              }}
            >
              <LogoMark priority={true} aria-hidden={true} />
              {siteContent.logo?.showWordmark && (
                <span
                  style={{
                    fontFamily: "var(--ff-logo, 'Anton', sans-serif)",
                    fontSize: "40px",
                    lineHeight: 1,
                    letterSpacing: "0.02em",
                    color: "var(--ink)",
                    textTransform: "uppercase",
                    display: "inline-block",
                  }}
                >
                  HEGXAI
                </span>
              )}
              {!siteContent.logo?.showWordmark && (
                <span style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>
                  HEGXAI - home
                </span>
              )}
            </Link>
          </div>

          {/* Row 1, Col 2: Center Nav */}
          <nav
            ref={navContentRef}
            aria-label="Primary"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
              width: "100%",
            }}
          >
            {NAV_LINKS.map((link, idx) => {
              const isActive = currentActiveId === link.id;
              return (
                <div key={link.label} style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`header-nav-link ${isActive ? "is-active" : ""}`}
                    style={{
                      fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                      fontSize: "15px",
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--ink)",
                      paddingBottom: "2px",
                    }}
                  >
                    {link.label}
                  </Link>
                  {idx < NAV_LINKS.length - 1 && (
                    <StarShape
                      size={6}
                      variant="fill"
                      color="var(--ink)"
                      opacity={0.6}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Row 1, Col 3: Right Button */}
          <div ref={buttonContentRef} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              href={bookingUrl || "#contact"}
              variant="primary"
              size="sm"
              onClick={(e) => {
                if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                  e.preventDefault();
                  openBooking();
                }
              }}
              onPointerEnter={preloadBooking}
              onFocus={preloadBooking}
            >
              Book a free audit
            </Button>
          </div>

          {/* Row 2, Col 1: Line 1 (directly under logo) */}
          <div
            ref={line1Ref}
            style={{
              height: "1px",
              background: "var(--grid-line)",
              transformOrigin: "left",
              width: "100%",
            }}
          />

          {/* Row 2, Col 2: Line 2 (directly under center nav) */}
          <div
            ref={line2Ref}
            style={{
              height: "1px",
              background: "var(--grid-line)",
              transformOrigin: "left",
              width: "100%",
            }}
          />

          {/* Row 2, Col 3: Line 3 (directly under right button) */}
          <div
            ref={line3Ref}
            style={{
              height: "1px",
              background: "var(--grid-line)",
              transformOrigin: "left",
              width: "100%",
            }}
          />
        </div>

        {/* MOBILE 2-ROW GRID (< 768px): Row 1 = [Logo, Menu], Row 2 = [Line 1, Line 2] */}
        <div className="hegxai-mobile-nav-grid">
          {/* Row 1, Col 1: Logo */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link
              href="/"
              prefetch={false}
              onClick={(e) => handleLinkClick(e, "/")}
              aria-label="HEGXAI - home"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
              }}
            >
              <LogoMark priority={true} aria-hidden={true} />
              {siteContent.logo?.showWordmark && (
                <span
                  style={{
                    fontFamily: "var(--ff-logo, 'Anton', sans-serif)",
                    fontSize: "26px",
                    lineHeight: 1,
                    letterSpacing: "0.02em",
                    color: "var(--ink)",
                    textTransform: "uppercase",
                    display: "inline-block",
                  }}
                >
                  HEGXAI
                </span>
              )}
              {!siteContent.logo?.showWordmark && (
                <span style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>
                  HEGXAI - home
                </span>
              )}
            </Link>
          </div>

          {/* Row 1, Col 2: MENU button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              ref={menuTriggerBtnRef}
              onClick={openMobileMenu}
              aria-label="Open Navigation Menu"
              style={{
                border: "2px solid var(--ink)",
                background: "transparent",
                color: "var(--ink)",
                padding: "8px 20px",
                minHeight: "44px",
                minWidth: "44px",
                borderRadius: 0,
                fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              MENU
            </button>
          </div>

          {/* Row 2, Col 1: Mobile Line 1 (under logo) */}
          <div
            ref={mobileLine1Ref}
            style={{
              height: "1px",
              background: "var(--grid-line)",
              transformOrigin: "left",
              width: "100%",
            }}
          />

          {/* Row 2, Col 2: Mobile Line 2 (under menu button) */}
          <div
            ref={mobileLine2Ref}
            style={{
              height: "1px",
              background: "var(--grid-line)",
              transformOrigin: "left",
              width: "100%",
            }}
          />
        </div>
      </header>

      {/* MOBILE FULL-SCREEN CREAM OVERLAY */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1100,
            background: "var(--bg, #F4EFE6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingTop: "calc(16px + env(safe-area-inset-top, 0px))",
            paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
            paddingLeft: "calc(16px + env(safe-area-inset-left, 0px))",
            paddingRight: "calc(16px + env(safe-area-inset-right, 0px))",
            boxSizing: "border-box",
          }}
        >
          {/* Top Bar: Logo + Close button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--grid-line)",
              paddingBottom: "16px",
            }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
              <LogoMark aria-hidden={true} />
              {siteContent.logo?.showWordmark && (
                <span
                  style={{
                    fontFamily: "var(--ff-logo, 'Anton', sans-serif)",
                    fontSize: "26px",
                    color: "var(--ink)",
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    display: "inline-block",
                  }}
                >
                  HEGXAI
                </span>
              )}
            </div>
            <button
              onClick={closeMobileMenu}
              aria-label="Close Navigation Menu"
              style={{
                border: "2px solid var(--ink)",
                background: "transparent",
                color: "var(--ink)",
                padding: "8px 18px",
                minHeight: "44px",
                minWidth: "44px",
                borderRadius: 0,
                fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕ CLOSE
            </button>
          </div>

          {/* Stacked big links: 32px tall tap rows with 56px type */}
          <nav
            aria-label="Mobile Navigation"
            ref={mobileLinksRef}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              padding: "24px 0",
            }}
          >
            {NAV_LINKS.map((link) => (
              <div key={link.label} style={{ overflow: "hidden" }}>
                <Link
                  href={link.href}
                  prefetch={false}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    minHeight: "44px",
                    fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                    fontSize: "clamp(42px, 12vw, 56px)",
                    fontWeight: 500,
                    lineHeight: 1,
                    textTransform: "uppercase",
                    letterSpacing: "-0.03em",
                    color: "var(--ink)",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Bottom sharp ink CTA (min-height 52px, full width) */}
          <div>
            <Button
              href={bookingUrl || "#contact"}
              variant="primary"
              style={{ width: "100%", minHeight: "52px" }}
              onClick={(e) => {
                if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                  e.preventDefault();
                  closeMobileMenu();
                  openBooking();
                }
              }}
              onPointerEnter={preloadBooking}
              onFocus={preloadBooking}
            >
              Book a free audit
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
