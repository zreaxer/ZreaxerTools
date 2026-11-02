import { useCallback, useMemo, useRef, useState } from "react";
import type { DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon, Upload, Download, X, SlidersHorizontal,
  Sparkles, ShieldCheck, FileImage, CheckCircle2, AlertCircle,
  RefreshCw, Layers3, ArrowDownToLine,
} from "lucide-react";

type OutputFormat = "original" | "image/jpeg" | "image/webp" | "image/png";

type CompressedImage = {
  id: string;
  file: File;
  previewUrl: string;
  outputUrl: string;
  outputName: string;
  outputType: string;
  originalSize: number;
  outputSize: number;
  width: number;
  height: number;
};

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
};

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function compressFile(file: File, quality: number, format: OutputFormat): Promise<CompressedImage> {
  return new Promise((resolve, reject) => {
    const previewUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Görsel işleme alanı oluşturulamadı.");

        // JPEG şeffaflığı desteklemez; beyaz zemin kullanılır.
        if (format === "image/jpeg") {
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
        context.drawImage(image, 0, 0);

        const outputType = format === "original"
          ? (["image/jpeg", "image/png", "image/webp"].includes(file.type) ? file.type : "image/jpeg")
          : format;

        canvas.toBlob((blob) => {
          if (!blob) {
            URL.revokeObjectURL(previewUrl);
            reject(new Error(`${file.name} sıkıştırılamadı.`));
            return;
          }

          const extension = outputType === "image/jpeg" ? "jpg" : outputType === "image/png" ? "png" : "webp";
          const stem = file.name.replace(/\.[^.]+$/, "") || "gorsel";

          resolve({
            id: makeId(),
            file,
            previewUrl,
            outputUrl: URL.createObjectURL(blob),
            outputName: `${stem}-zreaxer.${extension}`,
            outputType,
            originalSize: file.size,
            outputSize: blob.size,
            width: image.naturalWidth,
            height: image.naturalHeight,
          });
        }, outputType, outputType === "image/png" ? undefined : quality / 100);
      } catch (error) {
        URL.revokeObjectURL(previewUrl);
        reject(error instanceof Error ? error : new Error("Görsel işlenemedi."));
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      reject(new Error(`${file.name} açılamadı. JPG, PNG veya WebP dosyası deneyin.`));
    };

    image.src = previewUrl;
  });
}

