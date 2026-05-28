const phoneNumber = "15085629898";
const contactEmail = "bftfconstruction2023@gmail.com";
const galleryPhotoCount = 122;
const loaderImage = document.getElementById("loaderImage");
const loaderStartedAt = Date.now();
const loaderProgressDuration = 2450;
const loaderMinimumDuration = loaderProgressDuration;
const loaderFallbackDuration = loaderMinimumDuration;
document.body.classList.add("is-loading");

function getGalleryImagePath(index) {
  return `assets/optimized/gallery/photo-${String(index + 1).padStart(3, "0")}.webp`;
}

if (loaderImage) {
  const randomLoaderIndex = Math.floor(Math.random() * galleryPhotoCount);
  loaderImage.src = getGalleryImagePath(randomLoaderIndex);
}

const loader = document.getElementById("siteLoader");
let loaderHidden = false;

function hideLoader() {
  if (loaderHidden) return;
  loaderHidden = true;
  loader?.classList.add("is-hidden");
  document.body.classList.remove("is-loading");
}

function hideLoaderAfterMinimum() {
  const elapsed = Date.now() - loaderStartedAt;
  const remaining = Math.max(0, loaderMinimumDuration - elapsed);
  window.setTimeout(hideLoader, remaining);
}

if (document.readyState === "complete") {
  hideLoaderAfterMinimum();
} else {
  window.addEventListener("load", hideLoaderAfterMinimum);
}

window.setTimeout(hideLoader, loaderFallbackDuration);

const header = document.getElementById("siteHeader");
const scrollBar = document.getElementById("scrollBar");
const scrollMachine = document.getElementById("scrollMachine");
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

function updateScrollRig() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  const clamped = Math.max(0, Math.min(100, progress));

  if (scrollBar) scrollBar.style.width = `${clamped}%`;
  if (scrollMachine) scrollMachine.style.left = `${clamped}%`;
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
}

updateScrollRig();
window.addEventListener("scroll", updateScrollRig, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = mainNav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".main-nav a")];

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { rootMargin: "-42% 0px -52% 0px" }
);

sections.forEach((section) => activeObserver.observe(section));

const filterButtons = document.querySelectorAll(".filter-btn");
const galleryCards = document.querySelectorAll(".gallery-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    galleryCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const fullGalleryImages = Array.from({ length: galleryPhotoCount }, (_, index) => getGalleryImagePath(index));
const galleryCarouselTrack = document.getElementById("galleryCarouselTrack");
const galleryCarouselViewport = document.getElementById("galleryCarouselViewport");
const galleryLightbox = document.getElementById("galleryLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const galleryBatchSize = 24;
let fullGalleryOpened = false;
let galleryBatchStart = 0;

function openLightbox(src) {
  if (!galleryLightbox || !lightboxImage) return;
  lightboxImage.src = src;
  galleryLightbox.classList.add("is-open");
  galleryLightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  if (!galleryLightbox || !lightboxImage) return;
  galleryLightbox.classList.remove("is-open");
  galleryLightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}

function createGalleryButton(src, itemNumber, className, isClone = false) {
  const button = document.createElement("button");
  button.className = className;
  button.type = "button";
  button.draggable = false;
  button.setAttribute("aria-label", `Open project photo ${itemNumber}`);
  if (isClone) {
    button.tabIndex = -1;
  }
  button.innerHTML = `<img src="${src}" alt="BFTF Construction LLC project photo ${itemNumber}" loading="lazy" decoding="async" fetchpriority="low" draggable="false">`;
  button.addEventListener("dragstart", (event) => event.preventDefault());
  button.addEventListener("click", () => openLightbox(src));
  return button;
}

function getGalleryBatch() {
  return Array.from({ length: Math.min(galleryBatchSize, fullGalleryImages.length) }, (_, offset) => {
    const index = (galleryBatchStart + offset) % fullGalleryImages.length;
    return {
      index,
      src: fullGalleryImages[index]
    };
  });
}

function createGallerySet(images, isClone = false) {
  const set = document.createElement("div");
  set.className = "gallery-carousel-set";
  if (isClone) {
    set.setAttribute("aria-hidden", "true");
  }

  images.forEach(({ src, index }) => {
    set.appendChild(createGalleryButton(src, index + 1, "carousel-gallery-item", isClone));
  });

  return set;
}

function renderGalleryBatch() {
  if (!galleryCarouselTrack) return;
  const images = getGalleryBatch();
  galleryCarouselTrack.replaceChildren(createGallerySet(images, false), createGallerySet(images, true));
}

function rotateGalleryBatch() {
  galleryBatchStart = (galleryBatchStart + galleryBatchSize) % fullGalleryImages.length;
  renderGalleryBatch();
}

function openFullGallery() {
  if (fullGalleryOpened || !galleryCarouselTrack) return;
  fullGalleryOpened = true;
  renderGalleryBatch();
  galleryCarouselTrack.addEventListener("animationiteration", rotateGalleryBatch);
}

document.querySelectorAll('a[href="#gallery"]').forEach((link) => {
  link.addEventListener("click", openFullGallery);
});
if (window.location.hash === "#gallery") {
  openFullGallery();
}
window.addEventListener("hashchange", () => {
  if (window.location.hash === "#gallery") {
    openFullGallery();
  }
});

const gallerySection = document.getElementById("gallery");
if (gallerySection) {
  const galleryObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        openFullGallery();
        galleryObserver.disconnect();
      }
    },
    { threshold: 0.18 }
  );
  galleryObserver.observe(gallerySection);
}

if (gallerySection && galleryCarouselTrack && "IntersectionObserver" in window) {
  const galleryMotionObserver = new IntersectionObserver(
    (entries) => {
      galleryCarouselTrack.classList.toggle("is-paused", !entries.some((entry) => entry.isIntersecting));
    },
    { threshold: 0.05 }
  );
  galleryMotionObserver.observe(gallerySection);
}

