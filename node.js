
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


window.addEventListener('load', function load(event){
  
  var createButton = document.getElementById('btn_buy_cic');
  createButton.addEventListener('click', function() { 
    
    //var laserExtensionId = "oapeiebamdabkniagfepfndnachjoieg";
    var laserExtensionId = "haekjhhgkhihfpijloeidmnhehmlbdml" //Remove this when push

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

  $("#txt_inputprice").on('change', function() {
    var etherprice = this.value;
    var wei = etherprice * 1000000000000000000;
    document.getElementById('weiprice').value = wei;
    CheckImagedataempty();
  });

  //Allow only numbers and "." in textbox. 
  $('#txt_inputprice').keypress(function(event) {
    if (((event.which != 46 || (event.which == 46 && $(this).val() == '')) ||
            $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
  }).on('paste', function(event) {
    event.preventDefault();
  });

  //Block user from adding sigle and double quotes in introduction.
  $("#txtintro").on('input', function () {
    var value = $(this).val().replace(/'/g, '').replace(/"/g, '');
    $(this).val(value);
  });

});