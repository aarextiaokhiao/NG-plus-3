var stuckTimeout
stuckTimeout = setTimeout(function(){
	showStuckPopup()
},5000)

function showStuckPopup() {
	document.getElementById("stuck").style.display="block"
}