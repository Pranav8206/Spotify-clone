
console.log("Hello (Static Version)");

const play = document.getElementById("play");
const previous = document.getElementById("previous");
const next = document.getElementById("next");

let currentSong = new Audio();
let currFolder = "english";
let songs = [];

const albums = [
  {
    folder: "English",
    title: "English Hits",
    description: "Top trending English songs",
    cover: "Songs/English/cover.jpg",
    tracks: ["Thunder.mp3", "IAmScaredLeo.mp3", "Believer.mp3"]
  },
  {
    folder: "Hindi",
    title: "Hindi Hits",
    description: "chill beats, lofi vibes, new tracks every week..",
    cover: "Songs/Hindi/cover.jpg",
    tracks: ["AarambhhaiPrachand.mp3", "HamNeTumKoDekha.mp3", "HawaHawa.mp3",
      "IkBagalmechand.mp3","PaisaHaiTohFarzi2023.mp3","SabKeSapnonKiKGFChapter1.mp3",
      "SenoritaZindagiNaMilegiDobara.mp3","TeriUngliPakadKeChala.mp3"
    ]
  },
  {
    folder: "Marathi",
    title: "Marathi Songs",
    description: "chill beats, lofi vibes, new tracks every week...",
    cover: "Songs/Marathi/cover.jpg",
    tracks: ["TikTikVajateDokyaat.mp3"]
  },
  {
    folder: "South",
    title: "South Songs",
    description: "chill beats, lofi vibes, new tracks every week...",
    cover: "Songs/South/cover.jpg",
    tracks: ["AasaKoodaSaiAbhyankkar.mp3", "ChhotiStory.mp3", "Why This Kolaveri Di.mp3"]
  }

];

function convertToMinSec(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function getSongs(folder, trackList) {
  currFolder = folder;
  songs = trackList;

  const songUL = document.querySelector(".songList ul");
  songUL.innerHTML = "";

  songs.forEach((song) => {
    songUL.innerHTML += `
      <li>
        <img class="invert" src="svgs/music.svg" alt="">
        <div class="info">
            <div class="songName">${song.replace(".mp3", "")}</div>
            <div class="artistName">Artist: P.M.</div>
        </div>
        <div class="playnow">
            <span>Play</span>
            <img class="invert" src="svgs/pause.svg" alt="">
        </div>
      </li>`;
  });

  document.querySelectorAll(".songList li").forEach((li, i) => {
    li.addEventListener("click", () => playMusic(songs[i]));
  });
}

function playMusic(track, pause = false) {
  currentSong.src = `Songs/${currFolder}/${track}`;
  if (!pause) {
    currentSong.play();
    play.src = "svgs/play.svg";
  }
  document.querySelector(".songInfo").innerText = track.replace(".mp3", "");
  document.querySelector(".songTime").innerText = "";
}

function displayAlbums() {
  const container = document.querySelector(".cardContainer");
  container.innerHTML = "";
  
  albums.forEach(album => {
    container.innerHTML += `
      <div data-folder="${album.folder}" class="card">
        <img src="${album.cover}" alt="cover">
        <div class="playbtn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="black">
            <path d="M18.9 12.85c-.35 1.34-2.02 2.29-5.35 4.19-3.23 1.83-4.85 2.75-6.14 2.39-.54-.15-1.03-.44-1.41-.84C5 17.6 5 15.74 5 12s0-5.6.99-6.58c.38-.4.87-.69 1.41-.84 1.29-.36 2.91.56 6.14 2.39 3.33 1.9 5 2.85 5.35 4.19.14.56.14 1.13 0 1.68z" stroke="black" stroke-width="1.5" stroke-linejoin="round" />
          </svg>
        </div>
        <h3>${album.title}</h3>
        <p>${album.description}</p>
      </div>
    `;
  });

  document.querySelectorAll(".card").forEach((card, i) => {
    card.addEventListener("click", () => {
      getSongs(albums[i].folder, albums[i].tracks);
      playMusic(albums[i].tracks[0], true);
    });
  });
}

function main() {
  displayAlbums();
  getSongs(albums[0].folder, albums[0].tracks);
  playMusic(albums[0].tracks[0], true);

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "svgs/play.svg";
    } else {
      currentSong.pause();
      play.src = "svgs/pause.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerText = `${convertToMinSec(currentSong.currentTime)}/${convertToMinSec(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.clientWidth) * 100;
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").pop());
    if (index > 0) playMusic(songs[index - 1]);
  });

  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").pop());
    if (index < songs.length - 1) playMusic(songs[index + 1]);
  });

  document.getElementById("volume").addEventListener("input", (e) => {
    currentSong.volume = e.target.value / 100;
    document.querySelector(".volumeBtn").src = currentSong.volume === 0 ? "svgs/mute.svg" : "svgs/volume.svg";
  });

  document.querySelector(".volumeBtn").addEventListener("click", () => {
    if (currentSong.volume > 0) {
      currentSong.volume = 0;
      document.getElementById("volume").value = 0;
      document.querySelector(".volumeBtn").src = "svgs/mute.svg";
    } else {
      currentSong.volume = 0.5;
      document.getElementById("volume").value = 50;
      document.querySelector(".volumeBtn").src = "svgs/volume.svg";
    }
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left-sidebar").style.left = "0%";
  });
  document.querySelector(".cancel").addEventListener("click", () => {
    document.querySelector(".left-sidebar").style.left = "-100%";
  });
}

main();
