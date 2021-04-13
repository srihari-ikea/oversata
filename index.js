process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
fs = require('fs');
const https = require('https');

var json = false;
//let path = 'https://www.ikea.com/addon-app/localizations/officeplanner/sv_SE_20201210152706.json';
let path = 'https://www.ikea.com/addon-app/localizations/officeplanner/latest/se/en/';
let responses = [];

//function todo
function get(url, resolve, reject) {
    https.get(url, (res) => {
      if(res.statusCode === 301 || res.statusCode === 302) {

        res.headers.location = "https://www.ikea.com"+res.headers.location;

        //fetch existing file name
        fs.readFile('latest.txt', 'utf8' , (err, data) => {
            if (err) {
              console.error(err)
              return
            }
            console.log('data from file-'+data);
            console.log('res.headers.location-'+res.headers.location);

            if(ciEquals(data, res.headers.location)){
                console.log('Done.');
                json = true;
                console.log("in JSON-"+json);  
            }else{
                fs.writeFile('latest.txt', res.headers.location, function (err) {
                    if (err) return console.log(err);
                    console.log('data > latest.txt');
                  });
            }
                
          })
        console.log("out JSON-"+json);  
        return get(res.headers.location, resolve, reject)
      }
  
      let body = [];
  
      res.on("data", (chunk) => {
        body.push(chunk);
      });
  
      res.on("end", () => {
        try {
          resolve(JSON.parse(Buffer.concat(body).toString()));
        } catch (err) {
          reject(err);
        }
      });
    });
  }
  
  function ciEquals(a, b) {
    return typeof a === 'string' && typeof b === 'string'
        ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
        : a === b;
 }

  async function getData(url) {
    return new Promise((resolve, reject) => get(url, resolve, reject));
  }
  
  // call
  getData(path).then((r) => console.log(r));