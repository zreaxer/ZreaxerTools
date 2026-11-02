
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Clock3,
  MousePointer2,
  RotateCcw,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

type Phase = "idle" | "waiting" | "ready" | "result" | "tooSoon";

const TOTAL_ROUNDS = 5;

export default function ReactionTimeTest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [reaction, setReaction] = useState<number | null>(null);
  const [results, setResults] = useState<number[]>([]);
  const [round, setRound] = useState(1);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readyAtRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startRound = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setReaction(null);
    setPhase("waiting");

    const delay = 1700 + Math.random() * 3300;

    timerRef.current = setTimeout(() => {
      readyAtRef.current = performance.now();
      setPhase("ready");
    }, delay);
  };

  const beginTest = () => {
    setResults([]);
    setRound(1);
    setReaction(null);
    startRound();
  };

  const handleTargetClick = () => {
    if (phase === "idle") {
      beginTest();
      return;
    }

    if (phase === "waiting") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase("tooSoon");
      return;
    }

    if (phase === "ready") {
      const value = Math.round(performance.now() - readyAtRef.current);

      setReaction(value);
      setResults((previous) => [...previous, value]);
      setPhase("result");
    }
  };

  const nextRound = () => {
    if (round >= TOTAL_ROUNDS) return;

    setRound((previous) => previous + 1);
    startRound();
  };

  const average = results.length
    ? Math.round(results.reduce((sum, value) => sum + value, 0) / results.length)
    : null;

  const best = results.length ? Math.min(...results) : null;
  const finished = results.length === TOTAL_ROUNDS;

  const statusText = {
    idle: "HAZIR MISIN?",
    waiting: "SİNYALİ BEKLE",
    ready: "ŞİMDİ TIKLA!",
    result: "GÜZEL REFLEKS!",
    tooSoon: "ÇOK ERKEN!",
  }[phase];

  const targetStyle =
    phase === "waiting"
      ? "bg-[#d5a34b] text-[#211c16] border-[#f1c875]"
      : phase === "ready"
      ? "bg-[#d94a36] text-[#fff3e5] border-[#ff8c70]"
      : phase === "tooSoon"
      ? "bg-[#34302b] text-[#f0b6a6] border-[#a65b4c]"
      : phase === "result"
      ? "bg-[#e9dfce] text-[#29231d] border-[#c6a985]"
      : "bg-[#292722] text-[#e9dfce] border-[#75644f]";

  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[#211f1b] px-4 py-10 text-[#eee5d6] sm:px-6 sm:py-14">

      {/* Dekoratif arka plan */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 top-20 h-[420px] w-[420px] rounded-full border border-[#b77a4d]/15" />
        <div className="absolute -left-12 top-36 h-[300px] w-[300px] rounded-full border border-dashed border-[#d6a65c]/15" />
        <div className="absolute -right-28 bottom-[-110px] h-[560px] w-[560px] rounded-full border border-[#c94e3c]/20" />
        <div className="absolute right-[9%] top-[13%] h-24 w-24 rotate-12 border border-[#d6a65c]/20" />
        <div className="absolute bottom-[16%] left-[8%] h-14 w-14 -rotate-12 border border-[#c94e3c]/20" />

        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(#d6a65c 0.7px, transparent 0.7px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#bd8654]/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* Başlık */}
        <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 border border-[#bd8654]/35 bg-[#bd8654]/10 px-3 py-1.5 text-[10px] font-black tracking-[0.24em] text-[#d6a66e]">
              <Activity size={13} />
              REFLEKS LABORATUVARI
            </div>

            <h1 className="text-4xl font-black tracking-tight text-[#f4ead9] sm:text-5xl">
              Tepki Süresi <span className="text-[#d66b50]">Testi</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#aaa092] sm:text-base">
              Renk değişimini gördüğün anda tıkla. Reflekslerini 5 turda ölç,
              ortalamanı ve en iyi süreni keşfet.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start border border-[#74624d]/40 bg-[#2b2822] px-4 py-3 md:self-auto">
            <div className="flex h-10 w-10 items-center justify-center bg-[#d6a65c]/15 text-[#d6a65c]">
              <Target size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-[0.18em] text-[#958978]">
                TEST İLERLEMESİ
              </div>
              <div className="mt-1 text-sm font-black text-[#f0e5d5]">
                {Math.min(
                  results.length + (phase === "waiting" || phase === "ready" ? 1 : 0),
                  TOTAL_ROUNDS
                )} / {TOTAL_ROUNDS} TUR
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">

          {/* Test alanı */}
          <section className="border border-[#71604c]/35 bg-[#292721] p-4 shadow-[12px_12px_0_rgba(0,0,0,0.14)] sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#a99b87]">
                <Zap size={15} className="text-[#d6a65c]" />
                CANLI REFLEKS ÖLÇÜMÜ
              </div>
              <div className="text-xs font-semibold text-[#877b6b]">
                TUR {Math.min(round, TOTAL_ROUNDS)} / {TOTAL_ROUNDS}
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleTargetClick}
              whileTap={{ scale: 0.985 }}
              className={`group relative flex min-h-[330px] w-full flex-col items-center justify-center overflow-hidden border-2 transition-colors duration-200 sm:min-h-[390px] ${targetStyle}`}
              aria-label="Tepki testi alanı"
            >
              <div className="pointer-events-none absolute inset-4 border border-current opacity-15" />

              <div className="pointer-events-none absolute left-7 top-7 h-5 w-5 border-l-2 border-t-2 border-current opacity-50" />
              <div className="pointer-events-none absolute right-7 top-7 h-5 w-5 border-r-2 border-t-2 border-current opacity-50" />
              <div className="pointer-events-none absolute bottom-7 left-7 h-5 w-5 border-b-2 border-l-2 border-current opacity-50" />
              <div className="pointer-events-none absolute bottom-7 right-7 h-5 w-5 border-b-2 border-r-2 border-current opacity-50" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="relative z-10 flex flex-col items-center text-center"
                >
                  {phase === "idle" && (
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-[#d6a65c]/45 bg-[#d6a65c]/10">
                      <MousePointer2 size={42} />
                    </div>
                  )}

                  {phase === "waiting" && (
                    <div className="mb-6 h-24 w-24 animate-spin rounded-full border-[3px] border-current/30 border-t-current" />
                  )}

                  {phase === "ready" && (
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-current/60 bg-white/10">
                      <Zap size={48} />
                    </div>
                  )}

                  {phase === "tooSoon" && (
                    <AlertTriangle size={54} className="mb-6" />
                  )}

                  {phase === "result" && (
                    <Clock3 size={54} className="mb-6" />
                  )}

                  <span className="text-2xl font-black tracking-[0.12em] sm:text-3xl">
                    {statusText}
                  </span>

                  <span className="mt-3 max-w-sm text-sm font-medium opacity-75">
                    {phase === "idle" && "Başlamak için bu alana tıkla"}
                    {phase === "waiting" && "Renk kırmızıya dönene kadar bekle. Erken tıklama!"}
                    {phase === "ready" && "Hemen tıkla — süre şu an ölçülüyor"}
                    {phase === "tooSoon" && "Sinyal gelmeden tıkladın. Tekrar denemek için aşağıdaki butona bas."}
                    {phase === "result" && `${reaction} milisaniyede tepki verdin`}
                  </span>
                </motion.div>
              </AnimatePresence>

              <span className="absolute bottom-5 text-[9px] font-black tracking-[0.3em] opacity-35">
                ZREAXERTOOLS • REACTION UNIT
              </span>
            </motion.button>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-[#958a7b]">
                İpucu: Ekrana odaklan, sinyali bekle ve gördüğün an tek tık yap.
              </p>

              {(phase === "idle" || phase === "tooSoon") && (
                <button
                  onClick={beginTest}
                  className="inline-flex items-center justify-center gap-2 bg-[#c66a4d] px-5 py-3 text-xs font-black tracking-wider text-[#fff4e8] transition hover:bg-[#dc7959]"
                >
                  <Zap size={15} />
                  TESTE BAŞLA
                </button>
              )}

              {phase === "result" && !finished && (
                <button
                  onClick={nextRound}
                  className="inline-flex items-center justify-center gap-2 bg-[#d6a65c] px-5 py-3 text-xs font-black tracking-wider text-[#29231d] transition hover:bg-[#e5b96e]"
                >
                  SONRAKİ TUR →
                </button>
              )}

              {finished && (
                <button
                  onClick={beginTest}
                  className="inline-flex items-center justify-center gap-2 bg-[#c66a4d] px-5 py-3 text-xs font-black tracking-wider text-[#fff4e8] transition hover:bg-[#dc7959]"
                >
                  <RotateCcw size={15} />
                  YENİDEN DENE
                </button>
              )}
            </div>
          </section>

          {/* Sonuç paneli */}
          <aside className="flex flex-col gap-5">
            <div className="border border-[#71604c]/35 bg-[#292721] p-5">
              <div className="mb-4 flex items-center gap-2 text-xs font-black tracking-[0.16em] text-[#b9a88e]">
                <Activity size={15} className="text-[#d66b50]" />
                SONUÇLARIN
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#211f1b] p-4">
                  <div className="text-[9px] font-bold tracking-widest text-[#8f8373]">
                    ORTALAMA
                  </div>
                  <div className="mt-2 text-2xl font-black text-[#f0e5d5]">
                    {average ?? "—"}
                    <span className="ml-1 text-xs font-semibold text-[#a99b87]">ms</span>
                  </div>
                </div>

                <div className="bg-[#211f1b] p-4">
                  <div className="text-[9px] font-bold tracking-widest text-[#8f8373]">
                    EN İYİ
                  </div>
                  <div className="mt-2 text-2xl font-black text-[#d6a65c]">
                    {best ?? "—"}
                    <span className="ml-1 text-xs font-semibold text-[#a99b87]">ms</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#9f9382]">Tur geçmişi</span>
                <span className="text-[10px] text-[#756b5e]">
                  {results.length} / {TOTAL_ROUNDS}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {Array.from({ length: TOTAL_ROUNDS }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-xs"
                  >
                    <span className="font-bold text-[#9d907e]">
                      TUR {index + 1}
                    </span>
                    <span className={`font-black ${results[index] ? "text-[#e4b66e]" : "text-[#655e53]"}`}>
                      {results[index] ? `${results[index]} ms` : "—"}
                    </span>
                  </div>
                ))}
              </div>

              {finished && (
                <div className="mt-5 flex items-center gap-2 border border-[#d6a65c]/25 bg-[#d6a65c]/10 p-3 text-xs font-bold text-[#e4c48f]">
                  <Trophy size={16} />
                  5 turluk test tamamlandı!
                </div>
              )}
            </div>

            <div className="border border-[#71604c]/35 bg-[#332d25] p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-black tracking-[0.16em] text-[#d6a65c]">
                <Trophy size={15} />
                SKOR REHBERİ
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#c9bdab]">150 ms altı</span>
                  <b className="text-[#e7b86c]">Şimşek</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c9bdab]">150–200 ms</span>
                  <b className="text-[#d6a65c]">Çok hızlı</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c9bdab]">200–250 ms</span>
                  <b className="text-[#d98a62]">İyi</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c9bdab]">250 ms üzeri</span>
                  <b className="text-[#bd8b79]">Pratik yap</b>
                </div>
              </div>

              <p className="mt-4 border-t border-white/10 pt-3 text-[10px] leading-5 text-[#a99b87]">
                Sonuçlar cihazına, ekranına ve giriş gecikmesine göre değişebilir.
                Bu test eğlence ve kişisel kıyaslama amaçlıdır.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
