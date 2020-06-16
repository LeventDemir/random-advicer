const page = () => {
    return Math.floor(Math.random() * 500) + 1;
};

export const state = () => ({
    genres: [],
    movie: null,
    music: null,
    tvSeries: null
})

export const getters = {
    getGenres(state) {
        return state.genres
    },
    getMovie(state) {
        return state.movie
    },
    getMusic(state) {
        return state.music
    },
    getTVSeries(state) {
        return state.tvSeries
    }
}

export const mutations = {
    setGenres(state, genres) {
        state.genres = genres
    },
    setMovie(state, movie) {
        state.movie = movie
    },
    setMusic(state, music) {
        state.music = music
    },
    setTVSeries(state, tvSeries) {
        state.tvSeries = tvSeries
    }
}

export const actions = {
    movieAdvice({ getters, commit }) {
        const discover = `${process.env.MOVIEDB_BASE_URL}/discover/movie?api_key=${process.env.MOVIEDB_API_KEY}&page=${page()}`;

        return this.$axios.get(discover).then(response => {
            const movie =
                response.data.results[
                Math.floor(Math.random() * response.data.results.length)
                ];

            movie.genres = [];
            movie.poster_path = `${process.env.MOVIEDB_POSTER_PATH}${movie.poster_path}`

            getters['getGenres'].map(genre => {
                movie.genre_ids.map(movie_genre => {
                    if (genre.id == movie_genre) movie.genres.push(genre.name);
                });
            });

            commit('setMovie', movie)
        });
    },
    tvSeriesAdvice({ getters, commit }) {
        const discover = `${process.env.MOVIEDB_BASE_URL}/discover/tv?api_key=${process.env.MOVIEDB_API_KEY}&page=${page()}`;

        return this.$axios.get(discover).then(response => {
            const tv =
                response.data.results[
                Math.floor(Math.random() * response.data.results.length)
                ];

            tv.genres = [];
            tv.poster_path = `${process.env.MOVIEDB_POSTER_PATH}${tv.poster_path}`

            getters['getGenres'].map(genre => {
                tv.genre_ids.map(tv_genre => {
                    if (genre.id == tv_genre) tv.genres.push(genre.name);
                });
            });

            commit('setTVSeries', tv)
        });
    },
    genres({ commit }) {
        return this.$axios
            .get(`${process.env.MOVIEDB_BASE_URL}/genre/movie/list?api_key=${process.env.MOVIEDB_API_KEY}&language=en-US`)
            .then(response => commit('setGenres', response.data.genres));
    }
}