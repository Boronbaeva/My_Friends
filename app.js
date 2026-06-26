const timeline = document.getElementById("timeline");
const progressFill = document.getElementById("progressFill");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const songName = document.getElementById("songName");

const ending=document.getElementById("ending");
const restartBtn=document.getElementById("restartBtn");


const playlist = document.getElementById("playlist");
const songList = document.getElementById("songList");

const playlistBtn = document.querySelectorAll(".menuBtn")[1];
const playlistBack = document.getElementById("playlistBack");


const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playBtn = document.getElementById("playBtn");

let playing = true;

const terminal = document.getElementById("terminal");
const bar = document.getElementById("bar");
const enterBtn = document.getElementById("enterBtn");

const boot = document.getElementById("boot");
const welcome = document.getElementById("welcome");
const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeText = document.getElementById("welcomeText");

const menu = document.getElementById("menu");
const journey = document.getElementById("journey");

const journeyBtn = document.getElementById("journeyBtn");

const photo = document.getElementById("photo");
const photoBack = document.getElementById("photoBack");
const memoryText = document.getElementById("memoryText");
const statusText = document.getElementById("statusText");

const player = document.getElementById("player");
const changeFriendBtn = document.getElementById("changeFriendBtn");



const selectFriend = document.getElementById("selectFriend");
const friendList = document.getElementById("friendList");

const letterBtn = document.getElementById("letterBtn");
const letterPage = document.getElementById("letterPage");
const letterBack = document.getElementById("letterBack");

const envelope = document.getElementById("envelope");
const envelopeFlap = document.getElementById("envelopeFlap");
const letterPaper = document.getElementById("letterPaper");

const letterText = document.getElementById("letterText");
const signature = document.getElementById("signature");




let friend;

const bootLines = [
    "> Booting memory.exe...",
    "> Loading memories...",
    "> Checking files...",
    "> Ready."
];

let line = 0;
let memoryIndex = 0;
let interval = null;

function typeBoot() {

    if (line >= bootLines.length) {

        loadBar();
        return;
    }

    terminal.textContent += bootLines[line] + "\n";

    line++;

    setTimeout(typeBoot, 700);
}

function loadBar() {

    let width = 0;

    const timer = setInterval(() => {

        width++;

        bar.style.width = width + "%";

        if (width >= 100) {

            clearInterval(timer);

            enterBtn.style.display = "block";
        }

    }, 20);

}

typeBoot();

enterBtn.onclick = () => {

    boot.classList.add("hide");

    setTimeout(() => {

        boot.style.display = "none";

        selectFriend.classList.add("active");

        createFriends();

    }, 800);

};

let typingTimer = null;

function type(element, text, speed = 45) {

    clearInterval(typingTimer);

    element.textContent = "";

    let i = 0;

    typingTimer = setInterval(() => {

        if (i >= text.length) {
            clearInterval(typingTimer);
            return;
        }

        element.textContent += text.charAt(i);

        i++;

    }, speed);

}

function typeWelcome() {

    welcome.classList.add("active");

    type(welcomeTitle, `Welcome back, ${friend.name}.`);

    setTimeout(() => {
        type(welcomeText, friend.message);
    }, 1200);

    setTimeout(() => {

		console.log("Перехожу в меню");

		welcome.classList.remove("active");
		menu.classList.add("active");

	}, 5000);

}

journeyBtn.onclick = () => {

    menu.classList.remove("active");

    journey.classList.add("active");

    memoryIndex = 0;
    memoryText.innerHTML = "";

    showMemory();
    createTimeline();

    if (interval) clearInterval(interval);

    interval = setInterval(nextMemory, 6000);

};

function showMemory() {

    statusText.textContent = "Loading memory...";

    const memory = friend.memories[memoryIndex];

    photoBack.src = photo.src;

    photo.src = memory.photo;

    const card = document.createElement("div");

    card.className = "memoryCard";

    card.innerHTML = `
    <div class="memoryHeader">
        <strong>${memory.author}</strong>
        <span>${memory.date}</span>
    </div>

    <div class="memoryBody">
        ${memory.text}
    </div>
    `;

    memoryText.appendChild(card);

    memoryText.scrollTop = memoryText.scrollHeight;

    statusText.textContent = "Memory Found";

    updateTimeline();

}

function nextMemory() {

    if (memoryIndex === friend.memories.length - 1) {

        clearInterval(interval);

        setTimeout(() => {
            endJourney();
        }, 6000);

        return;
    }

    memoryIndex++;
    showMemory();

}

let ended = false;

function endJourney() {

    clearInterval(interval);

    // player.pause();

    journey.classList.remove("active");

    ending.classList.add("active");

    type(
        document.getElementById("letter"),
        friend.ending,
        35
    );

}

const petals = document.getElementById("petals");

setInterval(() => {

    const petal = document.createElement("div");

    petal.className = "petal";

    petal.style.left = Math.random()*100+"vw";

    petal.style.animationDuration = 6 + Math.random()*5 + "s";

    petal.style.opacity = .3 + Math.random()*.7;

    petal.style.transform =
        `scale(${0.5+Math.random()})`;

    petals.appendChild(petal);

    setTimeout(()=>{

        petal.remove();

    },12000);

},350);


nextBtn.onclick = () => {

    nextMemory();

};

