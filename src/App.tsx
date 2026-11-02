import React, {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  Search, Moon, Sun, Menu, X, QrCode, Keyboard, Lock,
  Palette, Percent, Timer, Image, Clock, RotateCw,
  ChevronRight, Zap, ShieldCheck, Sparkles, Heart,
  History, Command, Layers3, Home, ArrowLeft,
  Mail, FileText, Shield, AlertTriangle, LoaderCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

/* Araç bileşenleri */
const QRCodeTool = lazy(() => import("./tools/QRCodeTool"));
const PasswordGenerator = lazy(() => import("./tools/PasswordGenerator"));
const KeyboardSpeedTest = lazy(() => import("./tools/KeyboardSpeedTest"));
const ColorPaletteGenerator = lazy(() => import("./tools/ColorPaletteGenerator"));
const WheelSpinner = lazy(() => import("./tools/WheelSpinner"));
const PercentageCalculator = lazy(() => import("./tools/PercentageCalculator"));
const PomodoroTimer = lazy(() => import("./tools/PomodoroTimer"));
const ReactionTimeTest = lazy(() => import("./tools/ReactionTimeTest"));
const ImageCompressor = lazy(() => import("./tools/ImageCompressor"));

type Tool = {
  name: string;
  description: string;
  example: string;
  category: string;
  icon: LucideIcon;
  path: string;
  seoTitle: string;
  seoDescription: string;
};

const tools: Tool[] = [
  {
    name: "QR Kod Oluşturucu",
    description: "Metin ve bağlantılarından kolayca QR kod oluştur.",
    example: "Web sitesi bağlantını QR koda dönüştür.",
    category: "Üretkenlik",
    icon: QrCode,
    path: "/qr-code",
    seoTitle: "Ücretsiz QR Kod Oluşturucu | ZreaxerTools",
    seoDescription: "Metin, bağlantı ve diğer içeriklerin için hızlıca ücretsiz QR kod oluştur. QR kodunu kolayca indir.",
  },
  {
    name: "Klavye Hız Testi",
    description: "Dakikada kaç kelime yazabildiğini ölç.",
    example: "60 saniyede yazma hızını ve doğruluğunu test et.",
    category: "Test Araçları",
    icon: Keyboard,
    path: "/keyboard-speed-test",
    seoTitle: "Klavye Hız Testi – WPM Ölç | ZreaxerTools",
    seoDescription: "Ücretsiz klavye hız testiyle dakikadaki kelime sayını ve yazım doğruluğunu ölç.",
  },
  {
    name: "Şifre Oluşturucu",
    description: "Güçlü ve güvenli şifreler oluştur.",
    example: "Uzunluk ve karakter seçeneklerini belirleyerek şifre üret.",
    category: "Güvenlik",
    icon: Lock,
    path: "/password-generator",
    seoTitle: "Güçlü Şifre Oluşturucu | ZreaxerTools",
    seoDescription: "Ücretsiz ve güçlü rastgele şifreler oluştur. Şifre uzunluğunu ve karakter türlerini belirle.",
  },
  {
    name: "Renk Paleti Oluşturucu",
    description: "Projelerin için güzel renk kombinasyonları bul.",
    example: "Tasarımın için uyumlu renk kombinasyonları üret.",
    category: "Tasarım",
    icon: Palette,
    path: "/color-palette",
    seoTitle: "Renk Paleti Oluşturucu | ZreaxerTools",
    seoDescription: "Projelerin için renk kombinasyonları oluştur ve tasarımlarında kullanabileceğin renkleri keşfet.",
  },
  {
    name: "Yüzde Hesaplayıcı",
    description: "Yüzde ve oran hesaplamalarını kolayca yap.",
    example: "200 TL'nin yüzde 15'ini hesapla.",
    category: "Hesaplama",
    icon: Percent,
    path: "/percentage-calculator",
    seoTitle: "Ücretsiz Yüzde Hesaplayıcı | ZreaxerTools",
    seoDescription: "Yüzde hesaplama, artış ve azalış işlemlerini kolayca ve ücretsiz şekilde yap.",
  },
  {
    name: "Pomodoro Zamanlayıcı",
    description: "Çalışma ve mola sürelerini düzenle.",
    example: "25 dakika çalış, ardından kısa mola ver.",
    category: "Üretkenlik",
    icon: Timer,
    path: "/pomodoro",
    seoTitle: "Pomodoro Zamanlayıcı | ZreaxerTools",
    seoDescription: "Odaklanmanı artırmak için ücretsiz Pomodoro zamanlayıcısını kullan. Çalışma ve mola sürelerini düzenle.",
  },
  {
    name: "Görsel Sıkıştırıcı",
    description: "Görsellerinin dosya boyutunu küçült.",
    example: "Büyük bir fotoğrafı daha küçük boyuta sıkıştır.",
    category: "Tasarım",
    icon: Image,
    path: "/image-compressor",
    seoTitle: "Ücretsiz Görsel Sıkıştırıcı | ZreaxerTools",
    seoDescription: "Görsellerinin dosya boyutunu küçült. Ücretsiz online görsel sıkıştırma aracını kullan.",
  },
  {
    name: "Tepki Süresi Testi",
    description: "Reflekslerini ve tepki hızını test et.",
    example: "Ekran yeşile döndüğünde mümkün olduğunca hızlı tıkla.",
    category: "Test Araçları",
    icon: Clock,
    path: "/reaction-time-test",
    seoTitle: "Tepki Süresi Testi – Refleks Ölçer | ZreaxerTools",
    seoDescription: "Ücretsiz tepki süresi testiyle reflekslerini ölç ve tepki hızını milisaniye cinsinden öğren.",
  },
  {
    name: "Çark Çevirme",
    description: "Seçeneklerini ekle, çarkı döndür ve rastgele kazananı bul.",
    example: "Arkadaş grubun için rastgele bir kişi seç.",
    category: "Eğlence",
    icon: RotateCw,
    path: "/wheel-spinner",
    seoTitle: "Ücretsiz Online Çark Çevirme | ZreaxerTools",
    seoDescription: "Seçeneklerini ekle, online çarkı çevir ve rastgele bir sonuç belirle.",
  },
];

const categories = [
  "Tümü",
  "Üretkenlik",
  "Güvenlik",
  "Tasarım",
  "Hesaplama",
  "Test Araçları",
  "Eğlence",
];

const defaultSEO = {
  title: "ZreaxerTools – Ücretsiz Online Araçlar",
  description: "QR kod oluşturucu, şifre oluşturucu, klavye hız testi ve daha fazlası. Ücretsiz online araçlar tek bir yerde.",
};

function useSEO(title: string, description: string) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string) => {
      let element = document.querySelector<HTMLMetaElement>(
        `meta[name="${name}"]`
      );

      if (!element) {
        element = document.createElement("meta");
        element.name = name;
        document.head.appendChild(element);
      }

      element.content = content;
    };

    setMeta("description", description);
    setMeta("robots", "index, follow");
    setMeta("theme-color", "#0b0b0c");

    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = window.location.href.split("?")[0];

    return () => {
      document.title = defaultSEO.title;
    };
  }, [title, description]);
}

