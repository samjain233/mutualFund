//including npm pakages
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var request = require('request');
const _ = require('lodash');
var symbol = [{name: 'tesco plc', symbol: 'TSCO.LON'},
              {name: 'ibm', symbol: 'IBM'},
              {name: 'Shopify inc', symbol: 'SHOP.TRT'},
              {name: 'green power motor company inc', symbol: 'GPV.TRV'},
              {name: 'daimler ag', symbol: 'DAI.DEX'},
              {name: 'saic motor corporation ', symbol: '600104.SHH'},
              {name: 'china vanke company ltd ', symbol: '000002.SHZ'},
              {name: 'microsoft', symbol: 'MFST'},
              {name: 'reliance', symbol: 'RELIANCE.BSE'},
              {name: 'alibaba group holding limited', symbol: 'BABA'},
              {name: 'bank of america', symbol: 'BAC'},
              {name: 'tencent holdings', symbol: 'NNND.FRK'},
              {name: 'amazon', symbol: 'AMZN'},
              {name: 'tesla', symbol: 'TSLA'},
              {name: 'tata motors', symbol: 'TATAMOTORS.BSE'},
              {name: 'google', symbol: 'GOOGL'},
              {name: 'apple', symbol: 'APPL'}]

//middlewares
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


//routes-------------------------------------------------------------------------------
app.get("/", function (req, res) {
    res.render("home.ejs");
});

//mutual fund ------------------------------------------------------------------------
app.get("/mutualfund", function (req, res) {
    res.render("mutualfund.ejs");
});

app.post("/mutualfund", function (req, res) {
    let mutualFundID = req.body.mutualFundId;
    if (typeof mutualFundID != Number) {
        const url0 = "https://api.mfapi.in/mf";
        console.log(url0);
        request.get({
            url: url0,
            json: true,
            headers: { 'User-Agent': 'request' }
        }, (err, response, data) => {
            if (err) {
                console.log('Error:', err);
            } else if (response.statusCode !== 200) {
                console.log('Status:', response.statusCode);
            } else {
                let obj = data.find((mf) => mf.schemeName == mutualFundID);
                // console.log(obj);
                mutualFundID= obj.schemeCode;
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
                        const Datalist = data.data;
                        const metaData = data.meta;
                        console.log(metaData);
                        const imgpath = "https://quickchart.io/chart?c={type:'line',data:{labels:['" + Datalist[60].date + "','" + Datalist[50].date + "', '" + Datalist[40].date + "','" + Datalist[30].date + "', '" + Datalist[20].date + "','" + Datalist[10].date + "','" + Datalist[0].date + "',], datasets:[{label:'" + data.meta.fund_house + "', data: [" + Datalist[60].nav + "," + Datalist[50].nav + "," + Datalist[40].nav + "," + Datalist[30].nav + "," + Datalist[20].nav + "," + Datalist[10].nav + "," + Datalist[0].nav + "], fill:true,borderColor:'blue'}]}}";
                        res.render("mutualfundinfo.ejs", { imgpath: imgpath, metaData: metaData });
                    }
                });
            }
        });
    }
    else {
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
                const Datalist = data.data;
                const metaData = data.meta;
                console.log(metaData);
                const imgpath = "https://quickchart.io/chart?c={type:'line',data:{labels:['" + Datalist[60].date + "','" + Datalist[50].date + "', '" + Datalist[40].date + "','" + Datalist[30].date + "', '" + Datalist[20].date + "','" + Datalist[10].date + "','" + Datalist[0].date + "',], datasets:[{label:'" + data.meta.fund_house + "', data: [" + Datalist[60].nav + "," + Datalist[50].nav + "," + Datalist[40].nav + "," + Datalist[30].nav + "," + Datalist[20].nav + "," + Datalist[10].nav + "," + Datalist[0].nav + "], fill:true,borderColor:'blue'}]}}";
                res.render("mutualfundinfo.ejs", { imgpath: imgpath, metaData: metaData });
            }
        });
    }
});


app.post("/mutualfundcmp", function (req, res) {
    const mutualFundID1 = req.body.MFId1;
    const mutualFundID2 = req.body.MFId2;
    const url1 = "https://api.mfapi.in/mf/" + mutualFundID1;
    const url2 = "https://api.mfapi.in/mf/" + mutualFundID2;
    request.get({
        url: url1,
        json: true,
        headers: { 'User-Agent': 'request' }
    }, (err, response, data1) => {
        if (err) {
            console.log('Error:', err);
        } else if (response.statusCode !== 200) {
            console.log('Status:', response.statusCode);
        } else {
            const Datalist1 = data1.data;
            const metaData1 = data1.meta;

            request.get({
                url: url2,
                json: true,
                headers: { 'User-Agent': 'request' }
            }, (serr, sresponse, data2) => {
                if (err) {
                    console.log('Error:', serr);
                } else if (sresponse.statusCode !== 200) {
                    console.log('Status:', sresponse.statusCode);
                } else {
                    const Datalist2 = data2.data;
                    const metaData2 = data2.meta;

                    const imgpath = "https://quickchart.io/chart?c={type:'line',data:{labels:['" + Datalist1[60].date + "','" + Datalist1[50].date + "', '" + Datalist1[40].date + "','" + Datalist1[30].date + "', '" + Datalist1[20].date + "','" + Datalist1[10].date + "','" + Datalist1[0].date + "',], datasets:[{label:'" + data1.meta.fund_house + "', data: [" + Datalist1[60].nav + "," + Datalist1[50].nav + "," + Datalist1[40].nav + "," + Datalist1[30].nav + "," + Datalist1[20].nav + "," + Datalist1[10].nav + "," + Datalist1[0].nav + "], fill:true,borderColor:'blue'},{label:'" + data2.meta.fund_house + "', data: [" + Datalist2[60].nav + "," + Datalist2[50].nav + "," + Datalist2[40].nav + "," + Datalist2[30].nav + "," + Datalist2[20].nav + "," + Datalist2[10].nav + "," + Datalist2[0].nav + "], fill:true,borderColor:'green'}]}}";

                    res.render("mutualfundcmp.ejs", { imgpath: imgpath, metaData: metaData1, metaData2: metaData2 });
                }
            });
        }
    });
});

