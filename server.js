const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const Buffer = require('buffer').Buffer;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {

    const { fullName, email, phoneNumber, subject, message } = req.body;
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: Buffer.from(process.env.ENCODED_GMAIL, 'base64').toString('utf-8'),  
            pass: Buffer.from(process.env.ENCODED_PASSWORD, 'base64').toString('utf-8')   
        }
    });
    let mailOptions = {
        from: email,
        to: 'deb.personal.work@gmail.com',
        subject: `New message from ${fullName}: ${subject}`,
        text: `You have received a new message from your website contact form.\n\n
               Full Name: ${fullName}\n
               Email: ${email}\n
               Phone Number: ${phoneNumber}\n
               Subject: ${subject}\n
               Message:\n ${message}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Failed to send email');
        }
        console.log('Message sent: %s', info.messageId);
        res.status(200).json({ success: true });
    });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
