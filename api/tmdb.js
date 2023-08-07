const axios = require("axios");
require('dotenv').config();

const baseUrl = "https://api.themoviedb.org/3/";
const apiKey = process.env.TMDB_API_KEY;
const defaultFilters = [
    "include_adult=false",
    "include_video=false",
    "language=en-US",
    "sort_by=popularity.desc", // default
    "with_release_type=4", // get digital release or + only
];

const topRatedFilters = [
    "include_adult=false",
    "include_video=false",
    "language=en-US",
    "sort_by=vote_average.desc",
    "without_genres=99,10755",
    "vote_count.gte=200",
    "with_release_type=4", // get digital release or + only
];

async function getMovies(filters = [], topRated = false) {
    let link;
    if (topRated) {
        link = `${baseUrl}discover/movie?api_key=${apiKey}&${topRatedFilters.join(
            "&"
        )}&${filters.join("&")}`;
    } else {
        link = `${baseUrl}discover/movie?api_key=${apiKey}&${defaultFilters.join(
            "&"
        )}&${filters.join("&")}`;
    }
    console.log(filters);
    console.log(link);

    const data = await axios.get(link);
    return data.data.results;
}

async function searchMulti(q) {
    const link = `${baseUrl}search/multi?api_key=${apiKey}&query=${q}&${defaultFilters.join(
        "&"
    )}`;
    console.log(link);
    const data = await axios.get(link);
    return data.data.results;
}

async function getPoster(datas) {
    const posterPaths = [];
    for (i in datas) {
        posterPaths.push(
            `https://image.tmdb.org/t/p/w500${datas[i].poster_path}`
        );
    }
    return posterPaths;
}

async function getMovie(id) {
    const link = `${baseUrl}movie/${id}?api_key=${apiKey}&language=en-US`;
    console.log(link);
    const data = await axios.get(link);
    return data.data;
}

async function getRecommendedMovies(id) {
    const link = `${baseUrl}movie/${id}/recommendations?api_key=${apiKey}&language=en-US`;
    console.log(link);
    const data = await axios.get(link);
    return data.data.results;
}

async function getTvShows(filters = [], topRated = false) {
    let link;
    if (topRated) {
        link = `${baseUrl}discover/tv?api_key=${apiKey}&${topRatedFilters.join(
            "&"
        )}&${filters.join("&")}`;
    } else {
        link = `${baseUrl}trending/tv/week?api_key=${apiKey}&${defaultFilters.join(
            "&"
        )}&${filters.join("&")}`;
    }
    const data = await axios.get(link);
    console.log(filters);
    console.log(link);

    return data.data.results;
}

// getMovies();

module.exports = { getMovies, getMovie, getRecommendedMovies, searchMulti, getPoster, getTvShows };
