'use strict';
// IMPORTS
const express = require('express');
const unirest = require('unirest');

// SERVER 
const server_3dpassport_service = "https://3dpassport.yenaplus.com/3dpassport"
const server_3dspace_service = "https://3dspace.yenaplus.com/3dspace"
const server_username = "mirac.cicek"
const server_password = "enoviaV6"
const server_rememberme = "no"


// CONSTS 
const app = express();
const PORT = 8085;
const HOST = '0.0.0.0';


// ASYNC FUNCTIONS
async function get_login_ticket() {
  return new Promise((resolve, reject) => {
    let resObj
    let url = server_3dpassport_service + "/login?action=get_auth_params";
    unirest.get(url)
      .headers({
        'Accept': 'application/json',
        'Cookie': 'JSESSIONID=C1EC4492415FEA07A749482FD244E698; afs=fb2f7f70-3b3b-44fd-a54f-5f9e8c5afe1d'
      })
      .strictSSL(false)
      .end(function (res) {
        resObj = JSON.parse(res.raw_body)
        resolve(resObj.lt)
      })
  })
}

async function get_authentication(loginTicket) {
  return new Promise((resolve, reject) => {
    var req = unirest('GET', 'https://3dpassport.yenaplus.com/3dpassport/login?service=https://3dspace.yenaplus.com/3dspace/resources/modeler/pno/person?current=true%26tenant=OnPremise%26select=collabspaces%26select=preferredcredentials')
      .headers({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Accept': 'application/json',
        'Cookie': 'CASTGC=TGT-142-UslVHTLeJoT4bPgphZbaqZPlTKiVcJXaGeeh17hNQWELUUeeV9-cas; CASTGC=TGT-142-UslVHTLeJoT4bPgphZbaqZPlTKiVcJXaGeeh17hNQWELUUeeV9-cas; JSESSIONID=C1EC4492415FEA07A749482FD244E698; afs=13a4d249-6ca7-4927-b25a-f2eb48148810'
      })
      .send('lt=' + loginTicket)
      .send('username=mirac.cicek')
      .send('password=enoviaV6')
      .send('rememberMe=no').strictSSL(false)
      .end(function (res) {
        resolve(res.raw_body)
      })
  })
}

async function get_csrf_token() {
  return new Promise((resolve, reject) => {
    var req = unirest('GET', 'https://3dspace.yenaplus.com/3dspace/resources/v1/application/CSRF?tenant=OnPremise')
      .strictSSL(false)
      .end(function (res) {
        console.log(res.error)
        resolve(res.raw_body)
      });
  })
}


// MAIN FUNCTION
async function get_derived_output() {
  const login_ticket = await get_login_ticket()
  const authent = await get_authentication(login_ticket)
  const csrf_token = await get_csrf_token();
  console.log(csrf_token)

}
 
// Routes
app.get('/', (req, res) => {
  res.send("Test1");
  get_derived_output()
})

app.listen(PORT, HOST, () => {
  console.log("Derived Output RestAPI Integration Service Started ... - 2022");
  console.log(PORT + " listening....")
})



