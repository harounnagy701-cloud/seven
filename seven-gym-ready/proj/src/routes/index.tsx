import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import hero from "@/assets/hero.jpg";
import coach1 from "@/assets/coach1.jpg";
import coach2 from "@/assets/coach2.jpg";
import coach3 from "@/assets/coach3.jpg";
import { BarbellBuild, JoinForm, SiteFooter, WhatWeDo, WhySeven } from "@/components/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Seven Gym — Forge Your Legacy | سفن جيم" },
      { name: "description", content: "Seven Gym: elite coaches, classes and memberships. Train hard, forge your legacy." },
      { property: "og:title", content: "Seven Gym — Forge Your Legacy" },
      { property: "og:description", content: "Elite coaches, classes and memberships at Seven Gym." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Lang = "en" | "ar";
const T = {
  en: {
    nav: ["Trainers", "Classes", "Membership", "Location"],
    title: "SEVEN GYM", tagline: "Forge Your Legacy",
    sub: "Elite coaching, brutal energy, real results. Step into the forge.",
    start: "Get Started", tour: "Watch Tour", stats: ["Members", "Coaches", "Classes / week"],
    coachesKicker: "Our Team", coachesTitle: "Meet the Coaches",
    coaches: [
      { name: "Mark Thompson", role: "Strength & Conditioning" },
      { name: "Sara Haddad", role: "HIIT & Mobility" },
      { name: "Karim Mansour", role: "Boxing Coach" },
    ],
    classesTitle: "Classes", classes: ["Powerlifting", "CrossFit", "Boxing", "Yoga Flow", "Spinning", "Functional"],
    planTitle: "Membership", plans: [
      { n: "Basic", p: "499", f: ["Gym access", "Locker room", "1 class / week"] },
      { n: "Pro", p: "899", f: ["Unlimited classes", "Coach check-ins", "Nutrition plan"] },
      { n: "Elite", p: "1499", f: ["Personal coach", "Recovery zone", "Priority booking"] },
    ],
    month: "EGP / month", choose: "Choose Plan", popular: "Popular",
    locTitle: "Find Us", addr: "Cairo, Egypt — Open daily 6AM – 12AM", join: "Join Now",
    loading: "Loading the forge",
  },
  ar: {
    nav: ["المدربين", "الحصص", "الاشتراكات", "الموقع"],
    title: "سفن جيم", tagline: "اصنع أسطورتك",
    sub: "تدريب احترافي، طاقة لا تتوقف، ونتائج حقيقية. ادخل المعركة.",
    start: "ابدأ الآن", tour: "شاهد الجولة", stats: ["عضو", "مدرب", "حصة أسبوعياً"],
    coachesKicker: "فريقنا", coachesTitle: "تعرّف على المدربين",
    coaches: [
      { name: "مارك طومسون", role: "القوة واللياقة" },
      { name: "سارة حداد", role: "تمارين HIIT والمرونة" },
      { name: "كريم منصور", role: "مدرب ملاكمة" },
    ],
    classesTitle: "الحصص", classes: ["رفع الأثقال", "كروس فit", "ملاكمة", "يوجا", "دراجات", "تمارين وظيفية"],
    planTitle: "الاشتراكات", plans: [
      { n: "أساسي", p: "499", f: ["دخول الجيم", "غرفة تبديل", "حصة أسبوعياً"] },
      { n: "احترافي", p: "899", f: ["حصص بلا حدود", "متابعة مدرب", "نظام غذائي"] },
      { n: "النخبة", p: "1499", f: ["مدرب شخصي", "منطقة استشفاء", "أولوية الحجز"] },
    ],
    month: "جنيه / شهرياً", choose: "اختر الباقة", popular: "الأكثر طلباً",
    locTitle: "موقعنا", addr: "القاهرة، مصر — مفتوح يومياً ٦ص – ١٢م", join: "انضم الآن",
    loading: "جاري التحميل",
  },
};
T.ar.classes[1] = "كروس فيت";

function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round">
      <path d="M8 12h48L32 56z" />
      <path d="M20 20h24L32 44z" />
    </svg>
  );
}

