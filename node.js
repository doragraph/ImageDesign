
const Web3 = require('web3');
const web3 = new Web3('https://kovan.infura.io');

//web3.eth.getBalance('0x9E632F36D8193a23ee76e7C14698aCF4b92869A2').then(console.log)

function delay(ms){ // takes amount of milliseconds
    // returns a new promise
    return new Promise(function(resolve, reject){
      setTimeout(function(){ // when the time is up
        resolve(); // change the promise to the fulfilled state
      }, ms);
    });
  }
  
  function getSmartContractBalance(){
    // we're RETURNING the promise, remember, a promise is a wrapper over our value
    return delay(100).then(function(){ // when the promise is ready
        return web3.eth.getBalance('0x9E632F36D8193a23ee76e7C14698aCF4b92869A2'); // return the value 5, promises are all about return values
    })
  }
  // we _have_ to wrap it like this in the call site, we can't access the plain value
  getSmartContractBalance().then(function(bal){ 
    bal = bal / 1000000000000000000;
    document.getElementById("sc_bal").innerHTML = bal;
  });


