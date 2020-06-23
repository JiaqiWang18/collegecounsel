var controller;
var app = {
    // Application Constructor
    initialize: function() {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            document.addEventListener("deviceready", this.onDeviceReady, false);
        } else {
            this.onDeviceReady();
            console.log("ready")
        }
    },

    onDeviceReady: function() {
        controller = new Controller();
        app.overrideBrowserAlert();
    },

    overrideBrowserAlert: function() {
        if (navigator.notification) { 
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Warning", // title
                    'Okay'        // buttonName
                );
            };
        }
    },

};

function livesearch(name){
    $('.collegecard').each(function() {
        collegename = $(this).children('h4').text()
        if(collegename.toLowerCase().includes(name.toLowerCase())){
            $(this).show();
        }else{
            $(this).hide();
        }
    });
    var img =document.getElementById("notfound")
    if($(".collegecard:visible").length==0){
        //add not found img
       img.style.display = "block"
    }else{
        img.style.display = "none"
    }
}


app.initialize();
