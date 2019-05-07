var ipaddress = '13.75.117.140';
//var ipaddress = '192.168.51.212';
var port = '3368';


/////////Display images//////////
window.onload = function () {

var user = getUserInfo();

var allImages = "";

var totalinrow = 20;
var row = 1;
var col = 1;

var image_info, name;
var imgurl = getImages();
var imginfo = imgurl[1];

imginfo = sortByKey(imginfo, 'sort');


//console.log(imginfo);

for (var i = 1, j = 50; i < j; i++) {
    
    //if(imgurl[0][i] == undefined){imgurl[0][i]="image/upload.png"}
    if(imginfo[i]["url"] == undefined){imginfo[i]["url"]="image/upload.png"}
    
    if(typeof imginfo[i] === "undefined"){image_info = ""; name = ""; introduction = ""; }
    else{
        image_info = imginfo[i]["owner"] + "," + imginfo[i]["price"]+ "," +String(imginfo[i]["introduction"]).trim()+ "," +imginfo[i]["address"];
        introduction = String(imginfo[i]["introduction"]).trim();
    }

    var coordinateno = i;
    //allImages += '<img class="myImg" src='+ imgurl[0][i] +' id='+i+'_id onclick="openpopup(this.src,\''+image_info+'\');" title="'+introduction+'" alt="">';
    allImages += '<div class="blog" id=' + row + '_'+col+'_div><img class="myImg" src='+ imginfo[i]["url"] +' id='+coordinateno+' onclick="openpopup(this.id,this.src,\''+image_info+'\');" title="'+introduction+'" alt="" onerror="this.onerror=null;this.src=\'https://media1.giphy.com/media/j5QUSpXVuwtr2/giphy.gif?cid=790b76115ccc211b71584e665985d92f&rid=giphy.gif\';"></div>';
    
}


$('#blogPosts').append(allImages);

$('[id="inputurl"]').on('change', function() {
  $('#img02').attr('src', this.value);
  CheckImagedataempty();
});

$('[id="txtintro"]').on('change', function() {
  CheckImagedataempty();
});

};

//////////////////Open ModalPopup/////////////////
function openpopup(id,src,info){
    var modal = document.getElementById('myModal');
    var modalImg = document.getElementsByName("img01")[0];
    var captionText = document.getElementById("caption");

    modal.style.display = "block";
    modalImg.src = src;
    modalImg.id = id;
    var imginfoarray = info.split(",");

    var weiprice = imginfoarray[1].trim();
    var etherprice = weiprice / 1000000000000000000;
    console.log(etherprice);

    document.getElementById('weiprice').value = weiprice;

    document.getElementById("span_owner").innerHTML = imginfoarray[0].trim();
    document.getElementById("span_price").innerHTML = etherprice;
    captionText.innerHTML = imginfoarray[2].trim();
    document.getElementById("span_address").innerHTML = imginfoarray[3].trim();

}

// When the user clicks on <span> (x), close the modal
function closepopup(){
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
    document.getElementById("inputurl").value="";
    $('#img02').attr('src', null);
    document.getElementById("txtintro").value="";
    document.getElementById('span_inputhex').innerHTML="";
    document.getElementById('span_owner').innerHTML="";
    document.getElementById('span_price').innerHTML="";
    document.getElementById('span_address').innerHTML="";

    $('#btn_buy_meta').prop('disabled', true);
    $('#btn_buy_myether').prop('disabled', true);
    document.getElementById("weiprice").value="";

    document.getElementById('span_metalink').innerText ="";
    document.getElementById('span_metalink').href ="#";
}


////// Get images information from api ///////////////////////////
function getImages()
{
  var imagearr = [];
  var imageinfo = [];
  
  var request = new XMLHttpRequest();
  //request.open('GET', 'http://192.168.51.212:3368/casigo/sDAGpixel?limit=200', false);
  request.open('GET', 'http://'+ipaddress+':'+port+'/casigo/sDAGpixel?limit=200', false);
  request.onload = function () {
  var data = JSON.parse(this.response);
  if (request.status >= 200 && request.status < 400) {
    for(var j=0;j<data.length;j++) {
      imagearr.push(data[j].url);
      imageinfo.push({"url":data[j].url,"owner":data[j].owner,"price":data[j].price, "introduction":data[j].introduction, "sort":data[j].sort, "address":data[j].address});
    }
  } else {
    console.log('error');
    }
  }
  // Send request
  request.send(null);

  return [imagearr,imageinfo];
}

