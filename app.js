const express = require("express"); 
const bodyParser = require("body-parser"); 
const https = require("https"); 
const { dir } = require("console");
const { dirname } = require("path");
// const request = require("request");

const app = express(); 
const port = process.env.PORT; 

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res)=> {

    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req,res)=>{
    const firstName = req.body.fName; 
    const lastName = req.body.lName; 
    const email = req.body.email; 

    var data = {
        members: [
            {
                email_address: email, 
                status: "subscribed", 
                merge_fields: {
                    FNAME: firstName, 
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data); 

    const url = "https://us11.api.mailchimp.com/3.0/lists/0fe0d994be";
    
    const options = {
        method: "POST", 
        auth: "rodri1:f65a6de8c66a3e07016ff5c179d74e5c-us11"
    }

    const request = https.request(url, options, (response)=>{
        if(response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", (data)=>{
            console.log(JSON.parse(data));
        });
    });

    //request.write(jsonData);
    request.end(); 
    
});

app.post("/failure", (req,res)=>{
    res.redirect("/");
    
});


// LISTEN
app.listen(port, ()=>{
    console.log("Server is running in port " + port);
});

//api key: f65a6de8c66a3e07016ff5c179d74e5c-us11

//Audience id: 0fe0d994be