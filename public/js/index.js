const videoArea = document.querySelector("video");
const videoSelect = document.querySelector("#videoSource");
const profilePicCanvas = document.querySelector("#profilePicCanvas");
const profilePictureOutput = document.querySelector("#profilePictureOutput");
const takePicButton = document.querySelector("#takeProfilePicture");
const videoTag = document.querySelector("#videoTag");

let width = 240,
  height = 0,
  streaming = false;

// Picture

takePicButton.addEventListener(
  "click",
  e => {
    takeProfilePic();
    e.preventDefault();
  },
  false
);

function takeProfilePic() {
  let context = profilePicCanvas.getContext("2d");
  if (width && height) {
    profilePicCanvas.width = width;
    profilePicCanvas.height = height;
    context.drawImage(videoTag, 0, 0, width, height);

    let data = profilePicCanvas.toDataURL("image/png");
    profilePictureOutput.setAttribute("src", data);
  }
}

// Video

videoTag.addEventListener(
  "canplay",
  function(e) {
    if (!streaming) {
      height = videoTag.videoHeight / (videoTag.videoWidth / width);

      if (isNaN(height)) {
        height = width / (4 / 3);
      }

      videoTag.setAttribute("width", width);
      videoTag.setAttribute("height", height);
      profilePicCanvas.setAttribute("width", width);
      profilePicCanvas.setAttribute("height", height);
      streaming = true;
    }
  },
  false
);

let constraints = {
  audio: true,
  video: {
    mandatory: {
      minWidth: 240,
      maxWidth: 240,
      minHeight: 240,
      maxHeight: 240
    }
  }
};

navigator.mediaDevices.enumerateDevices().then(function(devices) {
  for (let i = 0; i < devices.length; i++) {
    let device = devices[i];
    if (device.kind === "videoinput") {
      let option = document.createElement("option");
      option.value = device.deviceId;
      option.text = device.label || "camera " + (i + 1);
      document.querySelector("select#videoSource").appendChild(option);
    }
  }
});
videoSelect.addEventListener("input", e => {
  startStream();
});

function startStream() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(stream => {
      console.log("Success! We have a stream");

      videoArea.srcObject = stream;
      videoArea.play();
    })
    .catch(error => {
      console.log("Error with getUserMedia: ", error);
    });
}
