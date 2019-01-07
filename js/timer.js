var list1 = []; var blogPosts = [];

// creating the map and putting it at given coordinates when reloaded
// var coordinatelist = [];
// mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VwdGFzIiwiYSI6ImNqa2E3dWtlYTF1aW0zcG9oazBuMjN3ZWoifQ.VYMlnaKdcAuHgFdXkBVk9Q';
// var mapp = new mapboxgl.Map({
//   container: 'mapboi',
//   style: 'mapbox://styles/mapbox/streets-v9',
//   center: [-122.03639030456543, 37.409334912568596],
//   zoom: 10
// });

function addTimer(){
  // getting the elements from the text areas

  var data; // = {};
  if($("#blogIndex").val() ==""){
    data = {};
  }else{
    data = blogPosts[$("#blogIndex").val()];
  }
  data.title = $("#timerTitle").val();
  data.description = $("#timerDescription").val();
  data.startTime = Date.parse($("#timerDateInput").val());
  data.likes = 0;
  if($("#blogIndex").val() ==""){
  blogPosts.push(data);


  //console.log(data);
  addToPage(data, blogPosts.length -1);
}else{
  location.reload();
}
  saveData();
  $('#addform')[0].reset();
  $('#myModal').modal('hide');
}
function saveData(){
  localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
}

function loadData() {
	var blogPostsStr = localStorage.getItem("blogPosts");
	if (blogPostsStr) {
		blogPosts = JSON.parse(blogPostsStr);
		for (var i=blogPosts.length -1; i >= 0; i--) {
		    var blogPost = blogPosts[i];
		    addToPage(blogPost, i);
		}
    		saveData();
	}
	makeTimer();
	setInterval(function() { makeTimer(); }, 1000);
}

function addToPage(data, index) {
  var newDiv = $("#postcopy").clone(true, true).insertBefore("#div1");
  newDiv.find(".timertitle").text(data.title);
  newDiv.find(".timerdescription").text(data.description);
  newDiv.find(".timertime").text(data.startTime);
//   newDiv.find(".bloglocation").text("Location: " + data.address);
  newDiv.find(".bloglikes").text(data.likes);
  newDiv.find(".bloglikes").attr("id", "likeBtn" + index);
//   newDiv.find(".blogimg").attr("src", data.pic);
  newDiv.find(".deletebtn").attr("onclick", "deletePost(" + index + ");");
  newDiv.find(".likebtn").attr("onclick", "likePost(" + index + ");");
  var editBtn = newDiv.find(".editbtn");
  newDiv.find(".editbtn").val(index);
  var previewBtn = newDiv.find(".previewbtn");
  newDiv.find(".previewbtn").val(index);
  newDiv.attr("id", "blogPost" + index);
  newDiv.show();
}

var numLikes = 0;
function likePost(index){

  numLikes = blogPosts[index].likes = blogPosts[index].likes + 1;
  document.getElementById("likeBtn" + index).innerHTML = numLikes;
   saveData();
}

function setPreviewTime(index) {
	var blogPost = blogPosts[index];
	var startTime = (blogPost.startTime / 1000);
	var timesince = getDisplayTime(startTime);
	var message = timesince[0] + " days " + timesince[1] + " hours " + timesince[2] + " minutes " + timesince[3] + " seconds";
	var now = (Date.parse(new Date()) / 1000);
	if (now - startTime < 0) {
		message += "<br/>till " + blogPost.title;
	} else {
		message += "<br/>since " + blogPost.title;
	}
	$('#previewtimer').html(message);
}
function editPost(index){
  var data = blogPosts[index];
  $("#timerTitle").val(data.title);
  $("#timerDescription").val(data.description);
  $("#blogIndex").val(index);
}
function addMarker(Longitude, Latitude) {
  var marker = new mapboxgl.Marker({
  })
  .setLngLat([
    Longitude, Latitude
  ])
  .addTo(mapp);
}
function getList1(){
  // search bar searching
  var findTag = document.getElementById("mySearch");
  var makeUp = findTag.value.toUpperCase();
  for (var i=blogPosts.length -1; i >= 0; i--) {
    if (blogPosts[i].tag.toUpperCase().indexOf(makeUp) > -1) {
        document.getElementById("blogPost" + i).style.display = "block";
    } else {
       document.getElementById("blogPost" + i).style.display = "none";
    }
  }
}

function deletePost(index){
  blogPosts.splice(index, 1);
  document.getElementById("blogPost" + index).style.display = "none";
  saveData();
}
function getDisplayTime(startTime) {
	var now = (Date.parse(new Date()) / 1000);
	var timeLeft = now - startTime;
	var eventTitle;
	if (timeLeft < 0) {
		timeLeft = -1 * timeLeft;
		eventTitle = "Time Left";
	} else {
		eventTitle = "Time Since";
	}
	var days = Math.floor(timeLeft / 86400);
	
	var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
	var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600 )) / 60);
	var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));
	
	if (hours < "10") { hours = "0" + hours; }
	if (minutes < "10") { minutes = "0" + minutes; }
	if (seconds < "10") { seconds = "0" + seconds; }
	return [days, hours, minutes, seconds];
}
function makeTimer() {
	for (var i=blogPosts.length -1; i >= 0; i--) {
		var blogPost = blogPosts[i];
		if (!isNaN(blogPost.startTime)) {
			var divname = 'blogPost' + i;
			var startTime = (blogPost.startTime / 1000);
			var timesince = getDisplayTime(startTime);
			var now = (Date.parse(new Date()) / 1000);
			if (now - startTime < 0) {
				eventTitle = "Time Left";
			} else {
				eventTitle = "Time Since";
			}

			/*
        // console.log("start :" + startTime);
				var now = (Date.parse(new Date()) / 1000);
        // console.log("now :" + now);
				var timeLeft = now - startTime;
				//console.log("timeleft: " + timeLeft);
				var eventTitle;
				if (timeLeft < 0) {
					timeLeft = -1 * timeLeft;
					eventTitle = "Time Left";
				} else {
					eventTitle = "Time Since";
				}
        // console.log(timeLeft);
				var days = Math.floor(timeLeft / 86400);

				var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
				var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600 )) / 60);
				var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

				if (hours < "10") { hours = "0" + hours; }
				if (minutes < "10") { minutes = "0" + minutes; }
				if (seconds < "10") { seconds = "0" + seconds; }

				*/

				var blogDiv = $('#blogPost' + i);
				blogDiv.find(".timedirection").html(eventTitle + "<span>---------------------------------------</span>");
				blogDiv.find(".days").html(timesince[0] + "<span>Days</span>");
				blogDiv.find(".hours").html(timesince[1] + "<span>Hours</span>");
				blogDiv.find(".minutes").html(timesince[2] + "<span>Minutes</span>");
				blogDiv.find(".seconds").html(timesince[3] + "<span>Seconds</span>");
			}

	}
}