if (galleryCarouselViewport && galleryCarouselTrack) {
  let isGalleryDragging = false;
  let didGalleryDrag = false;
  let shouldBlockGalleryClick = false;
  let galleryClickBlockTimer = 0;
  let galleryDragStartX = 0;
  let galleryDragStartScroll = 0;
  let galleryLastX = 0;
  let galleryLastTime = 0;
  let galleryVelocity = 0;
  let galleryMomentumFrame = 0;

  function stopGalleryMomentum() {
    if (!galleryMomentumFrame) return;
    window.cancelAnimationFrame(galleryMomentumFrame);
    galleryMomentumFrame = 0;
  }

  function startGalleryMomentum() {
    if (!didGalleryDrag || Math.abs(galleryVelocity) < 0.08) return;

    let velocity = galleryVelocity * 16;
    let previousTime = performance.now();
    const friction = 0.94;

    function step(time) {
      const elapsed = Math.min(32, time - previousTime);
      previousTime = time;
      galleryCarouselViewport.scrollLeft -= velocity * (elapsed / 16);
      velocity *= friction;

      if (Math.abs(velocity) < 0.35) {
        galleryMomentumFrame = 0;
        return;
      }

      galleryMomentumFrame = window.requestAnimationFrame(step);
    }

    galleryMomentumFrame = window.requestAnimationFrame(step);
  }

  function endGalleryDrag() {
    if (!isGalleryDragging) return;
    isGalleryDragging = false;
    shouldBlockGalleryClick = didGalleryDrag;
    galleryCarouselViewport.classList.remove("is-dragging");
    galleryCarouselTrack.classList.remove("is-user-dragging");
    startGalleryMomentum();

    window.clearTimeout(galleryClickBlockTimer);
    galleryClickBlockTimer = window.setTimeout(() => {
      shouldBlockGalleryClick = false;
    }, 250);
  }

  galleryCarouselViewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    stopGalleryMomentum();
    isGalleryDragging = true;
    didGalleryDrag = false;
    galleryVelocity = 0;
    galleryDragStartX = event.clientX;
    galleryDragStartScroll = galleryCarouselViewport.scrollLeft;
    galleryLastX = event.clientX;
    galleryLastTime = event.timeStamp || performance.now();
    galleryCarouselViewport.classList.add("is-dragging");
    galleryCarouselTrack.classList.add("is-user-dragging");
    galleryCarouselViewport.setPointerCapture?.(event.pointerId);
  });

  galleryCarouselViewport.addEventListener("pointermove", (event) => {
    if (!isGalleryDragging) return;
    const distance = event.clientX - galleryDragStartX;
    if (Math.abs(distance) > 4) {
      didGalleryDrag = true;
    }
    const time = event.timeStamp || performance.now();
    const elapsed = Math.max(16, time - galleryLastTime);
    galleryVelocity = (event.clientX - galleryLastX) / elapsed;
    galleryLastX = event.clientX;
    galleryLastTime = time;
    galleryCarouselViewport.scrollLeft = galleryDragStartScroll - distance;
    event.preventDefault();
  });

  galleryCarouselViewport.addEventListener("pointerup", endGalleryDrag);
  galleryCarouselViewport.addEventListener("pointercancel", endGalleryDrag);
  galleryCarouselViewport.addEventListener("pointerleave", endGalleryDrag);
  galleryCarouselViewport.addEventListener(
    "click",
    (event) => {
      if (!shouldBlockGalleryClick) return;
      event.preventDefault();
      event.stopPropagation();
      window.clearTimeout(galleryClickBlockTimer);
      shouldBlockGalleryClick = false;
    },
    true
  );

  galleryCarouselViewport.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });
}

lightboxClose?.addEventListener("click", closeLightbox);
galleryLightbox?.addEventListener("click", (event) => {
  if (event.target === galleryLightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

const galleryVideoFiles = [
  "assets/optimized/videos/whatsapp-video-2026-05-17-at-11-24-22-pm.mp4",
  "assets/optimized/videos/whatsapp-video-2026-05-17-at-11-24-21-pm.mp4",
  "assets/optimized/videos/whatsapp-video-2026-05-17-at-11-20-18-pm.mp4",
  "assets/optimized/videos/whatsapp-video-2026-05-17-at-11-24-19-pm.mp4",
  "assets/optimized/videos/whatsapp-video-2026-05-17-at-11-21-45-pm.mp4",
  "assets/optimized/videos/whatsapp-video-2026-05-17-at-11-21-33-pm.mp4",
  "assets/optimized/videos/whatsapp-video-2026-05-17-at-11-24-19-pm-1.mp4",
  "assets/optimized/videos/img-6672.mp4",
  "assets/optimized/videos/img-1172.mp4",
  "assets/optimized/videos/img-1171.mp4",
  "assets/optimized/videos/img-5943.mp4",
  "assets/optimized/videos/img-3576.mp4",
  "assets/optimized/videos/img-5216.mp4",
  "assets/optimized/videos/img-1775.mp4",
  "assets/optimized/videos/img-1935.mp4",
  "assets/optimized/videos/img-6674.mp4",
  "assets/optimized/videos/img-6673.mp4",
  "assets/optimized/videos/img-7357.mp4",
  "assets/optimized/videos/img-6675.mp4",
  "assets/optimized/videos/img-2265.mp4",
  "assets/optimized/videos/img-1273.mp4",
  "assets/optimized/videos/img-1951.mp4",
  "assets/optimized/videos/img-7323.mp4",
  "assets/optimized/videos/img-3968.mp4",
  "assets/optimized/videos/img-0685.mp4"
];
const galleryVideos = galleryVideoFiles.map((src, index) => ({
  src,
  title: `Project video ${index + 1}`
}));
const galleryVideoPlayer = document.getElementById("galleryVideoPlayer");
const videoPrev = document.getElementById("videoPrev");
const videoNext = document.getElementById("videoNext");
const videoSection = document.querySelector(".video-showcase");
let activeGalleryVideo = 0;
let videoCanAutoplay = !videoSection;
let hasLoadedGalleryVideo = false;

function applyVideoSoundPreference() {
  if (!galleryVideoPlayer) return;
  galleryVideoPlayer.muted = true;
  galleryVideoPlayer.defaultMuted = true;
  galleryVideoPlayer.volume = 0;
}

function playActiveGalleryVideo() {
  if (!galleryVideoPlayer || !hasLoadedGalleryVideo) return;
  if (document.hidden || !videoCanAutoplay) return;
  galleryVideoPlayer.play().catch(() => {});
}

function setGalleryVideo(index, shouldPlay = true) {
  if (!galleryVideoPlayer || !galleryVideos.length) return;
  activeGalleryVideo = (index + galleryVideos.length) % galleryVideos.length;
  const video = galleryVideos[activeGalleryVideo];
  if (galleryVideoPlayer.dataset.activeSrc !== video.src) {
    galleryVideoPlayer.src = encodeURI(video.src);
    galleryVideoPlayer.dataset.activeSrc = video.src;
  }
  galleryVideoPlayer.poster = "assets/optimized/images/hero-house.webp";
  galleryVideoPlayer.autoplay = true;
  galleryVideoPlayer.playsInline = true;
  galleryVideoPlayer.preload = "metadata";
  hasLoadedGalleryVideo = true;
  applyVideoSoundPreference();
  galleryVideoPlayer.load();

  if (shouldPlay) {
    playActiveGalleryVideo();
  }
}

function loadInitialGalleryVideo(shouldPlay = true) {
  if (!galleryVideoPlayer || !galleryVideos.length) return;
  if (!hasLoadedGalleryVideo) {
    setGalleryVideo(activeGalleryVideo, shouldPlay);
    return;
  }
  if (shouldPlay) {
    playActiveGalleryVideo();
  }
}

function changeGalleryVideo(direction) {
  setGalleryVideo(activeGalleryVideo + direction, true);
}

applyVideoSoundPreference();
videoCanAutoplay = !videoSection || videoSection.getBoundingClientRect().top < window.innerHeight;
if (galleryVideoPlayer) {
  galleryVideoPlayer.poster = "assets/optimized/images/hero-house.webp";
  galleryVideoPlayer.preload = "none";
}
if (videoCanAutoplay) {
  loadInitialGalleryVideo(true);
}
videoPrev?.addEventListener("click", () => changeGalleryVideo(-1));
videoNext?.addEventListener("click", () => changeGalleryVideo(1));
galleryVideoPlayer?.addEventListener("pointerdown", () => loadInitialGalleryVideo(true), { passive: true });
galleryVideoPlayer?.addEventListener("keydown", (event) => {
  if (event.key === " " || event.key === "Enter") {
    loadInitialGalleryVideo(true);
  }
});
galleryVideoPlayer?.addEventListener("ended", () => {
  if (hasLoadedGalleryVideo) {
    setGalleryVideo(activeGalleryVideo + 1, true);
  }
});

if (videoSection && galleryVideoPlayer && "IntersectionObserver" in window) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      videoCanAutoplay = entries.some((entry) => entry.isIntersecting);
      if (videoCanAutoplay) {
        loadInitialGalleryVideo(true);
      } else {
        galleryVideoPlayer.pause();
      }
    },
    { threshold: 0.18 }
  );
  videoObserver.observe(videoSection);
}

