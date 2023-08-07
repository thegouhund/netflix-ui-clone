const express = require("express");
const bodyParser = require("body-parser");
const tmdb = require("./api/tmdb");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    const dataMovies = await tmdb.getMovies();
    const dataTopRatedMovies = await tmdb.getMovies([], (topRated = true));
    const dataTvs = await tmdb.getTvShows();
    const dataTopRatedTvs = await tmdb.getTvShows([], (topRated = true));
    const randomFeatured = Math.floor(Math.random() * 19) + 1;
    const dataFeaturedMovie = await tmdb.getMovie(
        dataMovies[randomFeatured].id
    );

    return res.render("index", {
        featuredMovie: dataFeaturedMovie,
        movies: dataMovies,
        topRatedMovies: dataTopRatedMovies,
        tvs: dataTvs,
        topRatedTvs: dataTopRatedTvs,
    });
});

app.get("/movies", async (req, res) => {
    // get filter items to array ex: ["sort=popular", "language=id"]
    const filters = Object.entries(req.query).map(
        ([key, value]) => `${key}=${value}`
    );
    const dataMovies = await tmdb.getMovies(filters);

    // get only poster_path from dataMovies - push to an array
    const posterPaths = await tmdb.getPoster(dataMovies);

    return res.render("list", { posterPaths: posterPaths });
});

app.get("/search", async (req, res) => {
    const query = req.query.query;
    const dataMultis = await tmdb.searchMulti(query);

    const posterPaths = await tmdb.getPoster(dataMultis);
    return res.render("list", { posterPaths: posterPaths });
});

app.get("/watch/:tmdbId", async (req, res) => {
    if (!req.params.tmdbId) return res.redirect("/");
    const dataMovie = await tmdb.getMovie(req.params.tmdbId);
    const dataSimilar = await tmdb.getRecommendedMovies(req.params.tmdbId);
    return res.render("watch", {
        movie: dataMovie,
        similarMovies: dataSimilar,
    });
});

app.get("/stream/:tmdbId", (req, res) => {
    res.render("stream", { tmdbId: req.params.tmdbId });
});

app.use((req, res, next) => {
    return res.redirect("/");
});

app.listen(3000, (err) => {
    if (err) throw err;
    console.log("server running on\nhttp://localhost:3000");
});
