//including npm pakages
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var request = require('request');



//middlewares
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


//routes-------------------------------------------------------------------------------
app.get("/", function (req, res) {
    res.render("mutualfund.ejs");
});

app.post("/", function (req, res) {
    const mutualFundID = req.body.mutualFundId;
    const url = "https://api.mfapi.in/mf/" + mutualFundID;
    console.log(url);
    request.get({
        url: url,
        json: true,
        headers: { 'User-Agent': 'request' }
    }, (err, response, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (response.statusCode !== 200) {
            console.log('Status:', response.statusCode);
        } else {
            // data is successfully parsed as a JSON object:
            // console.log(data);
            console.log(data.data);
            const Datalist = data.data;
            const imgpath = "https://quickchart.io/chart?c={type:'line',data:{labels:['"+Datalist[0].date+"','"+Datalist[10].date+"', '"+Datalist[20].date+"','"+Datalist[30].date+"', '"+Datalist[40].date+"','"+Datalist[50].date+"','"+Datalist[60].date+"',], datasets:[{label:'"+data.meta.fund_house+"', data: ["+Datalist[0].nav+","+Datalist[10].nav+","+Datalist[20].nav+","+Datalist[30].nav+","+Datalist[40].nav+","+Datalist[50].nav+","+Datalist[60].nav+"], fill:true,borderColor:'blue'}]}}";
            console.log(imgpath);
            res.render("mutualfundinfo.ejs",{imgpath:imgpath});
        }
    });

});




//stock route----------------------------------------------------------------------------------

app.get("/stock", function (req, res) {
    res.render("stock.ejs");
});

app.post("/stock", function (req, res) {
    const stockId = req.body.StockId;
    const url = "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol="+stockId+"&apikey=EFMLDJZVJH1P7Y3C";
    const secondUrl="https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol="+stockId+"&apikey=EFMLDJZVJH1P7Y3C";
    request.get({
        url: url,
        json: true,
        headers: { 'User-Agent': 'request' }
    }, (err, response, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (response.statusCode !== 200) {
            console.log('Status:', response.statusCode);
        } else {
            const Datalist = data["Monthly Time Series"];

            const imgpath = "https://quickchart.io/chart?c={type:'line',data:{labels:['"+Object.keys(Datalist)[6]+"','"+Object.keys(Datalist)[5]+"', '"+Object.keys(Datalist)[4]+"','"+Object.keys(Datalist)[3]+"', '"+Object.keys(Datalist)[2]+"','"+Object.keys(Datalist)[1]+"','"+Object.keys(Datalist)[0]+"',], datasets:[{label:'"+data["Meta Data"]["2. Symbol"]+"', data: ["+Datalist[Object.keys(Datalist)[6]]["4. close"]+","+Datalist[Object.keys(Datalist)[5]]["4. close"]+","+Datalist[Object.keys(Datalist)[4]]["4. close"]+","+Datalist[Object.keys(Datalist)[3]]["4. close"]+","+Datalist[Object.keys(Datalist)[2]]["4. close"]+","+Datalist[Object.keys(Datalist)[1]]["4. close"]+","+Datalist[Object.keys(Datalist)[0]]["4. close"]+"], fill:true,borderColor:'blue'}]}}";

            request.get({
                url: secondUrl,
                json: true,
                headers: { 'User-Agent': 'request' }
            }, (serr, sresponse, sdata) => {
                if (serr) {
                    console.log('Error:', serr);
                } else if (sresponse.statusCode !== 200) {
                    console.log('Status:', sresponse.statusCode);
                } else {
                    const stockInfo = sdata["Global Quote"];
                    // console.log(stockInfo);
                    res.render("stockinfo.ejs",{imgpath:imgpath,stockInfo : stockInfo});
                }
            });
        }
    });

});
// -------------------------------------------------------------------------------------------------


//listen port--------------------------------------------------------------------------------------
app.listen(3000, function () {
    console.log("server started on port 3000");
});