//sort array by key
function sortByKey(array, key) {
  return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

////// Get header information from api ///////////////////////////
function getUserInfo()
{
  var b = document.getElementById("24h_users").innerHTML;
  var a = [];
  
  var request = new XMLHttpRequest();
  request.open('GET', 'http://'+ipaddress+':'+port+'/casigo/sDAGinfo', false);
  //request.open('GET', 'http://192.168.51.212:3368/casigo/sDAGinfo', false);
  request.onload = function () {
  var data = JSON.parse(this.response);
  //console.log(data);
  if (request.status >= 200 && request.status < 400) {

    //var objectNames = Object.keys(data);
    //var th_users = objectNames[2];
    //var th_transaction = objectNames[1];

    document.getElementById("24h_transaction").innerHTML = data.TFHtransaction;
    document.getElementById("24h_users").innerHTML = data.TFHuser;
    document.getElementById("sc_bal").innerHTML = data.contactBalance;
    document.getElementById("total_transaction").innerHTML = data.totalTransaction;
    document.getElementById("total_users").innerHTML = data.totaluser;
  } else {
    console.log('error');
    }
  }
  // Send request
  request.send(null);
}


///Send image url, coordinate and introduction to get input hex
function sendAPIData(url,introduction,coordinateid){
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        console.log(this.responseText);
        document.getElementById("span_inputhex").innerHTML = data[0].input;
        $('#btn_buy_meta').prop('disabled', false);
        $('#btn_buy_myether').prop('disabled', false);
      }
    };
    xhttp.open("POST", "http://"+ipaddress+":"+port+"/casigo/sDAGinput",true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var input = JSON.stringify({
      "coordinate": coordinateid,
      "url": url,
      "introduction": introduction
    });
    xhttp.send(input);
}

///check if user inputs url and introduction both
function CheckImagedataempty() {
  var url = document.getElementById('inputurl').value;
  var introduction = document.getElementById('txtintro').value;
  var coordinateid = document.getElementsByName('img01')[0].id;
  if (( url != '') && (introduction != '')) {
    sendAPIData(url,introduction,coordinateid);
  }
}


async function connectMetamask(){

  //Collect param values

  var wei = Number(document.getElementById('weiprice').value);
  var weitohex = "0x" + wei.toString(16);
  var inputhex = document.getElementById('span_inputhex').innerHTML.trim();
  var smartContractaddress = document.getElementById('span_address').innerHTML.trim();

  console.log(weitohex+','+inputhex+','+smartContractaddress)

  if (typeof window.ethereum !== 'undefined'
      || (typeof window.web3 !== 'undefined')) {
      // Web3 browser user detected. You can now use the provider.
      const provider = window['ethereum'] || window.web3.currentProvider
  }
  console.log(ethereum.isMetaMask);

  try {
    const accounts = await ethereum.enable();
    console.log("account: " +  accounts[0]);

    ethereum.send({
      method: 'eth_sendTransaction',
      params: [{"from": accounts[0],
      "to": smartContractaddress,
      "gas": "0x2DC6C0", // 30400
      "gasPrice": "0x2540BE400", 
      "value": weitohex, // 2441406250
      "data": inputhex}],
      //from: web3.eth.accounts[0], // Provide the user's account to use.
      from: accounts[0],
    },function(err, transactionHash) {
      if (!err)
        console.log(transactionHash); 
        document.getElementById('span_metalink').innerText="https://kovan.etherscan.io/tx/"+transactionHash.result;
        document.getElementById('span_metalink').href="https://kovan.etherscan.io/tx/"+transactionHash.result;
        
    })

  } catch (error) {
    console.log(error === "User rejected provider access")
  }
}