const images = [
    "/mnt/data/KakaoTalk_Photo_2024-07-16-18-57-53.png", // 이미지 파일 경로를 여기에 추가하세요
    "/mnt/data/KakaoTalk_Photo_2024-07-16-18-57-57.png"
];

let currentSlide = 0;

document.addEventListener("DOMContentLoaded", () => {
    showSlide(currentSlide);

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            changeSlide(-1);
        } else if (event.key === "ArrowRight") {
            changeSlide(1);
        }
    });

    const slideImage = document.getElementById("slide-image");
    let touchStartX = 0;
    let touchEndX = 0;

    slideImage.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].screenX;
    });

    slideImage.addEventListener("touchend", (event) => {
        touchEndX = event.changedTouches[0].screenX;
        handleGesture();
    });

    function handleGesture() {
        if (touchEndX < touchStartX) {
            changeSlide(1);
        } else if (touchEndX > touchStartX) {
            changeSlide(-1);
        }
    }
});

function showSlide(index) {
    const slideImage = document.getElementById("slide-image");
    const slideNumber = document.getElementById("slide-number");

    slideImage.src = images[index];
    slideNumber.textContent = `${index + 1}/${images.length}`;
}

function changeSlide(direction) {
    currentSlide = (currentSlide + direction + images.length) % images.length;
    showSlide(currentSlide);
}

function goHome() {
    window.location.href = "/";
}
