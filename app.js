var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var nodeMailer = require("nodemailer");
var dotenv = require("dotenv");

dotenv.config();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())

app.set("view engine", "ejs");
app.use(express.static("public"));


app.get("/", function (req, res) {
    res.render("index")
});

app.post("/send-email", function (req, res) {
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone-number: ${req.body.phone}</li>
        </ul>
        <h3>Message Details</h3>
        <p>${req.body.message}</p>
    `
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.myEmail,
            pass: process.env.myPass,
        }
    });
    let mailOptions = {
        from: '"Portfolio contact" <marowmars@gmail.com>', // sender address
        to:  'marowmars@gmail.com', // list of receivers
        subject: 'Important mail from my Portfolio', // Subject line
        number: req.body.phone, //Shows the number
        html: output // html body
        
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        res.render('index');
    })
})


app.listen(process.env.PORT || 3000, function () {
    console.log(`Your port is ${process.env.PORT}`);
})