function LoadingScreen() {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4 bg-[#0b0b0c] text-white">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-red-500/20 border-t-red-500" />
        <LoaderCircle className="text-red-500" size={27} />
      </div>
      <p className="text-sm font-semibold text-zinc-400">
        ZreaxerTools yükleniyor...
      </p>
    </div>
  );
}

function HomeBrandLogo({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 text-left"
      aria-label="ZreaxerTools ana sayfa"
    >
      <span className="flex h-11 w-11 items-center justify-center border border-red-500/60 bg-red-500/10 text-3xl font-black italic text-red-500 shadow-[4px_4px_0_rgba(185,35,48,0.35)]">
        Z
      </span>
      <span className="flex flex-col leading-none">
        <span className="whitespace-nowrap text-lg font-black tracking-tight text-white sm:text-xl">
          ZREAXER<span className="text-red-500">TOOLS</span>
        </span>
        <span className="mt-1.5 text-[9px] font-bold tracking-[0.25em] text-zinc-500">
          TOOLS WITHOUT LIMITS
        </span>
      </span>
    </button>
  );
}

function PageNavigation() {
  const navigate = useNavigate();

  return (
    <nav className="relative z-20 border-b border-white/10 bg-[#090909]/85 px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <HomeBrandLogo onClick={() => navigate("/")} />
        <button
          onClick={() => navigate("/")}
          className="flex shrink-0 items-center gap-2 border border-white/10 px-3 py-2.5 text-sm text-zinc-300 transition hover:border-red-500/50 hover:text-white"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Ana Sayfaya Dön</span>
          <span className="sm:hidden">Ana Sayfa</span>
        </button>
      </div>
    </nav>
  );
}

