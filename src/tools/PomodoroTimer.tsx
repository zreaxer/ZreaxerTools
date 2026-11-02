import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlarmClock, ArrowRight, Coffee, Focus, Minus, Pause,
  Play, Plus, RotateCcw, Settings2, SkipForward, Volume2, VolumeX,
} from "lucide-react";

type Mode = "focus" | "shortBreak" | "longBreak";

const MODE_INFO: Record<Mode, { label: string; eyebrow: string; color: string; soft: string; icon: typeof Focus }> = {
  focus: { label: "Odaklanma", eyebrow: "DEEP WORK SESSION", color: "#a84e3c", soft: "#f1ddd2", icon: Focus },
  shortBreak: { label: "Kısa Mola", eyebrow: "TAKE A BREATH", color: "#66745a", soft: "#e1e7d9", icon: Coffee },
  longBreak: { label: "Uzun Mola", eyebrow: "SLOW DOWN", color: "#687b83", soft: "#dce5e6", icon: AlarmClock },
};

const INITIAL_MINUTES: Record<Mode, number> = { focus: 25, shortBreak: 5, longBreak: 15 };

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remaining = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
}

export default function PomodoroTimer() {
  const [durations, setDurations] = useState(INITIAL_MINUTES);
  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_MINUTES.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [task, setTask] = useState("");

  const info = MODE_INFO[mode];
  const totalSeconds = durations[mode] * 60;
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const circumference = 2 * Math.PI * 126;
  const ModeIcon = info.icon;

  const nextMode = (completed: boolean) => {
    if (mode === "focus") {
      if (completed) setCompletedSessions((count) => count + 1);
      const next = completed && (completedSessions + 1) % 4 === 0 ? "longBreak" : "shortBreak";
      setMode(next);
      setSecondsLeft(durations[next] * 60);
    } else {
      setMode("focus");
      setSecondsLeft(durations.focus * 60);
    }
    setIsRunning(false);
  };

  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft !== 0) return;
    if (soundEnabled && typeof window !== "undefined") {
      try {
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          const context = new AudioContextClass();
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.frequency.value = 660;
          gain.gain.value = 0.08;
          oscillator.start();
          oscillator.stop(context.currentTime + 0.35);
          oscillator.onended = () => void context.close();
        }
      } catch { /* Ses desteği yoksa zamanlayıcı çalışmaya devam eder. */ }
    }
    nextMode(true);
    // Timer completion is intentionally handled once when it reaches zero.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  useEffect(() => {
    document.title = `${formatTime(secondsLeft)} · ${info.label} | ZreaxerTools`;
    return () => { document.title = "ZreaxerTools"; };
  }, [secondsLeft, info.label]);

  const sessionDots = useMemo(() => Array.from({ length: 4 }, (_, index) => index < completedSessions % 4), [completedSessions]);

  const changeDuration = (target: Mode, amount: number) => {
    setDurations((current) => {
      const updated = { ...current, [target]: Math.min(90, Math.max(1, current[target] + amount)) };
      if (mode === target && !isRunning) setSecondsLeft(updated[target] * 60);
      return updated;
    });
  };

  const selectMode = (selected: Mode) => {
    setMode(selected);
    setSecondsLeft(durations[selected] * 60);
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(durations[mode] * 60);
  };

  return (
    <main className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-[#e9e2d5] px-4 py-10 text-[#292820] sm:px-6 sm:py-14">
      {/* Distinct editorial / analogue-clock backdrop: warm paper, ink and terracotta. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.23]" style={{ backgroundImage: "radial-gradient(#827a68 0.55px, transparent 0.55px)", backgroundSize: "6px 6px" }} />
        <div className="absolute -right-28 -top-36 h-[560px] w-[560px] rounded-full border border-[#9b5947]/20" />
        <div className="absolute -right-12 -top-20 h-[440px] w-[440px] rounded-full border border-[#9b5947]/15" />
        <div className="absolute -right-[-5rem] -top-4 h-[300px] w-[300px] rounded-full border border-dashed border-[#9b5947]/20" />
        <div className="absolute -bottom-48 -left-32 h-[560px] w-[560px] rotate-[-18deg] border border-[#596451]/20" />
        <div className="absolute bottom-[-9rem] left-[-5rem] h-[420px] w-[420px] rotate-[-18deg] border border-[#596451]/15" />
        <div className="absolute left-[8%] top-[16%] h-24 w-24 rotate-12 border border-[#a84e3c]/20" />
        <div className="absolute bottom-[18%] right-[9%] h-16 w-16 rotate-45 border border-[#66745a]/25" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#d9d0c1]/70 to-transparent" />
        <span className="absolute left-[5%] top-[8%] font-serif text-[10px] tracking-[0.4em] text-[#827a68]/60">TIME IS A MATERIAL</span>
        <span className="absolute bottom-[5%] right-[5%] font-serif text-[10px] tracking-[0.4em] text-[#827a68]/60">STUDIO Nº 025</span>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col justify-between gap-5 border-b border-[#37372e]/15 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[10px] font-black tracking-[0.28em] text-[#a84e3c]"><span className="h-px w-7 bg-[#a84e3c]" /> ZREAXERTOOLS / PRODUCTIVITY</p>
            <h1 className="font-serif text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Zamanını <em className="font-normal text-[#a84e3c]">tasarla.</em></h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#777365]">Dikkatini tek bir işe ver. Aralara nefes alacak küçük alanlar bırak.</p>
          </div>
          <div className="flex items-center gap-3 self-start border border-[#37372e]/15 bg-[#f4efe5]/70 px-4 py-3 sm:self-auto">
            <div className="flex h-9 w-9 items-center justify-center bg-[#a84e3c] text-[#fff8ed]"><AlarmClock size={18} /></div>
            <div><p className="text-[9px] font-bold tracking-[0.2em] text-[#8b8577]">BUGÜNÜN ODAĞI</p><p className="font-serif text-lg leading-5">Küçük adımlar.</p></div>
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
          <section className="relative overflow-hidden border border-[#39392f]/15 bg-[#f4efe5] shadow-[10px_12px_0_rgba(67,59,45,0.08)]">
            <div className="absolute left-0 top-0 h-1.5 w-full" style={{ backgroundColor: info.color }} />
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#39392f]/10 px-5 py-5 sm:px-8">
              <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.22em]" style={{ color: info.color }}><ModeIcon size={15} /> {info.eyebrow}</div>
              <button onClick={() => setShowSettings((value) => !value)} className="flex items-center gap-2 border border-[#39392f]/15 px-3 py-2 text-xs font-semibold text-[#777365] transition hover:border-[#a84e3c]/40 hover:text-[#a84e3c]"><Settings2 size={15} /> Süre ayarları</button>
            </div>

            <div className="px-5 pb-8 pt-8 sm:px-8 sm:pb-10">
              <div className="mb-8 flex flex-wrap justify-center gap-2">
                {(["focus", "shortBreak", "longBreak"] as Mode[]).map((item) => (
                  <button key={item} onClick={() => selectMode(item)} className={`border px-4 py-2.5 text-xs font-bold transition ${mode === item ? "border-[#292820] bg-[#292820] text-[#f4efe5]" : "border-[#39392f]/15 bg-transparent text-[#777365] hover:border-[#39392f]/40"}`}>{MODE_INFO[item].label}</button>
                ))}
              </div>

              <div className="relative mx-auto mb-7 flex h-[290px] w-[290px] items-center justify-center sm:h-[330px] sm:w-[330px]">
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 280 280" aria-hidden="true">
                  <circle cx="140" cy="140" r="126" fill="none" stroke="#ded6c8" strokeWidth="2" />
                  {Array.from({ length: 60 }, (_, index) => {
                    const angle = (index / 60) * Math.PI * 2;
                    const major = index % 5 === 0;
                    const x1 = 140 + Math.cos(angle) * (major ? 113 : 118);
                    const y1 = 140 + Math.sin(angle) * (major ? 113 : 118);
                    const x2 = 140 + Math.cos(angle) * 121;
                    const y2 = 140 + Math.sin(angle) * 121;
                    return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#827a68" strokeOpacity={major ? 0.65 : 0.28} strokeWidth={major ? 2 : 1} />;
                  })}
                  <circle cx="140" cy="140" r="126" fill="none" stroke={info.color} strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} style={{ transition: "stroke-dashoffset 0.5s linear" }} />
                </svg>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <span className="mb-2 text-[9px] font-black tracking-[0.32em] text-[#999180]">{isRunning ? "SESSION IN PROGRESS" : "READY WHEN YOU ARE"}</span>
                  <AnimatePresence mode="wait"><motion.div key={mode + secondsLeft} initial={{ opacity: 0.7, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="font-mono text-[4.2rem] font-medium leading-none tracking-[-0.09em] text-[#292820] sm:text-[5rem]">{formatTime(secondsLeft)}</motion.div></AnimatePresence>
                  <span className="mt-3 font-serif text-lg italic" style={{ color: info.color }}>{info.label}</span>
                </div>
              </div>

              <div className="mb-8 flex items-center justify-center gap-2">
                {sessionDots.map((done, index) => <span key={index} className={`h-2.5 w-8 transition-colors ${done ? "bg-[#a84e3c]" : "bg-[#d9d1c3]"}`} />)}
                <span className="ml-2 text-[10px] font-bold tracking-wider text-[#898273]">{completedSessions} TAMAMLANAN ODAK</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button onClick={reset} aria-label="Sıfırla" className="flex h-12 w-12 items-center justify-center border border-[#39392f]/20 text-[#777365] transition hover:border-[#a84e3c]/50 hover:text-[#a84e3c]"><RotateCcw size={17} /></button>
                <button onClick={() => setIsRunning((value) => !value)} className="flex min-w-[180px] items-center justify-center gap-3 px-8 py-4 text-sm font-bold text-[#fff8ed] shadow-[4px_4px_0_rgba(67,59,45,0.18)] transition hover:-translate-y-0.5" style={{ backgroundColor: info.color }}>{isRunning ? <><Pause size={17} fill="currentColor" /> Duraklat</> : <><Play size={17} fill="currentColor" /> Başlat</>}</button>
                <button onClick={() => nextMode(false)} aria-label="Sonraki aşama" className="flex h-12 w-12 items-center justify-center border border-[#39392f]/20 text-[#777365] transition hover:border-[#a84e3c]/50 hover:text-[#a84e3c]"><SkipForward size={17} /></button>
              </div>

              <AnimatePresence>
                {showSettings && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-8 overflow-hidden border-t border-[#39392f]/10 pt-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {(["focus", "shortBreak", "longBreak"] as Mode[]).map((item) => <div key={item} className="border border-[#39392f]/12 bg-[#ebe5d9] p-4">
                      <p className="mb-3 text-[10px] font-black tracking-wider text-[#777365]">{MODE_INFO[item].label.toUpperCase()}</p>
                      <div className="flex items-center justify-between"><button onClick={() => changeDuration(item, -1)} aria-label="Süreyi azalt" className="flex h-8 w-8 items-center justify-center border border-[#39392f]/15"><Minus size={13} /></button><span className="font-mono text-xl font-bold">{durations[item]}<small className="ml-1 text-[10px] font-sans text-[#898273]">dk</small></span><button onClick={() => changeDuration(item, 1)} aria-label="Süreyi artır" className="flex h-8 w-8 items-center justify-center border border-[#39392f]/15"><Plus size={13} /></button></div>
                    </div>)}
                  </div>
                </motion.div>}
              </AnimatePresence>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="border border-[#39392f]/15 bg-[#dcd4c5] p-6 shadow-[6px_7px_0_rgba(67,59,45,0.06)]">
              <p className="mb-4 text-[10px] font-black tracking-[0.24em] text-[#a84e3c]">02 / WORK NOTE</p>
              <label htmlFor="pomodoro-task" className="mb-2 block font-serif text-2xl">Şimdi neye odaklanıyoruz?</label>
              <textarea id="pomodoro-task" value={task} onChange={(event) => setTask(event.target.value)} placeholder="Örn. Proje tasarımını tamamla..." rows={3} className="w-full resize-none border border-[#39392f]/15 bg-[#f4efe5]/75 p-3 text-sm leading-6 text-[#292820] outline-none placeholder:text-[#aaa18f] focus:border-[#a84e3c]/60" />
              <p className="mt-3 text-[11px] leading-5 text-[#827a68]">Tek bir küçük hedef seç. Geri kalan her şeyi bir süreliğine beklemeye al.</p>
            </section>

            <section className="border border-[#39392f]/15 bg-[#f4efe5] p-6">
              <p className="mb-5 text-[10px] font-black tracking-[0.24em] text-[#a84e3c]">03 / SESSION FLOW</p>
              <div className="space-y-4">
                {[{ n: "01", title: "Odaklan", detail: `${durations.focus} dakika tek işe yoğunlaş.`, color: "#a84e3c" }, { n: "02", title: "Nefes al", detail: `${durations.shortBreak} dakika kısa mola ver.`, color: "#66745a" }, { n: "03", title: "Yeniden başla", detail: "Dört odak seansından sonra uzun mola.", color: "#687b83" }].map((item) => <div key={item.n} className="flex gap-3"><span className="font-mono text-xs font-bold" style={{ color: item.color }}>{item.n}</span><div><p className="text-sm font-bold">{item.title}</p><p className="mt-1 text-xs leading-5 text-[#898273]">{item.detail}</p></div></div>)}
              </div>
            </section>

            <div className="flex items-center justify-between border border-[#39392f]/15 bg-[#292820] px-5 py-4 text-[#f4efe5]">
              <div><p className="text-[9px] font-bold tracking-[0.2em] text-[#b8ad9a]">TIMER SOUND</p><p className="mt-1 text-xs">Süre bitiş uyarısı</p></div>
              <button onClick={() => setSoundEnabled((value) => !value)} aria-label={soundEnabled ? "Sesi kapat" : "Sesi aç"} className="flex h-9 w-9 items-center justify-center border border-white/15 transition hover:border-[#d18b70]">{soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}</button>
            </div>
          </aside>
        </div>

        <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#37372e]/15 pt-5 text-[10px] font-bold tracking-[0.18em] text-[#898273] sm:flex-row"><span>MAKE SPACE FOR WHAT MATTERS.</span><span className="flex items-center gap-2">ZREAXERTOOLS <ArrowRight size={12} /> FOCUS STUDIO</span></footer>
      </div>
    </main>
  );
}
