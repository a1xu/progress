'use strict';

/*
	Function that is called when the document is ready.
	Call this function when the page loads (the "ready" event)
*/
$(document).ready(function() {
	initializePage();
	// test();
	// console.log(moment().parseZone());
})

var today = new Date();
var currmm = today.getMonth();
var year = today.getFullYear();
//credit to https://coderwall.com/p/yrhbfg/get-full-name-of-a-month-from-a-javascript-date-object
Date.prototype.getMonthName = function() {
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
	return months[this.getMonth()];
};

function initializePage() {
	var ctx = $("#testChart");
	var chart = new Chart(ctx, {
		// The type of chart we want to create
		type: "doughnut",
		// The data for our dataset
		data: {
			labels: ["Worked on", "No Progress"],
			datasets: [{
				data: [$("input:checkbox:checked").length, $("input:checkbox:not(:checked)").length],
				backgroundColor: [ 'rgba(52, 171, 250, 0.8)', 'rgba(238, 238, 238, 0.8)' ]
			}],
		},
		// Configuration options go here
		options: {
			title: { display: true, text: "Today's Progress:", position: "top", fontSize: 16, fontFamily: "Sniglet"},
			legend: { labels: {display: true, fontFamily: "Sniglet"}}
		}
	});

	$(".jumbotron p").addClass("active");
// Add any additional listeners here
// example: $("#div-id").click(functionToCall);
// $('#currentDay').text(today.getMonthName()+ " " + today.getDate());
	$("#currentDay").html(moment().format("MMM D YYYY"));

/*
$('#currentMonth').text(today.getMonthName() + " " + today.getFullYear());
$('#backButton').on("click", backButtonClick);
$('#forwardButton').on("click", forwardButtonClick);
$('#forwardButton').click(forwardButtonClick).addClass("active").toggleClass("active");
*/

	$('#addContent').click(addContentClick);
	$('#addContentB').click(addContentClick);
	$('#loginContent').click(loginContentClick);
	$('#deleteContent').click(deleteContentClick);
	$('#deleteContentB').click(deleteContentClickB);
	$("#addScreen").click(showAddProject);
	$("#addScreenB").click(showAddProjectB);
	$("#cancel-add").click(hideAddProject);
	$("#cancel-addB").click(hideAddProjectB);
	$(".deleteScreen").click(showDeleteProject);
	$(".deleteScreenB").click(showDeleteProjectB);
	$("#cancel-delete").click(hideDeleteProject);
	$("#cancel-deleteB").click(hideDeleteProjectB);
	$("#loginScreen").click(showLogin);
	$("#cancel-login").click(hideLogin);
	$("#submit-login").click(afterLogin);
	$("#logout").click(loginContentClick)
	$("#logout").css("display", "none");
	$("#logout").click(logout);

	$(".startPick").datepicker('setValue', moment());
	$(".duePick").datepicker();
	//$(".editStartPick").datepicker('setValue', moment());

	$('#calendar').fullCalendar({
    defaultView: 'month',
		themeSystem: "bootstrap4",
		eventLimit: true,
		contentHeight: "auto",
		titleFormat: "MMM YYYY",

		dayClick: function(date, jsEvent, view) {
			//console.log('Clicked on: ' + date.format());
			//console.log(date.isSameOrBefore());

			$(".fc-day").css("background-color", "white");
			$(this).css("border-box", "black");
			$(this).css('background-color', "rgba(52, 171, 250, 0.5)");
			$(".fc-past").not(this).css("background-color", "#eeeeee");
			$(this).siblings(".fc-day-top").css('background-color', "rgba(255, 99, 132, 0.8)");
			//console.log(this);

			var selectedDate = date.format("MMM D YYYY");
			var todaysDate = moment().format("MMM D YYYY");

			if(date.isSameOrBefore()) {
			  $("#currentDay").html(selectedDate);
		    } else {
			  $("#currentDay").html(todaysDate);
			}

			// var startDate = moment($(".project").children(".startdate").text()).format("MMM D");

			$(".project").each(function(i) {
				var startDate = moment($(this).children(".startdate").text());
				var selectedDate = date;
				// var selectedDateAdj = selectedDate.subtract(1, "days");
				if(startDate.isAfter(selectedDate)) {
					$(this).hide();
				} else {
					$(this).show();
				}
				// console.log("start: " + startDate.format());
				// console.log("selected: " + selectedDate.format());
				// console.log("adjusted: " + selectedDateAdj.format());
			});
        }
    });

	$(".pName").each(function(i) {
		var projectName = $.trim($(this).text());
		var eventStart = moment($("#currentDay").text());
		//console.log(eventStart);
		var eventDue = moment($(this).siblings(".duedate").text());
		//console.log(eventDue);
		var eventID = "event-" + eventStart.format("YYYY-MM-YY") + "-" + i;
		var checked = $(this).children().prop("checked");
		// var dueDate = $(this).siblings(".duedate").html();
		// var dueDate = "2019-02-22";
		// var eventStart = moment();

		if(checked) {
			$("#calendar").fullCalendar("renderEvent", {
				id: eventID,
				title: projectName,
				start: eventStart,
				//end: endDue,
				allDay: true
			}, true);
			//ga("send", "event", 'checked', 'click');
			// console.log(eventID);

		}
		// console.log(checked);
		// console.log(projectName + " " + dueDate);
	});

	$('.pName input').each(function(i) {
		$(this).change(function() {
			var projectName = $.trim($(this).parent().text());
			var eventStart = moment($("#currentDay").text());
			var eventID = "event-" + eventStart.format("YYYY-MM-YY") + "-" + i;
			var eventDue = moment($(this).siblings(".duedate").text());
			//console.log(eventDue);
			var checked = $(this).prop("checked");
			// var counter = parseInt($(".streakCounter").html());

			var counterSelect = $(this).parent().siblings(".streakCounter");
			var counter = parseInt(counterSelect.html());

			// console.log(typeof(counter));
			// console.log(eventStart);
			// console.log(counter);

			if(checked) {
				$("#calendar").fullCalendar("renderEvent", {
					id: eventID,
					title: projectName,
					start: eventStart,
					//end: eventDue,
					allDay: true,
				}, true);
				counter += 1;
				counterSelect.html(counter);
				// console.log(eventID);
				//ga("send", "event", 'checked', 'click');
			} else {
				$("#calendar").fullCalendar("removeEvents", eventID);
				counter -= 1;
				counterSelect.html(counter);
				// console.log(eventID);
				//ga("send", "event", 'checked', 'click');
			}
			var chartData = [$("input:checkbox:checked").length, $("input:checkbox:not(:checked)").length];
			//console.log(chartData);
			chart.data.datasets[0].data = chartData;
			chart.update();
		});
		// console.log($.trim($(this).parent().text()));
	});

		//var startDateArr = [];
	//	var dueDateArr = [];
	//console.log(startDateArr[0]);
	//$(".longestStreak").each(calcLongStr);

	$(".remainingDays").each(function(i) {
		var current = moment().startOf('day');
		var given = moment($(this).siblings(".duedate").html());
		var temp = moment.duration(given.diff(current)).asDays();
		if(temp < 0){
			$(this).css("color", "#dc3545").html(Math.round(temp) + " days");
		}else{

			$(this).html(Math.round(temp) + " days");
		}
	});

}

