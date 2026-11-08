const audio = document.querySelector("#birthdayAudio");
const musicToggle = document.querySelector("#musicToggle");
const musicLabel = document.querySelector("#musicLabel");
const wishButton = document.querySelector("#wishButton");
const wishCard = document.querySelector("#wishCard");

function setMusicState(isPlaying) {
  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
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
  wishCard.scrollIntoView({ behavior: "smooth", block: "center" });
  wishCard.classList.remove("revealed");
  requestAnimationFrame(() => wishCard.classList.add("revealed"));
  if (audio.paused) toggleMusic();
});
