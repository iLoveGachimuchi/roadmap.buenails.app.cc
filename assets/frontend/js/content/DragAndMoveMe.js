class DragAndMoveMe {
    /**
     * 
     * @param {Object} config 
     * @param {NodeElement} config.contentHandler
     * @param {NodeElement} config.contentMove
     * @param {function} config.whileMove
     * @param {function} config.afterMoveCall
     * @param {Boolean} config.xMove
     * 
     */
    constructor(config) {
        this.contentHandler = config.handler;
        this.contentMove = config.move;

        this.whileMove = typeof config.whileMove === 'function' ? config.whileMove : null;
        this.afterMoveCall = typeof config.afterMove === 'function' ? config.afterMove : null;
        this.xMove = typeof config.xMove === 'boolean' ? config.xMove : true;
        this.yMove = typeof config.yMove === 'boolean' ? config.yMove : true;

        this.pos = { top: 0, left: 0, x: 0, y: 0 };

        this.mousemoveHandler = null;
        this.mouseupHandler = null;
        // this.touchmoveHandler = null;
        // this.touchendHandler = null;

        this.contentHandler.addEventListener('mousedown', (e) => {
            this.mouseDownHandler(e)
        });

        this.contentHandler.addEventListener('touchmove', (e) => {
            this.mouseDownHandler(e)
        });

        this.afterMove = false;
        this.movePosX = 0;
        this.movePosY = 0;
    }

    resetMoveContent(moveElement) {
        this.contentMove = moveElement;
    }

    mouseDownHandler(e) {
        if (this.mousemoveHandler) {
            this.contentHandler.removeEventListener('mousemove', this.mousemoveHandler);
            this.contentHandler.removeEventListener('mouseup', this.mouseupHandler);
            // this.contentHandler.removeEventListener('touchmove', this.touchmoveHandler);
            // this.contentHandler.removeEventListener('touchend', this.touchendHandler);

            // ddEventListener('touchend', function(e) {

            this.afterMove = false;
            removeDragging();
        }

        if (e.button > 0)
            return;

        this.contentHandler.style.cursor = 'grabbing';
        this.contentHandler.style.userSelect = 'none';

        this.pos = {
            left: this.contentMove.scrollLeft,
            top: this.contentMove.scrollTop,
            x: e.clientX,
            y: e.clientY,
        };

        this.mousemoveHandler = this.mouseMoveHandler.bind(this);
        this.mouseupHandler = this.mouseUpHandler.bind(this);
        // this.touchmoveHandler = this.mouseMoveHandler.bind(this);
        // this.touchendHandler = this.mouseUpHandler.bind(this);

        this.contentHandler.addEventListener('mousemove', this.mousemoveHandler);
        this.contentHandler.addEventListener('mouseup', this.mouseupHandler);
        // this.contentHandler.addEventListener('touchmove', this.touchmoveHandler);
        // this.contentHandler.addEventListener('touchend', this.touchendHandler);


    }

    mouseMoveHandler(e) {
        let dx = (e.clientX - this.pos.x) * -1;
        let dy = (e.clientY - this.pos.y) * -1;

        this.movePosX = this.pos.left - dx;
        this.movePosY = this.pos.top - dy;

        let transform = '';

        if (this.xMove) {
            transform = 'translateX(' + (this.movePosX) + 'px)';
        }
        if (this.yMove) {
            transform = 'translateY(' + (this.movePosY) + 'px)';
        }
        if (this.xMove && this.yMove) {
            transform = 'translate(' + (this.movePosX) + 'px, ' + this.movePosY + 'px)';
        }

        this.contentMove.style.transform = transform;

        if (typeof this.whileMove === 'function')
            this.whileMove(e);

        this.afterMove = true;
        setDragging();

    }

    mouseUpHandler(e) {
        this.contentHandler.removeEventListener('mousemove', this.mousemoveHandler);
        this.contentHandler.removeEventListener('mouseup', this.mouseupHandler);
        // this.contentHandler.removeEventListener('touchmove', this.touchmoveHandler);
        // this.contentHandler.removeEventListener('touchend', this.touchendHandler);

        removeDragging();

        this.mousemoveHandler = null;
        this.mouseupHandler = null;
        this.touchmoveHandler = null;
        this.touchendHandler = null;

        this.contentHandler.style.cursor = null;
        this.contentHandler.style.removeProperty('user-select');


        if (this.afterMove) {
            if (typeof this.afterMoveCall === 'function')
                this.afterMoveCall(e, this.movePosX, this.movePosY);

            this.afterMove = false;
        }
    }

}