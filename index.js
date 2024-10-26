const captureBtn = document.querySelector(".capture-btn");
const recBtn = document.querySelector(".record-btn");
const videoElement = document.querySelector(".video")
const timerElement = document.querySelector(".timer")
const imageContainer = document.querySelector(".image-container")
const imageElement = document.querySelector(".image")
const downloadBtn = document.querySelector(".save")

const constraints = {
    audio: false,
    video: true
}

let chunks = []
let time = 0
let timerID;
let isRecording = false

function updateTimer() {
    const hours = Math.floor(time / 3600)
    time %= 3600
    const minutes = Math.floor(time / 60)
    time %= 60
    const seconds = Math.floor(time)
    timerElement.textContent = `${hours < 10 ? `0${hours}`: hours}:${minutes < 10 ? `0${minutes}`: minutes}:${seconds < 10 ? `0${seconds}`: seconds}`
}

function downloadImage(imageUrl) {
    const anchorEle = document.createElement("a")
    anchorEle.href = imageUrl
    anchorEle.download = "image.png"
    anchorEle.click()
}

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    videoElement.srcObject = stream
    const mediaRecorder = new MediaRecorder(stream)

    mediaRecorder.addEventListener("start", () => {
        chunks = []
    })

    mediaRecorder.addEventListener("dataavailable",(e) => {
        chunks.push(e.data)
    })

    mediaRecorder.addEventListener("stop", () => {
        console.log("recording stopped")
        const blob  = new Blob(chunks, {type: "video/mp4"})
        chunks = []
        const url =  URL.createObjectURL(blob)

        const anchorEle = document.createElement("a")
        anchorEle.href = url
        anchorEle.download = "recording.mp4"
        anchorEle.click()
    })

    recBtn.addEventListener("click", () => {
        if (isRecording) {
            mediaRecorder.stop()
            if (timerID){
             clearInterval(timerID)
            }
        } else {
            mediaRecorder.start()
            timerID = setInterval(() => {
                time++
                updateTimer()
            },1000)
        }
        recBtn.classList.toggle("animate-recording")
        isRecording = !isRecording
    })



}).catch((err) =>
    console.log(`error while recording: ${err.message}`)
)

captureBtn.addEventListener("click" , ()=> {
    captureBtn.classList.add("animate-capture")

    const canvas = document.createElement("canvas")
    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight
    const canvasContext = canvas.getContext("2d")
    canvasContext.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
    const imageUrl = canvas.toDataURL()
    imageElement.src = imageUrl

    downloadBtn.addEventListener("click", () => {
        console.log(imageUrl)
        downloadImage(imageUrl)
    })


    imageContainer.style.display = "block"
    setTimeout(() => {
        captureBtn.classList.remove("animate-capture")
    }, 200)
})

