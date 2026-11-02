import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette, RefreshCw, Lock, Unlock, Copy, Check, Download, 
  WandSparkles, Pipette, Paintbrush, Droplets, Blend, SwatchBook,
 Shapes, Rainbow,
} from "lucide-react";

type Harmony = "random" | "analogous" | "complementary" | "triadic";

const hslToHex = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));
  return `#${[f(0), f(8), f(4)].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
};

const createPalette = (harmony: Harmony, locked: string[]) => {
  const base = Math.floor(Math.random() * 360);
  const hues = harmony === "analogous"
    ? [base - 30, base - 15, base, base + 15, base + 30]
    : harmony === "complementary"
      ? [base, base + 180, base + 160, base + 200, base + 20]
      : harmony === "triadic"
        ? [base, base + 120, base + 240, base + 15, base + 135]
        : Array.from({ length: 5 }, () => Math.floor(Math.random() * 360));

  return Array.from({ length: 5 }, (_, i) => {
    if (locked[i]) return locked[i];
    return hslToHex(((hues[i] % 360) + 360) % 360, 55 + Math.random() * 30, 38 + Math.random() * 30);
  });
};

const harmonyLabels: { value: Harmony; label: string; note: string }[] = [
  { value: "random", label: "Serbest", note: "Sürpriz renkler" },
  { value: "analogous", label: "Analog", note: "Yan yana tonlar" },
  { value: "complementary", label: "Tamamlayıcı", note: "Güçlü kontrast" },
  { value: "triadic", label: "Üçlü Uyum", note: "Dengeli çeşitlilik" },
];

export default function ColorPaletteGenerator() {
  const [harmony, setHarmony] = useState<Harmony>("random");
  const [locked, setLocked] = useState<string[]>(["", "", "", "", ""]);
  const [colors, setColors] = useState<string[]>(() => createPalette("random", []));
  const [copied, setCopied] = useState<string | null>(null);

  const generate = () => {
    setColors(createPalette(harmony, locked));
    setCopied(null);
  };

  const toggleLock = (index: number) => {
    setLocked((previous) => {
      const next = [...previous];
      next[index] = next[index] ? "" : colors[index];
      return next;
    });
  };

  const updateColor = (index: number, value: string) => {
    const next = [...colors];
    next[index] = value.toUpperCase();
    setColors(next);
    setLocked((previous) => {
      const result = [...previous];
      if (result[index]) result[index] = value.toUpperCase();
      return result;
    });
  };

  const copyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  };

  const exportCSS = () => {
    const css = `:root {\n${colors.map((color, index) => `  --color-${index + 1}: ${color};`).join("\n")}\n}`;
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "zreaxer-color-palette.css";
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyAll = () => copyText(colors.join(", "), "all");

  return (
    <main className="color-workshop relative min-h-screen overflow-hidden px-4 pb-14 pt-10 text-[#292c24] sm:px-6 sm:pt-14">
      <style>{`
        .color-workshop { isolation: isolate; background-color: #e9e3d4; }
        .workshop-paper { background-image: radial-gradient(rgba(65,59,43,.12) .65px, transparent .65px); background-size: 6px 6px; }
        .workshop-grid { background-image: linear-gradient(rgba(63,67,54,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(63,67,54,.045) 1px, transparent 1px); background-size: 44px 44px; }
        .palette-swatch { box-shadow: inset 0 1px 0 rgba(255,255,255,.24), inset 0 -18px 35px rgba(0,0,0,.08); }
      `}</style>

      {/* Kâğıt dokusu, pigment şeritleri ve atölye detayları */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div className="workshop-paper absolute inset-0 opacity-70" />
        <div className="workshop-grid absolute inset-0 opacity-70" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#f7f1e4]/80 to-transparent" />
        <motion.div
          className="absolute -right-24 top-[-10%] h-[780px] w-24 rotate-[31deg] rounded-full bg-[#b96f50]/20"
          animate={{ y: [0, 35, 0], rotate: [31, 35, 31] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[13%] top-[-24%] h-[720px] w-12 rotate-[31deg] rounded-full bg-[#d0b16e]/25"
          animate={{ y: [0, -28, 0] }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-20 bottom-[-20%] h-[620px] w-20 rotate-[31deg] rounded-full bg-[#75816b]/20"
          animate={{ y: [0, -32, 0], rotate: [31, 26, 31] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute left-[5%] top-[19%] h-36 w-36 rotate-[-12deg] rounded-[2rem] border border-[#58604d]/10" />
        <div className="absolute bottom-[9%] right-[6%] h-56 w-56 rotate-[14deg] rounded-[2.5rem] border border-[#b96f50]/15" />
        <div className="absolute bottom-0 left-0 h-44 w-full bg-gradient-to-t from-[#d8d0bd]/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Başlık alanı */}
        <motion.header initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="mb-11 text-center">
          <motion.div
            animate={{ rotate: [0, -4, 4, 0], y: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-[25px] border border-[#34392e]/15 bg-[#f6f0e3] shadow-[0_14px_35px_rgba(57,53,40,.13)]"
          >
            <div className="absolute inset-2 grid grid-cols-2 grid-rows-2 gap-1 rounded-xl">
              <span className="rounded-tl-lg bg-[#bd7052]" />
              <span className="rounded-tr-lg bg-[#d6b96f]" />
              <span className="rounded-bl-lg bg-[#7a896e]" />
              <span className="rounded-br-lg bg-[#60768a]" />
            </div>
            <Palette size={25} className="relative z-10 text-white drop-shadow-md" />
          </motion.div>

          <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.03 }}
  className="mb-6 inline-flex items-center gap-3 rounded-2xl border border-[#414638]/15 bg-[#f6f0e3]/90 px-5 py-3 shadow-[0_8px_25px_rgba(57,53,40,.10)]"
>
  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 p-[2px] shadow-lg shadow-blue-900/20">
    <span className="absolute inset-[2px] rounded-[10px] bg-[#17202b]" />
    <span className="relative z-10 bg-gradient-to-br from-white via-cyan-100 to-violet-300 bg-clip-text text-3xl font-black italic text-transparent">
      Z
    </span>
    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_10px_3px_rgba(34,211,238,.45)]" />
  </span>

  <span className="flex flex-col text-left">
    <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-xl font-black tracking-tight text-transparent sm:text-2xl">
      ZreaxerTools
    </span>
    <span className="text-[9px] font-bold tracking-[0.25em] text-[#858577]">
      ALL TOOLS. ONE PLACE.
    </span>
  </span>

  <span className="ml-1 rounded-lg border border-cyan-600/20 bg-cyan-600/10 px-2 py-1 text-[9px] font-black tracking-widest text-cyan-700">
    FREE
  </span>
</motion.div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-[#292c24] sm:text-6xl">
            Renk Paleti <span className="font-serif italic font-semibold text-[#b5684b]">Atölyesi</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-[#737466] sm:text-base">
            İlhamını renklerden al. Birbiriyle uyumlu tonları keşfet, kendi paletini düzenle ve tasarımlarında kullan.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            {[
              { Icon: Pipette, label: "Renkleri keşfet" },
              { Icon: Blend, label: "Uyumu yakala" },
              { Icon: SwatchBook, label: "Paletini tasarla" },
            ].map(({ Icon, label }) => (
              <motion.div key={label} whileHover={{ y: -3 }} className="flex items-center gap-2 rounded-full border border-[#555b4b]/15 bg-[#f7f2e7]/75 px-4 py-2 text-xs font-semibold text-[#626858] shadow-sm">
                <Icon size={15} className="text-[#b96f50]" /> {label}
              </motion.div>
            ))}
          </div>
        </motion.header>

        {/* Ana palet paneli */}
        <motion.section
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="relative overflow-hidden rounded-[2rem] border border-[#414638]/15 bg-[#f5f0e5]/95 p-5 shadow-[0_25px_70px_rgba(55,53,42,.13)] sm:p-8"
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-[#b96f50]/15" />
          <div className="pointer-events-none absolute -right-8 -top-12 h-48 w-48 rounded-full border border-dashed border-[#7c866e]/20" />
          <div className="relative z-10">
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#b36b4e]">01 / Your palette</p>
                <h2 className="flex items-center gap-2 text-xl font-black text-[#303429] sm:text-2xl"><WandSparkles size={22} className="text-[#b96f50]" /> Renk kombinasyonun</h2>
                <p className="mt-1 text-sm text-[#858577]">Renkleri sabitle veya yeni bir kombinasyon oluştur.</p>
              </div>
              <button onClick={generate} className="flex items-center justify-center gap-2 rounded-xl bg-[#343a30] px-6 py-3 font-bold text-[#f5f0e5] shadow-[0_5px_0_#20251f] transition hover:-translate-y-0.5 hover:bg-[#48513f] hover:shadow-[0_7px_0_#20251f] active:translate-y-1 active:shadow-none">
                <RefreshCw size={18} /> Yeni Palet Oluştur
              </button>
            </div>

            <div className="mb-8">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-extrabold tracking-[0.2em] text-[#858577]"><Shapes size={15} className="text-[#b96f50]" /> RENK UYUMU</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {harmonyLabels.map((item) => (
                  <button key={item.value} onClick={() => setHarmony(item.value)} className={`rounded-xl border px-3 py-3 text-left transition ${harmony === item.value ? "border-[#b96f50]/50 bg-[#b96f50]/10 text-[#8e5039] shadow-sm" : "border-[#414638]/15 bg-[#ebe5d8] text-[#747667] hover:border-[#8a927b]/50 hover:bg-[#f8f3e9]"}`}>
                    <span className="block text-sm font-extrabold">{item.label}</span>
                    <span className="mt-0.5 block text-[10px] opacity-70">{item.note}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.2em] text-[#858577]"><Rainbow size={16} className="text-[#b96f50]" /> PALETİNDEKİ RENKLER</div>
              <span className="rounded-full bg-[#e8e1d2] px-3 py-1 text-[10px] font-bold tracking-wider text-[#7b7c6e]">05 SWATCHES</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
              <AnimatePresence mode="popLayout">
                {colors.map((color, index) => (
                  <motion.article key={index} layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ delay: index * 0.045 }} whileHover={{ y: -4 }} className="group overflow-hidden rounded-2xl border border-[#414638]/15 bg-[#e9e3d6] shadow-[0_5px_18px_rgba(45,45,35,.07)]">
                    <div className="palette-swatch relative h-36 sm:h-48" style={{ backgroundColor: color }}>
                      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/20 to-transparent" />
                      <div className="absolute right-3 top-3 flex gap-2">
                        <button onClick={() => toggleLock(index)} title={locked[index] ? "Kilidi aç" : "Rengi kilitle"} className="rounded-lg border border-white/30 bg-black/20 p-2 text-white shadow-sm backdrop-blur-sm transition hover:bg-black/40">{locked[index] ? <Lock size={16} /> : <Unlock size={16} />}</button>
                        <button onClick={() => copyText(color, `color-${index}`)} title="HEX kodunu kopyala" className="rounded-lg border border-white/30 bg-black/20 p-2 text-white shadow-sm backdrop-blur-sm transition hover:bg-black/40">{copied === `color-${index}` ? <Check size={16} /> : <Copy size={16} />}</button>
                      </div>
                      <label title="Rengi değiştir" className="absolute bottom-3 right-3 cursor-pointer rounded-lg border border-white/30 bg-black/20 p-2 text-white shadow-sm backdrop-blur-sm transition hover:bg-black/40">
                        <Paintbrush size={16} /><input type="color" value={color} onChange={(event) => updateColor(index, event.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                      </label>
                      <div className="absolute bottom-3 left-3 rounded-md bg-black/25 px-2 py-1 text-[10px] font-extrabold tracking-wider text-white backdrop-blur-sm">TONE 0{index + 1}</div>
                    </div>
                    <div className="flex items-center justify-between gap-2 p-3.5">
                      <div><p className="text-[9px] font-bold tracking-[0.16em] text-[#929181]">HEX VALUE</p><p className="mt-1 font-mono text-sm font-black tracking-wider text-[#34382e]">{color}</p></div>
                      <button onClick={() => copyText(color, `color-${index}`)} className="rounded-lg p-2 text-[#777b6d] transition hover:bg-[#dcd5c6] hover:text-[#33392e]">{copied === `color-${index}` ? <Check size={17} className="text-[#66805f]" /> : <Copy size={17} />}</button>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-[#414638]/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                <button onClick={copyAll} className="flex items-center gap-2 rounded-xl border border-[#414638]/20 bg-[#ebe5d8] px-4 py-3 text-sm font-bold text-[#555b4b] transition hover:bg-[#e1dacb]">{copied === "all" ? <Check size={17} className="text-[#66805f]" /> : <Copy size={17} />} Tüm HEX Kodlarını Kopyala</button>
                <button onClick={exportCSS} className="flex items-center gap-2 rounded-xl bg-[#b96f50] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#a85f43]"><Download size={17} /> CSS İndir</button>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#858577]"><Droplets size={14} className="text-[#b96f50]" /> Ücretsiz · Tarayıcında çalışır</div>
            </div>
          </div>
        </motion.section>

        {/* Özellikler */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { title: "Sınırsız kombinasyon", desc: "Her üretimde yeni tonlar keşfet.", Icon: Rainbow, color: "text-[#b96f50]", bg: "bg-[#b96f50]/10" },
            { title: "Renklerini koru", desc: "Beğendiğin tonları kilitle ve sabitle.", Icon: Lock, color: "text-[#71816a]", bg: "bg-[#71816a]/10" },
            { title: "Kolay dışa aktarım", desc: "HEX kodlarını kopyala veya CSS indir.", Icon: Download, color: "text-[#b49a5e]", bg: "bg-[#b49a5e]/15" },
          ].map(({ title, desc, Icon, color, bg }, index) => (
            <motion.div key={title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + index * 0.08 }} whileHover={{ y: -3 }} className="rounded-2xl border border-[#414638]/15 bg-[#f4efe3]/85 p-5 shadow-[0_8px_24px_rgba(45,45,35,.06)]">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}><Icon size={20} /></div>
              <h3 className="mb-1 font-extrabold text-[#373b30]">{title}</h3><p className="text-sm text-[#858577]">{desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="mt-10 flex flex-wrap items-center justify-center gap-3 text-[10px] font-extrabold tracking-[0.2em] text-[#8b897a]">
          <Palette size={14} className="text-[#b96f50]" /><span>ZREAXER / COLOR ATELIER</span><span className="text-[#b96f50]">✦</span><span>MAKE COLORS MATTER</span><span className="text-[#b96f50]">✦</span><span>100% FREE</span>
        </motion.footer>
      </div>
    </main>
  );
}
