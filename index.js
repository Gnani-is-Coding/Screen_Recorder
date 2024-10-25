const captureBtn = document.querySelector(".capture-btn");
const recBtn = document.querySelector(".record-btn");

captureBtn.addEventListener("click" , ()=> {
    captureBtn.classList.add("animate-capture")

    setTimeout(() => {
        captureBtn.classList.remove("animate-capture")
    }, 200)
})

recBtn.addEventListener("click", () => {
    recBtn.classList.toggle("animate-recording")
}) 