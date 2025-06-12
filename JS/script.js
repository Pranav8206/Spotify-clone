console.log("Hello");

let currentSong = new Audio();
let currFolder;
let songs;

function convertToMinSec(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "0:00";
  }

  const totalSeconds = Math.floor(seconds); // Remove decimal part
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const formattedSecs = secs.toString().padStart(2, "0");
  return `${minutes}:${formattedSecs}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/Songs/${folder}/`);
  let response = await a.text();
  // console.log(response)
  let div = document.createElement("div");
  div.innerHTML = response;
  let tds = div.getElementsByTagName("td");
  // console.log(tds)
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/Songs/${folder}/`)[1]);
    }
  }

  // Display all the song on the page
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
          <img class="invert" src="svgs/music.svg" alt="">
          <div class="info">
              <div class="songName">${song.replaceAll("%20", " ")}</div>
              <div class="artistName">Artist:-P.M.</div>
          </div>
          <div class="playnow">
              <span>Play</span>
              <img class="invert" src="svgs/pause.svg" alt="">
          </div>
      </li>`;
  }

  // Attach an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    // console.log(e)
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/Songs/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "svgs/play.svg";
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(
    track.split(".")[0]
  ); // split seperator the .mp3 from the name
  document.querySelector(".songTime").innerHTML = "";
};

async function DisplayAlbums() {
  let a = await fetch(`/Songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");

  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/Songs")) {
      let folder = e.href.split("/").slice(-2)[0];
      //get metadata of the folders
      let a = await fetch(`/Songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response);

      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `
        <div data-folder="${folder}" class="card">
            <img src="/Songs/${folder}/cover.jpg" alt="">
            <div class="playbtn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#111111" fill="black">
                    <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
            </div>
            <h3>${response.title}</h3>
            <p>${response.description}</p>
        </div>
        `;
    }
  }
  // load the playlist as card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0])
    });
  });
}

async function main() {
  // Get the list of all the songs
  await getSongs("Songs/south");
  playMusic(songs[0], true);

  //Display all album
  DisplayAlbums();

  //Attach an event listner to play next, previous and to stop songs
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "svgs/play.svg";
    } else {
      currentSong.pause();
      play.src = "svgs/pause.svg";
    }
  });

  // Timeupdate for the song in playBar
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songTime").innerHTML = `${convertToMinSec(
      currentSong.currentTime
    )}/${convertToMinSec(currentSong.duration)}`;

    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", (e) => {
    document.querySelector(".left-sidebar").style.left = "0%";
  });

  document.querySelector(".cancel").addEventListener("click", (e) => {
    document.querySelector(".left-sidebar").style.left = "-100%";
  });

  document.querySelector(".cardContainer").addEventListener("click", (e) => {
    console.log("clicked")
    document.querySelector(".left-sidebar").style.left = "0%";
  });

  //previous and nex tbutton adding event
  previous.addEventListener("click", (e) => {
    console.log("clicked pre");
    console.log(currentSong, currentSong.src)
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  next.addEventListener("click", (e) => {
    console.log("clicked next");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //volume
  document.getElementById("volume").addEventListener("change", (e) => {
    console.log(e, e.target, e.target.value);
    currentSong.volume = parseInt(e.target.value) / 100;

    if (currentSong.volume == 0){
      document.querySelector(".volumeBtn").src = "svgs/mute.svg"
    }
    else{ 
      document.querySelector(".volumeBtn").src = "svgs/volume.svg"
    }
  });

  //click volume to mute
  document.querySelector(".volumeBtn").addEventListener("click", (e)=> {
    console.log(e.target.src)
    if (e.target.src.includes("svgs/volume.svg")){
      e.target.src = e.target.src.replace("volume.svg", "mute.svg")
      currentSong.volume = 0
      document.getElementById("volume").value = 0
    }
    else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg")
      currentSong.volume = .1
      document.getElementById("volume").value = 10
    }
  })

}
// http://192.168.7.66:3000
// // first song will be played
// var audio = new Audio(
//     "http://192.168.43.96:3000/Songs/Believer(PagalWorld).mp3"
// );
// audio.play();

// audio.addEventListener("loadeddata", () => {
//     console.log(audio.duration, audio.currentSrc, audio.currentTime)
//     // The duration variable now holds the duration (in seconds) of the audio clip
// });

//

main();
