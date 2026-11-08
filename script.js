const audio = document.querySelector("#birthdayAudio");
const musicToggle = document.querySelector("#musicToggle");
const musicLabel = document.querySelector("#musicLabel");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setMusicState(isPlaying) {
  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute("aria-label", isPlaying ? "暂停生日背景音乐" : "播放生日背景音乐");
  musicLabel.textContent = isPlaying ? "正在播放" : "播放音乐";
}

musicToggle.addEventListener("click", async () => {
  if (!audio.paused) {
    audio.pause();
    setMusicState(false);
    return;
  }

  try {
    await audio.play();
    setMusicState(true);
  } catch {
    musicLabel.textContent = "再点一次播放";
  }
});

audio.addEventListener("pause", () => setMusicState(false));
audio.addEventListener("play", () => setMusicState(true));

if (window.gsap) {
  const gsap = window.gsap;

  if (!reducedMotion) {
    gsap.set("[data-enter]", { autoAlpha: 0, y: 18 });
    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .from(".topbar", { autoAlpha: 0, y: -12, duration: .55 })
      .to(".headline-block", { autoAlpha: 1, y: 0, duration: .68 }, "<.12")
      .to(".portrait-stage", { autoAlpha: 1, y: 0, duration: .72 }, "<.05")
      .from(".portrait-image-wrap", { scale: .96, duration: .92, ease: "power2.out" }, "<.04")
      .to(".glass-chip", { autoAlpha: 1, y: 0, duration: .48, stagger: .1 }, "<.2")
      .to(".bottom-row", { autoAlpha: 1, y: 0, duration: .52 }, "<.1");

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        gsap.fromTo(entry.target,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: .68, ease: "power3.out", clearProps: "transform,opacity,visibility" }
        );
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });

    document.querySelectorAll(".wishes-heading, .wish-glass").forEach((element) => revealObserver.observe(element));

    const card = document.querySelector(".wish-glass");
    if (card && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const xTo = gsap.quickTo(card, "--pointer-x", { duration: .45, ease: "power3.out" });
      const yTo = gsap.quickTo(card, "--pointer-y", { duration: .45, ease: "power3.out" });
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        xTo(`${((event.clientX - rect.left) / rect.width) * 100}%`);
        yTo(`${((event.clientY - rect.top) / rect.height) * 100}%`);
      });
    }
  }
}
