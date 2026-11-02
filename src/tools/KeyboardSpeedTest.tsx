import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  Play,
  Activity,
  Crosshair,
  ShieldCheck,
  Cpu,
  Gauge,
  Keyboard,
  Zap,
  Target,
  Clock3,
  Trophy,
  RotateCcw,
} from "lucide-react";

const passages = [
  "Teknoloji her geçen gün gelişiyor ve hayatımızın birçok alanını değiştiriyor. Yeni şeyler öğrenmek, kendimizi geliştirmek ve hedeflerimize ulaşmak için düzenli olarak çalışmalıyız. Başarı sabır, disiplin ve kararlılıkla gelir.",
  "Bilgisayar dünyasında hız kadar doğruluk da önemlidir. Klavyeyi doğru kullanmak zaman kazandırır ve işlerin daha verimli tamamlanmasını sağlar. Her gün yapılan küçük antrenmanlar zamanla büyük gelişmeler ortaya çıkarır.",
  "Hayallerini gerçekleştirmek için ilk adımı atmaktan korkma. Her yeni deneme sana farklı bir deneyim kazandırır. Hatalar öğrenme sürecinin doğal bir parçasıdır. Önemli olan vazgeçmeden devam etmektir.",
  "Dijital dünyada üretmek, keşfetmek ve öğrenmek için sınırsız fırsatlar var. Kendine bir hedef belirle, düzenli çalış ve gelişimini takip et. Küçük adımlar zamanla büyük sonuçlara dönüşebilir.",
];

const durations = [15, 30, 60, 120];

