const songs = require("../dev-data/songs.json");
const artists = require("../dev-data/artist.json");
module.exports.renderHomepage = function (req, res, next) {
    const best4Songs = [...songs]
        .sort((a, b) => b.liked - a.liked)
        .filter((song, index, data) => {
            if (index < 4) return song;
        });
    res.render("pages/user/homePage", { songs, artists, best4Songs });
};

module.exports.getDataSongs = function (req, res, next) {
    const best4Songs = [...songs]
        .sort((a, b) => b.liked - a.liked)
        .filter((song, index, data) => {
            if (index < 4) return song;
        });
    res.json({ songs, best4Songs, artists });
};