/*

function backButtonClick(e){
	e.preventDefault();
	if (currmm-1 < 0) {
		currmm+=12;
		year--;
	}
	currmm = (currmm-1) % 12;
	checkMonth(currmm);
}
function forwardButtonClick(e){
	e.preventDefault();
	if(currmm+1 == 12){
		year++;
	}
	currmm = (currmm+1) % 12;
	checkMonth(currmm);
}
*/

function addContentClick(e){
	console.log("Add content clicked");
	e.preventDefault();
}

function showAddProject(e) {
	e.preventDefault();
	$("#add-form").css("display", "block");
	$("#calendar-top")[0].style.WebkitFilter = 'blur(4px)';
	$("#calendar-top")[0].style.filter= 'blur(4px)';
	// $("#login-top")[0].style.WebkitFilter = 'blur(4px)';
	// $("#login-top")[0].style.filter= 'blur(4px)';
	$("#project-bottom-A")[0].style.WebkitFilter = 'blur(4px)';
	$("#project-bottom-A")[0].style.filter= 'blur(4px)';
}

function showAddProjectB(e) {
	e.preventDefault();
	$("#add-formB").css("display", "block");
	$("#calendar-top")[0].style.WebkitFilter = 'blur(4px)';
	$("#calendar-top")[0].style.filter= 'blur(4px)';
	// $("#login-top")[0].style.WebkitFilter = 'blur(4px)';
	// $("#login-top")[0].style.filter= 'blur(4px)';
	$("#project-bottom-B")[0].style.WebkitFilter = 'blur(4px)';
	$("#project-bottom-B")[0].style.filter= 'blur(4px)';

}

