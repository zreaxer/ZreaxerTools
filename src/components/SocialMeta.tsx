
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PageMetadata {
  title: string;
  description: string;
}

const pageMetadata: Record<string, PageMetadata> = {
  "/": {
    title: "ZreaxerTools | Ücretsiz Online Araçlar",
    description:
      "QR kod oluştur, güçlü şifreler üret, hesaplamalar yap ve günlük işlerini kolaylaştıran ücretsiz çevrimiçi araçları keşfet.",
  },

  "/qr-code": {
    title: "QR Kod Oluşturucu | ZreaxerTools",
    description:
      "Ücretsiz QR kod oluşturucu ile bağlantılarını ve metinlerini kolayca QR koda dönüştür. Hızlı ve pratik şekilde kullan.",
  },

  "/password-generator": {
    title: "Şifre Oluşturucu | ZreaxerTools",
    description:
      "Güçlü ve güvenli şifreler oluştur. Şifre uzunluğunu ve karakter seçeneklerini belirleyerek ücretsiz şifre üret.",
  },

  "/keyboard-speed-test": {
    title: "Klavye Hız Testi | ZreaxerTools",
    description:
      "Yazma hızını ölç, dakikadaki kelime sayını öğren ve klavye becerilerini ücretsiz test et.",
  },

  "/color-palette": {
    title: "Renk Paleti Oluşturucu | ZreaxerTools",
    description:
      "Projelerin için uyumlu renk paletleri oluştur. Renkleri keşfet ve kendi paletini hazırla.",
  },

  "/wheel-spinner": {
    title: "Çarkıfelek | ZreaxerTools",
    description:
      "Seçeneklerini çarka ekle, çevir ve rastgele seçim yap. Ücretsiz çevrimiçi çarkıfelek aracı.",
  },

  "/percentage-calculator": {
    title: "Yüzde Hesaplama | ZreaxerTools",
    description:
      "Yüzde hesaplamalarını kolayca yap. İndirim, artış ve oran hesaplamaları için ücretsiz araç.",
  },

  "/pomodoro": {
    title: "Pomodoro Zamanlayıcı | ZreaxerTools",
    description:
      "Pomodoro tekniğiyle çalışma ve mola sürelerini düzenle. Zamanını daha verimli kullan.",
  },

  "/reaction-time-test": {
    title: "Tepki Süresi Testi | ZreaxerTools",
    description:
      "Tepki hızını test et ve reflekslerini ölç. Ücretsiz çevrimiçi reaksiyon testi.",
  },

  "/image-compressor": {
    title: "Görsel Sıkıştırma | ZreaxerTools",
    description:
      "Görsellerinin dosya boyutunu küçült. Daha az yer kaplayan görseller hazırla.",
  },
};

function setMeta(
  attribute: "name" | "property",
  key: string,
  content: string
) {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

export default function SocialMeta() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.replace(/\/+$/, "") || "/";

    const metadata = pageMetadata[path] ?? {
      title: "ZreaxerTools | Ücretsiz Online Araçlar",
      description:
        "ZreaxerTools ile günlük işlerini kolaylaştıran ücretsiz çevrimiçi araçları keşfet.",
    };

    const currentUrl = `${window.location.origin}${path}`;

    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "ZreaxerTools");
    setMeta("property", "og:title", metadata.title);
    setMeta("property", "og:description", metadata.description);
    setMeta("property", "og:url", currentUrl);

    setMeta("name", "twitter:card", "summary");
    setMeta("name", "twitter:title", metadata.title);
    setMeta("name", "twitter:description", metadata.description);
    setMeta("name", "twitter:url", currentUrl);
  }, [location.pathname]);

  return null;
}
