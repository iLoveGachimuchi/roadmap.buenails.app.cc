class ModalFieldAnimation extends AnimationSctruct {

    constructor() {
        super();

    }


    animateIn(elementCall, modalElement) {

        let cssTransform = this.setModalPosition(elementCall, modalElement, .8);
        let timeoutLength = 200;

        setTimeout(() => {
            _doc.addStyles(modalElement, {
                opacity: 1,
                'transform': cssTransform
            })
        }, timeoutLength);

        return timeoutLength;

    }

    animateOut(elementCall, modalElement) {

        _doc.addStyles(modalElement, { opacity: 0 });
        modalElement.style.cssText = modalElement.style.cssText.replace('scale(1)', 'scale(.8)')

        let timeoutLength = 200;

        return timeoutLength;
    }


    /**
     * 
     * @param {Object} params 
     * @param {HTMLElement} params.wrap
     * @param {HTMLElement} params.element
     * @param {Boolean} params.next
     * @param {function} params.onDrawCall
     * @param {Object} params.content
     * @param {number} params.currentPosition
     */
    afterMoveProcess(e, newPosX) {
        
    }

    animateResetMove(storyContainer) {
        setTimeout(() => {
            _doc.addStyles(storyContainer, {
                'transition': 'all 0.3s cubic-bezier(.46,0,0,1.01) 0s',
                'transform': 'translateX(0px)'
            })

            setTimeout(() => {
                _doc.removeStyles(storyContainer, ['transform', 'transition']);
            }, 300);
        }, 50);

        return 350;
    }

}