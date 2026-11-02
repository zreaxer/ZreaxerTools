
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  RefreshCw,
  ShieldCheck,
  Lock,
  Check,
  Eye,
  EyeOff,
  Fingerprint,
} from "lucide-react";

function secureRandomIndex(max: number) {
  const range = 0x100000000;
  const limit = Math.floor(range / max) * max;
  const random = new Uint32Array(1);

  do {
    crypto.getRandomValues(random);
  } while (random[0] >= limit);

  return random[0] % max;
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(true);

  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  function generatePassword() {
    let chars = "";
    const required: string[] = [];

    if (uppercase) {
      chars += upperChars;
      required.push(upperChars);
    }

    if (lowercase) {
      chars += lowerChars;
      required.push(lowerChars);
    }

    if (numbers) {
      chars += numberChars;
      required.push(numberChars);
    }

    if (symbols) {
      chars += symbolChars;
      required.push(symbolChars);
    }

    if (!chars) {
      setPassword("");
      return;
    }

    const result = required.map(
      (group) => group[secureRandomIndex(group.length)]
    );

    while (result.length < length) {
      result.push(chars[secureRandomIndex(chars.length)]);
    }

    for (let i = result.length - 1; i > 0; i--) {
      const j = secureRandomIndex(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }

    setPassword(result.join(""));
    setCopied(false);
    setVisible(true);
  }

  async function copyPassword() {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Kopyalama başarısız oldu. Şifreyi manuel olarak kopyalayabilirsin.");
    }
  }

  const selectedCount = [
    uppercase,
    lowercase,
    numbers,
    symbols,
  ].filter(Boolean).length;

  const strength =
    selectedCount === 4 && length >= 20
      ? "Çok Güçlü"
      : selectedCount >= 3 && length >= 14
      ? "Güçlü"
      : selectedCount >= 2 && length >= 10
      ? "Orta"
      : "Zayıf";

  const strengthColor =
    strength === "Çok Güçlü" || strength === "Güçlü"
      ? "bg-emerald-400"
      : strength === "Orta"
      ? "bg-yellow-400"
      : "bg-red-400";

  const strengthWidth =
    strength === "Çok Güçlü"
      ? "100%"
      : strength === "Güçlü"
      ? "75%"
      : strength === "Orta"
      ? "50%"
      : "25%";

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="mb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 inline-flex rounded-2xl bg-emerald-500/15 p-4 text-emerald-400"
        >
          <ShieldCheck size={34} />
        </motion.div>

        <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">
          Şifre Oluşturucu
        </h1>

        <p className="text-gray-400">
          Güçlü ve rastgele şifrelerini saniyeler içinde oluştur.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
            <Lock className="text-emerald-400" size={21} />
            Şifre Ayarları
          </h2>

          <div className="mb-7">
            <div className="mb-3 flex justify-between text-sm">
              <label className="text-gray-300">Şifre Uzunluğu</label>
              <span className="font-bold text-emerald-400">
                {length} karakter
              </span>
            </div>

            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />

            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>4 karakter</span>
              <span>64 karakter</span>
            </div>
          </div>

          <div className="mb-7 space-y-4">
            <p className="text-sm font-medium text-gray-300">
              Kullanılacak Karakterler
            </p>

            {[
              {
                label: "Büyük Harfler (A-Z)",
                value: uppercase,
                set: setUppercase,
              },
              {
                label: "Küçük Harfler (a-z)",
                value: lowercase,
                set: setLowercase,
              },
              {
                label: "Rakamlar (0-9)",
                value: numbers,
                set: setNumbers,
              },
              {
                label: "Özel Karakterler (!@#$)",
                value: symbols,
                set: setSymbols,
              },
            ].map((item) => (
              <label
                key={item.label}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/10 p-4 transition hover:border-emerald-500/40"
              >
                <span className="text-sm text-gray-300">
                  {item.label}
                </span>

                <input
                  type="checkbox"
                  checked={item.value}
                  onChange={(e) => item.set(e.target.checked)}
                  className="h-5 w-5 accent-emerald-500"
                />
              </label>
            ))}
          </div>

          <button
            onClick={generatePassword}
            disabled={selectedCount === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-4 font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshCw size={19} />
            Yeni Şifre Oluştur
          </button>
        </div>

        <div className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
            <Fingerprint className="text-emerald-400" size={21} />
            Oluşturulan Şifre
          </h2>

          <div className="mb-6 flex min-h-32 items-center rounded-2xl border border-emerald-500/20 bg-black/30 p-5">
            {password ? (
              <p className="w-full break-all font-mono text-lg leading-relaxed text-emerald-300">
                {visible ? password : "•".repeat(password.length)}
              </p>
            ) : (
              <p className="w-full text-center text-sm text-gray-500">
                Henüz bir şifre oluşturmadın.
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-400">Şifre Gücü</span>
              <span className="font-semibold text-emerald-400">
                {password ? strength : "Bekleniyor"}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className={`h-full rounded-full ${password ? strengthColor : ""}`}
                animate={{ width: password ? strengthWidth : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-3">
            <button
              onClick={() => setVisible(!visible)}
              disabled={!password}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm text-gray-300 transition hover:bg-white/10 disabled:opacity-40"
            >
              {visible ? <EyeOff size={17} /> : <Eye size={17} />}
              {visible ? "Gizle" : "Göster"}
            </button>

            <button
              onClick={copyPassword}
              disabled={!password}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}
              {copied ? "Kopyalandı!" : "Kopyala"}
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-gray-500">
            <ShieldCheck size={13} className="mr-1 inline text-emerald-400" />
            Şifreler cihazında oluşturulur, sunucuya gönderilmez.
          </p>
        </div>
      </div>
    </div>
  );
}