function ToolPage({
  children,
  tool,
}: {
  children: React.ReactNode;
  tool: Tool;
}) {
  useSEO(tool.seoTitle, tool.seoDescription);

  return (
    <div className="min-h-screen overflow-hidden bg-[#0b0b0c] text-white">
      <PageNavigation />
      <Suspense fallback={<LoadingScreen />}>
        <div className="relative z-10">{children}</div>
      </Suspense>
    </div>
  );
}

function QRCodePage() {
  return <ToolPage tool={tools[0]}><QRCodeTool /></ToolPage>;
}
function KeyboardPage() {
  return <ToolPage tool={tools[1]}><KeyboardSpeedTest /></ToolPage>;
}
function PasswordPage() {
  return <ToolPage tool={tools[2]}><PasswordGenerator /></ToolPage>;
}
function ColorPalettePage() {
  return <ToolPage tool={tools[3]}><ColorPaletteGenerator /></ToolPage>;
}
function PercentagePage() {
  return <ToolPage tool={tools[4]}><PercentageCalculator /></ToolPage>;
}
function PomodoroPage() {
  return <ToolPage tool={tools[5]}><PomodoroTimer /></ToolPage>;
}
function ImageCompressorPage() {
  return <ToolPage tool={tools[6]}><ImageCompressor /></ToolPage>;
}
function ReactionTimePage() {
  return <ToolPage tool={tools[7]}><ReactionTimeTest /></ToolPage>;
}
function WheelPage() {
  return <ToolPage tool={tools[8]}><WheelSpinner /></ToolPage>;
}

function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  useSEO(`${title} | ZreaxerTools`, `${title} – ZreaxerTools hakkında bilgilendirme.`);
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#0b0b0c] text-white">
      <PageNavigation />
      <article className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 text-sm text-zinc-400 hover:text-red-400"
        >
          <ArrowLeft size={16} /> Ana sayfaya dön
        </button>
        <h1 className="mb-8 text-3xl font-black sm:text-4xl">{title}</h1>
        <div className="space-y-5 text-sm leading-7 text-zinc-400">
          {children}
        </div>
      </article>
    </main>
  );
}

function PrivacyPage() {
  return (
    <LegalLayout title="Gizlilik Politikası">
      <p>ZreaxerTools, kullanıcılarına ücretsiz online araçlar sunan bir platformdur.</p>
      <h2 className="text-lg font-bold text-white">Verilerin kullanımı</h2>
      <p>Araçlarımızın çoğu işlemi doğrudan tarayıcınızda gerçekleştirir. Girdiğiniz içerikler, ilgili aracın çalışma biçimine bağlı olarak cihazınızda işlenebilir.</p>
      <p>Favoriler ve son kullanılan araçlar gibi tercihler tarayıcınızın yerel depolama alanında saklanabilir. Tarayıcı verilerini temizleyerek bu kayıtları silebilirsiniz.</p>
      <h2 className="text-lg font-bold text-white">Üçüncü taraf hizmetler</h2>
      <p>Siteye ileride analiz, reklam veya üçüncü taraf hizmetleri eklenirse bu politika ilgili şekilde güncellenecektir.</p>
      <h2 className="text-lg font-bold text-white">İletişim</h2>
      <p>Gizlilik politikası hakkında sorularınız için İletişim sayfasını kullanabilirsiniz.</p>
      <p className="text-xs text-zinc-600">Son güncelleme: 2 Kasım 2026</p>
    </LegalLayout>
  );
}