function hideAddProject(e) {
	e.preventDefault();
	$("#add-form").css("display", "none");
	$("#calendar-top")[0].style.WebkitFilter = 'blur(0px)';
	$("#calendar-top")[0].style.filter= 'blur(0px)';
	// $("#login-top")[0].style.WebkitFilter = 'blur(0px)';
	// $("#login-top")[0].style.filter= 'blur(0px)';
	$("#project-bottom-A")[0].style.WebkitFilter = 'blur(0px)';
	$("#project-bottom-A")[0].style.filter= 'blur(0px)';
}

function hideAddProjectB(e) {
	e.preventDefault();
	$("#add-formB").css("display", "none");
	$("#calendar-top")[0].style.WebkitFilter = 'blur(0px)';
	$("#calendar-top")[0].style.filter= 'blur(0px)';
	// $("#login-top")[0].style.WebkitFilter = 'blur(0px)';
	// $("#login-top")[0].style.filter= 'blur(0px)';
	$("#project-bottom-B")[0].style.WebkitFilter = 'blur(0px)';
	$("#project-bottom-B")[0].style.filter= 'blur(0px)';
}

function loginContentClick(e){
	console.log("Login content clicked");
	e.preventDefault();
		$("#loginScreen").css("color","black");
		$("logout").hide();
}

function showLogin(e) {
	e.preventDefault();
	$("#login-form").css("display", "block");
	$("logout").hide();
	$("#calendar-top")[0].style.WebkitFilter = 'blur(4px)';
	$("#calendar-top")[0].style.filter= 'blur(4px)';
	// $("#login-top")[0].style.WebkitFilter = 'blur(4px)';
	// $("#login-top")[0].style.filter= 'blur(4px)';
	var currentLoc = window.location.pathname;
	//console.log(currentLoc);
	//console.log(typeof(currentLoc));
	if(currentLoc == "/"){
		$("#project-bottom-B")[0].style.WebkitFilter = 'blur(4px)';
		$("#project-bottom-B")[0].style.filter= 'blur(4px)';
	}
	else{
		$("#project-bottom-A")[0].style.WebkitFilter = 'blur(4px)';
		$("#project-bottom-A")[0].style.filter= 'blur(4px)';
	}
}

