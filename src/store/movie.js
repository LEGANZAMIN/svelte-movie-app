import axios from 'axios'
import _unionBy from 'lodash/unionBy'
import { writable, get } from "svelte/store";

export const movies = writable([])
export const loading = writable(false)
export const theMovie = writable({})
export const message = writable('Search for the movei title!')

export function initMovies() {
  movies.set([])
  message.set('Search for the movei title!')
  loading.set(false)
}

export async function searchMovies( payload ){
  if (get(loading)) return
  loading.set(true)
  message.set('')

  //const { title, type, year, number }  = payload

  let total = 0
  try{
    // const res = await _fetchMovie({
    //   ...payload,
    //   page: 1
    // })
    const res = await axios.post('/.netlify/functions/movie', {
      ...payload,
      page: 1
    })
    const { Search, totalResults } = res.data
    movies.set(Search)
    total = totalResults
  } catch(msg){
    movies.set([])
    message.set(msg)
    loading.set(false)
    return
  }



  // 14 / 10  ==> 1.4 ==> 2
  // 7 / 10 ==> 0.7 ==> 1
  // 63 / 10 ==> 6.3 ==> 7
  const pageLength = Math.ceil( total / 10 )

  if( pageLength > 1 ){
    for( let page=2; page <= pageLength; page += 1) {
      if( page > (payload.number / 10)) break
      // const res = await _fetchMovie({
      //   ...payload,
      //   page
      // })
      const res = await axios.post('/.netlify/functions/movie', {
        ...payload,
        page
      })

      console.log('for', res)
      const { Search } = res.data
      // movies.update( $movies => {
      //   $movies.push(...Search)
      //   return $movies
      // })
      movies.update( $movies => _unionBy($movies, Search, 'imdbID') )
    }
  }

  loading.set(false)
  //console.log('movies',process.env.NODE_ENV)
  //console.log('movies', get(movies))
}


export async function searchMovieWithId( id ){
  if( get(loading) ) return
  loading.set(true)

  const OMDB_API_KEY = 'a0549839'

  // const res = await _fetchMovie({
  //   id
  // })
  const res = await axios.post('/.netlify/functions/movie', {
    id
  })
  console.log(res)
  theMovie.set(res.data)

  loading.set(false)
}

// function _fetchMovie( payload ) {
//   const { title, type, year, page, id } = payload
//   const OMDB_API_KEY = 'a0549839'
//
//   const url = id
//     ? `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`
//     : `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`
//
//   return new Promise( async (resolve, reject ) => {
//     try {
//       const res = await axios.get(url)
//       if (res.data.Error) {
//         reject(res.data.Error)
//       }
//
//       resolve(res)
//     } catch (error){
//       console.log(error.message.status)
//       reject(error.message)
//
//     }
//   })
//
// }