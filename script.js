const audio = document.querySelector("#birthdayAudio");
const musicToggle = document.querySelector("#musicToggle");
const musicLabel = document.querySelector("#musicLabel");
const wishButton = document.querySelector("#wishButton");
const letter = document.querySelector("#letter");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setMusicState(isPlaying) {
  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute("aria-label", isPlaying ? "暂停背景音乐" : "开启背景音乐");
  musicLabel.textContent = isPlaying ? "音乐播放中" : "开启音乐";
}

async function toggleMusic() {
  if (audio.paused) {
    try {
      await audio.play();
      setMusicState(true);
    } catch (error) {
      musicLabel.textContent = "再点一次播放";
    }
  } else {
    audio.pause();
    setMusicState(false);
  }
}

musicToggle.addEventListener("click", toggleMusic);
audio.addEventListener("pause", () => setMusicState(false));
audio.addEventListener("play", () => setMusicState(true));

wishButton.addEventListener("click", () => {
  letter.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  if (audio.paused) toggleMusic();
});

function splitText(element) {
  const text = element.textContent.trim();
  element.setAttribute("aria-label", text);
  element.textContent = "";
  [...text].forEach((character) => {
    const span = document.createElement("span");
    span.className = "split-char";
    span.textContent = character === " " ? "\u00a0" : character;
    span.setAttribute("aria-hidden", "true");
    element.appendChild(span);
  });
}

document.querySelectorAll("[data-split]").forEach(splitText);

if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  if (reducedMotion) {
    gsap.set("[data-enter], [data-reveal]", { clearProps: "all", autoAlpha: 1 });
  } else {
    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .from(".topbar", { y: -16, autoAlpha: 0, duration: .7 })
      .from(".hero-meta", { y: 18, autoAlpha: 0, duration: .55 }, "<.18")
      .from(".hero-title .split-char", { y: 38, autoAlpha: 0, filter: "blur(9px)", duration: .9, stagger: .035 }, "<.12")
      .from(".hero-copy [data-enter]:not(.hero-meta)", { y: 20, autoAlpha: 0, duration: .55, stagger: .07 }, "<.28")
      .from(".hero-visual", { y: 28, rotate: -2, autoAlpha: 0, duration: .85 }, "<.12")
      .from(".scroll-cue", { y: 14, autoAlpha: 0, duration: .45 }, "<.18");

    gsap.from("[data-reveal]", {
      scrollTrigger: { trigger: "[data-reveal]", start: "top 78%", once: true },
      y: 34,
      autoAlpha: 0,
      duration: .85,
      immediateRender: false,
      ease: "power3.out"
    });

    gsap.from(".wish-row", {
      scrollTrigger: { trigger: ".wishes-list", start: "top 82%", once: true },
      x: -20,
      autoAlpha: 0,
      duration: .55,
      stagger: .08,
      immediateRender: false,
      ease: "power2.out"
    });
  }

  const portrait = document.querySelector("[data-portrait-frame]");
  if (!reducedMotion && portrait) {
    gsap.to(portrait, { y: -8, duration: 3.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
  }

  const pointerCard = document.querySelector("[data-pointer-card]");
  const glow = pointerCard?.querySelector(".card-glow");
  if (pointerCard && glow && window.matchMedia("(hover: hover)").matches) {
    const xTo = gsap.quickTo(glow, "x", { duration: .55, ease: "power3.out" });
    const yTo = gsap.quickTo(glow, "y", { duration: .55, ease: "power3.out" });
    pointerCard.addEventListener("pointermove", (event) => {
      const rect = pointerCard.getBoundingClientRect();
      xTo(event.clientX - rect.left - rect.width * .31);
      yTo(event.clientY - rect.top - rect.height * .24);
    });
    pointerCard.addEventListener("pointerleave", () => {
      xTo(0);
      yTo(0);
    });
  }
}