//----------------------------------------------------------------------------------------------



//stock route----------------------------------------------------------------------------------

app.get("/stock", function (req, res) {
    res.render("stock.ejs");
});

app.post("/stock", function (req, res) {
    const stockId = req.body.StockId;
    const obj = symbol.find(o => o.name === _.lowerCase(stockId));
    // console.log(obj.symbol);
    const url = "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=" + obj.symbol + "&apikey=EFMLDJZVJH1P7Y3C";
    const secondUrl = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + obj.symbol + "&apikey=EFMLDJZVJH1P7Y3C";
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

            const imgpath = "https://quickchart.io/chart?c={type:'line',data:{labels:['" + Object.keys(Datalist)[6] + "','" + Object.keys(Datalist)[5] + "', '" + Object.keys(Datalist)[4] + "','" + Object.keys(Datalist)[3] + "', '" + Object.keys(Datalist)[2] + "','" + Object.keys(Datalist)[1] + "','" + Object.keys(Datalist)[0] + "',], datasets:[{label:'" + data["Meta Data"]["2. Symbol"] + "', data: [" + Datalist[Object.keys(Datalist)[6]]["4. close"] + "," + Datalist[Object.keys(Datalist)[5]]["4. close"] + "," + Datalist[Object.keys(Datalist)[4]]["4. close"] + "," + Datalist[Object.keys(Datalist)[3]]["4. close"] + "," + Datalist[Object.keys(Datalist)[2]]["4. close"] + "," + Datalist[Object.keys(Datalist)[1]]["4. close"] + "," + Datalist[Object.keys(Datalist)[0]]["4. close"] + "], fill:true,borderColor:'blue'}]}}";

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
                    res.render("stockinfo.ejs", { imgpath: imgpath, stockInfo: stockInfo });
                }
            });
        }
    });
});


app.post("/stockcmp", function (req, res) {
    const stockId1 = req.body.StockId1;
    const obj1 = symbol.find(o => o.name === _.lowerCase(stockId1));
    const stockId2 = req.body.StockId2;
    const obj2 = symbol.find(o => o.name === _.lowerCase(stockId2));
    const url1 = "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=" + obj1.symbol + "&apikey=EFMLDJZVJH1P7Y3C";
    const url2 = "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=" + obj2.symbol + "&apikey=EFMLDJZVJH1P7Y3C";

    request.get({
        url: url1,
        json: true,
        headers: { 'User-Agent': 'request' }
    }, (err, response, data1) => {
        if (err) {
            console.log('Error:', err);
        } else if (response.statusCode !== 200) {
            console.log('Status:', response.statusCode);
        } else {
            const Datalist1 = data1["Monthly Time Series"];

            request.get({
                url: url2,
                json: true,
                headers: { 'User-Agent': 'request' }
            }, (serr, sresponse, sdata) => {
                if (serr) {
                    console.log('Error:', serr);
                } else if (sresponse.statusCode !== 200) {
                    console.log('Status:', sresponse.statusCode);
                } else {
                    const Datalist2 = sdata["Monthly Time Series"];

                    const imgpath = "https://quickchart.io/chart?c={type:'line',data:{labels:['" + Object.keys(Datalist1)[6] + "','" + Object.keys(Datalist1)[5] + "', '" + Object.keys(Datalist1)[4] + "','" + Object.keys(Datalist1)[3] + "', '" + Object.keys(Datalist1)[2] + "','" + Object.keys(Datalist1)[1] + "','" + Object.keys(Datalist1)[0] + "',], datasets:[{label:'" + data1["Meta Data"]["2. Symbol"] + "', data: [" + Datalist1[Object.keys(Datalist1)[6]]["4. close"] + "," + Datalist1[Object.keys(Datalist1)[5]]["4. close"] + "," + Datalist1[Object.keys(Datalist1)[4]]["4. close"] + "," + Datalist1[Object.keys(Datalist1)[3]]["4. close"] + "," + Datalist1[Object.keys(Datalist1)[2]]["4. close"] + "," + Datalist1[Object.keys(Datalist1)[1]]["4. close"] + "," + Datalist1[Object.keys(Datalist1)[0]]["4. close"] + "], fill:true,borderColor:'blue'},{label:'" + sdata["Meta Data"]["2. Symbol"] + "', data:[" + Datalist2[Object.keys(Datalist2)[6]]["4. close"] + "," + Datalist2[Object.keys(Datalist2)[5]]["4. close"] + "," + Datalist2[Object.keys(Datalist2)[4]]["4. close"] + "," + Datalist2[Object.keys(Datalist2)[3]]["4. close"] + "," + Datalist2[Object.keys(Datalist2)[2]]["4. close"] + "," + Datalist2[Object.keys(Datalist2)[1]]["4. close"] + "," + Datalist2[Object.keys(Datalist2)[0]]["4. close"] + "], fill:true,borderColor:'green'}]}}";

                    res.render("stockcompare.ejs", { imgpath: imgpath });
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
