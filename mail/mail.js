const path = require('path')
const nodemailer = require("nodemailer")
const adminEmail = "tnvrahmed98@zohomail.in"
const config = require('config');
const sendMessageEmail = async (data)=>{
    const {email,fName,lName,mobile , message } = data;
    const output = `
    <p> You have a new Query Message</p>
    <h3> Contact Details</h3>
    <ul>
        <li> Name: ${fName} ${lName}</li>
        <li> Contact No : ${mobile}</li>
        <li> Email: ${email}</li>
    </ul>
    <h3> MESSAGE </h3>
    <p> ${message}</p>
`;

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: config.get('MAIL_EMAIL'),
           pass : config.get('MAIL_PASS')
      },
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `contact.crystalcoaching@gmail.com `, // sender address
        to: "crystalcoaching01@gmail.com", // list of receivers
        subject: `Message from ${fName+lName} `, // Subject line
        text: "Hello world?", // plain text body
        html: output, // html body
      });
}

module.exports = {
    sendMessageEmail
}


/*
 steps to enable Application Specific Password
    1.Login to Zoho Accounts
    2. From the left menu, navigate to Security and click App passwords
    3.Click Generate New Password.
 */


// Configuration steps for SMTP : https://www.zoho.com/mail/help/imap-access.html#:~:text=If%20your%20domain%20is%20hosted,format%20you%40yourdomain.com.