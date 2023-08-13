const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

var splide = new Splide(".splide", {
    perPage: 5,
    rewind: true,
});
splide.mount();

const app = {
    audio: $("audio.song"),
    btnPlay: $("i.fa-play"),
    btnStop: $("i.fa-stop"),
    btnShuffle: $("i.fa-shuffle"),
    btnPrev: $("i.fa-backward-step"),
    btnNext: $("i.fa-forward-step"),
    btnRepeat: $("i.fa-repeat"),
    btnPrev: $("i.fa-backward-step"),
    timeProgress: $("progress.time"),
    volume: $("input.volume"),
    volumeState: $(".volume-state"),
    timeText: $(".time-text"),
    songsOfWeek: $(".song_of_week"),
    repeat: false,
    shuffle: false,
    songs: [],
    likedSong: [],
    control: $(".player-audio"),
    currentList: [],
    searchBtn: $(".search-song"),

    handleControl() {
        const searcherSongs = new FuzzySearch(this.songs.songs, ["title"]);
        $(".search-input")?.addEventListener("input", (e) => {
            $("ul.list_songs").innerHTML = searcherSongs.search($(".search-input")?.value).reduce(
                (pre, curr) =>
                    (pre += `<div
            data-id="${curr.song_id}"
            class="card song-player"
            style="background-color: #12192c; cursor: pointer"
        >
            <img
                src="${curr.image}"
                class="card-img-top"
                style="height: 200px; object-fit: contain"
                alt="${curr.title}"
            />
            <div class="card-body">
                <h5 class="card-title">${curr.title}</h5>
                <p class="card-text">${curr.artist}</p>
            </div>
        </div>`),
                ""
            );
        });
        const searcherArtist = new FuzzySearch(this.songs.artists, ["name"]);

        $(".search-input-artist")?.addEventListener("input", (e) => {
            $("ul.list_artists").innerHTML = searcherArtist
                .search($(".search-input-artist")?.value)
                .reduce(
                    (pre, curr, i) =>
                        (pre += `<div class="cluster d-flex">
                        <div
                            data-id="${curr.artist_id}"
                            class="card artist"
                            style="background-color: #12192c; cursor: pointer"
                        >
                            <img
                                src="${curr.image}"
                                class="card-img-top"
                                style="height: 200px; object-fit: contain"
                                alt="${curr.name}"
                            />
                            <div class="card-body">
                                <a
                                    class="card-title text-white fw-bold"
                                    data-bs-toggle="collapse"
                                    href="#collapseExample-${i}"
                                    role="button"
                                    aria-expanded="false"
                                    style="text-decoration: none"
                                    aria-controls="collapseExample"
                                    >${curr.name}</a
                                >
                                <p class="card-text">artist.genre</p>
                            </div>
                        </div>
                        <div class="collapse collapse-horizontal" id="collapseExample-${i}">
                            <ul
                                class="list list_songs list-song-by-artist d-flex flex-wrap text-white list_songs_page_2"
                                style="gap: 30px; width: 400px"
                            >
                            ${this.songs.songs
                                .filter((song) => song.artist === curr.name)
                                .reduce(
                                    (pre, curr, i) =>
                                        (pre += `
                            <div class="temp-card">
                                <div
                                    data-id="${curr.song_id}"
                                    class="p-3 song-player"
                                    style="
                                        background-color: #12192c;
                                        cursor: pointer;
                                        width: 300px;
                                        border-radius: 10px;
                                    "
                                >
                                    <div class="card-body">
                                        <h5 class="card-title">${curr.title}</h5>
                                        <p class="card-text">${curr.artist}</p>
                                    </div>
                                </div>
                                <div class="liked-song">
                                    <i class="bi bi-heart"></i>
                                    <i class="bi bi-heart-fill"></i>
                                </div>
                            </div>`),
                                    ""
                                )}
                            </ul>
                        </div>
                    </div>`),
                    ""
                );
            this.playSong();
        });
        const playStatusBtn = $(".play-status");
        playStatusBtn.addEventListener("click", (e) => {
            this.btnPlay.classList.toggle("active");
            if (!this.btnPlay.classList.contains("active")) return this.audio.play();
            this.audio.pause();
        });
        this.timeProgress.addEventListener("click", (e) => {
            const x = e.pageX - this.timeProgress.offsetLeft,
                clickedValue = (x * this.timeProgress.max) / this.timeProgress.offsetWidth;
            this.audio.currentTime = (clickedValue / 100) * this.audio.duration;
        });
        this.volume.addEventListener("change", (e) => {
            const valueVolume = +this.volume.value;
            if (valueVolume === 0)
                this.volumeState.innerHTML = `<i class="fa-solid fa-volume-off"></i>`;
            if (valueVolume >= 0.4)
                this.volumeState.innerHTML = `<i class="fa-solid fa-volume-low"></i>`;
            if (valueVolume >= 0.7)
                this.volumeState.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
            this.audio.volume = valueVolume;
        });
        this.audio.ontimeupdate = (e) => {
            this.timeProgress.value = (this.audio.currentTime / this.audio.duration) * 100 || 0;
            this.timeText.textContent = `${Math.floor(this.audio.currentTime / 60)}:${Math.floor(
                this.audio.currentTime % 60
            )}`;
        };
        this.audio.onended = (e) => {
            this.btnPlay.classList.add("active");
            if (this.shuffle) return this.playRandomSong();
            if (this.repeat) {
                this.btnPlay.classList.remove("active");
                this.audio.play();
                return;
            }
            this.playNextSong();
        };
        this.btnRepeat.addEventListener("click", (e) => {
            this.btnShuffle.classList.remove("active");
            this.btnRepeat.classList.toggle("active");
            if (this.btnRepeat.classList.contains("active")) {
                this.repeat = true;
                return;
            }
            this.repeat = false;
        });
        this.btnShuffle.addEventListener("click", (e) => {
            this.btnRepeat.classList.remove("active");
            this.btnShuffle.classList.toggle("active");
            if (this.btnShuffle.classList.contains("active")) {
                this.shuffle = true;
                return;
            }
            this.shuffle = false;
        });
        this.btnNext.addEventListener("click", (e) => {
            this.playNextSong();
        });
        this.btnPrev.addEventListener("click", (e) => {
            this.playPrevSong();
        });
    },
    renderLikedSong() {
        $(".list_liked").innerHTML = this.likedSong.reduce(
            (pre, curr, index) =>
                (pre += `<div class="temp-card">
        <div
            data-id="${curr.song_id}"
            class="card song-player"
            style="background-color: #12192c; cursor: pointer"
        >
            <img
                src="${curr.image}"
                class="card-img-top"
                style="height: 200px; object-fit: contain"
                alt="${curr.title}"
            />
            <div class="card-body">
                <h5 class="card-title">${curr.title}</h5>
                <p class="card-text">${curr.artist}</p>
            </div>
        </div>
        <div class="liked-song">
            <i class="bi bi-heart active"></i>
            <i class="bi bi-heart-fill"></i>
        </div>
    </div>`),
            ""
        );
    },
    renderSongOfArtist() {
        $(".list-song-by-artist").innerHTML = this.songs.songs.filter().reduce(
            (pre, curr) =>
                (pre += `<div class="temp-card">
        <div
            data-id="${curr.song_id}"
            class="p-3 song-player"
            style="
                background-color: #12192c;
                cursor: pointer;
                width: 300px;
                border-radius: 10px;
            "
        >
            <div class="card-body">
                <h5 class="card-title">${curr.title}</h5>
                <p class="card-text">${curr.artist}</p>
            </div>
        </div>
        <div class="liked-song">
            <i class="bi bi-heart"></i>
            <i class="bi bi-heart-fill"></i>
        </div>
    </div>`),
            ""
        );
    },
    playNextSong() {
        const nextSong = this.currentList.at(this.currentList.indexOf(this.currSong) + 1);
        this.currSong = nextSong;
        $(".image-player").src = nextSong.image;
        $(".title-player").textContent = nextSong.title;
        $(".artist-player").textContent = nextSong.artist;
        this.audio.src = nextSong.url;
        this.audio.play();
        this.btnPlay.classList.remove("active");
    },
    toggleNavbar() {
        const listTarget = ["content-home", "content-song", "content-artist", "content-liked"];
        const listNavLink = $$(".list-target .nav-item .nav-link");
        const listContainer = $$(".container-main-content");
        listNavLink.forEach((element) => {
            element.addEventListener("click", (e) => {
                listNavLink.forEach((val) => val.classList.remove("active"));
                listContainer.forEach((val) => val.classList.remove("active"));
                element.classList.add("active");
                $(
                    "main." + listTarget.find((val) => element.classList.contains(val))
                ).classList.add("active");
            });
        });
    },

    playRandomSong() {
        const nextSong = this.currentList.at(
            Math.floor(Math.random() * this.currentList.length - 1)
        );
        this.currSong = nextSong;
        $(".image-player").src = nextSong.image;
        $(".title-player").textContent = nextSong.title;
        $(".artist-player").textContent = nextSong.artist;
        this.audio.src = nextSong.url;
        this.audio.play();
        this.btnPlay.classList.remove("active");
    },

    playPrevSong() {
        const prevSong = this.currentList.at(this.currentList.indexOf(this.currSong) - 1);
        this.currSong = prevSong;
        $(".image-player").src = prevSong.image;
        $(".title-player").textContent = prevSong.title;
        $(".artist-player").textContent = prevSong.artist;
        this.audio.src = prevSong.url;
        this.audio.play();
        this.btnPlay.classList.remove("active");
    },
    handelPlay(list, e) {
        const song = e.target.closest("div.song-player");
        const hearth = e.target.closest("div.liked-song");
        console.log(song);
        if (hearth) {
            const heartIcon = hearth.querySelector("i.bi-heart");
            const songByHeart = hearth.closest(".temp-card").querySelector("div.song-player");
            heartIcon.classList.toggle("active");
            const songFound = list.find((val, index) => val.song_id === songByHeart.dataset.id);
            if (heartIcon.classList.contains("active")) {
                this.likedSong.push(songFound);
            } else {
                this.likedSong.splice(this.likedSong.indexOf(songFound), 1);
            }
            this.renderLikedSong();
        }
        if (!song) return;
        const songFound = list.find((val, index) => val.song_id === song.dataset.id);
        if (!songFound.url) return;
        this.currentList = list;
        this.currSong = songFound;
        $(".image-player").src = songFound.image;
        $(".title-player").textContent = songFound.title;
        $(".artist-player").textContent = songFound.artist;
        this.audio.src = this.currSong.url;
        this.btnPlay.classList.remove("active");
        this.audio.play();
    },
    playSong() {
        this.songsOfWeek?.addEventListener("click", (e) =>
            this.handelPlay(this.songs.best4Songs, e)
        );
        $$("ul.list_songs").forEach((val) =>
            val.addEventListener("click", (e) => this.handelPlay(this.songs.songs, e))
        );
    },
    async init() {
        const response = await fetch("/songs", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
        });
        this.songs = await response.json();
        this.currSong = this.songs.best4Songs[0];
        this.currentList = this.songs.best4Songs;
        this.toggleNavbar();
        this.handleControl();
        this.playSong();
    },
};

app.init().then();
