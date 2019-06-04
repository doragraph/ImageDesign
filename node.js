
const Web3 = require('web3');
const web3 = new Web3('https://kovan.infura.io');


const sdag = require('sdagsign');

var nonce;

function delay(ms) { // takes amount of milliseconds
  // returns a new promise
  return new Promise(function (resolve, reject) {
    setTimeout(function () { // when the time is up
      resolve(); // change the promise to the fulfilled state
    }, ms);
  });
}

function getSmartContractBalance() {
  // we're RETURNING the promise, remember, a promise is a wrapper over our value
  return delay(100).then(function () { // when the promise is ready
    return web3.eth.getBalance('0x9E632F36D8193a23ee76e7C14698aCF4b92869A2'); // return the value 5, promises are all about return values
  })
}
// we _have_ to wrap it like this in the call site, we can't access the plain value
getSmartContractBalance().then(function (bal) {
  bal = bal / 1000000000000000000;
  document.getElementById("sc_bal").innerHTML = bal;
});


function SignTransaction() {
  const pri = 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb';

  let account = new sdag.Accounts.NewAccount(pri)
  console.log('Private Key: ' + account.GeneratePrivateKey("1123"));
  console.log('Address: ' + account.Address);
  console.log('Public Key:' + account.PublicKey);

  if (typeof (Storage) !== "undefined") {
    localStorage.privatekey = pri;
    localStorage.address = account.Address;
    localStorage.publickey = account.PublicKey;
  } else {
    console.log('Sorry! No Web Storage support..');
  }

  nonce = getNonce();

  var weibal = Number(document.getElementById('weiprice').value);
  var weitohexbal = "0x" + weibal.toString(16);
  var SMB = document.getElementById('span_address').innerHTML;
  var inputhex = document.getElementById('span_inputhex').innerHTML;
  console.log(nonce);
  
  sendSignTransaction(SMB, weitohexbal, String(nonce), "aaa", inputhex, localStorage.privatekey)
}
window.SignTransaction = SignTransaction;

function getNonce() {
  var request = new XMLHttpRequest();
  request.open('GET', 'http://192.168.51.203:9006/getAccount?address=5428d8cb7de5926ce93aa9e63a499225a9df1fb2', false);
  request.onload = function () {
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      nonce = data.Nonce;
    } else {
      console.log('error');
    }
  }
  // Send request
  request.send(null);
  return nonce;
}

function sendSignTransaction(address, balance, nonce, type1, input1, privatekey) {

  var jdata = { 
    "fee":"100000000000000000", 
    "address":"b6bc21a512ea1043827e5b0af50f1d3c276be502", 
    "balance": "2000000000000000000", 
    "nonce":0, 
    "type":"bnn", 
    "input":"", 
    "PrivateKey":"eee21c84089ca7515d476a389f537d86edc80eb2c7b9d60c0c77d16ff40d2c87", 
    "crypto":"cic" 
    } 

  $.ajax({
    url: "http://192.168.51.212:9999/signTransaction",
    type: "POST",
    dataType: "json",
    ContentType: "text/plain; charset=UTF-8",
    data: JSON.stringify(jdata),
    success: function (response) {
      
      var result = JSON.stringify(response);
      console.log(result);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.status);
      console.log(textStatus);
      console.log(errorThrown);
    }

  });

}

window.addEventListener('load', function load(event){
  
  var createButton = document.getElementById('btn_buy_trust');
  createButton.addEventListener('click', function() { 
    
    var laserExtensionId = "igckbpgmlpgodblmhgjlkejcpldfpbgg";

    var weibal = Number(document.getElementById('weiprice').value);
    var weitoether = weibal / 1000000000000000000;
    var SMB = document.getElementById('span_address').innerHTML;
    var inputhex = document.getElementById('span_inputhex').innerHTML;
    inputhex = inputhex.replace('0x','');
    SMB = SMB.replace('0x','');
    var sendtrdetails = [SMB,weitoether,inputhex];

    chrome.runtime.sendMessage(laserExtensionId, sendtrdetails,
    function(response) {
      
    });
  });
});