function hideLogin(e) {
	e.preventDefault();
	$("#login-form").css("display", "none");
	$("logout").hide();
	$("#calendar-top")[0].style.WebkitFilter = 'blur(0px)';
	$("#calendar-top")[0].style.filter= 'blur(0px)';
	// $("#login-top")[0].style.WebkitFilter = 'blur(0px)';
	// $("#login-top")[0].style.filter= 'blur(0px)';
	var currentLoc = window.location.pathname;
	//console.log(currentLoc);
	//console.log(typeof(currentLoc));
	if(currentLoc == "/"){
		$("#project-bottom-B")[0].style.WebkitFilter = 'blur(0px)';
		$("#project-bottom-B")[0].style.filter= 'blur(0px)';
	}
	else{
		$("#project-bottom-A")[0].style.WebkitFilter = 'blur(0px)';
		$("#project-bottom-A")[0].style.filter= 'blur(0px)';
	}
}

function afterLogin(e) {
	e.preventDefault();
	$("#logout").css("display", "block");
	$("#loginScreen").css("display", "none");
	$("#login-form").css("display", "none");
	$("#calendar-top")[0].style.WebkitFilter = 'blur(0px)';
	$("#calendar-top")[0].style.filter= 'blur(0px)';
	// $("#login-top")[0].style.WebkitFilter = 'blur(0px)';
	// $("#login-top")[0].style.filter= 'blur(0px)';
	var currentLoc = window.location.pathname;
	//console.log(currentLoc);
	//console.log(typeof(currentLoc));
	if(currentLoc == "/"){
		$("#project-bottom-B")[0].style.WebkitFilter = 'blur(0px)';
		$("#project-bottom-B")[0].style.filter= 'blur(0px)';
	}
	else{
		$("#project-bottom-A")[0].style.WebkitFilter = 'blur(0px)';
		$("#project-bottom-A")[0].style.filter= 'blur(0px)';
	}
}

function logout(e) {
	e.preventDefault();
	$("#loginScreen").css("display", "block");
	$("#logout").css("display", "none");
	$("#username").hide();
}

function deleteContentClick(e){
	console.log("Delete content clicked");
	e.preventDefault();
}

function deleteContentClickB(e){
	console.log("Delete contentB clicked");
	e.preventDefault();
}

function showDeleteProject(e) {
	e.preventDefault();
	$("#delete-form").css("display", "block");
	var projectID = $(this).closest('tr').attr('id');
	$("#calendar-top")[0].style.WebkitFilter = 'blur(4px)';
	$("#calendar-top")[0].style.filter= 'blur(4px)';
	// $("#login-top")[0].style.WebkitFilter = 'blur(4px)';
	// $("#login-top")[0].style.filter= 'blur(4px)';
}

function showDeleteProjectB(e) {
	e.preventDefault();
	$("#delete-formB").css("display", "block");
	var projectID = $(this).closest('tr').attr('id');
	$("#calendar-top")[0].style.WebkitFilter = 'blur(4px)';
	$("#calendar-top")[0].style.filter= 'blur(4px)';
	// $("#login-top")[0].style.WebkitFilter = 'blur(4px)';
	// $("#login-top")[0].style.filter= 'blur(4px)';
}

function hideDeleteProject(e) {
	e.preventDefault();
	$("#delete-form").css("display", "none");
	$("#calendar-top")[0].style.WebkitFilter = 'blur(0px)';
	$("#calendar-top")[0].style.filter= 'blur(0px)';
	// $("#login-top")[0].style.WebkitFilter = 'blur(0px)';
	// $("#login-top")[0].style.filter= 'blur(0px)';
	$("#project-bottom-B")[0].style.WebkitFilter = 'blur(0px)';
	$("#project-bottom-B")[0].style.filter= 'blur(0px)';
}

function hideDeleteProjectB(e) {
	e.preventDefault();
	$("#delete-formB").css("display", "none");
	$("#calendar-top")[0].style.WebkitFilter = 'blur(0px)';
	$("#calendar-top")[0].style.filter= 'blur(0px)';
	// $("#login-top")[0].style.WebkitFilter = 'blur(0px)';
	// $("#login-top")[0].style.filter= 'blur(0px)';
	$("#project-bottom-B")[0].style.WebkitFilter = 'blur(0px)';
	$("#project-bottom-B")[0].style.filter= 'blur(0px)';
}
