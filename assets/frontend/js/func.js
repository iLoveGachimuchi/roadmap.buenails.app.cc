function getCurrentRotation(el, less0 = false) {
    var st = window.getComputedStyle(el, null);
    var tm = st.getPropertyValue("-webkit-transform") ||
        st.getPropertyValue("-moz-transform") ||
        st.getPropertyValue("-ms-transform") ||
        st.getPropertyValue("-o-transform") ||
        st.getPropertyValue("transform") ||
        "none";
    if (tm != "none") {
        var values = tm.split('(')[1].split(')')[0].split(',');
        Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
        var angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
        return (less0 === false ? angle : (angle < 0 ? angle + 360 : angle));
    }
    return 0;
}

function getBoundingClientRect(element) {
    var rect = element.getBoundingClientRect();
    return {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y
    };
}


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