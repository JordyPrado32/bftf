const phoneNumber = "15085629898";
const contactEmail = "bftfconstruction2023@gmail.com";
const loaderStartedAt = Date.now();
const loaderMinimumDuration = 1400;
const loaderFallbackDuration = 2600;
document.body.classList.add("is-loading");

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

const fullGalleryImages = Array.from({ length: 122 }, (_, index) => {
  return `assets/optimized/gallery/photo-${String(index + 1).padStart(3, "0")}.webp`;
});
const galleryCarouselTrack = document.getElementById("galleryCarouselTrack");
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
  button.setAttribute("aria-label", `Open project photo ${itemNumber}`);
  if (isClone) {
    button.tabIndex = -1;
  }
  button.innerHTML = `<img src="${src}" alt="BFTF Construction LLC project photo ${itemNumber}" loading="lazy" decoding="async" fetchpriority="low">`;
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

function applyVideoSoundPreference() {
  if (!galleryVideoPlayer) return;
  galleryVideoPlayer.muted = true;
  galleryVideoPlayer.defaultMuted = true;
  galleryVideoPlayer.volume = 0;
}

function playActiveGalleryVideo() {
  if (!galleryVideoPlayer) return;
  if (document.hidden || !videoCanAutoplay) return;
  galleryVideoPlayer.play().catch(() => {});
}

function setGalleryVideo(index, shouldPlay = true) {
  if (!galleryVideoPlayer || !galleryVideos.length) return;
  activeGalleryVideo = (index + galleryVideos.length) % galleryVideos.length;
  const video = galleryVideos[activeGalleryVideo];
  galleryVideoPlayer.src = encodeURI(video.src);
  galleryVideoPlayer.poster = "assets/optimized/images/hero-house.webp";
  galleryVideoPlayer.autoplay = true;
  galleryVideoPlayer.playsInline = true;
  applyVideoSoundPreference();
  galleryVideoPlayer.load();

  if (shouldPlay) {
    playActiveGalleryVideo();
  }
}

function changeGalleryVideo(direction) {
  setGalleryVideo(activeGalleryVideo + direction, true);
}

applyVideoSoundPreference();
videoCanAutoplay = !videoSection || videoSection.getBoundingClientRect().top < window.innerHeight;
setGalleryVideo(0, videoCanAutoplay);
videoPrev?.addEventListener("click", () => changeGalleryVideo(-1));
videoNext?.addEventListener("click", () => changeGalleryVideo(1));
galleryVideoPlayer?.addEventListener("ended", () => {
  setGalleryVideo(activeGalleryVideo + 1, true);
});

if (videoSection && galleryVideoPlayer && "IntersectionObserver" in window) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      videoCanAutoplay = entries.some((entry) => entry.isIntersecting);
      if (videoCanAutoplay) {
        playActiveGalleryVideo();
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
