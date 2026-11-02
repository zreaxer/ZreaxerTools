import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  Download,
  QrCode,
  RefreshCw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

export default function QRCodeTool() {
  const [text, setText] = useState("https://zreaxertools.com");
  const [size, setSize] = useState(300);
  const [foreground, setForeground] = useState("#20211f");
  const [background, setBackground] = useState("#f7f3ea");
  const [qrImage, setQrImage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;

    async function generateQR() {
      if (!text.trim()) {
        setQrImage("");
        setError("Lütfen bir metin veya bağlantı gir.");
        return;
      }

      try {
        const image = await QRCode.toDataURL(text, {
          width: size,
          margin: 2,
          color: {
            dark: foreground,
            light: background,
          },
        });

        if (active) {
          setQrImage(image);
          setError("");
        }
      } catch {
        if (active) {
          setError("QR kod oluşturulamadı.");
          setQrImage("");
        }
      }
    }

    generateQR();
    return () => {
      active = false;
    };
  }, [text, size, foreground, background]);

  function downloadQR() {
    if (!qrImage) return;
    const link = document.createElement("a");
    link.href = qrImage;
    link.download = "zreaxertools-qr-kodu.png";
    link.click();
  }

  async function copyText() {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setError("Panoya kopyalanamadı.");
    }
  }

  function resetSettings() {
    setText("https://zreaxertools.com");
    setSize(300);
    setForeground("#20211f");
    setBackground("#f7f3ea");
    setError("");
  }

  return (
    <main className="qr-studio relative min-h-screen overflow-hidden bg-[#f1ede3] px-4 py-10 text-[#20211f] sm:px-6 sm:py-14">
      <style>{`
        .qr-studio { isolation: isolate; }
        .qr-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.13'/%3E%3C/svg%3E");
        }
        .qr-orbit { animation: qrOrbit 48s linear infinite; transform-origin: center; }
        .qr-float { animation: qrFloat 8s ease-in-out infinite; }
        .qr-float-delay { animation: qrFloat 10s ease-in-out -3s infinite; }
        @keyframes qrOrbit { to { transform: rotate(360deg); } }
        @keyframes qrFloat { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-13px) rotate(3deg); } }
        .qr-grid-mark {
          background-image: linear-gradient(#292b26 1px, transparent 1px), linear-gradient(90deg, #292b26 1px, transparent 1px);
          background-size: 13px 13px;
        }
        .qr-studio ::selection { background: #c47a53; color: #fffaf1; }
      `}</style>

      <div className="qr-grain pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -right-32 -top-36 h-[34rem] w-[34rem] rounded-full border border-[#b66d4c]/25" />
      <div className="qr-orbit pointer-events-none absolute -right-20 -top-24 h-[30rem] w-[30rem] rounded-full border border-dashed border-[#b66d4c]/25" />
      <div className="pointer-events-none absolute -bottom-48 -left-36 h-[34rem] w-[34rem] rounded-full border-[1px] border-[#33352f]/15" />
      <div className="qr-float pointer-events-none absolute left-[5%] top-[19%] hidden h-24 w-24 rotate-12 border border-[#b66d4c]/35 p-2 md:block">
        <div className="qr-grid-mark h-full w-full opacity-30" />
      </div>
      <div className="qr-float-delay pointer-events-none absolute right-[7%] top-[57%] hidden h-16 w-16 -rotate-12 border border-[#292b26]/25 p-2 md:block">
        <div className="qr-grid-mark h-full w-full opacity-20" />
      </div>
      <div className="pointer-events-none absolute left-[12%] top-[72%] hidden h-3 w-3 rounded-full bg-[#b66d4c] md:block" />
      <div className="pointer-events-none absolute right-[18%] top-[20%] hidden h-2 w-2 rounded-full bg-[#b66d4c] md:block" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="mb-10 grid gap-8 border-b border-[#292b26]/20 pb-8 md:grid-cols-[1fr_auto] md:items-end"
        >
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#292b26]/20 bg-[#faf7ef]/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-[#8c573d]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b66d4c]" />
              ZREAXERTOOLS · DIGITAL PRINT LAB
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl">
              Bir bağlantı.
              <br />
              <span className="font-serif font-normal italic text-[#b66d4c]">Binlerce</span> tarama.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#65665e] sm:text-base">
              Bağlantılarını ve metinlerini saniyeler içinde, kendi tarzında QR kodlara dönüştür.
            </p>
          </div>

          <div className="hidden items-center gap-3 border-l border-[#292b26]/20 pl-6 md:flex">
            <div className="grid h-14 w-14 grid-cols-3 gap-1 rounded-xl border border-[#292b26]/15 bg-[#faf7ef] p-2">
              <span className="rounded-sm bg-[#252720]" /><span className="rounded-sm bg-[#252720]" /><span className="rounded-sm bg-[#252720]" />
              <span className="rounded-sm bg-[#252720]" /><span className="rounded-sm bg-[#b66d4c]" /><span className="rounded-sm bg-[#252720]" />
              <span className="rounded-sm bg-[#252720]" /><span className="rounded-sm bg-[#252720]" /><span className="rounded-sm bg-[#252720]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c573d]">Studio No. 01</p>
              <p className="mt-1 text-sm font-semibold">QR Collection</p>
            </div>
          </div>
        </motion.header>

        <div className="grid items-stretch gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.section
            initial={{ opacity: 0, x: -22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative overflow-hidden rounded-[2rem] border border-[#292b26]/15 bg-[#faf7ef] p-6 shadow-[0_24px_70px_rgba(42,39,31,0.08)] sm:p-8"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border-[22px] border-[#b66d4c]/10" />
            <div className="relative">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a36547]">01 / Customize</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight">Kodunu tasarla</h2>
                </div>
                <div className="rounded-2xl bg-[#252720] p-3 text-[#f1ede3]">
                  <ScanLine size={21} />
                </div>
              </div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#62635b]">
                Metin veya bağlantı
              </label>
              <div className="relative mb-7">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Bir bağlantı veya metin gir..."
                  className="min-h-32 w-full resize-y rounded-2xl border border-[#292b26]/15 bg-[#f1ede3] p-4 pr-12 text-sm leading-6 text-[#20211f] outline-none transition placeholder:text-[#99968d] focus:border-[#b66d4c] focus:ring-4 focus:ring-[#b66d4c]/10"
                />
                <button
                  onClick={copyText}
                  type="button"
                  title="Metni kopyala"
                  className="absolute right-3 top-3 rounded-lg border border-[#292b26]/10 bg-[#faf7ef] p-2 text-[#66675f] transition hover:border-[#b66d4c]/40 hover:text-[#a36547]"
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>

              <div className="mb-7">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#62635b]">Çözünürlük</label>
                  <span className="font-mono text-sm font-bold text-[#a36547]">{size} × {size}</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="600"
                  step="50"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#b66d4c]"
                />
                <div className="mt-1 flex justify-between text-[10px] text-[#99968d]">
                  <span>150 PX</span><span>600 PX</span>
                </div>
              </div>

              <div className="mb-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#292b26]/10 bg-[#f1ede3] p-4">
                  <label className="mb-3 block text-xs font-bold uppercase tracking-[0.1em] text-[#62635b]">Kod rengi</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={foreground}
                      onChange={(e) => setForeground(e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
                    />
                    <span className="font-mono text-xs text-[#62635b]">{foreground.toUpperCase()}</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-[#292b26]/10 bg-[#f1ede3] p-4">
                  <label className="mb-3 block text-xs font-bold uppercase tracking-[0.1em] text-[#62635b]">Zemin rengi</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
                    />
                    <span className="font-mono text-xs text-[#62635b]">{background.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={resetSettings}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#292b26]/20 bg-transparent py-3.5 text-sm font-semibold text-[#62635b] transition hover:border-[#b66d4c]/50 hover:bg-[#b66d4c]/5 hover:text-[#8c573d]"
              >
                <RefreshCw size={16} />
                Varsayılanlara Dön
              </button>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="relative flex flex-col overflow-hidden rounded-[2rem] bg-[#252720] p-6 text-[#f1ede3] shadow-[0_24px_70px_rgba(42,39,31,0.16)] sm:p-8"
          >
            <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full border border-[#d2a17e]/20" />
            <div className="pointer-events-none absolute -bottom-16 -right-12 h-56 w-56 rounded-full border border-dashed border-[#d2a17e]/20" />
            <div className="relative flex h-full flex-col">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#d2a17e]">02 / Preview</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight">Canlı önizleme</h2>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[#d2a17e]">
                  <QrCode size={21} />
                </div>
              </div>

              <div className="relative flex flex-1 flex-col items-center justify-center rounded-[1.6rem] border border-white/10 bg-[#191a16] px-5 py-8">
                <div className="absolute left-4 top-4 h-5 w-5 border-l border-t border-[#d2a17e]/60" />
                <div className="absolute right-4 top-4 h-5 w-5 border-r border-t border-[#d2a17e]/60" />
                <div className="absolute bottom-4 left-4 h-5 w-5 border-b border-l border-[#d2a17e]/60" />
                <div className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-[#d2a17e]/60" />

                {error ? (
                  <p className="max-w-xs py-16 text-center text-sm text-[#e5a18a]">{error}</p>
                ) : qrImage ? (
                  <motion.div
                    key={qrImage}
                    initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.35 }}
                    className="mb-5 rounded-2xl p-3 shadow-[0_18px_45px_rgba(0,0,0,0.25)]"
                    style={{ backgroundColor: background }}
                  >
                    <img
                      src={qrImage}
                      alt="Oluşturulan QR kod"
                      className="h-auto max-w-full"
                      style={{ width: "min(300px, 65vw)" }}
                    />
                  </motion.div>
                ) : null}

                <div className="mt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#aaa99f]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b66d4c]" />
                  Zreaxer scan-ready
                </div>
              </div>

              <button
                onClick={downloadQR}
                disabled={!qrImage}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[#c17a55] py-4 font-bold text-[#211f1a] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#d18b66] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download size={19} />
                PNG Olarak İndir
              </button>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#aaa99f]">
                <span className="flex items-center gap-1.5"><ShieldCheck size={13} /> Cihazında oluşturulur</span>
                <span className="flex items-center gap-1.5"><Sparkles size={13} /> Ücretsiz</span>
              </div>
            </div>
          </motion.section>
        </div>

        <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#292b26]/15 pt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#85847b] sm:flex-row">
          <span>ZREAXERTOOLS / QR STUDIO</span>
          <span>Designed for the details.</span>
        </footer>
      </div>
    </main>
  );
}