export default function ImageCompressor() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState(78);
  const [format, setFormat] = useState<OutputFormat>("original");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const totals = useMemo(() => {
    const original = items.reduce((sum, item) => sum + item.originalSize, 0);
    const output = items.reduce((sum, item) => sum + item.outputSize, 0);

    return {
      original,
      output,
      saved: Math.max(0, original - output),
      percent: original ? Math.max(0, (1 - output / original) * 100) : 0,
    };
  }, [items]);

  const addFiles = useCallback(async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (!files.length) return;

    setError("");

    const valid = files.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (valid.length !== files.length) {
      setError("Yalnızca JPG, PNG ve WebP dosyaları desteklenir. Desteklenmeyen dosyalar atlandı.");
    }

    if (!valid.length) return;

    setBusy(true);

    const results: CompressedImage[] = [];
    const failures: string[] = [];

    for (const file of valid) {
      try {
        results.push(await compressFile(file, quality, format));
      } catch (err) {
        failures.push(err instanceof Error ? err.message : "Bir dosya işlenemedi.");
      }
    }

    setItems((current) => [...current, ...results]);

    if (failures.length) {
      setError((current) => [current, ...failures].filter(Boolean).join(" "));
    }

    setBusy(false);
  }, [quality, format]);

  const removeItem = (id: string) => {
    setItems((current) => {
      const target = current.find((item) => item.id === id);

      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        URL.revokeObjectURL(target.outputUrl);
      }

      return current.filter((item) => item.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach((item) => {
      URL.revokeObjectURL(item.previewUrl);
      URL.revokeObjectURL(item.outputUrl);
    });

    setItems([]);
    setError("");
  };

  const downloadItem = (item: CompressedImage) => {
    const anchor = document.createElement("a");
    anchor.href = item.outputUrl;
    anchor.download = item.outputName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const downloadAll = () => {
    items.forEach((item, index) => {
      window.setTimeout(() => downloadItem(item), index * 180);
    });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    void addFiles(event.dataTransfer.files);
  };

  return (
    <main className="relative mx-auto min-h-[calc(100vh-80px)] max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">

      {/* Dekoratif detaylar */}
      <div className="pointer-events-none absolute right-6 top-12 hidden h-32 w-32 rotate-12 border border-[#a5a17c]/15 lg:block" />
      <div className="pointer-events-none absolute left-0 top-40 hidden h-24 w-24 rounded-full border border-[#b98268]/15 lg:block" />

      {/* Başlık */}
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative z-10 mx-auto mb-10 max-w-3xl text-center"
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#a5a17c]/25 bg-[#a5a17c]/[0.08] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#c0b995]">
          <Sparkles size={14} />
          Görsel Laboratuvarı / 01
        </div>

        <h1 className="text-4xl font-black tracking-tight text-[#eeeae0] sm:text-5xl lg:text-6xl">
          Görselini hafiflet,{" "}
          <span className="text-[#a5a17c]">kalitesini koru.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#aaa397] sm:text-base">
          Fotoğraflarını saniyeler içinde sıkıştır. Dosyaların cihazından ayrılmaz; işlem doğrudan tarayıcında gerçekleşir.
        </p>
      </motion.header>

      <section className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">

        {/* Sol alan */}
        <div className="min-w-0">

          {/* Dosya yükleme alanı */}
          <motion.div
            layout
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setDragging(false);
              }
            }}
            onDrop={handleDrop}
            className={`relative flex min-h-[290px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[28px] border-2 border-dashed px-6 py-10 text-center transition-all duration-300 ${
              dragging
                ? "border-[#a5a17c] bg-[#a5a17c]/[0.12]"
                : "border-[#615d50]/55 bg-[#292822]/75 hover:border-[#a5a17c]/65 hover:bg-[#302e27]"
            }`}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                inputRef.current?.click();
              }
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(event) => {
                if (event.target.files) {
                  void addFiles(event.target.files);
                }
                event.target.value = "";
              }}
            />

            <motion.div
              animate={{
                y: dragging ? -7 : [0, -5, 0],
                rotate: dragging ? -5 : [0, 2, 0],
              }}
              transition={
                dragging
                  ? { duration: 0.2 }
                  : { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-[25px] border border-[#a5a17c]/30 bg-[#a5a17c]/10 text-[#c0b995] shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
            >
              <Upload size={34} strokeWidth={1.7} />
            </motion.div>

            <h2 className="text-xl font-bold text-[#eeeae0] sm:text-2xl">
              Görsellerini buraya bırak
            </h2>

            <p className="mt-2 text-sm text-[#a39b8e]">
              veya dosyalarına göz atmak için tıkla
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["JPG", "PNG", "WEBP", "ÇOKLU YÜKLEME"].map((label) => (
                <span
                  key={label}
                  className="rounded-md border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-bold tracking-widest text-[#aaa397]"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="pointer-events-none absolute -bottom-20 -right-12 h-56 w-56 rounded-full border border-[#b98268]/10" />
            <div className="pointer-events-none absolute -bottom-14 -right-6 h-40 w-40 rounded-full border border-[#b98268]/10" />
          </motion.div>

          {/* Hata mesajı */}
          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#b98268]/25 bg-[#b98268]/10 p-3 text-sm text-[#d1a18a]">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* İşlenen görseller başlığı */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#d7d0c3]">
              <Layers3 size={17} className="text-[#a5a17c]" />
              İşlenen görseller

              <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-[#aaa397]">
                {items.length}
              </span>
            </div>

            {items.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={clearAll}
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-[#aabbb6] transition hover:border-[#b98268]/50 hover:text-[#d1a18a]"
                >
                  Tümünü Temizle
                </button>

                <button
                  onClick={downloadAll}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#a5a17c] px-3.5 py-2 text-xs font-extrabold text-[#211f1a] transition hover:bg-[#c9c3a0]"
                >
                  <Download size={14} />
                  Tümünü İndir
                </button>
              </div>
            )}
          </div>

          {/* Görsel listesi */}
          <AnimatePresence mode="popLayout">
            {items.map((item) => {
              const saved = item.originalSize - item.outputSize;
              const percent = item.originalSize
                ? Math.max(0, (saved / item.originalSize) * 100)
                : 0;

              return (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="mt-4 grid gap-4 rounded-2xl border border-white/10 bg-[#24231f]/90 p-4 sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:items-center"
                >
                  <div className="flex h-24 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#1c1b18]">
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-[#eeeae0]">
                          {item.file.name}
                        </h3>

                        <p className="mt-1 text-xs text-[#999184]">
                          {item.width} × {item.height} px ·{" "}
                          {item.outputType.split("/")[1].toUpperCase()}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full border border-[#a5a17c]/25 bg-[#a5a17c]/10 px-2.5 py-1 text-[10px] font-extrabold text-[#c0b995]">
                        {percent > 0
                          ? `%${percent.toFixed(1)} tasarruf`
                          : "Boyut korundu"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="text-[#a39b8e]">
                        {formatBytes(item.originalSize)}
                      </span>

                      <ArrowDownToLine size={13} className="text-[#a5a17c]" />

                      <span className="font-bold text-[#e6e0d4]">
                        {formatBytes(item.outputSize)}
                      </span>

                      <span className={saved > 0 ? "text-[#c0b995]" : "text-[#edb18f]"}>
                        {saved > 0
                          ? `${formatBytes(saved)} küçüldü`
                          : "Daha fazla küçültülemedi"}
                      </span>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, percent)}%` }}
                        className="h-full rounded-full bg-[#a5a17c]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:flex-col">
                    <button
                      onClick={() => downloadItem(item)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#a5a17c] px-3 py-2.5 text-xs font-extrabold text-[#211f1a] transition hover:bg-[#c9c3a0] sm:flex-none"
                    >
                      <Download size={15} />
                      İndir
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label="Görseli kaldır"
                      className="rounded-lg border border-white/10 p-2.5 text-[#a39b8e] transition hover:border-[#b98268]/50 hover:text-[#b98268]"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>

          {/* Boş durum */}
          {items.length === 0 && !busy && (
            <div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-8 text-center">
              <FileImage size={27} className="mx-auto mb-3 text-[#8b846d]" />

              <p className="text-sm font-semibold text-[#b4c4be]">
                Henüz görsel eklemedin
              </p>

              <p className="mt-1 text-xs text-[#827b70]">
                Sıkıştırma sonuçların burada görünecek.
              </p>
            </div>
          )}

          {/* Yükleme durumu */}
          {busy && (
            <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl border border-[#a5a17c]/20 bg-[#a5a17c]/[0.06] p-5 text-sm font-semibold text-[#c0b995]">
              <RefreshCw size={17} className="animate-spin" />
              Görseller işleniyor...
            </div>
          )}
        </div>

        {/* Sağ ayarlar alanı */}
        <aside className="space-y-5">

          {/* Sıkıştırma ayarları */}
          <div className="rounded-[24px] border border-white/10 bg-[#24231f]/90 p-5">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal size={17} className="text-[#a5a17c]" />

              <h2 className="font-bold text-[#e8e3d8]">
                Sıkıştırma ayarları
              </h2>
            </div>

            {/* Kalite */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label
                  htmlFor="quality"
                  className="text-sm font-semibold text-[#bdcbc5]"
                >
                  Görsel kalitesi
                </label>

                <span className="rounded-md bg-[#a5a17c]/10 px-2.5 py-1 text-sm font-black tabular-nums text-[#c0b995]">
                  %{quality}
                </span>
              </div>

              <input
                id="quality"
                type="range"
                min="20"
                max="100"
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                className="w-full accent-[#a5a17c]"
              />

              <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-[#827b70]">
                <span>Daha küçük</span>
                <span>Daha kaliteli</span>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#999184]">
                Kalite ayarı yeni ekleyeceğin görsellere uygulanır. PNG formatında kalite kaydırıcısı kullanılmaz.
              </p>
            </div>

            <div className="my-5 h-px bg-white/10" />

            {/* Format */}
            <label
              htmlFor="format"
              className="mb-2 block text-sm font-semibold text-[#bdcbc5]"
            >
              Çıktı formatı
            </label>

            <select
              id="format"
              value={format}
              onChange={(event) => setFormat(event.target.value as OutputFormat)}
              className="w-full rounded-xl border border-white/10 bg-[#1c1b18] px-3 py-3 text-sm text-[#e6e0d4] outline-none transition focus:border-[#a5a17c]/60"
            >
              <option value="original">Orijinal formatı koru</option>
              <option value="image/webp">WebP — web için önerilir</option>
              <option value="image/jpeg">JPG — fotoğraflar</option>
              <option value="image/png">PNG — kayıpsız</option>
            </select>

            {/* Gizlilik */}
            <div className="mt-5 rounded-xl border border-[#b98268]/15 bg-[#b98268]/[0.06] p-3">
              <p className="flex items-center gap-2 text-xs font-bold text-[#c99b82]">
                <ShieldCheck size={15} />
                Gizlilik önceliği
              </p>

              <p className="mt-1.5 text-xs leading-5 text-[#a9958a]">
                Dosyaların herhangi bir sunucuya gönderilmez. Sıkıştırma bu cihazda yapılır.
              </p>
            </div>
          </div>

          {/* Toplam sonuç */}
          <div className="rounded-[24px] border border-[#a5a17c]/20 bg-gradient-to-br from-[#333127] to-[#24231f] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c0b995]">
              Toplam sonuç
            </p>

            <div className="mt-4">
              <p className="text-xs text-[#9db5ad]">
                Kazanılan alan
              </p>

              <p className="mt-1 text-3xl font-black tracking-tight text-[#f2f4ec]">
                {formatBytes(totals.saved)}
              </p>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-[#9db5ad]">
                  Genel tasarruf
                </p>

                <p className="mt-1 text-2xl font-black text-[#c0b995]">
                  %{totals.percent.toFixed(1)}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#a5a17c]/25 bg-[#a5a17c]/10 text-[#c0b995]">
                {totals.saved > 0
                  ? <CheckCircle2 size={27} />
                  : <ImageIcon size={27} />}
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-xs">
              <div className="flex justify-between text-[#9db5ad]">
                <span>Önce</span>
                <span>{formatBytes(totals.original)}</span>
              </div>

              <div className="flex justify-between font-bold text-[#e6e0d4]">
                <span>Sonra</span>
                <span>{formatBytes(totals.output)}</span>
              </div>
            </div>
          </div>

          <p className="px-1 text-[11px] leading-5 text-[#827b70]">
            Not: Sıkıştırma oranı görselin içeriğine ve formatına göre değişir. Bazı dosyalar zaten optimize edilmiş olabilir.
          </p>
        </aside>
      </section>
    </main>
  );
}