function TermsPage() {
  return (
    <LegalLayout title="Kullanım Koşulları">
      <p>ZreaxerTools web sitesini kullanarak aşağıdaki koşulları kabul etmiş olursunuz.</p>
      <h2 className="text-lg font-bold text-white">Hizmetin kapsamı</h2>
      <p>ZreaxerTools, çeşitli dijital işlemleri kolaylaştırmak amacıyla ücretsiz online araçlar sunar. Araçlar mevcut halleriyle sağlanır ve zaman içinde değiştirilebilir.</p>
      <h2 className="text-lg font-bold text-white">Kullanıcı sorumluluğu</h2>
      <p>Siteyi yürürlükteki yasalara uygun kullanmak sizin sorumluluğunuzdadır. Araçları kötüye kullanmamalı veya başkalarının haklarını ihlal etmemelisiniz.</p>
      <h2 className="text-lg font-bold text-white">Garanti ve sorumluluk</h2>
      <p>Hesaplama ve dönüştürme sonuçlarını önemli kararlar vermeden önce kontrol etmelisiniz. Hizmetin kesintisiz veya hatasız olacağı garanti edilmez.</p>
      <h2 className="text-lg font-bold text-white">Değişiklikler</h2>
      <p>Bu koşullar gerektiğinde güncellenebilir. Güncel metin bu sayfada yayımlanır.</p>
      <p className="text-xs text-zinc-600">Son güncelleme: 2 Kasım 2026</p>
    </LegalLayout>
  );
}

function ContactPage() {
  return (
    <LegalLayout title="İletişim">
      <p>ZreaxerTools hakkında öneri, hata bildirimi veya destek taleplerin için bizimle iletişime geçebilirsin.</p>
      <div className="flex items-center gap-3 border border-white/10 bg-white/[0.03] p-5">
        <Mail className="shrink-0 text-red-500" />
        <div>
          <p className="font-bold text-white">E-posta</p>
          <p className="text-zinc-500">E-posta adresini buraya ekle.</p>
        </div>
      </div>
      <p className="text-xs text-zinc-600">Yayınlamadan önce yukarıdaki iletişim bilgisini gerçek e-posta adresinle değiştir.</p>
    </LegalLayout>
  );
}

