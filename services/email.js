'use strict'
import { createTestAccount, createTransport, getTestMessageUrl } from "nodemailer";

createTestAccount((err, account) => {
  let transporter = createTransport({
    host: 'smtp.gmail.com',
    port: '465',
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass
    }

  })

  let mailoptions = {
    from : '"server 👻"<spaservercloudpri@gmail.com>',
    to: 'Holaa',
    text: 'Helllo',
    html: '<h1>Hello</h1>'
  }

  transporter.sendMail(mailoptions, (err, info) =>{
    if(err){
      return new Error(`${err}`)
    }
    console.log(`${info.messageId}`)
    console.log(`${getTestMessageUrl(info)}`)
  })

})