document.addEventListener("visibilitychange", () => {
  if (!galleryVideoPlayer) return;
  if (document.hidden) {
    galleryVideoPlayer.pause();
    return;
  }
  playActiveGalleryVideo();
});

const emailForm = document.getElementById("emailForm");
const formStatus = document.getElementById("formStatus");
const humanCheck = document.getElementById("humanCheck");
const holdVerify = document.getElementById("holdVerify");
const verifyText = document.getElementById("verifyText");
const verificationToken = document.getElementById("verificationToken");
const formReadyAt = Date.now() + 3500;
let isVerifiedHuman = false;
let holdStartedAt = 0;
let holdFrame = 0;

function setVerificationProgress(progress) {
  humanCheck?.style.setProperty("--verify-progress", `${Math.max(0, Math.min(100, progress))}%`);
}

function completeVerification() {
  isVerifiedHuman = true;
  window.cancelAnimationFrame(holdFrame);
  setVerificationProgress(100);
  humanCheck?.classList.add("is-verified");
  if (verificationToken) {
    verificationToken.value = `verified-${Date.now()}`;
  }
  if (verifyText) {
    verifyText.textContent = "Verified. You can send your request.";
  }
}

function resetVerification() {
  if (isVerifiedHuman) return;
  window.cancelAnimationFrame(holdFrame);
  holdStartedAt = 0;
  setVerificationProgress(0);
  if (verifyText) {
    verifyText.textContent = "Press and hold the shield to verify.";
  }
}

function updateHoldProgress() {
  if (!holdStartedAt || isVerifiedHuman) return;
  const elapsed = Date.now() - holdStartedAt;
  const progress = (elapsed / 950) * 100;
  setVerificationProgress(progress);

  if (progress >= 100) {
    completeVerification();
    return;
  }

  holdFrame = window.requestAnimationFrame(updateHoldProgress);
}

function startVerificationHold(event) {
  event.preventDefault();
  if (isVerifiedHuman) return;
  holdStartedAt = Date.now();
  if (verifyText) {
    verifyText.textContent = "Keep holding...";
  }
  updateHoldProgress();
}

holdVerify?.addEventListener("pointerdown", startVerificationHold);
holdVerify?.addEventListener("pointerup", resetVerification);
holdVerify?.addEventListener("pointerleave", resetVerification);
holdVerify?.addEventListener("pointercancel", resetVerification);

function setStatus(message, isSuccess = false) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.style.color = isSuccess ? "#17683a" : "#9b2c13";
}

function fieldValue(id) {
  return document.getElementById(id)?.value.trim() || "";
}

emailForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const honeypot = fieldValue("company");
  if (honeypot) return;

  const name = fieldValue("name");
  const email = fieldValue("email");
  const phone = fieldValue("phone");
  const service = fieldValue("service");
  const message = fieldValue("message");

  if (!name || !email || !service || !message) {
    setStatus("Please complete the required fields.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setStatus("Please enter a valid email address.");
    return;
  }

  if (Date.now() < formReadyAt) {
    setStatus("Please take a moment to complete the form before sending.");
    return;
  }

  if (!isVerifiedHuman || !verificationToken?.value) {
    setStatus("Please complete the human verification.");
    return;
  }

  const subject = `New ${service} request from ${name}`;
  const body = [
    "Hello BFTF Construction LLC,",
    "",
    "I would like to request more information about a project.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Service: ${service}`,
    "",
    "Project details:",
    message,
    "",
    "Sent from the BFTF Construction LLC website."
  ].join("\n");

  const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  setStatus("Verification complete. Opening your email app.", true);
  window.location.href = mailto;
});

document.querySelectorAll("a[href*='wa.me']").forEach((link) => {
  const url = new URL(link.href);
  if (!url.pathname.includes(phoneNumber)) {
    url.pathname = `/${phoneNumber}`;
    link.href = url.toString();
  }
});

const assistantWidget = document.getElementById("assistantWidget");
const assistantToggle = document.getElementById("assistantToggle");
const assistantClose = document.getElementById("assistantClose");
const assistantPanel = document.getElementById("assistantPanel");
const assistantMessages = document.getElementById("assistantMessages");
const assistantForm = document.getElementById("assistantForm");
const assistantInput = document.getElementById("assistantInput");

