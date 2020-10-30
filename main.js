//Load libraries
const express = require('express')
const handlebars = require('express-handlebars')
const fetch = require('node-fetch')
const withQuery = require('with-query').default

 


//Create PORT
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000
const API_KEY = process.env.API_KEY || ""
const NEWS_URL = "https://newsapi.org/v2/top-headlines"


/*
https://newsapi.org/v2/top-headlines
?q=trump
&country=de
&category=business
&apiKey=API_KEY
*/

//create an instance of express
const app = express()



//Configure handlebars
app.engine('hbs', handlebars({
    defaultLayout: 'default.hbs'
}))

app.set('view engine', 'hbs')

//Input API
if (API_KEY) {
    app.listen(PORT, function(){
        console.info(`Application started on port ${PORT} at ${new Date()}`)
        console.info(`with key ${API_KEY}`)
    })
} else {
    console.error('API_KEY is not set')
}

app.use(express.static(__dirname + '/images'))
app.use(express.static(__dirname + '/static'))

// Layer the caching in front of the other routes



app.get('/', (req, res) => {
    res.status(200)
    res.type('text/html')
    res.render('index')
})

app.get('/search', async (req, resp) => {
    const search = req.query['searchNews']
    const countries = req.query['country']
    const category = req.query['catergories']
    
    console.info('searchNews: ', search)
    console.info('country: ', countries)
    console.info('Category: ', category)

    //construct the url with the query parameter
    const url = withQuery(
        NEWS_URL,
        {
            apikey: API_KEY,
            q: search,
            country: countries,
            category: category
            

        }
    )
   
    const result = await fetch(url)
    // // then(result => {})
    const headline = await result.json()
     
    console.info('Top headline: ', headline)

    const headline_array=[]
    const articles = headline["articles"]

   
    for (let i = 0; i < articles.length; i++){
        const title = articles[i]["title"]
        const images = articles[i]["urlToImage"]
        const summary = articles[i]["description"]
        const date = articles[i]["publishedAt"]
        const url_link = articles[i]["url"]
        headline_array.push({title, images, summary, date, url_link})
    }

    
    resp.status(200)
    resp.type('text/html')
    resp.render('search', {
        
        headline_array,
        hasContent: headline_array.length > 0
        
    })

    
    
})