export default function KeyboardSpeedTest() {
  const [duration, setDuration] = useState(30);
  const [remaining, setRemaining] = useState(30);
  const [passageIndex, setPassageIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const passage = passages[passageIndex];

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setIsRunning(false);
          setIsFinished(true);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  const correctChars = typed
    .split("")
    .filter((char, index) => char === passage[index]).length;

  const wrongChars = typed.length - correctChars;
  const accuracy =
    typed.length > 0 ? Math.round((correctChars / typed.length) * 100) : 100;

  const elapsed = duration - remaining;
  const wpm =
    elapsed > 0 ? Math.round(correctChars / 5 / (elapsed / 60)) : 0;

  const progress = Math.min((typed.length / passage.length) * 100, 100);

  function resetTest(nextDuration = duration, nextPassage?: number) {
    setDuration(nextDuration);
    setRemaining(nextDuration);
    setTyped("");
    setIsRunning(false);
    setIsFinished(false);

    if (nextPassage !== undefined) {
      setPassageIndex(nextPassage);
    }
  }

  function handleTyping(value: string) {
    if (isFinished) return;

    const nextValue = value.slice(0, passage.length);

    if (!isRunning && nextValue.length > 0) {
      setIsRunning(true);
    }

    setTyped(nextValue);

    if (nextValue.length >= passage.length) {
      setIsRunning(false);
      setIsFinished(true);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090d13] text-white">
      {/* Cyber background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[450px] w-[450px] rounded-full bg-blue-600/15 blur-[130px]" />
        <div className="absolute -right-40 top-40 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[350px] w-[500px] rounded-full bg-cyan-500/10 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(56,189,248,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.25) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="absolute -right-32 top-24 h-[500px] w-[500px] rounded-full border border-cyan-400/10"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
          className="absolute -right-12 top-44 h-[300px] w-[300px] rounded-full border border-orange-400/10"
        />

        {Array.from({ length: 22 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-cyan-300"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
            }}
            animate={{ opacity: [0.15, 0.9, 0.15], scale: [0.7, 1.5, 0.7] }}
            transition={{
              duration: 2 + (i % 4),
              repeat: Infinity,
              delay: i * 0.13,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-10 md:py-14">
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 text-xs font-semibold tracking-[0.2em] text-cyan-300"
          >
            <Activity size={14} />
            CYBER PERFORMANCE LAB
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-300/30 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 shadow-[0_0_45px_rgba(34,211,238,0.18)]"
          >
            <Keyboard size={40} className="text-cyan-300" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 text-4xl font-black tracking-tight md:text-5xl"
          >
            KLAVYE{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-orange-400 bg-clip-text text-transparent">
              HIZ TESTİ
            </span>
          </motion.h1>

          <p className="mx-auto max-w-xl text-sm text-slate-400 md:text-base">
            Reflekslerini test et, yazma hızını ölç ve kendi rekorunu kır.
            Gerçek performansını keşfet!
          </p>
        </div>

        {/* Stats */}
        <div className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            {
              label: "YAZMA HIZI",
              value: `${wpm}`,
              unit: "WPM",
              icon: Zap,
              color: "text-cyan-300",
            },
            {
              label: "DOĞRULUK",
              value: `${accuracy}`,
              unit: "%",
              icon: Target,
              color: "text-emerald-300",
            },
            {
              label: "HATALI KARAKTER",
              value: `${wrongChars}`,
              unit: "",
              icon: Crosshair,
              color: "text-orange-300",
            },
            {
              label: "KALAN SÜRE",
              value: `${remaining}`,
              unit: "SN",
              icon: Clock3,
              color: "text-blue-300",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl transition hover:border-cyan-300/30 hover:bg-white/[0.06]"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500">
                  {stat.label}
                </span>
                <stat.icon size={17} className={stat.color} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tabular-nums text-white">
                  {stat.value}
                </span>
                <span className={`text-xs font-bold ${stat.color}`}>
                  {stat.unit}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Test panel */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-[#111923]/85 shadow-[0_25px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
        >
          {/* Panel header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-5 md:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <Cpu size={20} />
              </div>
              <div>
                <h2 className="font-bold text-white">Yazma Alanı</h2>
                <p className="text-xs text-slate-500">
                  {isRunning
                    ? "Test devam ediyor..."
                    : isFinished
                      ? "Test tamamlandı"
                      : "Başlamak için yazmaya başla"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  isRunning ? "animate-pulse bg-emerald-400" : "bg-slate-500"
                }`}
              />
              <span className="text-xs font-semibold text-slate-400">
                {isRunning ? "LIVE TEST" : isFinished ? "COMPLETED" : "READY"}
              </span>
            </div>
          </div>

          <div className="p-5 md:p-7">
            {/* Duration selector */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold tracking-widest text-slate-500">
                TEST SÜRESİ
              </span>

              <div className="flex flex-wrap gap-2">
                {durations.map((time) => (
                  <button
                    key={time}
                    onClick={() => resetTest(time)}
                    disabled={isRunning}
                    className={`rounded-lg border px-4 py-2 text-xs font-bold transition ${
                      duration === time
                        ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.12)]"
                        : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {time} SN
                  </button>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="mb-5">
              <div className="mb-2 flex justify-between text-xs text-slate-500">
                <span>METİN İLERLEMESİ</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>

            {/* Passage */}
            <div className="relative mb-5 min-h-[190px] rounded-2xl border border-cyan-400/10 bg-[#080e16] p-5 md:p-7">
              <div className="mb-5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] text-cyan-300/70">
                  <ShieldCheck size={14} />
                  TYPING CHALLENGE
                </span>
                <span className="text-[10px] text-slate-600">
                  {typed.length}/{passage.length} KARAKTER
                </span>
              </div>

              <p className="font-mono text-base leading-8 tracking-wide md:text-lg">
                {passage.split("").map((char, index) => {
                  const isTyped = index < typed.length;
                  const isCorrect = isTyped && typed[index] === char;
                  const isWrong = isTyped && typed[index] !== char;
                  const isCurrent = index === typed.length;

                  return (
                    <span
                      key={index}
                      className={`relative rounded-sm ${
                        isCorrect
                          ? "bg-emerald-400/10 text-emerald-300"
                          : isWrong
                            ? "bg-red-500/20 text-red-400 underline decoration-red-400"
                            : isCurrent
                              ? "border-b-2 border-cyan-300 bg-cyan-300/10 text-white"
                              : "text-slate-500"
                      }`}
                    >
                      {char}
                    </span>
                  );
                })}
              </p>
            </div>

            {/* Typing input */}
            <label className="mb-2 block text-xs font-bold tracking-widest text-slate-500">
              METNİ BURAYA YAZ
            </label>
            <textarea
              value={typed}
              onChange={(event) => handleTyping(event.target.value)}
              disabled={isFinished}
              placeholder={
                isFinished
                  ? "Test tamamlandı. Yeniden başlatabilirsin."
                  : "Yukarıdaki metni buraya yazmaya başla..."
              }
              spellCheck={false}
              autoComplete="off"
              className="min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/25 p-5 font-mono text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/5 disabled:opacity-60"
            />

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => resetTest(duration, (passageIndex + 1) % passages.length)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-3.5 text-sm font-bold text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <RotateCcw size={17} />
                Yeniden Başlat
              </button>

              {!isRunning && !isFinished && typed.length === 0 && (
                <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-black text-white shadow-[0_0_25px_rgba(34,211,238,0.15)]">
                  <Play size={17} fill="currentColor" />
                  Yazmaya Başla
                </div>
              )}

              {isFinished && (
                <div className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 py-3.5 text-sm font-bold text-emerald-300">
                  <Trophy size={18} />
                  Test Tamamlandı!
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Result panel */}
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mt-6 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.08] to-blue-500/[0.06] p-6 md:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-orange-400/10 p-3 text-orange-300">
                <Trophy size={25} />
              </div>
              <div>
                <h2 className="text-xl font-black">Test Sonucun</h2>
                <p className="text-sm text-slate-400">
                  Performansını tamamladın. İşte sonuçların!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: "Kelime / Dakika", value: `${wpm} WPM`, icon: Gauge },
                { label: "Doğruluk", value: `%${accuracy}`, icon: Target },
                { label: "Doğru Karakter", value: `${correctChars}`, icon: Zap },
                { label: "Hatalı Karakter", value: `${wrongChars}`, icon: Crosshair },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <item.icon size={19} className="mb-3 text-cyan-300" />
                  <div className="text-2xl font-black">{item.value}</div>
                  <div className="mt-1 text-xs text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>

            <p className="mt-5 text-center text-sm text-slate-400">
              {accuracy >= 95
                ? "Harika doğruluk! Gerçekten çok iyi iş çıkardın."
                : accuracy >= 80
                  ? "Güzel performans! Biraz daha pratikle daha iyisini yapabilirsin."
                  : "Pratik yapmaya devam et. Hız kadar doğruluk da önemli!"}
            </p>
          </motion.div>
        )}

        {/* Bottom info */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Hızını Geliştir",
              desc: "WPM değerini takip ederek gelişimini ölç.",
            },
            {
              icon: Crosshair,
              title: "Doğru Yaz",
              desc: "Hatalarını gör ve doğruluğunu artır.",
            },
            {
              icon: Trophy,
              title: "Rekorunu Kır",
              desc: "Her testte kendinden daha iyisini hedefle.",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.1 }}
              className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
            >
              <div className="rounded-xl bg-cyan-400/10 p-2.5 text-cyan-300">
                <item.icon size={19} />
              </div>
              <div>
                <h3 className="mb-1 text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs leading-5 text-slate-500">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-[10px] font-semibold tracking-[0.2em] text-slate-600">
          ZREAXERTOOLS • CYBER PERFORMANCE SYSTEM
        </p>
      </div>
    </main>
  );
}
