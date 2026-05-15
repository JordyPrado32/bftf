const phoneNumber = "15085629898";
const contactEmail = "bftfconstruction2023@gmail.com";
const loaderImage = document.getElementById("loaderImage");
const loaderImages = [
  "assets/images/hero-house.jpg",
  "assets/images/exterior-build.jpg",
  "assets/images/roofing.jpg",
  "assets/images/roofing-work.jpg",
  "assets/images/kitchen.jpg",
  "assets/images/bathroom.jpg",
  "assets/images/framing.jpg",
  "assets/images/siding.jpg",
  "assets/images/basement.jpg",
  "assets/images/exterior-tall.jpg"
];

if (loaderImage) {
  loaderImage.src = loaderImages[Math.floor(Math.random() * loaderImages.length)];
}

document.body.classList.add("is-loading");

const loader = document.getElementById("siteLoader");
let loaderHidden = false;

function hideLoader() {
  if (loaderHidden) return;
  loaderHidden = true;
  loader?.classList.add("is-hidden");
  document.body.classList.remove("is-loading");
}

window.addEventListener("load", () => {
  window.setTimeout(hideLoader, 950);
});

window.setTimeout(hideLoader, 1800);

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
  return `assets/gallery/photo-${String(index + 1).padStart(3, "0")}.jpg`;
});
const galleryCarouselTrack = document.getElementById("galleryCarouselTrack");
const galleryCarouselViewport = document.getElementById("galleryCarouselViewport");
const galleryCount = document.getElementById("galleryCount");
const galleryLightbox = document.getElementById("galleryLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
let fullGalleryOpened = false;
let galleryAutoTimer = 0;

function updateGalleryCount() {
  if (!galleryCount) return;
  galleryCount.textContent = fullGalleryOpened
    ? `${fullGalleryImages.length} photos in automatic carousel`
    : `${fullGalleryImages.length} photos available`;
}

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

function createGalleryButton(src, itemNumber, className) {
  const button = document.createElement("button");
  button.className = className;
  button.type = "button";
  button.setAttribute("aria-label", `Open project photo ${itemNumber}`);
  button.innerHTML = `<img src="${src}" alt="BFTF Construction LLC project photo ${itemNumber}" loading="lazy">`;
  button.addEventListener("click", () => openLightbox(src));
  return button;
}

function galleryStep() {
  const firstItem = galleryCarouselTrack?.querySelector(".carousel-gallery-item");
  return firstItem ? firstItem.getBoundingClientRect().width + 14 : 320;
}

function scrollGallery(direction = 1) {
  if (!galleryCarouselViewport) return;
  const nearEnd =
    galleryCarouselViewport.scrollLeft + galleryCarouselViewport.clientWidth >=
    galleryCarouselViewport.scrollWidth - galleryStep() * 0.8;

  if (direction > 0 && nearEnd) {
    galleryCarouselViewport.scrollTo({ left: 0, behavior: "smooth" });
    return;
  }

  if (direction < 0 && galleryCarouselViewport.scrollLeft <= 4) {
    galleryCarouselViewport.scrollTo({ left: galleryCarouselViewport.scrollWidth, behavior: "smooth" });
    return;
  }

  galleryCarouselViewport.scrollBy({ left: galleryStep() * direction, behavior: "smooth" });
}

function startGalleryAutoplay() {
  if (galleryAutoTimer || !galleryCarouselViewport) return;
  galleryAutoTimer = window.setInterval(() => scrollGallery(1), 2600);
}

function stopGalleryAutoplay() {
  window.clearInterval(galleryAutoTimer);
  galleryAutoTimer = 0;
}

function openFullGallery() {
  if (fullGalleryOpened) return;
  fullGalleryOpened = true;

  fullGalleryImages.forEach((src, index) => {
    galleryCarouselTrack?.appendChild(createGalleryButton(src, index + 1, "carousel-gallery-item"));
  });

  updateGalleryCount();
  startGalleryAutoplay();
}

updateGalleryCount();
document.querySelectorAll('a[href="#gallery"]').forEach((link) => {
  link.addEventListener("click", openFullGallery);
});
if (window.location.hash === "#gallery") {
  openFullGallery();
}

galleryCarouselViewport?.addEventListener("mouseenter", stopGalleryAutoplay);
galleryCarouselViewport?.addEventListener("mouseleave", startGalleryAutoplay);
galleryCarouselViewport?.addEventListener("focusin", stopGalleryAutoplay);
galleryCarouselViewport?.addEventListener("focusout", startGalleryAutoplay);

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

lightboxClose?.addEventListener("click", closeLightbox);
galleryLightbox?.addEventListener("click", (event) => {
  if (event.target === galleryLightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

const videoSources = [
  "Imagenes/IMG_1951.MOV",
  "Imagenes/IMG_6675.MOV",
  "Imagenes/IMG_6676.MOV"
];
const videoAd = document.getElementById("videoAd");
const videoClose = document.getElementById("videoClose");
const videoAdPlayer = document.getElementById("videoAdPlayer");
let currentVideoIndex = -1;
let videoAdClosed = false;

function nextVideoIndex() {
  if (videoSources.length < 2) return 0;
  let next = currentVideoIndex;
  while (next === currentVideoIndex) {
    next = Math.floor(Math.random() * videoSources.length);
  }
  return next;
}

function playVideoAt(index) {
  if (!videoAd || !videoAdPlayer || !videoSources.length) return;
  if (videoAdClosed) return;
  currentVideoIndex = index;
  videoAdPlayer.src = videoSources[currentVideoIndex];
  videoAdPlayer.poster = "assets/images/hero-house.jpg";
  videoAd.classList.add("is-visible");
  videoAdPlayer.currentTime = 0;
  videoAdPlayer.play().catch(() => {
    videoAdPlayer.controls = true;
  });
}

function showRandomVideoAd() {
  videoAdClosed = false;
  playVideoAt(nextVideoIndex());
}

videoAdPlayer?.addEventListener("ended", () => {
  if (videoAdClosed) return;
  playVideoAt(nextVideoIndex());
});

videoAdPlayer?.addEventListener("error", () => {
  if (videoAdClosed) return;
  playVideoAt(nextVideoIndex());
});

videoClose?.addEventListener("click", () => {
  videoAdClosed = true;
  videoAd?.classList.remove("is-visible");
  if (videoAdPlayer) {
    videoAdPlayer.pause();
    videoAdPlayer.removeAttribute("src");
    videoAdPlayer.load();
  }
});

window.setTimeout(showRandomVideoAd, 4200);

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
