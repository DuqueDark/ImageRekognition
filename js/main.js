(function ($) {

	"use strict";

	var fullHeight = function () {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function () {
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$(".toggle-password").click(function () {

		$(this).toggleClass("fa-eye fa-eye-slash");
		var input = $($(this).attr("toggle"));
		if (input.attr("type") == "password") {
			input.attr("type", "text");
		} else {
			input.attr("type", "password");
		}
	});


})(jQuery);

$(document).ready(function () {
	$('form input').change(function () {
		$('form p').text(this.files.length + " Arquivo(s) Selecioando");
	});
});

function Enviar() {
	$.ajax({
		url: '',
		type: 'POST',
		dataType: 'html',
		data: {
			id: '1'
		},
		success: function (data) {
			if (data == 'voted') {
				$('.set-result').html('you already voted. try again after 24 hours');
			} else {
				$('.set-result').html('successfully voted');
			}
		}
	});
}
// function endPoint_API() {
// 	window.location.href = '/Image.html'
// }

document.getElementById("fileToSave").addEventListener("change", function (event) {
    ProcessImage();
  }, false);

  //Calls DetectFaces API and shows estimated ages of detected faces
  function DetectFaces(imageData) {
    AWS.region = "us-east-1";
    var rekognition = new AWS.Rekognition();
    var params = {
      Image: {
        Bytes: imageData
      },
      MaxLabels: 123,
      MinConfidence: 70
    };

    rekognition.detectLabels(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        for (let i = 0; i < data["Labels"].length; i++) {
          if (data["Labels"][i]["Name"] != "Clothing") {
            console.log(data["Labels"][i]["Name"] + " - " + data["Labels"][i]["Confidence"]);
          }
        }
      }
    });

    // rekognition.detectFaces(params, function (err, data) {
    //   if (err) console.log(err, err.stack); // an error occurred
    //   else {
    //     var table = "<table><tr><th>Low</th><th>High</th></tr>";
    //     // show each face and build out estimated age table
    //     for (var i = 0; i < data.FaceDetails.length; i++) {
    //       table += '<tr><td>' + data.FaceDetails[i].AgeRange.Low +
    //         '</td><td>' + data.FaceDetails[i].AgeRange.High + '</td></tr>';
    //     }
    //     table += "</table>";
    //     document.getElementById("opResult").innerHTML = table;
    //   }
    // });

  }
  //Loads selected image and unencodes image bytes for Rekognition DetectFaces API
  function ProcessImage() {
    AnonLog();
    var control = document.getElementById("fileToSave");
    var file = control.files[0];
    // Load base64 encoded image 
    var reader = new FileReader();
    reader.onload = (function (theFile) {
      return function (e) {
        var img = document.createElement('img');
        var image = null;
        img.src = e.target.result;
        var jpg = true;
        try {
          image = atob(e.target.result.split("data:image/jpeg;base64,")[1]);
        } catch (e) {
          jpg = false;
        }
        if (jpg == false) {
          try {
            image = atob(e.target.result.split("data:image/png;base64,")[1]);
          } catch (e) {
            alert("Not an image file Rekognition can process");
            return;
          }
        }
        //unencode image bytes for Rekognition DetectFaces API 
        var length = image.length;
        imageBytes = new ArrayBuffer(length);
        var ua = new Uint8Array(imageBytes);
        for (var i = 0; i < length; i++) {
          ua[i] = image.charCodeAt(i);
        }
        //Call Rekognition  
        DetectFaces(imageBytes);
      };
    })(file);
    reader.readAsDataURL(file);
  }
  //Provides anonymous log on to AWS services
  function AnonLog() {
    // Configure the credentials provider to use your identity pool
    AWS.config.region = 'us-east-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      // IdentityPoolId: 'us-east-1:a8358272-9ee8-4dc2-a425-550cdd5972b4',
      IdentityPoolId: 'us-east-1:2c44eea1-7064-4a85-abce-d4a2cb6005fa',
    });
    // Make the call to obtain credentials
    AWS.config.credentials.get(function () {
      // Credentials will be available when this function is called.
      var accessKeyId = AWS.config.credentials.accessKeyId;
      var secretAccessKey = AWS.config.credentials.secretAccessKey;
      var sessionToken = AWS.config.credentials.sessionToken;
    });
  }

