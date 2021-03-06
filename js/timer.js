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
  var errors = false;
  if ($('#timerTitle').val().trim() == '') {
	  $('#timerTitle').css('background-color', 'pink');
	  $('#timerTitle').tooltip({
		title: 'Title cannot be empty',
		placement: 'top'
	  });
	  $('#timerTitle').tooltip('show');
	  $('#timerTitle').on('input', function() {
	  	$('#timerTitle').css('background-color', 'white');
	  	$('#timerTitle').tooltip('hide');
	  	$('#timerTitle').tooltip('disable');
	  });
	  errors = true;
  }
  if ($('#timerDateInput').val().trim() == '') {
	  $('#timerDateInput').css('background-color', 'pink');
	  $('#timerDateInput').tooltip({
		title: 'Start date & time cannot be empty',
		placement: 'top'
	  });
	  $('#timerDateInput').tooltip('show');
	  $('#timerDateInput').on('change', function() {
	  	$('#timerDateInput').css('background-color', 'white');
	  	$('#timerDateInput').tooltip('hide');
	  	$('#timerDateInput').tooltip('disable');
	  });
	  errors = true;
  }
  if (errors) {
	  return;
  }

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
  $('#addmodal').modal('hide');
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

function getDefaultFormatForPreviewTime(index) {
	var blogPost = blogPosts[index];
	var startTime = (blogPost.startTime / 1000);
	var now = (Date.parse(new Date()) / 1000);
	var format;
	if (now - startTime < 0) {
		format = "%days% days %hours% hours %minutes% minutes %seconds% seconds<br/>till %title%";
	} else {
		format = "%days% days %hours% hours %minutes% minutes %seconds% seconds<br/>since %title%";
	}
	return format;
}

function getPreviewTimeWithFormat(index, format) {
	var blogPost = blogPosts[index];
	var startTime = (blogPost.startTime / 1000);
	var timesince = getDisplayTime(startTime);
	var message = format.replace('%days%', timesince[0]);
	message = message.replace('%hours%', timesince[1]);
	message = message.replace('%minutes%', timesince[2]);
	message = message.replace('%seconds%', timesince[3]);
	message = message.replace('%title%', blogPost.title);
	return message;
}
function editPost(index){
  var data = blogPosts[index];
  $("#timerTitle").val(data.title);
  $("#timerDescription").val(data.description);
  $("#blogIndex").val(index);

  var options = { day: 'numeric', month: 'long', year: 'numeric', hour:'numeric',  minute:'numeric', second: 'numeric' };
  var startTime = new Date(data.startTime);
  $('#timerDateInput').val(startTime.toLocaleDateString(navigator.language, options));
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

			var blogDiv = $('#blogPost' + i);
			blogDiv.find(".timedirection").html(eventTitle + "<span>---------------------------------------</span>");
			blogDiv.find(".days").html(timesince[0] + "<span>Days</span>");
			blogDiv.find(".hours").html(timesince[1] + "<span>Hours</span>");
			blogDiv.find(".minutes").html(timesince[2] + "<span>Minutes</span>");
			blogDiv.find(".seconds").html(timesince[3] + "<span>Seconds</span>");
		}
	}
}
