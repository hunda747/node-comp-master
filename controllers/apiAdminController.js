const jwt = require("jsonwebtoken");
const config = require("../config/authConfig.js");
const nodemailer = require("nodemailer");
const AdminUser = require('../models/adminUser');
const Request = require('../models/request');

exports.getUser = async(req, res, next) => {
    const userName = String(req.headers["username"]);
    const password = String(req.headers["password"]);

  if(!userName || !password){
     return res.status(400).send({ error: 'userName or password missing from request' });
  }
  //create adminUser model nd its method to find user by unam
  AdminUser.findOne(userName)
    .then(user => {
      if (!user || user[0].length === 0) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = (password === user[0][0].password);


      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ userName: user.userName }, config.secret, {
        expiresIn: 86400 // 24 hours //replaces login
      });

        res.status(200).send({
          userName: user.userName,
          accessToken: token
        });
      
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}
//get status:pending reqs
exports.getRequest = async(req, res, next) => {
  const request =await Request.fetchNew();

  return res.status(200).send({
    req: request[0],
    status: request[0].status
  });
  
}

//get all reqs
exports.getHistory = async(req, res, next) => {
  const request =await Request.fetchAll();
  return res.status(200).send({req: request[0]});
}

//get req by id
exports.getProduct = (req, res, next) => {
  const reqId = req.params.requestId;

  Request.findById(reqId)
  .then(([row, fieldData]) => {
  return res.status(200).send({req: row[0]});

  })
  .catch(err => console.log(err));
}

//shld verify that id is req that is pending but doesnt
exports.getEmail = async (req, res, next) => {
  // let email = req.body.email_adress;
  // const id = req.body.id;
  // const message = req.body.response;
  const id = req.params.id;
  const message = req.params.message;

  let email = 'hundaolnk@gmail.com';
  Request.changeStatus(message, id);
  
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'agnes.lockman80@ethereal.email', // generated ethereal user
      pass: 'XRz9BuZ9eXTW4FMDCR', // generated ethereal password
    },
  });

  const msg = {
    from: '"The express app" <foo@example.com>', //  sender address
    to: email, // list of receivers
    subject: "sup", // Subject line
    text: req.body.response, // plain text body
  }

  // send mail with defined transport object
  let info = await transporter.sendMail(msg);

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  const request =await Request.fetchNew();
  // res.render('admin/request', {req: request[0]});
  return res.status(200).send({message: "request approved successfuly", req: request[0]});

}
