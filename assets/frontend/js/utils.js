function setDragging() {
    if (!isDragging())
        document.body.classList.add("dragging");
}

function removeDragging() {
    setTimeout(() => {
        document.body.classList.remove("dragging");
    }, 300);
}

function isDragging() {
    return document.body.classList.contains("dragging");
}