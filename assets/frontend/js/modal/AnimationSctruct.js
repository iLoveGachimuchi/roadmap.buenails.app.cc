class AnimationSctruct {

    constructor() {
        this.styles = {};
    }

    setStyles(styles) {
        this.styles = Object.assign(styles, this.styles);
    }


    getBoundingClientRect(element) {
        let rect = element.getBoundingClientRect();
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

    getCurrentRotation(element, less0 = false) {
        let st = window.getComputedStyle(element, null);
        let tm = st.getPropertyValue("-webkit-transform") ||
            st.getPropertyValue("-moz-transform") ||
            st.getPropertyValue("-ms-transform") ||
            st.getPropertyValue("-o-transform") ||
            st.getPropertyValue("transform") ||
            "none";
        if (tm != "none") {
            let values = tm.split('(')[1].split(')')[0].split(',');
            Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
            let angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
            return (less0 === false ? angle : (angle < 0 ? angle + 360 : angle));
        }
        return 0;
    }
}