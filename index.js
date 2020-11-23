// API KEY
const apiKey = '112ca2b68890cedc6cd02c2b81593072';
// VARIABLE FOR THE TEMPLATE OF A MOVIE BOX
const templateMovieBox = document.getElementById('template-movie-box')
// VARIABLES FOR THE SEARCH INPUT
const search = document.getElementById('search');
const searchInput = document.getElementById('searchInput');
// VARIABLES FOR THE MENU BUTTONS FEATURED AND GENRES
const featured = document.getElementById('featured');
const genres = document.getElementById('genres');
// VARIABLE FOR THE DISPLAY SECTION
const displaySection = document.getElementById('displaySection').querySelector('.film-grid');
// VARIABLES FOR THE MODAL TEMPLATE
const templateMovieModal = document.getElementById('template-movie-modal');
const modalPlaceholder = document.getElementById('modal-placeholder')
// VARIABLE FOR THE MORE MOVIES BUTTON
const more = document.getElementById('more')
const less = document.getElementById('prev')

let page = 1;

// FUNCTION TO FETCH FEATURED MOVIES
function fetchMovie(url){
    fetch(url)
    .then(res=>res.json())
    .then(data=>{
        displayMovie(data.results)
    })
}

// MORE MOVIES

more.addEventListener('click', ()=>{
    if (page >= 0){
        page++
        fetchMovie(`https://api.themoviedb.org/3/movie/popular?api_key=112ca2b68890cedc6cd02c2b81593072&language=en-US&page=${page}`)
    }
})
less.addEventListener('click', ()=>{
    if (page > 1){
        page--
        fetchMovie(`https://api.themoviedb.org/3/movie/popular?api_key=112ca2b68890cedc6cd02c2b81593072&language=en-US&page=${page}`)
    }
})

// EVENT LISTENER FOR SEARCH MOVIE
search.addEventListener('submit',(e)=> {
    e.preventDefault();
    fetchMovie(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${searchInput.value}&page=1&include_adult=false`)
    searchInput.value = '';
    document.getElementById('displaySection').querySelector('h2').innerText = 'Let\'s movie it !';
})

// ADD EVENT LISTENER FOR TRENDING MOVIES
featured.addEventListener('click', ()=>{
    fetchMovie(`https://api.themoviedb.org/3/movie/popular?api_key=112ca2b68890cedc6cd02c2b81593072&language=en-US&page=${page}`)
})




// ADD EVENT LISTENER FOR GENRES MOVIES
featured.addEventListener('click', ()=>{
    fetchMovie()
})


// GENERIC FUNCTION TO DISPLAY MOVIE
function displayMovie(dataArr) {
    console.log(dataArr)
    displaySection.innerHTML = '';
    if (dataArr.length===0){
        document.getElementById('displaySection').querySelector('h2').innerText = 'Woopsy ! No results. Try another search term';
    } else {
        for(let i = 0; i<dataArr.length;i++){
            if(dataArr[i].poster_path) {
                let newItem = document.createElement('div');
                newItem.innerHTML = templateMovieBox.innerHTML;
                newItem.querySelector('img').setAttribute('src', `http://image.tmdb.org/t/p/w300/${dataArr[i].poster_path}` )
                newItem.querySelector('.title').innerText = dataArr[i].title;
                newItem.querySelector('.year').innerText = dataArr[i].release_date.slice(0,4);
                newItem.querySelector('.rating').innerText = dataArr[i].vote_average;
                newItem.querySelector('.genre').innerText = `${getGenre(dataArr[i].genre_ids)}`;
                displaySection.appendChild(newItem);
                newItem.addEventListener('click', ()=>{
                    clickMovie(dataArr[i], dataArr[i].id)
                })
            }
        }
    }
}


// CLICK MOVIE
async function clickMovie(movie, id){
    let res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=112ca2b68890cedc6cd02c2b81593072&language=en-US`);
    let vidData = await res.json()
    vidData = vidData.results[0].key

    res = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=112ca2b68890cedc6cd02c2b81593072`);
    const castData = await res.json();
    openModal(movie, vidData, castData);
}

// OPEN MODAL
async function openModal(dataArr, vid, cast){
    let newModal = document.createElement('div');
    newModal.innerHTML = templateMovieModal.innerHTML;
    newModal.querySelector('.title').innerText = dataArr.title;
    newModal.querySelector('.year').innerText = dataArr.release_date.slice(0,4);
    newModal.querySelector('.overview').innerText = dataArr.overview;
    newModal.querySelector('.genre').innerText = `${getGenre(dataArr.genre_ids)}`;
    newModal.querySelector('.cast').innerHTML = `
        <span>Cast:</span><br> ${getCast(cast)}
    `;
    newModal.querySelector('.modal-box__video').innerHTML = `
    <iframe width="560" height="315" src="https://www.youtube.com/embed/${vid}" frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen></iframe>
    `
    modalPlaceholder.appendChild(newModal);
    newModal.querySelector('.close').addEventListener('click', ()=>{
        newModal.remove();
    })
}

// FUNCTION GET CAST : TAKES CAST DATA ARR RETURNS STRING

function getCast(cast) {
    let castArr = [];
    for(let i=0; i<4;i++){
        castArr.push(cast.cast[i].name)
    }
    return castArr.join('<br>')
}

// FUNCTION GET GENRE : TAKES IDS AND RETURNS STRINGS

function getGenre(ids){
    let genresArr = [];
    ids.forEach((e)=>{
        for (let i = 0; i<genresByID.length;i++){
            if (e === genresByID[i].id) {
                genresArr.push(genresByID[i].name)
            }
        }
    })
    return genresArr.join(' - ')
}

// FETCH GENRES DATA TO USE IT LATER

let genresByID;

fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`)
.then(res=>res.json())
.then(data=>{
    genresByID = data.genres;
})

fetchMovie('https://api.themoviedb.org/3/movie/popular?api_key=112ca2b68890cedc6cd02c2b81593072&language=en-US&page=1')