function Loader({ label, onDone }: { label: string; onDone: () => void }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setP((v) => (v >= 100 ? 100 : v + Math.ceil(Math.random() * 6))), 45);
    return () => clearInterval(id);
  }, []);
  useEffect(() => { if (p < 100) return undefined; const t = setTimeout(onDone, 450); return () => clearTimeout(t); }, [p, onDone]);
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="absolute inset-0 grid-lines opacity-10 animate-gridmove" />
      <motion.div
        initial={{ scale: 0.4, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: "backOut" }}
        className="relative"
      >
        <svg viewBox="0 0 64 64" className="h-32 w-32 text-primary drop-shadow-[0_0_20px_var(--primary)]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
          <motion.path d="M8 12h48L32 56z" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4 }} />
          <motion.path d="M20 20h24L32 44z" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: 0.4 }} />
        </svg>
        <motion.div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.6 }} />
      </motion.div>
      <div className="relative mt-10 font-display text-7xl tabular-nums text-primary text-glow">{Math.min(p, 100)}%</div>
      <div className="relative mt-6 h-[3px] w-64 overflow-hidden rounded-full bg-muted">
        <motion.div className="h-full bg-gradient-primary shadow-glow" style={{ width: `${Math.min(p, 100)}%` }} />
      </div>
      <p className="relative mt-4 text-xs uppercase tracking-[0.4em] text-muted-foreground animate-flicker">{label}</p>
    </motion.div>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function Btn({ children, variant = "primary", href = "#" }: { children: ReactNode; variant?: "primary" | "outline"; href?: string }) {
  const base = "btn-shine group inline-flex items-center gap-3 rounded-md px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] rtl:tracking-normal transition-all duration-300 active:scale-95";
  const v = variant === "primary"
    ? "bg-gradient-primary text-primary-foreground shadow-glow hover:-translate-y-1 hover:brightness-110"
    : "border border-primary/60 bg-background/40 text-primary backdrop-blur hover:bg-primary hover:text-primary-foreground hover:shadow-glow hover:-translate-y-1";
  return (
    <motion.a href={href} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className={`${base} ${v}`}>
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">→</span>
    </motion.a>
  );
}

