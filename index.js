require('dotenv').config({path: '.env'})
const { GOOGLE_API_KEY, SEARCH_ENGINE_ID, MONGO_DB_URL } = process.env;

const express = require('express');
const app = express();
const { request } = require('./request');
const ResultModel = require('./model');
const mongoose = require('mongoose');

const PORT = 3000;
const terms = "covid"
const country = "countryCA"
const dateRange = 2;

app.get('/', (req, res, next) => new Promise(async(resolve, reject) => {
    try {
        let response = [];
        const firstResults = await request({ key: GOOGLE_API_KEY, id: SEARCH_ENGINE_ID, terms, country, dateRange })
        if(firstResults.error) {
            return reject( res.send({
                code: ((firstResults|| {}).error || {}).code || 404, 
                message: ((firstResults || {}).error || {}).message || "Could not hit Google Search API",
                error: firstResults.error 
            }))
        }
        let maxResults = ((firstResults || {}).searchInformation || {}).totalResults || 0;
        
        // Since we are using the free tier of the GOOGLE SEARCH API, the no. of request that can be made per day are limited for an API key
       
        // REMOVE THIS BELOW LINE OF CODE to fetch all the results
        maxResults = 10; // <<
        // REMOVE THIS ABOVE OF CODE to fetch all the results
        
        const requestLoop = async() => {
            for(let i = 0 ; i < maxResults/10 ; i ++) {
                const partialResponse = await request({ key: GOOGLE_API_KEY, id: SEARCH_ENGINE_ID, terms, country, dateRange, index: (1+ (i*10)) }); // index refers to the index of the starting element of the total list. Each list contains ten elements including the start index.
                if(partialResponse.error) {
                    return reject( res.send({
                        code: ((partialResponse|| {}).error || {}).code || 404, 
                        message: ((partialResponse || {}).error || {}).message || "Could not hit Google Search API",
                        error: partialResponse.error 
                    }))
                }
                response.push(...partialResponse.items);
            }
        }
        await requestLoop();

        response.forEach(async(element) => {

            if( ((element || {}).pagemap || {}).metatags ) {
               
                const dates = Object.values(element.pagemap.metatags[0]);
                const object = {
                    url: element.link,
                    title: element.title,
                    publicationName: element.displayLink,
                }
                if(dates.length > 1 && new Date(dates[1]) >= new Date(new Date().setDate(new Date().getDate() - dateRange)) ){ // Checking if the modified time of the article is present and if it lies within past 2 days
                    Object.assign(object, { date: new Date(dates[1]) });
                    const data = new ResultModel(object);
                    await data.save()
                    console.log(data._doc)
                }
                else if ( new Date(dates[0]) >= new Date(new Date().setDate(new Date().getDate() - dateRange)) ) { // Checking if the published time of the article is present and if it lies within past 2 days
                    Object.assign(object, { date: new Date(dates[0]) });
                    const data = new ResultModel(object);
                    await data.save()  
                    console.log(data._doc) 
                }
            }
        })
        return resolve(res.send({ 
            code: 200,
            message: 'Success', 
        }))
    }
    catch(error) {
        console.log(error)
        return reject( res.send({
            code: ((error|| {}).error || {}).code || 500, 
            message: ((error || {}).error || {}).message || "Some Error",
            error: error 
        }))
    }
}))

// Connecting to the database.
mongoose.connect(MONGO_DB_URL, (err) => {
    if(!err)
        console.log("Database Connected")
    else {
        console.log(err)
    }
})

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
}) 