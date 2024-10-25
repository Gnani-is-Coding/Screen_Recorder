const captureBtn = document.querySelector(".capture-btn");
const recBtn = document.querySelector(".record-btn");
const videoElement = document.querySelector(".video")

const constraints = {
    audio: false,
    video: true
}
let chunks = []

let isRecording = false

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
        } else {
            mediaRecorder.start()
        }
        recBtn.classList.toggle("animate-recording")
        isRecording = !isRecording
        
    })



}).catch((err) =>
    console.log(`error while recording: ${err.message}`)
)

captureBtn.addEventListener("click" , ()=> {
    captureBtn.classList.add("animate-capture")

    setTimeout(() => {
        captureBtn.classList.remove("animate-capture")
    }, 200)
})

