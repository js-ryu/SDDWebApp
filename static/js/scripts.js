document.addEventListener("DOMContentLoaded", () => {
    const dragDropArea = document.getElementById("drag-drop-area");
    const fileInput = document.getElementById("file-input");
    const browseButton = document.getElementById("browse-button");
    const previewGrid = document.getElementById("preview-grid");
    const detectButton = document.getElementById("detect-button");
    const loadingPage = document.getElementById("loading-page");

    let fileArray = [];

    browseButton.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (event) => {
        handleFiles(event.target.files);
    });

    dragDropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        dragDropArea.classList.add("drag-over");
    });

    dragDropArea.addEventListener("dragleave", () => {
        dragDropArea.classList.remove("drag-over");
    });

    dragDropArea.addEventListener("drop", (event) => {
        event.preventDefault();
        dragDropArea.classList.remove("drag-over");
        handleFiles(event.dataTransfer.files);
    });

    detectButton.addEventListener("click", () => {
        if (fileArray.length === 0) {
            alert("Please upload at least one image before detecting.");
        } else {
            showLoadingPage();
            uploadFiles(fileArray);
        }
    });

    function handleFiles(files) {
        const newFiles = Array.from(files);
        fileArray = fileArray.concat(newFiles);

        newFiles.forEach(file => {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imgElement = document.createElement("div");
                    imgElement.classList.add("preview-image");
                    imgElement.innerHTML = `
                        <img src="${event.target.result}" alt="${file.name}">
                        <button class="delete-icon">x</button>
                    `;
                    previewGrid.appendChild(imgElement);

                    imgElement.querySelector(".delete-icon").addEventListener("click", () => {
                        imgElement.remove();
                        fileArray = fileArray.filter(f => f !== file);
                    });
                };
                reader.readAsDataURL(file);
            } else {
                alert("Only image files are allowed.");
            }
        });
    }

    function uploadFiles(files) {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const params = new URLSearchParams({
                    temp_dir: data.temp_dir,
                    results : JSON.stringify(data.results),
                    images: data.image_paths.join(',')
                });
                window.location.href = `/detect?${params.toString()}`;
            } else {
                alert("Failed to upload images.");
                hideLoadingPage();
            }
        })
        .catch(error => {
            console.error("Error uploading images:", error);
            hideLoadingPage();
        });
    }

    function showLoadingPage() {
        loadingPage.style.display = "flex";
    }

    function hideLoadingPage() {
        loadingPage.style.display = "none";
    }
});
