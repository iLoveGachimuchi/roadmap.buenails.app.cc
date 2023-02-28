class AnimationSctruct {

    constructor() {
        this.styles = {};
    }

    setStyles(styles) {
        this.styles = Object.assign(styles, this.styles);
    }

}