if (assistantWidget && assistantToggle && assistantPanel && assistantMessages && assistantForm && assistantInput) {
  const assistantWhatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    "Hello BFTF Construction LLC, I would like to request a free quote."
  )}`;

  const assistantCopy = {
    en: {
      botName: "BFTF Assistant",
      userName: "You",
      welcomeTitle: "How can I help?",
      welcomeText:
        "I can answer using BFTF Construction LLC service information and keep the conversation focused on the area you ask about.",
      welcomeItems: [
        "Roofing, siding and exterior work",
        "Kitchen, bathroom and interior remodeling",
        "Flooring, drywall, painting and carpentry",
        "Concrete, masonry, landscaping, electrical and plumbing"
      ],
      quoteRule:
        "For price, measurements, materials, permits or exact timing, BFTF should review the project first. The inspection and quote are free.",
      scopeRule:
        "I only use BFTF's listed service information here. For anything outside that scope, the best next step is to contact the team directly.",
      contactTitle: "Contact and quote",
      contactText:
        "BFTF serves residential and commercial clients in Massachusetts and Rhode Island. You can request a free inspection or quote by WhatsApp, phone or email.",
      contactItems: [
        "Phone: (508) 562-9898",
        "Email: bftfconstruction2023@gmail.com",
        "Location: Massachusetts and Rhode Island"
      ],
      cta: "Open WhatsApp",
      servicesTitle: "BFTF services",
      servicesText: "These are the main service areas listed for BFTF Construction LLC.",
      fallbackTitle: "I can help with BFTF services",
      fallbackText:
        "I did not find that exact topic in the company information. Ask me about one of these areas and I will stay focused on it.",
      thanksTitle: "Glad to help",
      thanksText: "Tell me the service area you are interested in and I will keep the answer focused there."
    },
    es: {
      botName: "Asistente BFTF",
      userName: "Tu",
      welcomeTitle: "Como puedo ayudar?",
      welcomeText:
        "Puedo responder usando la informacion de servicios de BFTF Construction LLC y mantener la conversacion enfocada en el area que preguntes.",
      welcomeItems: [
        "Roofing, siding y trabajo exterior",
        "Remodelacion de cocinas, banos e interiores",
        "Pisos, drywall, pintura y carpinteria",
        "Concreto, masonry, landscaping, electricidad y plomeria"
      ],
      quoteRule:
        "Para precio, medidas, materiales, permisos o tiempo exacto, BFTF debe revisar el proyecto primero. La inspeccion y cotizacion son gratis.",
      scopeRule:
        "Aqui solo uso la informacion de servicios de BFTF. Para algo fuera de ese alcance, lo mejor es contactar al equipo directamente.",
      contactTitle: "Contacto y cotizacion",
      contactText:
        "BFTF atiende clientes residenciales y comerciales en Massachusetts and Rhode Island. Puedes pedir una inspeccion o cotizacion gratis por WhatsApp, telefono o email.",
      contactItems: [
        "Telefono: (508) 562-9898",
        "Email: bftfconstruction2023@gmail.com",
        "Ubicacion: Massachusetts and Rhode Island"
      ],
      cta: "Abrir WhatsApp",
      servicesTitle: "Servicios de BFTF",
      servicesText: "Estas son las areas principales de servicio listadas para BFTF Construction LLC.",
      fallbackTitle: "Puedo ayudar con servicios de BFTF",
      fallbackText:
        "No encontre ese tema exacto en la informacion de la compania. Preguntame por una de estas areas y mantengo la respuesta enfocada.",
      thanksTitle: "Con gusto",
      thanksText: "Dime el area de servicio que te interesa y mantengo la respuesta enfocada."
    }
  };

  const assistantTopics = [
    {
      id: "roofing",
      title: { en: "Roofing Services", es: "Servicios de roofing / techo" },
      intro: {
        en: "For roofing, BFTF focuses on roof replacement, repairs, inspections and weather-related protection for residential and commercial properties.",
        es: "Para roofing o techos, BFTF se enfoca en reemplazos, reparaciones, inspecciones y proteccion contra danos del clima para propiedades residenciales y comerciales."
      },
      keywords: [
        "roof",
        "roofing",
        "techo",
        "tejado",
        "shingle",
        "shingles",
        "flat roof",
        "rubber roof",
        "epdm",
        "metal roof",
        "leak",
        "gotera",
        "filtracion",
        "flashing",
        "skylight",
        "storm damage",
        "solar panel"
      ],
      services: {
        en: [
          "Full roof replacement and roof repairs",
          "Asphalt shingle roofing and flat roofing systems",
          "EPDM rubber roofing",
          "Metal roofing",
          "Leak detection, flashing installation and skylight installation",
          "Roof inspections, storm damage repairs and insurance claim assistance",
          "Solar panel removal and reinstallation when roofing work requires it"
        ],
        es: [
          "Reemplazo completo de techo y reparaciones",
          "Asphalt shingles y sistemas de techo plano",
          "EPDM rubber roofing",
          "Metal roofing",
          "Deteccion de filtraciones, instalacion de flashing e instalacion de skylights",
          "Inspecciones de techo, reparaciones por tormenta y asistencia con reclamos de seguro",
          "Remocion y reinstalacion de paneles solares cuando el trabajo de techo lo requiere"
        ]
      }
    },
    {
      id: "siding",
      title: { en: "Siding and Exterior Services", es: "Siding y servicios exteriores" },
      intro: {
        en: "For exterior work, BFTF handles siding, trim, gutters, waterproofing and other improvements that protect and refresh the outside of the property.",
        es: "Para exteriores, BFTF trabaja siding, trim, gutters, waterproofing y mejoras que protegen y renuevan la parte exterior de la propiedad."
      },
      keywords: [
        "siding",
        "exterior",
        "vinyl",
        "hardie",
        "trim",
        "soffit",
        "fascia",
        "gutter",
        "gutters",
        "canaleta",
        "canaletas",
        "power washing",
        "waterproofing",
        "window",
        "door",
        "ventana",
        "puerta"
      ],
      services: {
        en: [
          "Vinyl siding installation and Hardie Board siding",
          "Exterior trim installation, soffit and fascia repairs",
          "Gutter installation and repairs",
          "Exterior painting, power washing and exterior waterproofing",
          "Window and door replacement"
        ],
        es: [
          "Instalacion de vinyl siding y Hardie Board siding",
          "Instalacion de exterior trim y reparaciones de soffit y fascia",
          "Instalacion y reparacion de gutters / canaletas",
          "Pintura exterior, power washing y exterior waterproofing",
          "Reemplazo de ventanas y puertas"
        ]
      }
    },
    {
      id: "kitchen",
      title: { en: "Kitchen Remodeling", es: "Remodelacion de cocinas" },
      intro: {
        en: "For kitchens, BFTF can coordinate the main parts of a renovation from layout upgrades through finish details.",
        es: "Para cocinas, BFTF puede coordinar las partes principales de una renovacion, desde mejoras de distribucion hasta detalles de acabado."
      },
      keywords: [
        "kitchen",
        "cocina",
        "cabinet",
        "cabinets",
        "gabinete",
        "countertop",
        "backsplash",
        "island",
        "isla",
        "open concept",
        "lighting",
        "plumbing upgrade"
      ],
      services: {
        en: [
          "Full kitchen renovations",
          "Cabinet installation, countertop installation and backsplash installation",
          "Kitchen island design and modern open-concept designs",
          "Flooring installation",
          "Lighting, electrical upgrades and plumbing upgrades"
        ],
        es: [
          "Remodelaciones completas de cocina",
          "Instalacion de gabinetes, countertops y backsplash",
          "Diseno de isla de cocina y conceptos abiertos modernos",
          "Instalacion de pisos",
          "Mejoras de iluminacion, electricidad y plomeria"
        ]
      }
    },
    {
      id: "bathroom",
      title: { en: "Bathroom Remodeling", es: "Remodelacion de banos" },
      intro: {
        en: "For bathrooms, BFTF covers full renovations, waterproofing and fixture upgrades with modern finish options.",
        es: "Para banos, BFTF cubre renovaciones completas, waterproofing y mejoras de fixtures con opciones de acabado modernas."
      },
      keywords: [
        "bathroom",
        "bath",
        "bano",
        "banos",
        "shower",
        "ducha",
        "tile",
        "vanity",
        "bathtub",
        "tub",
        "waterproofing",
        "fixture",
        "glass shower"
      ],
      services: {
        en: [
          "Full bathroom renovations",
          "Custom shower installation",
          "Tile wall and floor installation",
          "Vanity installation and bathtub installation",
          "Waterproofing systems, glass shower doors and plumbing or fixture upgrades"
        ],
        es: [
          "Remodelaciones completas de bano",
          "Instalacion de duchas personalizadas",
          "Instalacion de tile en paredes y pisos",
          "Instalacion de vanity y bathtub",
          "Sistemas de waterproofing, puertas de vidrio para ducha y mejoras de plomeria o fixtures"
        ]
      }
    },
    {
      id: "flooring",
      title: { en: "Flooring Services", es: "Servicios de pisos" },
      intro: {
        en: "For flooring, BFTF works with common residential and commercial surfaces, including repairs and leveling before the finish goes in.",
        es: "Para pisos, BFTF trabaja superficies comunes residenciales y comerciales, incluyendo reparaciones y nivelacion antes del acabado."
      },
      keywords: [
        "floor",
        "flooring",
        "piso",
        "pisos",
        "hardwood",
        "laminate",
        "vinyl",
        "tile",
        "epoxy",
        "leveling",
        "stair",
        "escalera"
      ],
      services: {
        en: [
          "Hardwood flooring, laminate flooring and vinyl flooring",
          "Tile installation and epoxy flooring",
          "Floor repairs and floor leveling",
          "Stair finishing"
        ],
        es: [
          "Hardwood flooring, laminate flooring y vinyl flooring",
          "Instalacion de tile y epoxy flooring",
          "Reparaciones y nivelacion de pisos",
          "Acabado de escaleras"
        ]
      }
    },
    {
      id: "drywallPainting",
      title: { en: "Drywall and Painting", es: "Drywall y pintura" },
      intro: {
        en: "For walls, ceilings and paint, BFTF can handle drywall installation, repair work and interior or exterior painting.",
        es: "Para paredes, techos interiores y pintura, BFTF puede trabajar drywall, reparaciones y pintura interior o exterior."
      },
      keywords: [
        "drywall",
        "sheetrock",
        "wall",
        "walls",
        "pared",
        "paredes",
        "ceiling",
        "ceilings",
        "cielo raso",
        "painting",
        "paint",
        "pintura",
        "texture",
        "taping",
        "water damage",
        "stain"
      ],
      services: {
        en: [
          "Drywall installation, sheetrock repairs and ceiling replacement",
          "Taping, finishing and texture matching",
          "Interior painting and exterior painting",
          "Water damage repairs, stain blocking and restoration"
        ],
        es: [
          "Instalacion de drywall, reparaciones de sheetrock y reemplazo de ceiling",
          "Taping, finishing y texture matching",
          "Pintura interior y exterior",
          "Reparaciones por dano de agua, stain blocking y restauracion"
        ]
      }
    },
    {
      id: "carpentry",
      title: { en: "Carpentry Services", es: "Carpinteria" },
      intro: {
        en: "For carpentry, BFTF covers structural and finish details that shape rooms, openings and outdoor living areas.",
        es: "Para carpinteria, BFTF cubre detalles estructurales y de acabado para espacios interiores, aperturas y areas exteriores."
      },
      keywords: [
        "carpentry",
        "carpinteria",
        "framing",
        "finish carpentry",
        "crown molding",
        "molding",
        "baseboard",
        "trim",
        "closet",
        "closets",
        "deck",
        "porch",
        "window framing"
      ],
      services: {
        en: [
          "Framing and finish carpentry",
          "Crown molding, baseboards and trim",
          "Custom closets",
          "Interior and exterior door installation",
          "Window framing, deck construction and porch construction"
        ],
        es: [
          "Framing y finish carpentry",
          "Crown molding, baseboards y trim",
          "Closets personalizados",
          "Instalacion de puertas interiores y exteriores",
          "Window framing, construccion de decks y porches"
        ]
      }
    },
    {
      id: "concrete",
      title: { en: "Concrete and Masonry", es: "Concreto y masonry" },
      intro: {
        en: "For concrete and masonry, BFTF works on hard surfaces, retaining structures and repair needs around the property.",
        es: "Para concreto y masonry, BFTF trabaja superficies, estructuras de contencion y reparaciones alrededor de la propiedad."
      },
      keywords: [
        "concrete",
        "concreto",
        "masonry",
        "slab",
        "driveway",
        "sidewalk",
        "patio",
        "retaining wall",
        "stairs",
        "brick",
        "stone",
        "foundation"
      ],
      services: {
        en: [
          "Concrete slabs",
          "Driveways",
          "Sidewalks",
          "Patios",
          "Retaining walls",
          "Concrete stairs",
          "Decorative concrete",
          "Brick and stone work",
          "Foundation repairs"
        ],
        es: [
          "Concrete slabs",
          "Driveways",
          "Sidewalks",
          "Patios",
          "Retaining walls",
          "Escaleras de concreto",
          "Decorative concrete",
          "Trabajos de brick y stone",
          "Reparaciones de foundation"
        ]
      }
    },
    {
      id: "landscaping",
      title: { en: "Landscaping and Outdoor Services", es: "Landscaping y exteriores" },
      intro: {
        en: "For outdoor areas, BFTF can support grading, drainage, lighting, fencing and surface improvements.",
        es: "Para areas exteriores, BFTF puede apoyar con nivelacion, drenaje, iluminacion, cercas y mejoras de superficie."
      },
      keywords: [
        "landscaping",
        "landscape",
        "yard",
        "patio",
        "outdoor",
        "jardin",
        "land leveling",
        "excavation",
        "synthetic grass",
        "sod",
        "outdoor lighting",
        "decorative stone",
        "fence",
        "drainage"
      ],
      services: {
        en: [
          "Land leveling and excavation",
          "Synthetic grass installation and sod installation",
          "Outdoor lighting and decorative stone installation",
          "Fence installation, drainage systems and retaining walls"
        ],
        es: [
          "Land leveling y excavation",
          "Instalacion de synthetic grass y sod",
          "Outdoor lighting e instalacion de decorative stone",
          "Instalacion de fences, drainage systems y retaining walls"
        ]
      }
    },
    {
      id: "electricalPlumbing",
      title: { en: "Electrical and Plumbing Services", es: "Electricidad y plomeria" },
      intro: {
        en: "For electrical and plumbing needs, BFTF lists practical installation, upgrade and repair services tied to remodels and property maintenance.",
        es: "Para electricidad y plomeria, BFTF lista servicios practicos de instalacion, mejoras y reparaciones conectadas a remodelaciones y mantenimiento."
      },
      keywords: [
        "electrical",
        "electric",
        "electricidad",
        "wiring",
        "outlet",
        "switch",
        "panel",
        "lighting",
        "plumbing",
        "plomeria",
        "water heater",
        "pipe",
        "pipes",
        "drain",
        "leak repair"
      ],
      services: {
        en: [
          "Outlet and switch installation",
          "Recessed lighting, electrical wiring, panel upgrades and exterior lighting",
          "Water heater installation",
          "Pipe repairs, leak repairs, bathroom and kitchen plumbing and drain repairs"
        ],
        es: [
          "Instalacion de outlets y switches",
          "Recessed lighting, electrical wiring, panel upgrades y exterior lighting",
          "Instalacion de water heaters",
          "Reparaciones de pipes, leak repairs, plomeria de bano/cocina y drain repairs"
        ]
      }
    },
    {
      id: "residentialCommercial",
      title: { en: "Residential and Commercial Services", es: "Servicios residenciales y comerciales" },
      intro: {
        en: "BFTF serves both homeowners and commercial clients with solutions sized to the project.",
        es: "BFTF atiende tanto a duenos de casa como a clientes comerciales con soluciones adaptadas al tamano del proyecto."
      },
      keywords: [
        "residential",
        "commercial",
        "residencial",
        "comercial",
        "office",
        "oficina",
        "retail",
        "property maintenance",
        "maintenance",
        "emergency",
        "repairs"
      ],
      services: {
        en: [
          "Residential construction",
          "Commercial renovations",
          "Office remodeling and retail construction",
          "Property maintenance",
          "Emergency repairs"
        ],
        es: [
          "Construccion residencial",
          "Renovaciones comerciales",
          "Remodelacion de oficinas y retail construction",
          "Property maintenance",
          "Emergency repairs"
        ]
      }
    },
    {
      id: "remodeling",
      title: { en: "Remodeling Focus", es: "Enfoque en remodelaciones" },
      intro: {
        en: "For remodeling, BFTF can focus on the area the client wants to improve and combine the needed trades into one coordinated scope.",
        es: "Para remodelaciones, BFTF puede enfocarse en el area que el cliente quiere mejorar y combinar los oficios necesarios en un solo alcance coordinado."
      },
      keywords: [
        "remodel",
        "remodeling",
        "renovation",
        "renovations",
        "renovate",
        "remodelacion",
        "remodelaciones",
        "remodelar",
        "renovacion",
        "renovaciones",
        "renovar",
        "home improvement",
        "interior",
        "interiores",
        "acabado",
        "acabados",
        "living room",
        "sala",
        "bedroom",
        "dormitorio"
      ],
      services: {
        en: [
          "Kitchen remodeling: cabinets, countertops, backsplash, islands, flooring, lighting, electrical and plumbing upgrades",
          "Bathroom remodeling: custom showers, tile walls and floors, vanities, bathtubs, waterproofing and fixture upgrades",
          "Interior surfaces: flooring, drywall, sheetrock, ceiling replacement, taping, finishing and texture matching",
          "Painting and restoration: interior paint, exterior paint, water damage repairs and stain blocking",
          "Carpentry and finishes: framing, trim, crown molding, baseboards, closets, doors, windows, decks and porches",
          "Commercial spaces: office remodeling, retail construction, property maintenance and emergency repairs"
        ],
        es: [
          "Cocinas: gabinetes, countertops, backsplash, islas, pisos, iluminacion, electricidad y plomeria",
          "Banos: duchas personalizadas, tile en paredes y pisos, vanities, bathtubs, waterproofing y fixtures",
          "Interiores: pisos, drywall, sheetrock, reemplazo de ceiling, taping, finishing y texture matching",
          "Pintura y restauracion: pintura interior/exterior, reparaciones por dano de agua y stain blocking",
          "Carpinteria y acabados: framing, trim, crown molding, baseboards, closets, puertas, ventanas, decks y porches",
          "Espacios comerciales: remodelacion de oficinas, retail construction, property maintenance y emergency repairs"
        ]
      }
    }
  ];

  const assistantServiceOverview = {
    en: [
      "Roofing Services",
      "Siding and Exterior Services",
      "Kitchen Remodeling",
      "Bathroom Remodeling",
      "Flooring Services",
      "Drywall and Painting",
      "Carpentry Services",
      "Concrete and Masonry",
      "Landscaping and Outdoor Services",
      "Electrical and Plumbing Services",
      "Residential and Commercial Services"
    ],
    es: [
      "Roofing / techos",
      "Siding y servicios exteriores",
      "Remodelacion de cocinas",
      "Remodelacion de banos",
      "Servicios de pisos",
      "Drywall y pintura",
      "Carpinteria",
      "Concreto y masonry",
      "Landscaping y exteriores",
      "Electricidad y plomeria",
      "Servicios residenciales y comerciales"
    ]
  };

  const spanishHints = [
    "hola",
    "quiero",
    "necesito",
    "cotizacion",
    "precio",
    "cuanto",
    "que",
    "incluye",
    "mas",
    "servicio",
    "servicios",
    "hacen",
    "techo",
    "cocina",
    "bano",
    "pisos",
    "pintura",
    "plomeria",
    "electricidad",
    "remodelacion",
    "gracias"
  ];

  const englishHints = [
    "hello",
    "hi",
    "need",
    "quote",
    "price",
    "cost",
    "service",
    "services",
    "roof",
    "kitchen",
    "bathroom",
    "flooring",
    "painting",
    "plumbing",
    "electrical",
    "remodel",
    "thanks"
  ];

  const priceOrTimeTerms = [
    "price",
    "pricing",
    "cost",
    "estimate",
    "quote",
    "how much",
    "timeline",
    "time",
    "schedule",
    "permit",
    "permits",
    "precio",
    "precios",
    "costo",
    "cuanto",
    "cotizacion",
    "estimado",
    "tiempo",
    "cuando",
    "permiso",
    "permisos"
  ];

  let activeAssistantTopic = null;
  let assistantHasWelcomed = false;
  let activeAssistantTypewriter = null;

  function normalizeAssistantText(value) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getAssistantLanguage(message = "") {
    const normalized = normalizeAssistantText(message);
    const spanishScore = spanishHints.reduce((total, hint) => total + (normalized.includes(hint) ? 1 : 0), 0);
    const englishScore = englishHints.reduce((total, hint) => total + (normalized.includes(hint) ? 1 : 0), 0);

    return spanishScore > englishScore ? "es" : "en";
  }

  function hasAnyTerm(normalized, terms) {
    return terms.some((term) => normalized.includes(term));
  }

  function isGreeting(normalized) {
    return /^(hi|hello|hey|hola|buenas|buenos dias|buenas tardes|buenas noches)$/.test(normalized);
  }

  function isThanks(normalized) {
    return /^(thanks|thank you|gracias|muchas gracias|ok gracias|perfecto gracias)$/.test(normalized);
  }

  function isServicesOverview(normalized) {
    return [
      "services",
      "service list",
      "what do you do",
      "what services",
      "servicios",
      "lista de servicios",
      "que servicios",
      "que hacen",
      "trabajos realizan"
    ].some((term) => normalized.includes(term));
  }

  function isContactQuestion(normalized) {
    return [
      "contact",
      "phone",
      "call",
      "email",
      "quote",
      "estimate",
      "price",
      "cost",
      "address",
      "location",
      "whatsapp",
      "inspection",
      "contacto",
      "telefono",
      "llamar",
      "correo",
      "cotizacion",
      "estimado",
      "precio",
      "costo",
      "direccion",
      "ubicacion",
      "inspeccion"
    ].some((term) => normalized.includes(term));
  }

  function isFollowUp(normalized) {
    return [
      "what includes",
      "what is included",
      "more details",
      "tell me more",
      "how does it work",
      "que incluye",
      "incluye",
      "mas detalles",
      "dime mas",
      "como funciona",
      "y eso",
      "tambien"
    ].some((term) => normalized.includes(term));
  }

  function findAssistantTopic(message) {
    const normalized = normalizeAssistantText(message);
    let bestTopic = null;
    let bestScore = 0;

    assistantTopics.forEach((topic) => {
      const score = topic.keywords.reduce((total, keyword) => {
        const normalizedKeyword = normalizeAssistantText(keyword);
        if (!normalizedKeyword || !normalized.includes(normalizedKeyword)) return total;
        return total + (normalizedKeyword.includes(" ") ? 3 : 2);
      }, 0);

      if (score > bestScore) {
        bestScore = score;
        bestTopic = topic;
      }
    });

    return bestScore > 0 ? bestTopic : null;
  }

  function buildWelcomeResponse(lang) {
    return {
      title: assistantCopy[lang].welcomeTitle,
      text: assistantCopy[lang].welcomeText,
      items: assistantCopy[lang].welcomeItems,
      note: assistantCopy[lang].quoteRule
    };
  }

  function buildContactResponse(lang) {
    return {
      title: assistantCopy[lang].contactTitle,
      text: assistantCopy[lang].contactText,
      items: assistantCopy[lang].contactItems,
      note: assistantCopy[lang].quoteRule,
      cta: { label: assistantCopy[lang].cta, href: assistantWhatsappUrl }
    };
  }

  function buildOverviewResponse(lang) {
    return {
      title: assistantCopy[lang].servicesTitle,
      text: assistantCopy[lang].servicesText,
      items: assistantServiceOverview[lang],
      note: assistantCopy[lang].scopeRule,
      cta: { label: assistantCopy[lang].cta, href: assistantWhatsappUrl }
    };
  }

  function buildTopicResponse(topic, lang, message) {
    const normalized = normalizeAssistantText(message);
    const needsQuoteRule = hasAnyTerm(normalized, priceOrTimeTerms);

    return {
      title: topic.title[lang],
      text: topic.intro[lang],
      items: topic.services[lang],
      note: needsQuoteRule ? assistantCopy[lang].quoteRule : assistantCopy[lang].scopeRule,
      cta: { label: assistantCopy[lang].cta, href: assistantWhatsappUrl }
    };
  }

  function buildFallbackResponse(lang) {
    return {
      title: assistantCopy[lang].fallbackTitle,
      text: assistantCopy[lang].fallbackText,
      items: assistantServiceOverview[lang],
      note: assistantCopy[lang].scopeRule
    };
  }

  function buildThanksResponse(lang) {
    return {
      title: assistantCopy[lang].thanksTitle,
      text: assistantCopy[lang].thanksText
    };
  }

  function getAssistantResponse(message) {
    const lang = getAssistantLanguage(message);
    const normalized = normalizeAssistantText(message);

    if (!normalized || isGreeting(normalized)) {
      return { lang, response: buildWelcomeResponse(lang) };
    }

    if (isThanks(normalized)) {
      return { lang, response: buildThanksResponse(lang) };
    }

    const detectedTopic = findAssistantTopic(message);
    if (detectedTopic) {
      activeAssistantTopic = detectedTopic;
      return { lang, response: buildTopicResponse(detectedTopic, lang, message) };
    }

    if (isServicesOverview(normalized)) {
      return { lang, response: buildOverviewResponse(lang) };
    }

    if (activeAssistantTopic && (isFollowUp(normalized) || hasAnyTerm(normalized, priceOrTimeTerms))) {
      return { lang, response: buildTopicResponse(activeAssistantTopic, lang, message) };
    }

    if (isContactQuestion(normalized)) {
      return { lang, response: buildContactResponse(lang) };
    }

    return { lang, response: buildFallbackResponse(lang) };
  }

  function clearAssistantTypewriter() {
    if (!activeAssistantTypewriter) return;
    activeAssistantTypewriter.finish();
    activeAssistantTypewriter = null;
  }

  function createAssistantTypewriter(article, segments, cta) {
    let timer = 0;
    let segmentIndex = 0;
    let characterIndex = 0;
    let isFinished = false;
    const chunkSize = 4;
    const typingDelay = 8;

    function keepAssistantScrolled() {
      assistantMessages.scrollTop = assistantMessages.scrollHeight;
    }

    function appendCta() {
      if (!cta || cta.link.isConnected) return;
      cta.container.appendChild(cta.link);
    }

    function finish() {
      if (isFinished) return;
      isFinished = true;
      window.clearTimeout(timer);
      segments.forEach(({ element, text }) => {
        element.textContent = text;
      });
      appendCta();
      article.classList.remove("is-typing");
      keepAssistantScrolled();
    }

    function typeNextChunk() {
      if (isFinished) return;

      const segment = segments[segmentIndex];
      if (!segment) {
        finish();
        activeAssistantTypewriter = null;
        return;
      }

      characterIndex = Math.min(segment.text.length, characterIndex + chunkSize);
      segment.element.textContent = segment.text.slice(0, characterIndex);
      keepAssistantScrolled();

      if (characterIndex >= segment.text.length) {
        segmentIndex += 1;
        characterIndex = 0;
        timer = window.setTimeout(typeNextChunk, 70);
        return;
      }

      timer = window.setTimeout(typeNextChunk, typingDelay);
    }

    return {
      finish,
      start() {
        timer = window.setTimeout(typeNextChunk, 110);
      }
    };
  }

  function appendAssistantMessage(role, message, lang = "en", options = {}) {
    const article = document.createElement("article");
    article.className = `assistant-message is-${role}`;

    const label = document.createElement("strong");
    label.textContent = role === "user" ? assistantCopy[lang].userName : assistantCopy[lang].botName;
    article.appendChild(label);

    if (role === "user") {
      const text = document.createElement("p");
      text.textContent = message;
      article.appendChild(text);
    } else {
      const shouldAnimate = Boolean(options.animate);
      const segments = [];

      function addBotTextElement(element, text) {
        article.appendChild(element);
        if (shouldAnimate) {
          segments.push({ element, text });
          return;
        }
        element.textContent = text;
      }

      if (message.title) {
        const title = document.createElement("p");
        addBotTextElement(title, message.title);
      }

      if (message.text) {
        const text = document.createElement("p");
        addBotTextElement(text, message.text);
      }

      if (message.items?.length) {
        const list = document.createElement("ul");
        message.items.forEach((item) => {
          const listItem = document.createElement("li");
          if (shouldAnimate) {
            segments.push({ element: listItem, text: item });
          } else {
            listItem.textContent = item;
          }
          list.appendChild(listItem);
        });
        article.appendChild(list);
      }

      if (message.note) {
        const note = document.createElement("p");
        note.className = "assistant-note";
        addBotTextElement(note, message.note);
      }

      let cta = null;
      if (message.cta) {
        const link = document.createElement("a");
        link.href = message.cta.href;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = message.cta.label;
        if (shouldAnimate) {
          cta = { container: article, link };
        } else {
          article.appendChild(link);
        }
      }

      if (shouldAnimate) {
        clearAssistantTypewriter();
        article.classList.add("is-typing");
        activeAssistantTypewriter = createAssistantTypewriter(article, segments, cta);
      }
    }

    assistantMessages.appendChild(article);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;

    if (role === "bot" && options.animate) {
      activeAssistantTypewriter?.start();
    }
  }

  function askAssistant(question) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;

    clearAssistantTypewriter();
    const lang = getAssistantLanguage(cleanQuestion);
    appendAssistantMessage("user", cleanQuestion, lang);
    const result = getAssistantResponse(cleanQuestion);
    window.setTimeout(() => appendAssistantMessage("bot", result.response, result.lang, { animate: true }), 160);
  }

  function openAssistant() {
    assistantWidget.classList.add("is-open");
    assistantToggle.setAttribute("aria-expanded", "true");
    assistantToggle.setAttribute("aria-label", "Close BFTF assistant");
    assistantPanel.setAttribute("aria-hidden", "false");

    if (!assistantHasWelcomed) {
      assistantHasWelcomed = true;
      appendAssistantMessage("bot", buildWelcomeResponse("en"), "en", { animate: true });
    }

    window.setTimeout(() => assistantInput.focus(), 80);
  }

  function closeAssistantPanel() {
    assistantWidget.classList.remove("is-open");
    assistantToggle.setAttribute("aria-expanded", "false");
    assistantToggle.setAttribute("aria-label", "Open BFTF assistant");
    assistantPanel.setAttribute("aria-hidden", "true");
  }

  assistantToggle.addEventListener("click", () => {
    if (assistantWidget.classList.contains("is-open")) {
      closeAssistantPanel();
      return;
    }

    openAssistant();
  });

  assistantClose?.addEventListener("click", closeAssistantPanel);

  assistantForm.addEventListener("submit", (event) => {
    event.preventDefault();
    askAssistant(assistantInput.value);
    assistantInput.value = "";
  });

  assistantPanel.querySelectorAll("[data-question]").forEach((button) => {
    button.addEventListener("click", () => {
      askAssistant(button.dataset.question || "");
      assistantInput.focus();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && assistantWidget.classList.contains("is-open")) {
      closeAssistantPanel();
    }
  });
}
