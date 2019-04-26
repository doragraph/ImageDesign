
/////////Display images//////////
window.onload = function () {

var user = getUserInfo();

var allImages = "";

/*
for (var i = 0; i < 298; i++) {
  var width = getRandomSize(200, 400);
  var height =  getRandomSize(200, 400);
  
  allImages += '<img class="myImg" src="http://lorempixel.com/'+width+'/'+height+'/sports" id='+i+'_id alt="pretty kitty" onclick="openpopup(this.src)">';
  
}*/
var totalinrow = 20;
var row = 1;
var col = 1;

var image_info, name;
var imgurl = getImages();
var imginfo = imgurl[1];

imginfo = sortByKey(imginfo, 'sort');

//console.log(imginfo);

for (var i = 0, j = imginfo.length; i < j; i++) {
    
    if(imgurl[0][i] == undefined){imgurl[0][i]="image/upload.png"}
    
    if(typeof imginfo[i] === "undefined"){image_info = ""; name = ""; }
    else{
        image_info = "owner=" + imginfo[i]["owner"] + " and price=" + imginfo[i]["price"];
        introduction = String(imginfo[i]["introduction"]).trim();
    }
    //allImages += '<img class="myImg" src='+ imgurl[0][i] +' id='+i+'_id onclick="openpopup(this.src,\''+image_info+'\');" title="'+introduction+'" alt="">';
    allImages += '<div class="blog" id=' + row + '_'+col+'_div><img class="myImg" src='+ imgurl[0][i] +' id='+i+'_id onclick="openpopup(this.src,\''+image_info+'\');" title="'+introduction+'" alt=""></div>';

}
//$('#photos').append(allImages);
$('#blogPosts').append(allImages);

};

//////////////////Open ModalPopup/////////////////
function openpopup(src,info){
    var modal = document.getElementById('myModal');
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");

    modal.style.display = "block";
    modalImg.src = src;
    captionText.innerHTML = info;

}

// When the user clicks on <span> (x), close the modal
function closepopup(){
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
}


////// Getimages from api ///////////////////////////
function getImages()
{
  var imagearr = [];
  var imageinfo = [];
  
  var request = new XMLHttpRequest();
  request.open('GET', 'http://192.168.51.212:3368/casigo/sDAGpixel', false);
  request.onload = function () {
  var data = JSON.parse(this.response);
  if (request.status >= 200 && request.status < 400) {
    for(var j=0;j<data.length;j++) {
      imagearr.push(data[j].url);
      imageinfo.push({"owner":data[j].owner,"price":data[j].price, "introduction":data[j].introduction, "sort":data[j].sort});
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
  //request.open('GET', 'http://192.168.51.212:3368/casigo/sDAGpixel', false);
  request.open('GET', 'http://192.168.51.212:3368/casigo/sDAGinfo', false);
  request.onload = function () {
  var data = JSON.parse(this.response);
  console.log(data);
  if (request.status >= 200 && request.status < 400) {

    var objectNames = Object.keys(data);
    var th_users = objectNames[0];
    var th_transaction = objectNames[3];

    document.getElementById("24h_transaction").innerHTML = data[th_transaction];
    document.getElementById("24h_users").innerHTML = data[th_users];
    document.getElementById("sc_bal").innerHTML = data.contactBalance;
    document.getElementById("total_transaction").innerHTML = data.totalTransaction;
    document.getElementById("total_users").innerHTML = data.totaluser;
  } else {
    console.log('error');
    }
  }
  // Send request
  request.send(null);

  return a;
}



