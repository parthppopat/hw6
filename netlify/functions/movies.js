// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
// EXtract year and genre details from querystring parameters
let year = event.queryStringParameters.year
let genre = event.queryStringParameters.genre

// Check whether yrar or genre are undefined; if so, return a warning message 
if (year == undefined || genre == undefined) {
  return {
    statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    body: `Year and genre are not defined in your data` // a string of data
  }
}

// If yera and genre data is available, proceed to create output i.e. list of movies 
else {

// Generate object returnValue to store the movie count and the array of movies
  let returnValue = {
    numResults: 0,
    movies: []
  }

// Run a loop through movie listings to extract details
  for (let i=0; i < moviesFromCsv.length; i++) {

// Store each listing in memory
    let movieList = moviesFromCsv[i]
    
// Create a new movieDetails object containing the required fields    
    let movieDetails = {
      Movie_Title: movieList.primaryTitle,
      Movie_Release_Year: movieList.startYear,
      Movie_Genre: movieList.genres
    }

// Condition to include a movie in the output list only if it meets the criteria input by the user + condition to exclude movies with //N runtime and genres
    if(movieList.genres.includes(genre) && movieList.startYear == year && movieList.runtimeMinutes !== `\\N` && movieList.genres !== `\\N`){
    
// Add the filtered results to the movie list i.e. array    
    returnValue.movies.push(movieDetails)
    
// Add +1 to the movie list counter    
    returnValue.numResults=returnValue.numResults+1  
  }
}
  // a lambda function returns a status code and a string of data
return {
  statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
  body: JSON.stringify(returnValue) // a string of data
}
}
}