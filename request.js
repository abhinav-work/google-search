const https = require('https');
const opt = {
    hostname: "customsearch.googleapis.com",
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
};


// GET https://customsearch.googleapis.com/customsearch/v1?key=[YOUR_API_KEY] HTTP/1.1


exports.request = ({ key, id, terms, country, dateRange, index = 1 }) => new Promise (async(resolve, reject) => { 
    try{

        if(!(key && id && terms && country && dateRange && index)) {
            return reject({ code: 400, message: 'Missing one of the following parameters: key, id, terms, country, dateRange or index.' })
        }

        const dateNow = new Date().toISOString().split('T')[0].split('-').join('') // Current Date and Time in the API accepted format
        const dateFrom = new Date(new Date().setDate(new Date().getDate() - dateRange)).toISOString().split('T')[0].split('-').join('') // // Custom Past Date and Time in the API accepted format from which results are to be included, which in this case is past 2 days.
       
        opt.path = `/customsearch/v1?key=${key}&cx=${id}&exactTerms=${terms}&cr=${country}&q=news&orTerms=article&fields=searchInformation,items(title,link,displayLink,pagemap(metatags(article:published_time,article:modified_time)))&dateRestrict=d${dateRange}&sort=date:r:${dateFrom}:${dateNow}&start=${index}`; 
       
        const req = https.request(opt, (res) => {
            const chunks = [];
    
            res.on('data', (chunk) => {
                chunks.push(chunk);
            });
    
            res.on('end', () => {
                const body = Buffer.concat(chunks);
                return resolve(JSON.parse(body.toString()));
            });
        });
        req.write('daa');
        req.end();
        req.on('error', e => { return reject(e) }) 
    }
    catch(err) {
        return reject(err)
    }
})