function Hero({ t, lang }: { t: typeof T.en; lang: Lang }) {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 }), sy = useSpring(my, { stiffness: 60, damping: 20 });
  const bgX = useTransform(sx, (v) => v * -30), bgY = useTransform(sy, (v) => v * -30);
  const fgX = useTransform(sx, (v) => v * 40), fgY = useTransform(sy, (v) => v * 40);
  const letters = lang === "ar" ? t.title.split(" ").flatMap((w, i) => (i ? [" ", w] : [w])) : t.title.split("");
  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden"
      onMouseMove={(e) => { mx.set(e.clientX / window.innerWidth - 0.5); my.set(e.clientY / window.innerHeight - 0.5); }}
    >
      <motion.img
        src={hero} alt="Neon dumbbells and Seven Gym logo" width={1920} height={1088}
        className="absolute inset-0 h-full w-full scale-110 object-cover rtl:-scale-x-110"
        style={{ x: bgX, y: bgY }}
        initial={{ scale: 1.35, opacity: 0 }} animate={{ scale: 1.1, opacity: 1 }} transition={{ duration: 2, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent rtl:bg-gradient-to-l" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      <div className="pointer-events-none absolute -bottom-10 end-0 h-72 w-2/3 grid-lines opacity-20 animate-gridmove [transform:perspective(500px)_rotateX(60deg)]" />
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span key={i} className="absolute h-1 w-1 rounded-full bg-primary shadow-glow"
          style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%` }}
          animate={{ y: [0, -40, 0], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.2 }} />
      ))}
      <motion.div style={{ x: fgX, y: fgY }} className="pointer-events-none absolute end-[12%] top-1/4 hidden lg:block">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="h-80 w-80 rounded-full border border-dashed border-primary/30" />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-28 sm:px-6">
        <motion.div initial={{ opacity: 0, x: lang === "ar" ? 40 : -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-primary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Est. 2026
        </motion.div>
        <h1 className="font-display text-[clamp(3.2rem,16vw,10rem)] italic leading-[0.9] text-primary text-glow">
          {letters.map((c, i) => (
            <motion.span key={`${lang}-${i}`} className="inline-block"
              initial={{ y: 120, opacity: 0, rotateX: -90 }} animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              {c === " " ? "\u00A0" : c}
            </motion.span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
          className="mt-4 text-3xl font-light text-foreground sm:text-5xl">{t.tagline}</motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">{t.sub}</motion.p>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4 [&>a]:justify-center">
          <Btn href="#join">{t.start}</Btn>
          <Btn variant="outline" href="#trainers">{t.tour}</Btn>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} className="mt-12 grid grid-cols-3 gap-4 sm:mt-16 sm:flex sm:gap-10">
          {[["2.5K+", t.stats[0]], ["25", t.stats[1]], ["80+", t.stats[2]]].map(([n, l]) => (
            <div key={l} className="min-w-0"><div className="font-display text-3xl text-foreground sm:text-4xl">{n}</div><div className="text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs">{l}</div></div>
          ))}
        </motion.div>
      </div>
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 h-10 w-6 -translate-x-1/2 rounded-full border-2 border-primary/50">
        <div className="mx-auto mt-2 h-2 w-1 rounded-full bg-primary" />
      </motion.div>
    </section>
  );
}

function Coaches({ t, lang }: { t: typeof T.en; lang: Lang }) {
  const imgs = [coach1, coach2, coach3];
  const [i, setI] = useState(0);
  const n = imgs.length;
  useEffect(() => { const id = setInterval(() => setI((v) => (v + 1) % n), 4500); return () => clearInterval(id); }, [n]);
  const go = (d: number) => setI((v) => (v + d + n) % n);
  return (
    <section id="trainers" className="relative overflow-hidden py-32">
      <Reveal className="relative z-10 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-primary">{t.coachesKicker}</p>
        <h2 className="mt-3 font-display text-5xl sm:text-6xl">{t.coachesTitle}</h2>
      </Reveal>
      <div className="relative mt-16 flex h-[560px] items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div key={`${lang}-${i}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.6 }}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center font-display text-[16vw] uppercase leading-[0.85] text-stroke select-none">
            {t.coaches[i]!.name.split(" ").map((w) => <span key={w} className="text-foreground/[0.06]">{w}</span>)}
          </motion.div>
        </AnimatePresence>
        {imgs.map((src, k) => {
          let off = k - i; if (off > n / 2) off -= n; if (off < -n / 2) off += n;
          const dir = lang === "ar" ? -1 : 1;
          const active = off === 0;
          return (
            <motion.button key={k} onClick={() => setI(k)} aria-label={t.coaches[k]!.name}
              className="absolute w-[280px] overflow-hidden rounded-2xl border border-foreground/10 bg-card sm:w-[340px]"
              animate={{ x: off * 360 * dir, scale: active ? 1 : 0.72, opacity: Math.abs(off) > 1 ? 0 : active ? 1 : 0.35, rotateY: off * -25 * dir, filter: active ? "blur(0px)" : "blur(4px)", zIndex: active ? 10 : 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
              style={{ transformPerspective: 1200 }}
              whileHover={active ? { y: -10 } : {}}>
              <img src={src} alt={t.coaches[k]!.name} width={768} height={1024} loading="lazy" className="aspect-[3/4] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
              <motion.div animate={{ opacity: active ? 1 : 0, y: active ? 0 : 20 }} transition={{ delay: active ? 0.25 : 0 }} className="absolute inset-x-0 bottom-0 p-6 text-center">
                <h3 className="text-2xl font-semibold">{t.coaches[k]!.name}</h3>
                <p className="mt-1 text-sm text-primary">{t.coaches[k]!.role}</p>
              </motion.div>
              {active && <div className="absolute inset-0 rounded-2xl ring-1 ring-primary/50 shadow-glow" />}
            </motion.button>
          );
        })}
        <button onClick={() => go(lang === "ar" ? 1 : -1)} aria-label="Previous" className="absolute start-[6%] z-20 h-12 w-12 rounded-full bg-foreground/15 backdrop-blur transition hover:scale-110 hover:bg-primary hover:shadow-glow sm:start-[18%]">‹</button>
        <button onClick={() => go(lang === "ar" ? -1 : 1)} aria-label="Next" className="absolute end-[6%] z-20 h-12 w-12 rounded-full bg-foreground/15 backdrop-blur transition hover:scale-110 hover:bg-primary hover:shadow-glow sm:end-[18%]">›</button>
      </div>
      <div className="mt-8 flex justify-center gap-2">
        {imgs.map((_, k) => <button key={k} onClick={() => setI(k)} aria-label={`Coach ${k + 1}`} className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? "w-10 bg-primary shadow-glow" : "w-4 bg-muted"}`} />)}
      </div>
    </section>
  );
}

function Index() {
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Lang>("en");
  const [plan, setPlan] = useState<"basic" | "pro" | "elite">("pro");
  const [scrolled, setScrolled] = useState(false);
  const t = T[lang];
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f);
  }, []);
  const ids = ["trainers", "classes", "membership", "location"];

  return (
    <div className={lang === "ar" ? "[&_.font-display]:font-[Cairo] [&_.font-display]:font-black" : ""}>
      <AnimatePresence>{loading && <Loader label={t.loading} onDone={() => setLoading(false)} />}</AnimatePresence>

      <motion.header initial={{ y: -100 }} animate={{ y: loading ? -100 : 0 }} transition={{ duration: 0.8, delay: 0.3 }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/80 py-3 backdrop-blur-xl border-b border-border" : "py-6"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <a href="#" className="flex items-center gap-3 text-primary"><Logo className="h-10 w-10 drop-shadow-[0_0_10px_var(--primary)]" /></a>
          <nav className="hidden gap-10 md:flex">
            {t.nav.map((l, k) => (
              <a key={l} href={`#${ids[k]}`} className="group relative text-sm font-medium uppercase tracking-widest text-foreground/80 transition hover:text-primary">
                {l}<span className="absolute -bottom-1 start-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="relative flex rounded-full border border-border bg-secondary/60 p-1 text-xs font-semibold">
              {(["en", "ar"] as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)} className={`relative z-10 rounded-full px-3 py-1.5 transition-colors ${lang === l ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {lang === l && <motion.span layoutId="lang" className="absolute inset-0 -z-10 rounded-full bg-gradient-primary shadow-glow" />}
                  {l === "en" ? "EN" : "ع"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      {!loading && (
        <main>
          <Hero t={t} lang={lang} />

          <div className="overflow-hidden border-y border-primary/20 bg-primary/5 py-5">
            <div className="flex w-max animate-marquee gap-12 font-display text-3xl uppercase italic text-primary/80" dir="ltr">
              {Array.from({ length: 2 }).flatMap((_, r) => ["Strength", "•", "Power", "•", "Discipline", "•", "Legacy", "•", "قوة", "•", "انضباط", "•"].map((w, k) => <span key={`${r}-${k}`}>{w}</span>))}
            </div>
          </div>

          <WhySeven lang={lang} />
          <BarbellBuild lang={lang} />
          <WhatWeDo lang={lang} />
          <Coaches t={t} lang={lang} />

          <section id="membership" className="relative py-24">
            <div className="absolute inset-0 grid-lines opacity-[0.04]" />
            <div className="relative mx-auto max-w-7xl px-6">
              <Reveal className="text-center"><h2 className="font-display text-5xl sm:text-6xl">{t.planTitle}</h2></Reveal>
              <div className="mt-14 grid gap-6 md:grid-cols-3">
                {t.plans.map((p, k) => {
                  const pop = k === 1;
                  const key = (["basic", "pro", "elite"] as const)[k]!;
                  return (
                    <Reveal key={p.n} delay={k * 0.12}>
                      <motion.div whileHover={{ y: -12, scale: 1.02 }} className={`relative h-full rounded-2xl border p-8 ${pop ? "border-primary bg-card shadow-glow" : "border-border bg-card/60"}`}>
                        {pop && <span className="absolute -top-3 start-8 rounded-full bg-gradient-primary px-3 py-1 text-xs font-bold uppercase text-primary-foreground">{t.popular}</span>}
                        <h3 className="text-xl font-semibold uppercase tracking-widest text-muted-foreground">{p.n}</h3>
                        <div className="mt-4 flex items-end gap-2"><span className="font-display text-6xl text-foreground">{p.p}</span><span className="pb-2 text-sm text-muted-foreground">{t.month}</span></div>
                        <ul className="mt-8 space-y-3">{p.f.map((f) => <li key={f} className="flex items-center gap-3"><span className="text-primary">✦</span>{f}</li>)}</ul>
                        <div className="mt-10" onClick={() => setPlan(key)}><Btn variant={pop ? "primary" : "outline"} href="#join">{t.choose}</Btn></div>
                      </motion.div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          <JoinForm lang={lang} plan={plan} />
          <SiteFooter lang={lang} logo={<Logo className="h-12 w-12 drop-shadow-[0_0_10px_var(--primary)]" />} />
        </main>
      )}
    </div>
  );
}
