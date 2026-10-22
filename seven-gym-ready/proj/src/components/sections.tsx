import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import barbell from "@/assets/barbell.png";
import plate from "@/assets/plate.png";

type Lang = "en" | "ar";

const C = {
  en: {
    whyKicker: "Why Seven", whyTitle: "Built different. Built for you.",
    why: [
      { n: "01", t: "Elite equipment", d: "Competition-grade racks, plates and machines — maintained daily." },
      { n: "02", t: "Certified coaches", d: "Every coach is certified and trains you with a real plan." },
      { n: "03", t: "Open 18 hours", d: "Train before work, after work, or at midnight." },
      { n: "04", t: "Real community", d: "Thousands of members pushing each other every day." },
    ],
    buildA: "NOW COME BUILD", buildB: "YOURS.", joinSeven: "Join Seven", scroll: "Scroll",
    doKicker: "What we do", doTitle: "Five ways to get stronger",
    doItems: [
      { t: "Strength Training", d: "Barbells, powerlifting and progressive overload." },
      { t: "Personal Coaching", d: "One-on-one sessions built around your goals." },
      { t: "Group Classes", d: "HIIT, CrossFit, spinning and more — high energy." },
      { t: "Boxing & Combat", d: "Technique, conditioning and confidence." },
      { t: "Nutrition Plans", d: "Eat right for the body you're building." },
    ],
    formKicker: "Join the forge", formTitle: "Start your membership",
    name: "Full name", phone: "Phone number", email: "Email (optional)", plan: "Membership type", goal: "Your goal (optional)",
    plans: { basic: "Basic — 499 EGP", pro: "Pro — 899 EGP", elite: "Elite — 1499 EGP" },
    send: "Send request", sending: "Sending...", ok: "Request received! We'll contact you soon.", err: "Something went wrong. Please try again.",
    errs: { name: "Please enter your name", phone: "Please enter a valid phone number", email: "Invalid email" },
    footTitle: "Visit us", addr: "Cairo, Egypt", hours: "Open daily · 6AM – 12AM", contact: "Contact", rights: "All rights reserved.",
  },
  ar: {
    whyKicker: "لماذا سفن", whyTitle: "مختلفين. ومصممين لك.",
    why: [
      { n: "01", t: "أجهزة احترافية", d: "أجهزة وأوزان بمواصفات البطولات وصيانة يومية." },
      { n: "02", t: "مدربين معتمدين", d: "كل مدرب معتمد ويتابعك بخطة حقيقية." },
      { n: "03", t: "مفتوح ١٨ ساعة", d: "تمرن قبل الشغل أو بعده أو حتى بالليل." },
      { n: "04", t: "مجتمع حقيقي", d: "آلاف الأعضاء بيشجعوا بعض كل يوم." },
    ],
    buildA: "يلا ابني", buildB: "جسمك.", joinSeven: "انضم لسفن", scroll: "مرر",
    doKicker: "ماذا نقدم", doTitle: "خمس طرق لتصبح أقوى",
    doItems: [
      { t: "تمارين القوة", d: "بار حديد ورفع أثقال وزيادة تدريجية." },
      { t: "تدريب شخصي", d: "جلسات فردية مبنية على هدفك." },
      { t: "حصص جماعية", d: "HIIT وكروس فيت ودراجات بطاقة عالية." },
      { t: "ملاكمة وقتال", d: "تكنيك ولياقة وثقة بالنفس." },
      { t: "أنظمة غذائية", d: "كُل صح للجسم اللي بتبنيه." },
    ],
    formKicker: "انضم إلينا", formTitle: "ابدأ اشتراكك",
    name: "الاسم بالكامل", phone: "رقم الهاتف", email: "البريد الإلكتروني (اختياري)", plan: "نوع الاشتراك", goal: "هدفك (اختياري)",
    plans: { basic: "أساسي — 499 جنيه", pro: "احترافي — 899 جنيه", elite: "النخبة — 1499 جنيه" },
    send: "أرسل الطلب", sending: "جاري الإرسال...", ok: "تم استلام طلبك! هنتواصل معاك قريباً.", err: "حصل خطأ، حاول تاني.",
    errs: { name: "من فضلك اكتب اسمك", phone: "من فضلك اكتب رقم صحيح", email: "بريد غير صحيح" },
    footTitle: "زورنا", addr: "القاهرة، مصر", hours: "مفتوح يومياً · ٦ص – ١٢م", contact: "تواصل", rights: "جميع الحقوق محفوظة.",
  },
};

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const btn = "btn-shine inline-flex items-center justify-center gap-3 rounded-md bg-gradient-primary px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] rtl:tracking-normal text-primary-foreground shadow-glow transition-all duration-300 hover:-translate-y-1 hover:brightness-110 active:scale-95 disabled:opacity-60";

