import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  Calculator,
  Copy,
  Percent,
  RefreshCw,
  Scissors,
  Sparkles,
} from "lucide-react";

type Mode = "percentOf" | "whatPercent" | "change" | "discount";

const modes: { id: Mode; title: string; description: string; accent: string }[] = [
  { id: "percentOf", title: "Bir sayının yüzdesi", description: "Bir değerin belirli yüzdesini bul", accent: "#2457D6" },
  { id: "whatPercent", title: "Yüzde kaç eder?", description: "Bir sayı diğerinin yüzde kaçı?", accent: "#E34B35" },
  { id: "change", title: "Artış / azalış", description: "İki değer arasındaki değişimi hesapla", accent: "#7A8B35" },
  { id: "discount", title: "İndirim hesapla", description: "İndirimli fiyatı ve kazancını bul", accent: "#B87935" },
];

const numberValue = (value: string) => {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 4 }).format(value);

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("percentOf");
  const [first, setFirst] = useState("250");
  const [second, setSecond] = useState("20");
  const [copied, setCopied] = useState(false);

  const a = numberValue(first);
  const b = numberValue(second);

  const result = useMemo(() => {
    if (mode === "percentOf") {
      return { main: (a * b) / 100, label: `${formatNumber(a)} sayısının %${formatNumber(b)}'si`, detail: `${formatNumber(a)} × ${formatNumber(b)} ÷ 100` };
    }
    if (mode === "whatPercent") {
      const value = b === 0 ? null : (a / b) * 100;
      return { main: value, label: `${formatNumber(a)}, ${formatNumber(b)} sayısının yüzde kaçı?`, detail: `${formatNumber(a)} ÷ ${formatNumber(b)} × 100` };
    }
    if (mode === "change") {
      const value = a === 0 ? null : ((b - a) / Math.abs(a)) * 100;
      return { main: value, label: "İlk değerden ikinci değere değişim", detail: `(${formatNumber(b)} − ${formatNumber(a)}) ÷ ${formatNumber(a)} × 100` };
    }
    const discount = (a * b) / 100;
    return { main: a - discount, label: `%${formatNumber(b)} indirimli fiyat`, detail: `${formatNumber(a)} − ${formatNumber(discount)} indirim` };
  }, [mode, a, b]);

  const secondary = mode === "discount" ? `Kazancın: ${formatNumber((a * b) / 100)}` :
    mode === "change" && result.main !== null ? (result.main >= 0 ? "Artış" : "Azalış") : "";

  const copyResult = async () => {
    if (result.main === null) return;
    await navigator.clipboard.writeText(formatNumber(result.main));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const reset = () => {
    setFirst("250");
    setSecond("20");
    setCopied(false);
  };

  const firstLabel = mode === "whatPercent" ? "Parça değer" : mode === "change" ? "İlk değer" : mode === "discount" ? "Etiket fiyatı" : "Sayı";
  const secondLabel = mode === "whatPercent" ? "Toplam değer" : mode === "change" ? "Yeni değer" : mode === "discount" ? "İndirim oranı (%)" : "Yüzde (%)";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F2EBDD] px-4 py-10 text-[#20221F] sm:px-6 sm:py-14">
      <style>{`
        .paper-grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.16'/%3E%3C/svg%3E"); }
        .checker { background-image: linear-gradient(45deg,#20221F 25%,transparent 25%),linear-gradient(-45deg,#20221F 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#20221F 75%),linear-gradient(-45deg,transparent 75%,#20221F 75%); background-size: 16px 16px; background-position: 0 0,0 8px,8px -8px,-8px 0; }
        @keyframes drift { 0%,100% { transform: translate3d(0,0,0) rotate(-8deg); } 50% { transform: translate3d(12px,-18px,0) rotate(5deg); } }
        @keyframes orbit { to { transform: rotate(360deg); } }
        .drift { animation: drift 9s ease-in-out infinite; }
        .orbit { animation: orbit 34s linear infinite; }
      `}</style>

      <div className="paper-grain pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full border-[38px] border-[#E34B35]/15" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-96 w-96 rounded-full border-[1px] border-[#2457D6]/25" />
      <div className="pointer-events-none absolute right-[12%] top-[28%] h-24 w-24 rotate-12 border-[10px] border-[#7A8B35]/30 drift" />
      <div className="pointer-events-none absolute bottom-[16%] right-[8%] h-16 w-16 rounded-full bg-[#E5B94E] opacity-70 drift" />
      <div className="pointer-events-none absolute left-[8%] top-[30%] h-12 w-12 rotate-45 bg-[#E34B35] opacity-80 drift" />
      <div className="pointer-events-none absolute right-[7%] top-[8%] hidden h-40 w-40 rounded-full border border-[#20221F]/20 sm:block">
        <div className="orbit absolute inset-3 rounded-full border border-dashed border-[#20221F]/35" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.header initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="mb-7 flex items-center justify-between border-b-2 border-[#20221F] pb-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em]">
              <span className="flex h-8 w-8 items-center justify-center bg-[#E34B35] text-white"><Percent size={18} /></span>
              ZreaxerTools / Hesaplama
            </div>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.25em] sm:block">Sayılarla oyna · 01—04</span>
          </div>

          <div className="grid items-end gap-6 md:grid-cols-[1fr_250px]">
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-[#E34B35]">
                <Sparkles size={14} /> Hızlı ve net hesaplama
              </p>
              <h1 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.07em] sm:text-7xl">
                YÜZDE<br /><span className="text-[#2457D6]">HESAPLA.</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm font-medium leading-6 text-[#62635B] sm:text-base">
                Yüzdeler gözünü korkutmasın. İhtiyacın olan işlemi seç, sayıları gir ve sonucu anında gör.
              </p>
            </div>
            <div className="relative hidden h-44 items-center justify-center md:flex">
              <div className="absolute h-36 w-36 rotate-12 border-[3px] border-[#20221F]" />
              <div className="absolute h-28 w-28 -rotate-12 bg-[#E5B94E]" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[5px] border-[#F2EBDD] bg-[#2457D6] text-4xl font-black text-white shadow-[8px_8px_0_#20221F]">%</div>
              <span className="absolute right-3 top-2 text-3xl font-black text-[#E34B35]">×</span>
              <span className="absolute bottom-1 left-5 text-3xl font-black">+</span>
            </div>
          </div>
        </motion.header>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.section initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} className="border-2 border-[#20221F] bg-[#FAF7EF] p-5 shadow-[8px_8px_0_#20221F] sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#77766D]">İşlem seçimi</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">Ne hesaplayalım?</h2>
              </div>
              <Calculator size={27} strokeWidth={2.5} />
            </div>

            <div className="space-y-3">
              {modes.map((item, index) => (
                <button key={item.id} onClick={() => { setMode(item.id); setCopied(false); }} className={`group flex w-full items-center gap-4 border-2 p-4 text-left transition-all ${mode === item.id ? "border-[#20221F] bg-[#20221F] text-[#FAF7EF] shadow-[4px_4px_0_#E5B94E] -translate-x-1 -translate-y-1" : "border-[#D8D1C3] bg-transparent hover:border-[#20221F] hover:bg-white"}`}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center text-sm font-black" style={{ backgroundColor: item.accent, color: "white" }}>0{index + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black sm:text-base">{item.title}</span>
                    <span className={`mt-0.5 block text-xs font-medium ${mode === item.id ? "text-white/60" : "text-[#77766D]"}`}>{item.description}</span>
                  </span>
                  <span className="text-xl font-black">{mode === item.id ? "↗" : "→"}</span>
                </button>
              ))}
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="relative overflow-hidden border-2 border-[#20221F] bg-[#E5B94E] p-5 shadow-[8px_8px_0_#20221F] sm:p-7">
            <div className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full border-[22px] border-[#20221F]/10" />
            <div className="relative">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#5C512F]">Hesaplama alanı</p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight">Değerleri gir</h2>
                </div>
                <button onClick={reset} className="flex items-center gap-2 border-2 border-[#20221F] bg-[#F2EBDD] px-3 py-2 text-xs font-black uppercase tracking-wide transition hover:bg-white">
                  <RefreshCw size={14} /> Sıfırla
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em]">{firstLabel}</span>
                  <input inputMode="decimal" value={first} onChange={(e) => setFirst(e.target.value)} className="w-full border-2 border-[#20221F] bg-[#FAF7EF] px-4 py-4 text-2xl font-black outline-none transition focus:shadow-[4px_4px_0_#2457D6]" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em]">{secondLabel}</span>
                  <input inputMode="decimal" value={second} onChange={(e) => setSecond(e.target.value)} className="w-full border-2 border-[#20221F] bg-[#FAF7EF] px-4 py-4 text-2xl font-black outline-none transition focus:shadow-[4px_4px_0_#E34B35]" />
                </label>
              </div>

              <div className="my-7 flex items-center gap-3">
                <div className="h-[2px] flex-1 bg-[#20221F]/30" />
                <ArrowLeftRight size={18} />
                <div className="h-[2px] flex-1 bg-[#20221F]/30" />
              </div>

              <div className="border-2 border-[#20221F] bg-[#20221F] p-5 text-[#FAF7EF] sm:p-7">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50">Sonuç</span>
                  <span className="flex h-8 w-8 items-center justify-center bg-[#E34B35]"><Percent size={17} /></span>
                </div>
                <p className="text-xs font-bold text-[#E5B94E]">{result.label}</p>
                <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
                  <motion.div key={`${mode}-${result.main}`} initial={{ opacity: 0.4, y: 8 }} animate={{ opacity: 1, y: 0 }} className="break-all text-4xl font-black leading-none tracking-[-0.06em] sm:text-6xl">
                    {result.main === null ? "—" : formatNumber(result.main)}
                    {mode === "whatPercent" || mode === "change" ? <span className="ml-1 text-2xl text-[#E5B94E]">%</span> : null}
                  </motion.div>
                  <button onClick={copyResult} disabled={result.main === null} className="flex items-center gap-2 border border-white/30 px-3 py-2 text-xs font-black transition hover:bg-white hover:text-[#20221F] disabled:opacity-30">
                    <Copy size={14} /> {copied ? "Kopyalandı" : "Kopyala"}
                  </button>
                </div>
                {secondary && <p className="mt-4 flex items-center gap-2 text-sm font-black text-[#E5B94E]">{mode === "discount" ? <Scissors size={15} /> : result.main !== null && result.main >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}{secondary}</p>}
                {result.main === null && <p className="mt-3 text-xs font-semibold text-[#F29A8B]">Sıfıra bölme yapılamaz. Lütfen ikinci değeri kontrol et.</p>}
              </div>
              <p className="mt-4 text-xs font-semibold text-[#5C512F]">İşlem: {result.detail}</p>
            </div>
          </motion.section>
        </div>

        <footer className="mt-10 flex flex-col gap-2 border-t-2 border-[#20221F] pt-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#77766D] sm:flex-row sm:items-center sm:justify-between">
          <span>ZreaxerTools · Hesaplama stüdyosu</span>
          <span>Ücretsiz · Anında sonuç · Tarayıcında hesaplanır</span>
        </footer>
      </div>
    </main>
  );
}