prevBtn.onclick = () => {

    memoryIndex--;

    if(memoryIndex < 0){

        memoryIndex = friend.memories.length - 1;

    }

    showMemory();

};

playBtn.onclick = () => {

    if(playing){

        clearInterval(interval);

        player.pause();

        playBtn.textContent = "▶ Play";

    }else{

        interval = setInterval(nextMemory,6000);

        player.play();

        playBtn.textContent = "⏸ Pause";

    }

    playing = !playing;

};

function createTimeline(){

    timeline.innerHTML = "";

    friend.memories.forEach((memory,index)=>{
		const img=new Image();

    	img.src=memory.photo;

        const dot = document.createElement("div");

        dot.className = "timelineDot";

        if(index===0){

            dot.classList.add("active");

        }

        dot.onclick = ()=>{

            memoryIndex=index;

            showMemory();

            updateTimeline();

        }

        timeline.appendChild(dot);

        if(index<friend.memories.length-1){

            const line=document.createElement("div");

            line.className="timelineLine";

            timeline.appendChild(line);

        }

    });

}

function updateTimeline(){

    const dots=document.querySelectorAll(".timelineDot");

    dots.forEach((dot,index)=>{

        dot.classList.toggle(
            "active",
            index===memoryIndex
        );

    });

}


player.addEventListener("loadedmetadata",()=>{

    duration.textContent=format(player.duration);

});

player.addEventListener("timeupdate",()=>{

    currentTime.textContent=format(player.currentTime);

    progressFill.style.width=
    (player.currentTime/player.duration*100)+"%";

});

function format(sec){

		const m=Math.floor(sec/60);

		const s=Math.floor(sec%60);

		return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

}

restartBtn.onclick = () => {

    letter.textContent = "";

    ending.classList.remove("active");

    menu.classList.add("active");

}

document.addEventListener("mousemove",(e)=>{

    const x=(e.clientX/window.innerWidth-.5)*20;
    const y=(e.clientY/window.innerHeight-.5)*20;

    photo.style.transform=
    `translate(${x}px,${y}px) rotate(3deg)`;

    photoBack.style.transform=
    `translate(${x/2}px,${y/2}px) rotate(-5deg)`;

});

function createFriends(){

    friendList.innerHTML = "";

    friends.forEach(person => {

        const card = document.createElement("div");

        card.className = "friendCard";

        card.innerHTML = `
            <img src="${person.avatar}" class="friendAvatar">

            <h2>${person.name}</h2>

            <p>Click to enter</p>
        `;

        card.onclick = () => {

            friend = person;
			petals.style.display = "block";
            document.documentElement.style.setProperty(
                "--accent",
                friend.color
            );

            player.src = friend.songs[0].file;
			songName.textContent = "♪ " + friend.songs[0].title;
            player.volume = 0.3;
            player.loop = true;
            player.play().catch(err => console.log(err));

            selectFriend.classList.remove("active");
            welcome.classList.add("active");

            typeWelcome();

        };

        friendList.appendChild(card);

    });

}

changeFriendBtn.onclick = () => {

    player.pause();
    player.currentTime = 0;

    petals.style.display = "none";

    friend = null;

    document.documentElement.style.setProperty(
        "--accent",
        "#4682B4"
    );

    menu.classList.remove("active");
    selectFriend.classList.add("active");

};

function createPlaylist() {

    songList.innerHTML = "";

    friend.songs.forEach((song, index) => {

        const card = document.createElement("div");

        card.className = "songCard";

        card.innerHTML = `
            <div class="songPlay">▶</div>

            <div class="songInfo">
                <h2>${song.title}</h2>
                <p>${song.artist}</p>
            </div>
        `;

        card.onclick = () => {

            document.querySelectorAll(".songCard").forEach(el => {
                el.classList.remove("activeSong");
            });

            card.classList.add("activeSong");

            player.src = song.file;

            player.play();

            songName.textContent = "♪ " + song.title;

        };

        songList.appendChild(card);

    });

    const first = document.querySelector(".songCard");

    if (first) {

        first.classList.add("activeSong");

    }

}

playlistBtn.onclick = () => {

    menu.classList.remove("active");

    playlist.classList.add("active");

    createPlaylist();

};

playlistBack.onclick = () => {

    playlist.classList.remove("active");

    menu.classList.add("active");

};


letterBtn.onclick = () => {

    menu.classList.remove("active");

    letterPage.classList.add("active");

};
letterBack.onclick = () => {

    letterPage.classList.remove("active");
    menu.classList.add("active");

    envelopeFlap.style.transform = "";
    letterPaper.classList.remove("open");

    letterText.textContent = "";
    signature.textContent = "";

}


function typeLetter(text){

    letterText.textContent="";

    let i=0;

    const timer=setInterval(()=>{

        letterText.textContent+=text[i];

        i++;

        if(i>=text.length){

            clearInterval(timer);

            signature.textContent="— YUJI ❤️";

        }

    },35);

}

function type(element, text, speed){

    element.textContent = "";

    let i = 0;

    const timer = setInterval(() => {

        element.textContent += text[i];

        i++;

        if(i >= text.length){

            clearInterval(timer);

        }

    }, speed);

}



envelope.onclick = () => {

    // alert("CLICK");

    envelopeFlap.style.transform = "rotateX(180deg)";

    letterPaper.classList.add("open");

    type(letterText, friend.letter, 28);

    signature.textContent = friend.name;

}