/** Card that unfolds open when scrolled into view and folds closed when it leaves. */
function FoldCard({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 1000, transformOrigin: "top center" }}
      initial={{ opacity: 0, rotateX: -80, scaleY: 0.4, y: 40 }}
      whileInView={{ opacity: 1, rotateX: 0, scaleY: 1, y: 0 }}
      viewport={{ once: false, amount: 0.35 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const pcCard = "group relative isolate flex h-full min-h-[240px] flex-col justify-end overflow-hidden rounded-[18px] border border-border bg-card px-6 py-7 transition-all duration-500 hover:-translate-y-2.5 hover:border-primary hover:shadow-glow sm:min-h-[300px]";
const pcGlow = "absolute inset-0 -z-10 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--primary)_90%,transparent),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-55";
const pcNum = "absolute start-5 top-3 font-display text-7xl italic text-transparent [-webkit-text-stroke:1.5px_var(--border)] transition-all duration-500 group-hover:[-webkit-text-stroke-color:var(--foreground)] sm:text-8xl";

export function WhySeven({ lang }: { lang: Lang }) {
  const c = C[lang];
  return (
    <section id="why" className="mx-auto max-w-7xl px-5 py-24 sm:px-6">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.4em] text-primary rtl:tracking-normal">{c.whyKicker}</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl sm:text-6xl">{c.whyTitle}</h2>
      </Reveal>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {c.why.map((w, k) => (
          <FoldCard key={w.n} delay={k * 0.1}>
            <div className={pcCard}>
              <div className={pcGlow} />
              <span className={pcNum}>{w.n}</span>
              <h3 className="font-display text-2xl uppercase italic sm:text-3xl">{w.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground transition-colors group-hover:text-foreground">{w.d}</p>
            </div>
          </FoldCard>
        ))}
      </div>
    </section>
  );
}

const CAPS = {
  en: [["It starts with ", "the bar."], ["Plate by ", "plate."], ["Now come build ", "yours."]],
  ar: [["كل شيء يبدأ ", "بالبار."], ["قرص بعد ", "قرص."], ["والآن ابنِ ", "قوتك."]],
};

export function BarbellBuild({ lang }: { lang: Lang }) {
  const c = C[lang];
  const ref = useRef<HTMLElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const [cap, setCap] = useState(0);
  const [noGl, setNoGl] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let alive = true;
    const prog = () => {
      const el = ref.current; if (!el) return 0;
      const b = el.getBoundingClientRect();
      return Math.min(1, Math.max(0, -b.top / (b.height - window.innerHeight)));
    };
    import("@/lib/barbell3d").then(({ mountBarbell }) => {
      if (!alive || !cvRef.current) return;
      cleanup = mountBarbell(cvRef.current, prog);
      if (!cleanup) setNoGl(true);
    });
    const onScroll = () => { const p = prog(); setCap(p < 0.28 ? 0 : p < 0.72 ? 1 : 2); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { alive = false; cleanup?.(); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <section ref={ref} id="build" className="relative h-[320vh] bg-[radial-gradient(ellipse_60%_60%_at_50%_55%,color-mix(in_oklab,var(--primary)_14%,var(--background)),var(--background)_70%)]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={cvRef} aria-hidden className="absolute inset-0 h-full w-full" />
        {noGl && <img src={barbell} alt="Glowing barbell" width={1536} height={768} className="absolute inset-x-0 top-1/3 mx-auto w-[90vw] max-w-[900px]" />}
        <p className="absolute start-5 top-24 z-10 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground rtl:tracking-normal sm:start-10">{c.scroll} ↓</p>
        <div className="pointer-events-none absolute inset-x-5 bottom-[12vh] z-10 sm:inset-x-10">
          {CAPS[lang].map(([a, b], k) => (
            <motion.div key={`${lang}-${k}`} className="absolute bottom-0 max-w-[640px]"
              animate={{ opacity: cap === k ? 1 : 0, y: cap === k ? 0 : 24 }} transition={{ duration: 0.6 }}
              style={{ pointerEvents: cap === k ? "auto" : "none" }}>
              <h3 className="font-display text-[clamp(2.4rem,9vw,5rem)] uppercase italic leading-[0.92] rtl:not-italic rtl:leading-tight">
                {a}<span className="text-primary text-glow">{b}</span>
              </h3>
              {k === 2 && <a href="#join" className={`${btn} mt-5`}>{c.joinSeven}</a>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhatWeDo({ lang }: { lang: Lang }) {
  const c = C[lang];
  return (
    <section id="classes" className="mx-auto max-w-7xl px-5 py-24 sm:px-6">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.4em] text-primary rtl:tracking-normal">{c.doKicker}</p>
        <h2 className="mt-3 font-display text-4xl sm:text-6xl">{c.doTitle}</h2>
      </Reveal>
      <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4">
        {c.doItems.map((it, k) => (
          <FoldCard key={it.t} delay={k * 0.08}>
            <div className={pcCard}>
              <div className={pcGlow} />
              <span className={pcNum}>0{k + 1}</span>
              <h3 className="font-display text-2xl uppercase italic sm:text-3xl">{it.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground transition-colors group-hover:text-foreground">{it.d}</p>
            </div>
          </FoldCard>
        ))}
      </div>
    </section>
  );
}

const schema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{5,19}$/),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  plan: z.enum(["basic", "pro", "elite"]),
  goal: z.string().trim().max(500).optional(),
});

export function JoinForm({ lang, plan = "pro" }: { lang: Lang; plan?: "basic" | "pro" | "elite" }) {
  const c = C[lang];
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", plan: plan as string, goal: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  useEffect(() => { setForm((f) => ({ ...f, plan })); }, [plan]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: Record<string, string> = {};
      for (const i of r.error.issues) {
        const k = String(i.path[0]);
        errs[k] = k === "full_name" ? c.errs.name : k === "phone" ? c.errs.phone : c.errs.email;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    const { error } = await supabase.from("membership_requests").insert({
      full_name: r.data.full_name, phone: r.data.phone, email: r.data.email || null, plan: r.data.plan, goal: r.data.goal || null,
    });
    if (error) { setStatus("err"); return; }
    setStatus("ok");
    setForm({ full_name: "", phone: "", email: "", plan: "pro", goal: "" });
  };

  const field = "w-full rounded-lg border border-input bg-background/60 px-4 py-3.5 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:shadow-glow";
  return (
    <section id="join" className="relative py-24">
      <div className="absolute inset-0 grid-lines opacity-[0.04]" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-primary">{c.formKicker}</p>
          <h2 className="mt-3 font-display text-5xl sm:text-7xl">{c.formTitle}</h2>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="mt-10 hidden h-48 w-48 lg:block">
            <img src={plate} alt="" aria-hidden width={816} height={816} loading="lazy" className="w-full opacity-80" />
          </motion.div>
        </Reveal>
        <Reveal delay={0.15}>
          <form onSubmit={submit} noValidate className="space-y-4 rounded-2xl border border-border bg-card/70 p-6 backdrop-blur sm:p-8">
            <div>
              <input className={field} placeholder={c.name} value={form.full_name} maxLength={100} onChange={(e) => set("full_name", e.target.value)} />
              {errors["full_name"] && <p className="mt-1 text-xs text-destructive">{errors["full_name"]}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <input className={field} type="tel" dir="ltr" placeholder={c.phone} value={form.phone} maxLength={20} onChange={(e) => set("phone", e.target.value)} />
                {errors["phone"] && <p className="mt-1 text-xs text-destructive">{errors["phone"]}</p>}
              </div>
              <div>
                <input className={field} type="email" dir="ltr" placeholder={c.email} value={form.email} maxLength={255} onChange={(e) => set("email", e.target.value)} />
                {errors["email"] && <p className="mt-1 text-xs text-destructive">{errors["email"]}</p>}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm text-muted-foreground">{c.plan}</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {(["basic", "pro", "elite"] as const).map((k) => (
                  <button type="button" key={k} onClick={() => set("plan", k)}
                    className={`relative rounded-lg border px-3 py-3 text-sm font-medium transition-all duration-300 ${form.plan === k ? "border-primary text-primary-foreground" : "border-input text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>
                    {form.plan === k && <motion.span layoutId="planpick" className="absolute inset-0 -z-0 rounded-lg bg-gradient-primary shadow-glow" />}
                    <span className="relative">{c.plans[k]}</span>
                  </button>
                ))}
              </div>
            </div>
            <textarea className={`${field} min-h-24 resize-none`} placeholder={c.goal} value={form.goal} maxLength={500} onChange={(e) => set("goal", e.target.value)} />
            <button type="submit" disabled={status === "sending"} className={`${btn} w-full`}>{status === "sending" ? c.sending : c.send}</button>
            {status === "ok" && <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center text-sm text-primary">{c.ok}</motion.p>}
            {status === "err" && <p className="text-center text-sm text-destructive">{c.err}</p>}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export function SiteFooter({ lang, logo }: { lang: Lang; logo: ReactNode }) {
  const c = C[lang];
  return (
    <footer id="location" className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <div className="text-primary">{logo}</div>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl">{c.footTitle}</h2>
          <p className="mt-4 text-lg">{c.addr}</p>
          <p className="mt-1 text-muted-foreground">{c.hours}</p>
          <p className="mt-6 text-sm uppercase tracking-widest text-primary">{c.contact}</p>
          <p className="mt-1 text-muted-foreground" dir="ltr">+20 100 000 0000</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-primary/30 shadow-glow">
            <iframe title="Seven Gym location" src="https://maps.google.com/maps?q=Cairo%2C%20Egypt&z=12&output=embed" loading="lazy" className="h-72 w-full grayscale invert-[0.9] contrast-[0.9] sm:h-80" />
          </div>
        </Reveal>
      </div>
      <div className="border-t border-border py-6 text-center text-sm text-muted-foreground">© 2026 Seven Gym. {c.rights}</div>
    </footer>
  );
}
