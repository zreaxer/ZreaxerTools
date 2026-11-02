
import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  Plus,
  Trash2,
  RotateCw,
  Trophy,
  X,
  RotateCcw,
  Compass,
  Clover,
  Star,
  Dice5,
  Leaf,
} from "lucide-react";

const initialOptions = [
  "Minecraft",
  "Valorant",
  "Roblox",
  "Fortnite",
  "CS2",
  "GTA 5",
];

// Sıcak, mücevher tonlarında masa oyunu paleti
const colors = [
  "#8f3d35", // kiremit
  "#b77b36", // eskitilmiş altın
  "#526b4b", // yosun yeşili
  "#344f5a", // petrol
  "#9a6658", // gül ağacı
  "#6f493d", // ceviz
  "#a28b5b", // pirinç
  "#59634a", // zeytin
  "#76566b", // mürdüm
  "#bd8e62", // bakır
];

const polarPoint = (angle: number, radius: number) => {
  const radians = (angle * Math.PI) / 180;

  return {
    x: 200 + radius * Math.cos(radians),
    y: 200 + radius * Math.sin(radians),
  };
};

export default function WheelSpinner() {
  const [options, setOptions] = useState(initialOptions);
  const [newOption, setNewOption] = useState("");
  const [winner, setWinner] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const controls = useAnimation();

  const addOption = () => {
    const value = newOption.trim();

    if (!value || options.length >= 20) return;

    setOptions((current) => [...current, value]);
    setNewOption("");
    setWinner("");
  };

  const removeOption = (index: number) => {
    setOptions((current) => current.filter((_, i) => i !== index));
    setWinner("");
  };

  const clearAll = () => {
    setOptions([]);
    setWinner("");
    setNewOption("");
  };

  const restoreOptions = () => {
    setOptions(initialOptions);
    setWinner("");
  };

  const spinWheel = async () => {
    if (options.length < 2 || spinning) return;

    setSpinning(true);
    setWinner("");

    const extraRotation = 1800 + Math.random() * 1800;
    const targetRotation = rotation + extraRotation;

    setRotation(targetRotation);

    await controls.start({
      rotate: targetRotation,
      transition: {
        duration: 5,
        ease: [0.12, 0.8, 0.15, 1],
      },
    });

    const normalizedRotation =
      ((targetRotation % 360) + 360) % 360;

    const anglePerOption = 360 / options.length;

    const selectedIndex = Math.floor(
      (((360 - normalizedRotation) % 360) / anglePerOption)
    );

    setWinner(options[selectedIndex] ?? options[0]);
    setSpinning(false);
  };

  const wheelSegments = options.map((option, index) => {
    const angle = 360 / options.length;
    const startAngle = -90 + index * angle;
    const endAngle = startAngle + angle;
    const middleAngle = startAngle + angle / 2;

    const start = polarPoint(startAngle, 180);
    const end = polarPoint(endAngle, 180);
    const label = polarPoint(middleAngle, 112);

    const largeArc = angle > 180 ? 1 : 0;

    const path = [
      "M 200 200",
      `L ${start.x} ${start.y}`,
      `A 180 180 0 ${largeArc} 1 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");

    return {
      option,
      index,
      path,
      label,
      middleAngle,
      color: colors[index % colors.length],
    };
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#211d18] px-4 py-12 text-[#f5ead7] sm:px-6">
      {/* Parşömen, ahşap ve eski masa oyunu atmosferi */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_12%,rgba(168,112,65,0.23),transparent_34%),radial-gradient(ellipse_at_82%_78%,rgba(91,105,68,0.2),transparent_36%),linear-gradient(135deg,#29231d_0%,#171a16_48%,#30251e_100%)]" />
        <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%270 0 180 180%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.8%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%27.45%27/%3E%3C/svg%3E')" }} />
        <div className="absolute left-[8%] top-24 h-72 w-72 rounded-full border border-[#c6a36d]/10" />
        <div className="absolute right-[7%] bottom-16 h-96 w-96 rounded-full border border-[#c6a36d]/10" />
        <motion.div className="absolute left-[12%] top-[28%] text-[#c49a62]/25" animate={{ y: [0, -18, 0], rotate: [0, 12, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}><Leaf size={42} /></motion.div>
        <motion.div className="absolute right-[13%] top-[19%] text-[#d8bd8c]/25" animate={{ y: [0, 14, 0], rotate: [0, -18, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}><Compass size={52} strokeWidth={1.2} /></motion.div>
        <motion.div className="absolute bottom-[18%] left-[22%] text-[#8d9a70]/30" animate={{ y: [0, -13, 0], rotate: [0, 16, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}><Clover size={34} /></motion.div>
        <motion.div className="absolute bottom-[24%] right-[18%] text-[#c49a62]/25" animate={{ y: [0, 16, 0], rotate: [0, -12, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}><Star size={28} /></motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b99762]/35 bg-[#8c7048]/20 px-5 py-2 text-sm font-bold tracking-wide text-[#d9c39a] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <Compass size={16} />
            TALİHİNİ YOKLA
          </div>

          <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-6xl">
            Çarkı{" "}
            <span className="font-serif italic text-[#c9a66e]">
              Çevir!
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-base font-medium text-[#b9ad9a] sm:text-lg">
            Seçimlerini masaya bırak, talih çarkının kararını gör.
          </p>
        </motion.div>

        {/* Ana alan */}
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_370px]">
          {/* Çark alanı */}
          <div className="flex min-w-0 flex-col items-center justify-center">
            <div className="relative flex w-full items-center justify-center">
              {/* Çarkın altında yumuşak masa gölgesi */}
              <div className="absolute h-[340px] w-[340px] rounded-full bg-[#a77b4d]/20 blur-[65px] sm:h-[490px] sm:w-[490px]" />

              {/* Pirinç işlemeli çark kasası */}
              <div className="relative w-full max-w-[520px]">
                <div className="absolute inset-[-15px] rounded-full border border-[#c6a36d]/35 shadow-[0_18px_45px_rgba(0,0,0,0.45)]" />
                <div className="absolute inset-[-7px] rounded-full border-[3px] border-[#71583b]" />

                <div className="relative rounded-full border-[10px] border-[#62482f] bg-[#2a2119] p-1 shadow-[0_18px_40px_rgba(0,0,0,0.55),inset_0_2px_8px_rgba(255,230,190,0.18)] sm:border-[13px]">
                  {/* Sabit gösterge */}
                  <div className="absolute left-1/2 top-[-17px] z-30 -translate-x-1/2">
                    <div className="h-0 w-0 border-x-[19px] border-t-[38px] border-x-transparent border-t-[#e2c58e] drop-shadow-[0_4px_3px_rgba(0,0,0,0.55)]" />
                  </div>

                  {/* Dönen SVG */}
                  <motion.div
                    animate={controls}
                    initial={{ rotate: 0 }}
                    className="relative aspect-square w-full overflow-hidden rounded-full"
                  >
                    {options.length > 0 ? (
                      <svg
                        viewBox="0 0 400 400"
                        className="h-full w-full"
                      >
                        {wheelSegments.map((segment) => {
                          const fontSize =
                            options.length > 12
                              ? 11
                              : options.length > 8
                              ? 13
                              : options.length > 5
                              ? 15
                              : 18;

                          const maxLength =
                            options.length > 12 ? 9 : 15;

                          const text =
                            segment.option.length > maxLength
                              ? segment.option.slice(0, maxLength - 1) + "…"
                              : segment.option;

                          return (
                            <g key={segment.index}>
                              <path
                                d={segment.path}
                                fill={segment.color}
                                stroke="#f1dfbd"
                                strokeWidth="2.5"
                                strokeOpacity="0.55"
                              />

                              <text
                                x={segment.label.x}
                                y={segment.label.y}
                                fill="#fff6e5"
                                fontSize={fontSize}
                                fontWeight="900"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                transform={`rotate(${segment.middleAngle}, ${segment.label.x}, ${segment.label.y})`}
                                style={{
                                  paintOrder: "stroke",
                                  stroke: "rgba(48,31,22,0.55)",
                                  strokeWidth: 2.5,
                                  letterSpacing: "0.3px",
                                }}
                              >
                                {text}
                              </text>
                            </g>
                          );
                        })}

                        <circle
                          cx="200"
                          cy="200"
                          r="29"
                          fill="#4b3827"
                          stroke="#e0c18a"
                          strokeWidth="5"
                        />
                        <circle
                          cx="200"
                          cy="200"
                          r="11"
                          fill="#d6b878"
                        />
                      </svg>
                    ) : (
                      <div className="flex aspect-square items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/[0.03] text-center">
                        <div>
                          <Compass className="mx-auto mb-3 text-[#c9a66e]" size={42} />
                          <p className="font-bold text-[#e6d6bd]">
                            Çark boş
                          </p>
                          <p className="mt-1 text-sm text-[#a99a83]">
                            Seçenek ekleyerek başla
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Döndür butonu */}
            <motion.button
              whileHover={{ scale: options.length >= 2 && !spinning ? 1.04 : 1 }}
              whileTap={{ scale: options.length >= 2 && !spinning ? 0.96 : 1 }}
              onClick={spinWheel}
              disabled={options.length < 2 || spinning}
              className="mt-12 flex items-center gap-3 rounded-2xl border border-[#e2c58e]/45 bg-gradient-to-b from-[#a87943] to-[#70472f] px-10 py-5 text-lg font-black tracking-wide text-[#fff4df] shadow-[0_8px_0_#493324,0_14px_28px_rgba(0,0,0,0.35)] transition hover:brightness-110 active:translate-y-1 active:shadow-[0_4px_0_#493324,0_8px_16px_rgba(0,0,0,0.3)] disabled:cursor-not-allowed disabled:opacity-40 sm:px-14 sm:text-xl"
            >
              <RotateCw
                size={24}
                className={spinning ? "animate-spin" : ""}
              />
              {spinning ? "ÇARK DÖNÜYOR..." : "ÇARKI DÖNDÜR"}
            </motion.button>

            {options.length < 2 && (
              <p className="mt-4 text-sm font-semibold text-[#d9b878]">
                Çarkı döndürmek için en az 2 seçenek eklemelisin.
              </p>
            )}

            {/* Kazanan */}
            {winner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="mt-8 w-full max-w-md rounded-3xl border border-[#c7a36a]/40 bg-[#473725]/85 p-6 text-center shadow-[0_16px_35px_rgba(0,0,0,0.3)]"
              >
                <Trophy className="mx-auto mb-3 text-[#dfbd7e]" size={42} />
                <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#dfbd7e]">
                  Kazanan
                </p>
                <h2 className="break-words font-serif text-3xl font-black text-[#fff1d8] sm:text-4xl">
                  {winner}
                </h2>
              </motion.div>
            )}
          </div>

          {/* Seçenek paneli */}
          <motion.aside
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full rounded-3xl border border-[#b99a6d]/25 bg-[#302920]/90 p-5 shadow-[0_22px_55px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-black text-[#f0e2ca]">Seçenekler</h2>
                <p className="mt-1 text-sm font-medium text-[#aa9b84]">
                  {options.length}/20 seçenek
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#c4a16b]/30 bg-[#8a6841]/20 text-[#d5b77d]">
                <Dice5 size={22} />
              </div>
            </div>

            {/* Yeni seçenek */}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                addOption();
              }}
              className="mb-5 flex gap-2"
            >
              <input
                value={newOption}
                onChange={(event) => setNewOption(event.target.value)}
                placeholder="Yeni seçenek yaz..."
                maxLength={35}
                className="min-w-0 flex-1 rounded-xl border border-[#b99a6d]/25 bg-[#1c1915] px-4 py-3 text-sm font-semibold text-[#f3e5ce] outline-none transition placeholder:font-medium placeholder:text-[#81735f] focus:border-[#c5a36d]/70"
              />

              <button
                type="submit"
                disabled={!newOption.trim() || options.length >= 20}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e0c28e]/30 bg-[#87603c] text-[#fff1d8] transition hover:bg-[#a47749] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Seçenek ekle"
              >
                <Plus size={23} />
              </button>
            </form>

            {/* Liste başlığı ve tümünü sil */}
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#aa9b84]">
                Seçenek Listesi
              </span>

              <button
                onClick={clearAll}
                disabled={options.length === 0 || spinning}
                className="flex items-center gap-1.5 rounded-lg border border-[#a45e4e]/35 bg-[#8d493d]/15 px-3 py-2 text-xs font-bold text-[#d99b88] transition hover:border-[#c17a65]/60 hover:bg-[#8d493d]/30 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Trash2 size={14} />
                Tümünü Sil
              </button>
            </div>

            {/* Seçenekler */}
            <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
              {options.length > 0 ? (
                options.map((option, index) => (
                  <motion.div
                    layout
                    key={`${option}-${index}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-3 rounded-xl border border-[#b99a6d]/15 bg-[#211d18]/75 px-3 py-3"
                  >
                    <span
                      className="h-4 w-4 shrink-0 rounded-full border border-[#f3dfbd]/35 shadow-inner"
                      style={{
                        backgroundColor: colors[index % colors.length],
                      }}
                    />

                    <span className="min-w-0 flex-1 break-words text-sm font-bold text-[#e8dac2]">
                      {option}
                    </span>

                    <button
                      onClick={() => removeOption(index)}
                      disabled={spinning}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#968873] transition hover:bg-[#8d493d]/20 hover:text-[#d99b88] disabled:opacity-30"
                      aria-label={`${option} seçeneğini sil`}
                    >
                      <X size={17} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#b99a6d]/25 px-4 py-10 text-center">
                  <Dice5 className="mx-auto mb-3 text-[#9d8969]" size={30} />
                  <p className="font-bold text-[#c7b99f]">
                    Henüz seçenek yok
                  </p>
                  <p className="mt-1 text-xs text-[#91836d]">
                    Yukarıdan yeni seçenek ekleyebilirsin.
                  </p>
                </div>
              )}
            </div>

            {/* Alt butonlar */}
            <div className="mt-5 border-t border-[#b99a6d]/20 pt-5">
              <button
                onClick={restoreOptions}
                disabled={spinning}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#b99a6d]/25 bg-[#44372a] px-4 py-3 text-sm font-bold text-[#e8dac2] transition hover:bg-[#57432f] disabled:opacity-40"
              >
                <RotateCcw size={16} />
                Örnek Seçenekleri Geri Yükle
              </button>

              <p className="mt-4 text-center text-xs font-medium text-[#94866f]">
                Tamamen ücretsiz · Rastgele seçim · API gerektirmez
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
