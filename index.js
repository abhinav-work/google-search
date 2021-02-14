require('dotenv').config({path: '.env'})
const { GOOGLE_API_KEY, SEARCH_ENGINE_ID } = process.env;

const express = require('express');
const app = express();
const PORT = 3000;
const { request } = require('./request');
const terms = "covid"
const country = "countryCA"
const dateRange = 2;

app.get('/', (req, res, next) => new Promise(async(resolve, reject) => {
    try {
        let response = [];
        for(let i = 0 ; i < 1 ; i ++) {
            const partialResponse = await request({ key: GOOGLE_API_KEY, id: SEARCH_ENGINE_ID, terms, country, dateRange, index: (1+ (i*10)) })
            if(partialResponse.error) {
                return reject(res.send({code: response.error.code, err: response}))
            }
            response.push(...partialResponse.items);
        }

        const finalResponse = [];
        response.length ? response.forEach(element => {
           
            if( ((element || {}).pagemap || {}).metatags ) {
                const dates = Object.values(element.pagemap.metatags[0]);
                const object = {
                    Url: element.link,
                    Title: element.title,
                    PublicationName: element.displayLink,
                }
                if(dates.length > 1 && new Date(dates[1]) >= new Date(new Date().setDate(new Date().getDate() - dateRange)) ){
                    Object.assign(object, { Date: new Date(dates[1]) });
                    finalResponse.push(object)
                }
                if ( new Date(dates[0]) >= new Date(new Date().setDate(new Date().getDate() - dateRange)) ) {
                    object.Date = new Date(dates[0]);
                    finalResponse.push(object);
                }
            }
        }) : response
        return resolve(res.send({ code: 200, success: finalResponse}))
    }
    catch(err) {
        return reject(res.send({code: 500, err}))
    }
}))

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
}) 