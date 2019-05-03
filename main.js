
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


console.log(imginfo);

for (var i = 1, j = imginfo.length; i < j; i++) {
    
    //if(imgurl[0][i] == undefined){imgurl[0][i]="image/upload.png"}
    if(imginfo[i]["url"] == undefined){imginfo[i]["url"]="image/upload.png"}
    
    if(typeof imginfo[i] === "undefined"){image_info = ""; name = ""; introduction = ""; }
    else{
        image_info = imginfo[i]["owner"] + "," + imginfo[i]["price"]+ "," +String(imginfo[i]["introduction"]).trim();
        introduction = String(imginfo[i]["introduction"]).trim();
    }

    var coordinateno = i;
    //allImages += '<img class="myImg" src='+ imgurl[0][i] +' id='+i+'_id onclick="openpopup(this.src,\''+image_info+'\');" title="'+introduction+'" alt="">';
    allImages += '<div class="blog" id=' + row + '_'+col+'_div><img class="myImg" src='+ imginfo[i]["url"] +' id='+coordinateno+' onclick="openpopup(this.id,this.src,\''+image_info+'\');" title="'+introduction+'" alt=""></div>';
    
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
    document.getElementById("span_owner").innerHTML = imginfoarray[0].trim();
    document.getElementById("span_price").innerHTML = imginfoarray[1].trim();
    captionText.innerHTML = imginfoarray[2].trim();

}

// When the user clicks on <span> (x), close the modal
function closepopup(){
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
    document.getElementById("inputurl").value="";
    $('#img02').attr('src', null);
    document.getElementById("txtintro").value="";
    document.getElementById('span_inputhex').innerHTML="";
}


////// Get images information from api ///////////////////////////
function getImages()
{
  var imagearr = [];
  var imageinfo = [];
  
  var request = new XMLHttpRequest();
  request.open('GET', 'http://192.168.51.212:3368/casigo/sDAGpixel?limit=200', false);
  request.onload = function () {
  var data = JSON.parse(this.response);
  if (request.status >= 200 && request.status < 400) {
    for(var j=0;j<data.length;j++) {
      imagearr.push(data[j].url);
      imageinfo.push({"url":data[j].url,"owner":data[j].owner,"price":data[j].price, "introduction":data[j].introduction, "sort":data[j].sort});
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
}


///Send image url, coordinate and introduction to get input hex
function sendAPIData(url,introduction,coordinateid){
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        console.log(this.responseText);
        document.getElementById("span_inputhex").innerHTML = data[0].input;
      }
    };
    xhttp.open("POST", "http://192.168.51.212:3368/casigo/sDAGinput",true);
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