function NotFoundPage() {
  useSEO("404 – Sayfa Bulunamadı | ZreaxerTools", "Aradığın sayfa bulunamadı. ZreaxerTools ana sayfasına dönebilirsin.");
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0b0b0c] px-5 text-center text-white">
      <p className="text-8xl font-black tracking-tighter text-red-500 sm:text-9xl">404</p>
      <h1 className="mt-5 text-2xl font-black">Sayfa bulunamadı</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">Aradığın sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.</p>
      <button
        onClick={() => navigate("/")}
        className="mt-8 flex items-center gap-2 bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-500"
      >
        <Home size={17} /> Ana sayfaya dön
      </button>
    </main>
  );
}

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("ZreaxerTools uygulama hatası:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#0b0b0c] px-5 text-center text-white">
          <AlertTriangle size={48} className="text-red-500" />
          <h1 className="mt-5 text-2xl font-black">Bir şeyler ters gitti</h1>
          <p className="mt-3 max-w-md text-sm text-zinc-500">Sayfa yüklenirken beklenmeyen bir hata oluştu. Sayfayı yenilemeyi deneyebilirsin.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-7 bg-red-600 px-6 py-3 text-sm font-bold hover:bg-red-500"
          >
            Sayfayı yenile
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

function HomePage() {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [activeView, setActiveView] = useState<"all" | "favorites">("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);

  useSEO(defaultSEO.title, defaultSEO.description);

  useEffect(() => {
    try {
      const savedFavorites = JSON.parse(localStorage.getItem("zreaxer-favorites") || "[]");
      const savedRecent = JSON.parse(localStorage.getItem("zreaxer-recent") || "[]");
      if (Array.isArray(savedFavorites)) setFavorites(savedFavorites.filter((item) => typeof item === "string"));
      if (Array.isArray(savedRecent)) setRecent(savedRecent.filter((item) => typeof item === "string"));
      const savedTheme = localStorage.getItem("zreaxer-theme");
      if (savedTheme === "light") setDarkMode(false);
    } catch {
      localStorage.removeItem("zreaxer-favorites");
      localStorage.removeItem("zreaxer-recent");
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem("zreaxer-favorites", JSON.stringify(favorites));
    localStorage.setItem("zreaxer-recent", JSON.stringify(recent));
    localStorage.setItem("zreaxer-theme", darkMode ? "dark" : "light");
  }, [favorites, recent, darkMode, storageReady]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      if (event.key === "Escape") {
        setMobileMenu(false);
        if (document.activeElement === searchInputRef.current) {
          setSearch("");
          searchInputRef.current?.blur();
        }
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const toggleFavorite = (tool: Tool) => {
    setFavorites((current) =>
      current.includes(tool.path)
        ? current.filter((item) => item !== tool.path)
        : [...current, tool.path]
    );
  };

  const openTool = (tool: Tool) => {
    setRecent((current) => [tool.path, ...current.filter((item) => item !== tool.path)].slice(0, 6));
    navigate(tool.path);
  };

  const filteredTools = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("tr-TR");
    return tools.filter((tool) => {
      const matchesSearch =
        !query ||
        tool.name.toLocaleLowerCase("tr-TR").includes(query) ||
        tool.description.toLocaleLowerCase("tr-TR").includes(query) ||
        tool.category.toLocaleLowerCase("tr-TR").includes(query);
      const matchesCategory = activeCategory === "Tümü" || tool.category === activeCategory;
      const matchesView = activeView === "all" || favorites.includes(tool.path);
      return matchesSearch && matchesCategory && matchesView;
    });
  }, [search, activeCategory, activeView, favorites]);

  const recentTools = recent
    .map((path) => tools.find((tool) => tool.path === path))
    .filter((tool): tool is Tool => Boolean(tool))
    .slice(0, 4);

  const pageBackground = darkMode ? "bg-[#0b0b0c] text-white" : "bg-[#f3f0ed] text-[#171313]";
  const cardBackground = darkMode
    ? "border-white/[0.09] bg-[#171719] hover:bg-[#201b1c]"
    : "border-black/10 bg-white hover:bg-[#fff8f7]";
  const mutedText = darkMode ? "text-zinc-400" : "text-zinc-600";

  return (
    <main className={`relative min-h-screen overflow-hidden ${pageBackground}`}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className={`absolute inset-0 ${darkMode ? "bg-[#0b0b0c]" : "bg-[#f3f0ed]"}`} />
        <div className={`absolute -right-[18%] -top-[24%] h-[78vh] w-[58vw] rotate-[-24deg] ${darkMode ? "bg-[#171112]" : "bg-[#e8dfdc]"}`} />
        <div className="absolute -right-[13%] top-[8%] h-[68vh] w-[34vw] min-w-[260px] rotate-[-24deg] bg-[#a51f2b] opacity-50" />
        <div className={`absolute inset-x-0 bottom-0 h-[45%] ${darkMode ? "bg-gradient-to-t from-[#0b0b0c] via-[#0b0b0c]/75 to-transparent" : "bg-gradient-to-t from-[#f3f0ed] via-[#f3f0ed]/70 to-transparent"}`} />
      </div>

      <div className="relative z-10">
        <nav className={`sticky top-0 z-50 border-b backdrop-blur-md ${darkMode ? "border-white/10 bg-[#0b0b0c]/90" : "border-black/10 bg-[#f3f0ed]/90"}`}>
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-5 sm:py-4">
            <HomeBrandLogo onClick={() => navigate("/")} />

            <div className="hidden items-center gap-6 md:flex">
              <a href="#tools" className={`text-sm transition hover:text-red-400 ${mutedText}`}>Araçlar</a>
              <a href="#about" className={`text-sm transition hover:text-red-400 ${mutedText}`}>Hakkımızda</a>
              <button
                onClick={() => {
                  setActiveView("favorites");
                  document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex items-center gap-2 text-sm transition hover:text-red-400 ${mutedText}`}
              >
                <Heart size={15} /> Favoriler
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-lg border border-white/10 p-2"
                aria-label="Tema değiştir"
              >
                {darkMode ? <Sun size={19} /> : <Moon size={19} />}
              </button>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-lg border border-white/10 p-2"
                aria-label="Tema değiştir"
              >
                {darkMode ? <Sun size={19} /> : <Moon size={19} />}
              </button>
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="rounded-lg border border-white/10 p-2"
                aria-label={mobileMenu ? "Menüyü kapat" : "Menüyü aç"}
                aria-expanded={mobileMenu}
              >
                {mobileMenu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {mobileMenu && (
            <div className="border-t border-white/10 px-5 py-4 md:hidden">
              <a href="#tools" onClick={() => setMobileMenu(false)} className="block py-3">Araçlar</a>
              <a href="#about" onClick={() => setMobileMenu(false)} className="block py-3">Hakkımızda</a>
              <button
                onClick={() => {
                  setActiveView("favorites");
                  setMobileMenu(false);
                  document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 py-3"
              >
                <Heart size={15} /> Favorilerim
              </button>
            </div>
          )}
        </nav>

        <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-16 sm:pt-20 lg:min-h-[650px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pt-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-7 inline-flex items-center gap-3 border-l-2 border-red-500 bg-red-500/[0.08] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-red-400 sm:text-xs">
              <span className="h-2 w-2 bg-red-500" />
              Tamamen Ücretsiz Online Araçlar
            </div>
            <h1 className="mb-6 text-4xl font-black leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-[5rem]">
              Dijital işlerin için{" "}
              <span className="text-[#e43b43]">güçlü araçlar</span>
            </h1>
            <p className={`mb-8 max-w-xl text-sm leading-7 sm:text-lg ${mutedText}`}>
              İhtiyacın olan pratik araçlar tek bir yerde. Hızlı, sade,
              güvenilir ve tamamen ücretsiz.
            </p>

            <div className={`flex max-w-xl items-center gap-3 border px-4 py-3.5 transition focus-within:border-red-500/70 ${darkMode ? "border-white/10 bg-[#171719]" : "border-black/10 bg-white"}`}>
              <Search className="shrink-0 text-red-500" size={21} />
              <input
                ref={searchInputRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Araç, kategori veya özellik ara..."
                aria-label="Araçlarda ara"
                className={`w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-zinc-500 ${darkMode ? "text-white" : "text-zinc-900"}`}
              />
              {search && (
                <button onClick={() => setSearch("")} aria-label="Aramayı temizle">
                  <X size={16} />
                </button>
              )}
              <kbd className="hidden items-center gap-1 border border-white/10 px-2 py-1 text-[11px] text-zinc-500 sm:inline-flex">
                <Command size={11} /> K
              </kbd>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <span className="flex items-center gap-2"><Zap size={15} className="text-red-500" /> Hızlı kullanım</span>
              <span className="flex items-center gap-2"><ShieldCheck size={15} className="text-red-500" /> Güvenli</span>
              <span className="flex items-center gap-2"><Sparkles size={15} className="text-red-500" /> Ücretsiz</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative mx-auto flex w-full max-w-[420px] items-center justify-center py-5"
          >
            <div className={`relative flex aspect-square w-[82%] items-center justify-center border ${darkMode ? "border-white/10 bg-[#141213]" : "border-black/10 bg-white"}`}>
              <motion.div
                className="absolute inset-[9%] border border-red-500/35"
                animate={{ rotate: 360 }}
                transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-[17%] border border-dashed border-white/10" />
              <motion.span
                className="select-none text-[clamp(130px,25vw,260px)] font-black italic leading-none tracking-[-0.12em] text-[#d52c38]"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                Z
              </motion.span>
              <span className="absolute bottom-[12%] left-[12%] text-[9px] font-black tracking-[0.3em] text-zinc-500">ZREAXER / 001</span>
            </div>
            <div className="absolute bottom-0 right-0 bg-[#b92330] px-4 py-2 text-[9px] font-black tracking-[0.18em] text-white sm:text-[10px]">
              ONE PLACE. ALL TOOLS.
            </div>
          </motion.div>
        </section>

        {recentTools.length > 0 && (
          <section className="mx-auto max-w-7xl px-5 pb-12">
            <div className="mb-5 flex items-center gap-2">
              <History size={17} className="text-red-500" />
              <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Son Kullandıkların</h2>
              <span className="text-xs text-zinc-500">/ Bu cihazda saklanır</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recentTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.path}
                    onClick={() => openTool(tool)}
                    className={`flex min-w-0 items-center gap-3 border p-4 text-left transition hover:-translate-y-0.5 hover:border-red-500/50 ${cardBackground}`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-red-500/20 bg-red-500/10 text-red-400"><Icon size={19} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{tool.name}</span>
                      <span className="mt-1 block text-xs text-zinc-500">{tool.category}</span>
                    </span>
                    <ChevronRight size={16} className="shrink-0 text-zinc-500" />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section id="tools" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-20">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-red-500">01 / Araç Kütüphanesi</p>
              <h2 className="text-3xl font-black tracking-tight">Tüm Araçlar</h2>
              <p className={`mt-2 text-sm ${mutedText}`}>İhtiyacına uygun aracı seç ve hemen kullan.</p>
            </div>
            <span className="text-sm text-zinc-500">{filteredTools.length} / {tools.length} araç</span>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveView("all")}
              className={`inline-flex items-center gap-2 border px-4 py-2.5 text-sm font-semibold transition ${activeView === "all" ? "border-red-600 bg-red-600 text-white" : "border-white/10 text-zinc-400"}`}
            >
              <Layers3 size={15} /> Tüm Araçlar
            </button>
            <button
              onClick={() => setActiveView("favorites")}
              className={`inline-flex items-center gap-2 border px-4 py-2.5 text-sm font-semibold transition ${activeView === "favorites" ? "border-red-600 bg-red-600 text-white" : "border-white/10 text-zinc-400"}`}
            >
              <Heart size={15} /> Favorilerim <span className="text-xs opacity-75">{favorites.length}</span>
            </button>
          </div>

          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">Kategoriler</div>
          <div className="mb-8 flex gap-2 overflow-x-auto pb-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 border px-4 py-2.5 text-sm font-semibold transition ${
                  activeCategory === category
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-red-500/50 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              const isFavorite = favorites.includes(tool.path);

              return (
                <motion.article
                  key={tool.path}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: (index % 4) * 0.04 }}
                  className={`tool-card group relative flex min-w-0 flex-col border p-5 ${cardBackground}`}
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center border border-red-500/25 bg-red-500/10 text-red-400">
                      <Icon size={23} />
                    </div>
                    <button
                      onClick={() => toggleFavorite(tool)}
                      aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
                      title={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
                      className={`rounded-lg border p-2 transition ${isFavorite ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-white/10 text-zinc-500 hover:border-red-500/40 hover:text-red-400"}`}
                    >
                      <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <span className="mb-2 inline-block text-xs font-bold uppercase tracking-wider text-red-400">{tool.category}</span>
                  <h3 className="mb-2 text-lg font-bold">{tool.name}</h3>
                  <p className="mb-4 min-h-10 text-sm leading-relaxed text-zinc-500">{tool.description}</p>
                  <div className="mb-5 border-l-2 border-red-500/50 bg-black/10 px-3 py-2 text-xs leading-5 text-zinc-500">
                    <span className="font-bold text-zinc-400">Örnek: </span>{tool.example}
                  </div>
                  <button
                    onClick={() => openTool(tool)}
                    className="mt-auto flex w-full items-center justify-between border border-white/10 bg-black/10 px-4 py-3 text-sm font-semibold transition hover:border-red-500/50 hover:bg-red-500/10"
                  >
                    <span>Aracı Kullan</span>
                    <ChevronRight size={17} className="text-red-500 transition group-hover:translate-x-1" />
                  </button>
                </motion.article>
              );
            })}
          </div>

          {filteredTools.length === 0 && (
            <div className="border border-white/10 py-16 text-center">
              <Search className="mx-auto mb-4 text-zinc-500" size={35} />
              <h3 className="text-lg font-semibold">{activeView === "favorites" && !search ? "Henüz favorin yok" : "Araç Bulunamadı"}</h3>
              <p className="mt-2 px-4 text-sm text-zinc-500">Arama kelimeni veya kategori seçimini değiştirmeyi deneyebilirsin.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("Tümü");
                  setActiveView("all");
                }}
                className="mt-5 border border-red-500/30 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </section>

        <section id="about" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-20">
          <div className="relative overflow-hidden border border-red-500/25 bg-[#151112] p-7 sm:p-12">
            <div className="absolute right-0 top-0 h-full w-2 bg-[#b92330]" />
            <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-red-500">02 / Hakkımızda</p>
            <h2 className="mb-4 text-2xl font-black sm:text-3xl">Daha Kolay. Daha Hızlı. Daha Verimli.</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              ZreaxerTools, günlük ihtiyaçlarını tek bir yerde karşılayabilmen için geliştirilen ücretsiz online araç platformudur. Amacımız kullanışlı araçları herkes için kolay erişilebilir hale getirmek.
            </p>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-[#090909] px-5 py-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
            <HomeBrandLogo onClick={() => navigate("/")} />
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-xs text-zinc-500">
              <Link className="hover:text-red-400" to="/gizlilik-politikasi"><Shield size={13} className="mr-1 inline" />Gizlilik</Link>
              <Link className="hover:text-red-400" to="/kullanim-kosullari"><FileText size={13} className="mr-1 inline" />Kullanım Koşulları</Link>
              <Link className="hover:text-red-400" to="/iletisim"><Mail size={13} className="mr-1 inline" />İletişim</Link>
            </div>
            <p className="text-xs text-zinc-500">© {new Date().getFullYear()} ZreaxerTools.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}

function RouteSEO() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <AppErrorBoundary>
      <RouteSEO />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/qr-code" element={<QRCodePage />} />
          <Route path="/password-generator" element={<PasswordPage />} />
          <Route path="/keyboard-speed-test" element={<KeyboardPage />} />
          <Route path="/color-palette" element={<ColorPalettePage />} />
          <Route path="/wheel-spinner" element={<WheelPage />} />
          <Route path="/percentage-calculator" element={<PercentagePage />} />
          <Route path="/pomodoro" element={<PomodoroPage />} />
          <Route path="/reaction-time-test" element={<ReactionTimePage />} />
          <Route path="/image-compressor" element={<ImageCompressorPage />} />
          <Route path="/gizlilik-politikasi" element={<PrivacyPage />} />
          <Route path="/kullanim-kosullari" element={<TermsPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppErrorBoundary>
  );
}