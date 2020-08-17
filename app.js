var express = require('express');
var axios = require('axios');
var circularJSON = require('circular-json');

var app = express();
var PORT = process.env.PORT || 3000;

app.get('/:url*',(req,res)=>{
    var url = `https://${req.params.url}${req.params[0]}`;
    
    var queriesName = Object.keys(req.query);
    var queriesValue = Object.values(req.query);

    if(queriesName.length!=0)
    {
        var n = queriesName.length;
        url=url+'?';
        for(let i=0;i<n;i++)
        {
            url=url+`${queriesName[i]}=${queriesValue[i]}`;
            if(i!=(n-1))
                url=url+'&';
        }
    }

    res.set('Access-Control-Allow-Origin','*');

    axios.get(url,{
        crossDomain : true
    }).then((response)=>{
        var obj = JSON.parse(circularJSON.stringify(response));
        obj.headers["access-control-allow-origin"] = "*";
        res.send(obj);
    }).catch((e)=>{
        res.send({
            url : url,
            status : 400
        });
    })
})

app.listen(PORT,()=>{
    console.log(`Server running at port ${PORT} !`);
})
