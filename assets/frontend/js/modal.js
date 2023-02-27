class ModalConstruct {
    constructor(eventObj) {

        this.modal = {
            "type": (typeof eventObj.type == 'undefined' ? null : eventObj.type),
            "data": (typeof eventObj.data == 'undefined' ? null : eventObj.data),
            "view": 'default',
            "date": 0,
            "params": {}
        }

        this.loadModalData();
    }

    loadModalData() {
        if (typeof this.modal.data.src === 'undefined')
            return;

        fetch(this.modal.data.src).then((response) => {
            if (response.ok) {
                response.json().then((resp) => {
                    this.setModalData(resp);
                });
            } else {
                console.log('Network request for stickers.json failed with response ' + response.status + ': ' + response.statusText);
            }
        });
    }

    setModalData(responce) {
        this.modal = Object.assign(this.modal, responce);
    }

    call(eventCallName = null) {
        if (typeof this.modal.view === 'undefined')
            return false;

        let modalView = null;
        let elementCall = document.querySelector("[data-event-click=\"" + eventCallName + "\"]").parentNode;

        switch (this.modal.view.toLowerCase()) {
            case 'album': modalView = new ModalAlbum(this.modal); break;
            case 'field': modalView = new ModalField(this.modal); break;
            case 'story': modalView = new ModalStory(this.modal); break;
            default: return;
        }

        modalView.render(elementCall);

    }
}







class ModalStruct {
    constructor(modalData) {
        this.data = modalData;
        this.modalElement = null;

        this.hotkeyCloseHandler = null;


        this.desctructTimeOut = 300;
        this.onDesctruct = null;

        this.modalEvents = typeof this.data.events !== 'undefined' ? this.data.events : {};


        this.styles = {
            'modalWrap': 'modal-wrap',

            'actionXClose': 'modal-action-x-close',
            'actionXCloseSrc': '/assets/frontend/img/icons/x-close.svg',


            'modalActions': 'modal-actions',
            'modalButton': 'modal-button',
            'modalActionClose': 'modal-action-close',



            'modalBlur': 'apblur',
            'modalCursorPointer': 'apclick'

        };
    }



    addStyles(localStyles) {
        this.styles = Object.assign(this.styles, localStyles);
    }

    modalDataIsset() {
        return !(typeof this.data === 'undefined');
    }

    callModalEvents(eventName) {
        try {
            if (typeof this.modalEvents[eventName] !== 'undefined' && typeof window[this.modalEvents[eventName]] === 'function')
                window[this.modalEvents[eventName]]();
        } catch (ex) { console.log(ex) }
    }





    setModalWrap() {
        this.modalElement = _doc.createElement('div', { class: this.styles.modalWrap });
        this.modalApplyParams();

        this.callModalEvents('onstart');

        return this.modalElement;
    }









    modalApplyParams() {

        if (typeof this.data.params['overlay-blur'] !== 'undefined')
            this.modalElement.classList.add(this.styles.modalBlur)

        if (typeof this.data.params['overlay-click-to-close'] !== 'undefined') {
            this.modalElement.classList.add(this.styles.modalCursorPointer);
            this.modalElement.addEventListener('click', (e) => {

                if (isDragging())
                    return;

                if (!e.target.classList.contains(this.styles.modalCursorPointer))
                    return;
                e.preventDefault();

                this.destroy();
            })
        }

        if (typeof this.data.params['overlay-hotkey-to-close']) {
            this.hotkeyCloseHandler = this.hotkeyCloseEvent.bind(this);
            document.addEventListener('keyup', this.hotkeyCloseHandler);
        }

    }


    getModalXClose(desctructorCall = null) {
        if (typeof this.data.buttons['x-close'] === 'undefined')
            return null;

        let icon = _doc.createElement('img', { src: this.styles.actionXCloseSrc });

        let actionXClose = _doc.createElement('div', { class: this.styles.actionXClose });

        actionXClose.appendChild(icon);

        actionXClose.addEventListener('click', (
            desctructorCall === null ?
                (e) => {
                    this.destroy();
                } :
                desctructorCall
        ));

        return actionXClose;
    }





    /**
     * Modal actions and events
     * 
     * @param {Object} actionsObj 
     * @param {Object} actionsObj.close - default image and event
     * @param {Object} actionsObj.butonName
     * @param {string} actionsObj.butonName.icon - src or svg
     * @param {string} actionsObj.butonName.text - button text
     * @param {Object} actionsObj.butonName.event - custom or null
     * @param {string} actionsObj.butonName.style - css styles
     * @param {string} actionsObj.butonName.class - css class name
     * @param {integer} actionsObj.butonName.textIndex
     */
    getModalActions(actionsObj) {
        let modalAction = _doc.createElement('div', { class: this.styles.modalActions });

        for (let buttonName in actionsObj) {

            if (buttonName === 'x-close')
                continue;


            let icon = (typeof actionsObj[buttonName].icon !== 'undefined' ? actionsObj[buttonName].icon : null);
            let text = (typeof actionsObj[buttonName].text !== 'undefined' ? actionsObj[buttonName].text : null);
            let event = (typeof actionsObj[buttonName].event !== 'undefined' ? actionsObj[buttonName].event : {});
            let style = (typeof actionsObj[buttonName].style !== 'undefined' ? actionsObj[buttonName].style : null);
            let cssclass = (typeof actionsObj[buttonName].class !== 'undefined' ? actionsObj[buttonName].class : null);
            let textIndex = (typeof actionsObj[buttonName].textIndex === 'number' ? actionsObj[buttonName].textIndex : 0);


            let button = null;



            if (typeof event.type === 'undefined')
                event.type = null;
            if (typeof event.func === 'undefined')
                event.func = null;

            if (buttonName == 'close') {
                button = _doc.createElement('div', { class: this.styles.modalButton + ' ' + this.styles.modalActionClose });

                text = (text === null ? 'Закрыть' : text);
                icon = (icon === 'default' ? this.styles.actionXCloseSrc : icon);

                event = {
                    "type": "click",
                    "func": event.func
                };

                button.addEventListener('click', (e) => {
                    this.destroy();
                });

            } else
                button = _doc.createElement('div', { class: this.styles.modalButton + ' ' + buttonName });


            text = _doc.createElement('span', { innerText: (text === null ? '' : text) });




            if (typeof icon === 'string') {

                if (icon.indexOf('<svg') !== -1)
                    icon = _doc.createElement('div', { innerHTML: icon }).childNodes[0];
                else
                    icon = _doc.createElement('img', { src: icon });
            }




            if (typeof event.func !== 'function' && typeof window[event.func] === 'function')
                event.func = window[event.func];

            if (style !== null)
                button.style.cssText += style;

            if (cssclass !== null)
                button.className += (button.className.length > 0 ? ' ' : '') + cssclass;

            if (typeof event.func === 'function')
                button.addEventListener(event.type, (e) => {
                    event.func(e, this);
                });





            if (textIndex === 0) {
                if (text)
                    button.appendChild(text);
                if (icon)
                    button.appendChild(icon);
            } else {
                if (icon)
                    button.appendChild(icon);
                if (text)
                    button.appendChild(text);
            }

            button.setAttribute('data-button', buttonName);


            modalAction.appendChild(button);

        }

        return modalAction;
    }





    innerPreload() {
        // console.log('preload innered');
    }
    removePreload() {
        // console.log('preload removed');
    }

    modalPreload(sources, callback = null) {

        // for (let i = 0; i < sources.length; i++) {
        //     sources[i] += '?' + Math.random();
        // }

        let fileTypes = {
            'img': ["jpg", "jpeg", "svg", "png"],
            'audio': ["mp3"],
            'video': ["mp4"]
        }

        function preloadFiles(sources, callback) {
            let counter = 0;

            function onLoad() {
                counter++;
                if (counter == sources.length) callback();
            }

            function getfileType(file) {
                if (file.indexOf('?') !== -1)
                    file = file.substr(0, file.indexOf('?'));

                let fileType = (/[.]/.exec(file)) ? /[^.]+$/.exec(file)[0] : null;

                if (!fileType)
                    return null;

                for (let key in fileTypes)
                    if (fileTypes[key].includes(fileType))
                        return key;

                return null;
            }

            for (let source of sources) {
                try {
                    let f = document.createElement(getfileType(source));
                    f.onload = f.onerror = onLoad;
                    f.src = source;
                }
                catch (e) { console.log(e) }
            }


        }

        preloadFiles(sources, callback);
    }






    innerModal(element) {
        element.appendChild(this.modalElement);

        this.callModalEvents('onload');
    }




    hotkeyCloseEvent(evt) {
        evt = evt || window.event;

        if (("key" in evt && (evt.key === "Escape" || evt.key === "Esc") || evt.keyCode === 27)) {
            this.destroy();
        }

    }



    initRender(localRender) {
        if (!this.modalDataIsset())
            return;

        this.addStyles(this.getLocalStyles());
        this.setModalWrap();

        this.innerPreload();


        localRender();


        this.innerModal(document.querySelector('body'));
    }


    destroy() {

        if (this.hotkeyCloseHandler)
            document.removeEventListener('keyup', this.hotkeyCloseHandler);


        if (!this.modalElement)
            this.modalElement = document.querySelector('.modal-wrap');

        if (this.onDesctruct)
            this.onDesctruct();


        // this.modal.style.opacity = '0';

        setTimeout(() => {
            this.modalElement.style.opacity = '0';

            setTimeout(() => {
                if (this.modalElement.parentNode)
                    this.modalElement.parentNode.removeChild(this.modalElement);

                this.modalElement = null;
            }, 300);

        }, this.desctructTimeOut);


        this.callModalEvents('onclose');

    }
}






class ModalAlbum extends ModalStruct {

    getLocalStyles() {
        return {
            'modalAlbumLayer': 'modal-album-layer',
            'modalAlbumCard': 'modal-album-card',
            'modalPhoto': 'modal-photo',

            'modalAlbumInfo': 'modal-album-info',
            'modalInfoCard': 'modal-info-card',

            'modalTitle': 'modal-title',
            'modalText': 'modal-text',
            'modalDescr': 'modal-descr'

        }
    }

    getImages() {
        let imgs = [];

        this.data.img.forEach(el => {
            imgs.push(el.src);
        });

        return imgs;
    }

    makeModalAlbum() {

        let modalAlbumlayer = _doc.createElement('div', { class: this.styles.modalAlbumLayer });


        if (typeof this.data.params['overlay-click-to-close'] !== 'undefined')
            modalAlbumlayer.addEventListener('click', (e) => {
                if (e.target.classList.contains(this.styles.modalAlbumLayer))
                    this.albumDestruct();
            });




        this.data.img.forEach(el => {
            let modalAlbumCard = _doc.createElement('div', { class: this.styles.modalAlbumCard });
            let modalPhoto = _doc.createElement('div', { class: this.styles.modalPhoto });
            let photoel = _doc.createElement('img', el);

            modalPhoto.appendChild(photoel);
            modalAlbumCard.appendChild(modalPhoto);

            modalAlbumlayer.appendChild(modalAlbumCard);
        });



        if (this.data.img.length > 3)
            return this.modalElement.appendChild(modalAlbumlayer);



        let modalAlbumInfo = _doc.createElement('div', { class: this.styles.modalAlbumInfo });
        let modalInfoCard = _doc.createElement('div', { class: this.styles.modalInfoCard });

        let modalTitle = null;
        let modalText = null;
        let modalDescr = null;

        let xClose = null;
        let actionButtons = null;



        // xClose = this.getModalXClose(desctructFunc);
        xClose = this.getModalXClose();

        if (typeof this.data.title === 'string')
            modalTitle = _doc.createElement('p', { class: this.styles.modalTitle, innerText: this.data.title });
        if (typeof this.data.text === 'string')
            modalText = _doc.createElement('p', { class: this.styles.modalText, innerText: this.data.text });
        if (typeof this.data.descr === 'string')
            modalDescr = _doc.createElement('p', { class: this.styles.modalDescr, innerText: this.data.descr });

        if (typeof this.data.buttons !== 'undefined') {
            // if (typeof this.data.buttons.close !== 'undefined')
            //     this.data.buttons.close.event.func = desctructFunc;

            actionButtons = this.getModalActions(this.data.buttons);
        }




        if (xClose)
            modalInfoCard.appendChild(xClose);

        if (modalTitle)
            modalInfoCard.appendChild(modalTitle);
        if (modalText)
            modalInfoCard.appendChild(modalText);
        if (modalDescr)
            modalInfoCard.appendChild(modalDescr);

        if (actionButtons)
            modalInfoCard.appendChild(actionButtons);


        modalAlbumInfo.appendChild(modalInfoCard);
        modalAlbumlayer.appendChild(modalAlbumInfo);


        return this.modalElement.appendChild(modalAlbumlayer);
    }


    albumDestruct() {
        this.animation.infoCardAnimateOut(this.elementCall);

        this.elementCall = null;
        this.onDesctruct = null;
        this.destroy();
    }


    render(callelement) {

        this.elementCall = callelement;
        this.animation = new ModalAlbumAnimation();
        this.animation.setStyles(this.styles);


        this.initRender(() => {
            this.modalPreload(this.getImages(), () => {

                this.removePreload();
                this.makeModalAlbum();


                this.animation.infoCardAnimateIn(this.elementCall)

                this.desctructTimeOut = 600;
                this.onDesctruct = () => {
                    this.animation.infoCardAnimateOut(this.elementCall);
                }

            });
        })

    }

}

class ModalField extends ModalStruct { }

class ModalStory extends ModalStruct {
    getLocalStyles() {
        return {
            modalStoryWrap: 'modal-story-wrap',
            modalStoryEvents: 'modal-story-events',
            modalStoryProgressContainer: 'progress-container',

            modalStoryEventClose: 'modal-story--event-close',
            modalStoryLoader: 'modal-story--loader',
            modalStoryEventBack: 'modal-story--event-back',
            modalStoryEventPause: 'modal-story--event-pause',
            modalStoryEventNext: 'modal-story--event-next',

            modalStoryContentWrap: 'modal-story-content-wrap',
            modalStoryContainer: 'modal-story--container',
            modalStoryContent: 'modal-story--content',
            modalStoryContentHeader: 'modal-story--content-header',


            modalStoryImage: 'modal-story--image'

        }
    }

    getImages() {
        let imgs = [];

        this.data.content.forEach(el => {
            imgs.push(el.src);
        });

        return imgs;
    }

    makeModalStory() {

        let storyElement = {
            "tagName": "div",
            "class": this.styles.modalStoryWrap,
            "children": {
                "1": {
                    "tagName": "div",
                    "class": this.styles.modalStoryEvents,
                    "children": {
                        "1": {
                            "tagName": "div",
                            "class": this.styles.modalStoryEventClose
                        },
                        "3": {
                            "tagName": "div",
                            "class": this.styles.modalStoryLoader,
                            "children": {
                                "1": {
                                    "tagName": "div",
                                    "class": this.styles.modalStoryProgressContainer
                                }
                            }
                        },
                        "5": {
                            "tagName": "div",
                            "class": this.styles.modalStoryEventBack
                        },
                        "7": {
                            "tagName": "div",
                            "class": this.styles.modalStoryEventPause
                        },
                        "9": {
                            "tagName": "div",
                            "class": this.styles.modalStoryEventNext
                        }
                    }
                },
                "3": {
                    "tagName": "div",
                    "class": this.styles.modalStoryContentWrap,
                    "children": {
                        "1": {
                            "tagName": "div",
                            "class": this.styles.modalStoryContainer,
                            "children": {
                                "1": {
                                    "tagName": "div",
                                    "class": this.styles.modalStoryContent,
                                    "children": {
                                        "1": {
                                            "tagName": "div",
                                            "class": this.styles.modalStoryContentHeader
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };


        this.modalElement.appendChild(_doc.formatToElement(storyElement));


        this.progressModal = new ModalStoryProcess(this.data.content, this.styles);
        this.progressModal.run(0);

        document.querySelector('.' + this.styles.modalStoryEventClose).addEventListener('click', () => {
            this.storyDesctruct();
        });

        this.animation.animateIn(this.elementCall);

    }

    storyDesctruct() {
        this.animation.animateOut(this.elementCall);

        setTimeout(() => {
            this.progressModal.destroy();
        }, 300);

        this.elementCall = null;
        this.onDesctruct = null;
        this.destroy();
    }

    render(callelement) {

        this.elementCall = callelement;
        this.animation = new ModalStoryAnimation();
        this.animation.setStyles(this.styles);


        this.initRender(() => {
            this.modalPreload(this.getImages(), () => {

                this.removePreload();

                this.makeModalStory();


                this.desctructTimeOut = 400;
                this.onDesctruct = () => {
                    this.animation.animateOut(this.elementCall);

                    setTimeout(() => {
                        this.progressModal.destroy();
                    }, 300);
                }

            });
        });

    }

}




class AnimationSctruct {

    constructor() {
        this.styles = {};
    }

    setStyles(styles) {
        this.styles = Object.assign(styles, this.styles);
    }

}

class ModalAlbumAnimation extends AnimationSctruct {

    constructor() {
        super();

        this.setStyles({
            stickerImgBox: 'sticker-img-box',
            stikerPadding: 'sticker-padding',

            cloneAlbumContainer: 'clone-album-container',

        });
    }


    // DONT TOUCH - tce zalupa, yebet
    infoCardAnimateIn(element) {


        let imgs = element.querySelectorAll('.' + this.styles.stickerImgBox);

        if (imgs.length == 0)
            imgs = element.querySelectorAll('.' + this.styles.stikerPadding);



        let modalWrap = document.querySelector('.' + this.styles.modalWrap);
        let animateElment = modalWrap.querySelectorAll('.' + this.styles.modalAlbumLayer + ' .' + this.styles.modalPhoto);


        let infoCardAnimate = document.querySelector('.' + this.styles.modalInfoCard);
        if (!infoCardAnimate)
            infoCardAnimate = null;



        let clonnedNodesContainer = _doc.createElement('div', { class: this.styles.cloneAlbumContainer });
        let clonnedNodes = [];
        let originalPosition = [];



        animateElment.forEach((el, index) => {

            if (index > 3)
                return;

            clonnedNodes.push(el.cloneNode(true));

            let rect = getBoundingClientRect(el);
            let rotation = getCurrentRotation(el) + 'deg';


            if (index == 0)
                _doc.addStyles(el, { transform: 'translateX(-40%) translateY(44%) rotate(0deg)' });
            if (index == 1)
                _doc.addStyles(el, { transform: 'translateX(40%) translateY(-41%) rotate(0deg)' });
            if (index == 2)
                _doc.addStyles(el, { transform: 'translateX(-40%) translateY(-40%) rotate(0deg)' });
            if (index == 3)
                _doc.addStyles(el, { transform: 'translateX(40%) translateY(40%) rotate(0deg)' });

            let rect1 = getBoundingClientRect(el);

            originalPosition[index] = rect1;
            originalPosition[index].rotation = rotation;
            originalPosition[index].width = getBoundingClientRect(el.parentNode).width;
            originalPosition[index].height = getBoundingClientRect(el.parentNode).height;

            _doc.removeStyles(el, 'transform');

            clonnedNodesContainer.appendChild(clonnedNodes[index]);
        });

        animateElment.forEach((el, index) => {
            // imgs.forEach((el, index) => {

            let imgsIndex = (typeof imgs[index] === 'undefined' ? imgs[0] : imgs[index]);

            let viewportOffset = imgsIndex.getBoundingClientRect();
            let rotation = getCurrentRotation(imgsIndex) + 'deg';

            if (typeof clonnedNodes[index] === 'undefined')
                index = 0;

            _doc.addStyles(clonnedNodes[index], {
                position: 'fixed',
                width: viewportOffset.width + 'px',
                height: viewportOffset.height + 'px',
                transition: '0s',
                left: '0px',
                top: '0px',
                opacity: 1,
                overflow: 'none',
                transform: 'translate(' + viewportOffset.x + 'px, ' + viewportOffset.y + 'px) rotate(' + rotation + ')',
                zIndex: (index > 2 ? 11 : 10 - index)
            });

            if (typeof imgs[index] !== 'undefined')
                _doc.addStyles(imgs[index], { opacity: 0 });
        });


        if (infoCardAnimate) {
            _doc.addStyles(infoCardAnimate, { display: 'none' });
            _doc.removeStyles(infoCardAnimate, 'transition');
        }


        modalWrap.appendChild(clonnedNodesContainer);


        setTimeout(() => {
            if (infoCardAnimate) {
                _doc.addStyles(infoCardAnimate, { opacity: 1 });
                _doc.removeStyles(infoCardAnimate, 'display');
            }

            clonnedNodes.forEach((el, index) => {
                let transitonProp = (index == 0 ? 'transform .5s ease-in-out' : (index == 1 ? 'transform .55s ease' : (index == 2 ? 'transform .4s ease-in' : 'transform .46s ease-in-out')));

                _doc.addStyles(el, {
                    width: originalPosition[index].width + 'px',
                    height: originalPosition[index].height + 'px',

                    transition: transitonProp,

                    transform: 'translate(' + originalPosition[index].x + 'px, ' + originalPosition[index].y + 'px) rotate(' + originalPosition[index].rotation + ')'
                });
            })
        }, 100);


        setTimeout(() => {
            _doc.addStyles(animateElment, { opacity: 1 });

            modalWrap.removeChild(clonnedNodesContainer);
        }, 600);

    }

    infoCardAnimateOut(element) {

        let imgs = element.querySelectorAll('.' + this.styles.stickerImgBox);

        if (imgs.length == 0)
            imgs = element.querySelectorAll('.' + this.styles.stikerPadding);



        let modalWrap = document.querySelector('.' + this.styles.modalWrap);
        let animateElment = modalWrap.querySelectorAll('.' + this.styles.modalAlbumLayer + ' .' + this.styles.modalPhoto);


        let infoCardAnimate = document.querySelector('.' + this.styles.modalInfoCard);
        if (infoCardAnimate) {
            _doc.addStyles(infoCardAnimate, { transform: 'translateX(35%) translateY(250%)' });

            setTimeout(() => {
                _doc.addStyles(infoCardAnimate, { display: 'none' });
            }, 500);
        }




        let clonnedNodesContainer = _doc.createElement('div', { class: this.styles.cloneAlbumContainer });
        let clonnedNodes = [];
        let originalPosition = [];


        modalWrap.appendChild(clonnedNodesContainer);


        animateElment.forEach((el, index) => {

            if (index > 3)
                return;


            clonnedNodes.push(el.cloneNode(true));

            let rotation = getCurrentRotation(el) + 'deg';


            _doc.addStyles(el, {
                transition: '0s',
                opacity: 0
            });

            if (index == 0)
                _doc.addStyles(el, { transform: 'translateX(-40%) translateY(44%) rotate(0deg)' });
            if (index == 1)
                _doc.addStyles(el, { transform: 'translateX(40%) translateY(-41%) rotate(0deg)' });
            if (index == 2)
                _doc.addStyles(el, { transform: 'translateX(-40%) translateY(-40%) rotate(0deg)' });
            if (index == 3)
                _doc.addStyles(el, { transform: 'translateX(-40%) translateY(-40%) rotate(0deg)' });


            let viewportOffset = el.getBoundingClientRect();

            _doc.addStyles(clonnedNodes[index], {
                position: 'fixed',
                width: getBoundingClientRect(el.parentNode).width + 'px',
                height: getBoundingClientRect(el.parentNode).height + 'px',
                transition: '0s',
                left: '0px',
                top: '0px',
                opacity: 1,
                overflow: 'none',
                transform: 'translate(' + viewportOffset.x + 'px, ' + viewportOffset.y + 'px) rotate(' + rotation + ')',
                zIndex: 10 - index
            });

            clonnedNodesContainer.appendChild(clonnedNodes[index]);
        });


        // setTimeout(() => {
        clonnedNodes.forEach((el, index) => {

            // imgs.forEach((el, index) => {

            if (typeof imgs[index] === 'undefined')
                index = 0;

            let viewportOffset = imgs[index].getBoundingClientRect();
            let rotation = getCurrentRotation(imgs[index]) + 'deg';

            let transitonProp = (index == 0 ? 'transform .5s ease-in-out' : (index == 1 ? 'transform .55s ease' : (index == 2 ? 'transform .4s ease-in' : 'transform .46s ease-in-out')));

            _doc.addStyles(el, {
                transition: transitonProp,

                width: viewportOffset.width + 'px',
                height: viewportOffset.height + 'px',
                opacity: 1,


                transform: 'translate(' + viewportOffset.x + 'px, ' + viewportOffset.y + 'px) rotate(' + rotation + ')'
            });

        })
        // }, 50);

        setTimeout(() => {
            _doc.addStyles(animateElment, { opacity: 0 });

            imgs.forEach((el, index) => {
                _doc.addStyles(el, { opacity: 1 });
            });

            modalWrap.removeChild(clonnedNodesContainer);

        }, 600);



    }

}

class ModalStoryAnimation extends AnimationSctruct {

    constructor() {
        super();

        this.setStyles({
            stickerImgBox: 'sticker-img-box',
            stikerPadding: 'sticker-padding',

            cloneAlbumContainer: 'clone-album-container',

        });
    }


    animateIn(element) {

        setTimeout(() => {
            document.querySelector('.' + this.styles.modalStoryWrap).style.opacity = '1';
        }, 300)

    }

    animateOut(element) {
        document.querySelector('.' + this.styles.modalStoryWrap).style.opacity = '0';

    }
}








class ModalStoryProcess {

    constructor(storyesPages, styles) {
        this.storyesPages = storyesPages;
        this.styles = styles;

        this.progressContainer = document.querySelector('.' + this.styles.modalStoryProgressContainer);
        this.progress = [];
        this.backClick = document.querySelector('.' + this.styles.modalStoryEventBack);
        this.nextClick = document.querySelector('.' + this.styles.modalStoryEventNext);
        this.pauseClick = document.querySelector('.' + this.styles.modalStoryEventPause);

        this.currentPosition = null;
        this.dragAndMoveRange = 110;
    }


    instalProgress() {
        this.storyesPages.forEach(el => {
            let styles = {
                'class': 'progress',
                'style': {
                    'animation-duration': "4s"
                }
            };

            if (typeof el.styles !== 'undefined' && typeof el.styles['animation-duration'] !== 'undefined')
                styles.style['animation-duration'] = el.styles['animation-duration'];

            let progress = _doc.createElement('div', styles);

            this.progress.push(progress);
            this.progressContainer.appendChild(progress);
        });
    }


    getCurrentActive() {
        let current = 0;
        let mapBreak = false;
        this.progress.map((el) => {
            if (mapBreak)
                return;
            if (el.classList.contains('active')) {
                mapBreak = true;
                return;
            } else
                current++;
        });

        return current;
    }


    animateMoving(activeNumber, next = true) {
        let wrap = document.querySelector('.' + this.styles.modalStoryContentWrap);

        let element = wrap.querySelector('.' + this.styles.modalStoryContainer);
        let elementNext = element.cloneNode(true);

        if (activeNumber === -1) {
            activeNumber = 0;
            this.drawContent(element, this.storyesPages[activeNumber]);
            return;
        }

        let moveLength = element.offsetWidth + 40;

        if (!this.currentPosition)
            _doc.addStyles(element, 'transform: translateX(0px)');

        _doc.addStyles(elementNext, {
            'transform': 'translateX(' + (moveLength * (next ? 1 : -1) + 'px)')
        });


        (next ?
            wrap.appendChild(elementNext) :
            wrap.insertBefore(elementNext, wrap.firstChild)
        );

        this.drawContent(elementNext, this.storyesPages[activeNumber]);




        let posx = (moveLength * (next ? -1 : 1));
        setTimeout(() => {
            _doc.addStyles(element, {
                'transition': 'all 0.' + (this.currentPosition === null ? 6 : 4) + 's cubic-bezier(.46,0,0,1.01) 0s',
                'transform': 'translateX(' + posx + 'px)'
            });

            setTimeout(() => {
                _doc.addStyles(elementNext, {
                    'transition': 'all 0.6s cubic-bezier(.46,0,0,1.01) 0s',
                    'transform': 'translateX(0px)'
                })
            }, 50);
        }, 50);



        setTimeout(() => {
            wrap.removeChild(element);
            _doc.removeStyles(elementNext, ['transform', 'transition']);
        }, 600);

        this.currentPosition = null;
        this.dragAndMove.resetMoveContent(elementNext);
    }


    drawContent(element, content) {

        let modalContent = element.querySelector('.' + this.styles.modalStoryContent);

        let styles = {};

        if (typeof content.styles !== 'undefined')
            styles = content.styles;


        if (typeof content.src !== 'undefined')
            styles.background = 'url(' + content.src + ')';

        if (typeof styles['background-size'] === 'undefined') {
            styles['background-size'] = 'cover';
            // styles['background-size'] = 'contain';
            styles['background-repeat'] = 'no-repeat';
            styles['background-position'] = 'center';

        }


        let img = element.querySelector('.' + this.styles.modalStoryImage);

        if (!img) {
            img = _doc.createElement('div', { class: this.styles.modalStoryImage });
            element.appendChild(img);
        }

        for (let style in styles)
            img.style.cssText += style + ':' + styles[style] + ';';


        while (modalContent.firstChild) {
            modalContent.removeChild(modalContent.lastChild);
        }

        if (typeof content.title === 'string') {
            modalContent.appendChild(
                _doc.createElement('div', {
                    class: this.styles.modalStoryContentHeader,
                    innerText: content.title
                })
            )
        }


        if (typeof content.text === 'string') {
            modalContent.appendChild(
                _doc.createElement('p', {
                    innerText: content.text
                })
            )
        }

    }




    playNextAnimate(e) {
        // setTimeout(() => { quweySelector('.modal-story--container').style.pointerEvents = 'none'; }, 2000);
        this.playNext();
    };

    playNext(e) {
        let current = this.getCurrentActive();


        if (current + 1 > this.progress.length - 1) {
            current = 0;
            this.progress.map((el) => {
                el.classList.remove('active');
                el.classList.remove('passed');
                this.progress[current].classList.remove('pause');
            });
        } else {
            this.progress[current].classList.remove('active');
            this.progress[current].classList.add('passed');
            current++;
        }

        this.progress[current].classList.add('active');

        if (typeof e === 'number')
            current = -1;

        this.animateMoving(current, true);
        // this.drawContent(current);
    };

    playPreview() {
        let current = this.getCurrentActive();

        this.progress[current].classList.remove('active');
        this.progress[current].classList.remove('passed');
        this.progress[current].classList.remove('pause');

        if (current - 1 < 0) {
            current = this.progress.length - 1;
            this.progress.map((el) => {
                el.classList.remove('active');
                el.classList.add('passed');
            });
        } else
            current--;

        this.progress[current].classList.remove('passed');
        this.progress[current].classList.add('active');
        this.animateMoving(current, false);
        // this.drawContent(current);

    };

    clickHandler() {
        if (!e.target)
            return;

        let current = 0;
        let mapBreak = false;

        this.progress.map((el) => {
            if (!mapBreak)
                current++;
            if (el == e.target) {
                mapBreak = true;
            }
            el.classList.remove('active');
            el.classList.remove('passed');
        });

        current--;
        if (current < 1) {
            current = 0;
            this.progress[current].classList.add('active');
        } else {
            for (let i = 0; i < current; i++)
                this.progress[i].classList.add('passed');

            this.progress[current].classList.add('active');
        }
        this.animateMoving(current, true);
        // this.drawContent(current);
    }

    pauseIt(e) {
        let current = this.getCurrentActive();
        this.progress[current].classList.toggle('pause');
    }



    moveProcess(index) {

        if (index < 1)
            return;


        let progress = Array.from(this.progressContainer.querySelectorAll('.progress'));
        for (let i = 0; i < index; i++)
            progress[i].classList.add('passed');

        this.progressContainer.childNodes[index - 1].classList.add('active');

    }


    dragAndMoveInit() {
        this.dragAndMove = new DragAndMoveMe({
            // handler: document.querySelector('.' + this.styles.modalStoryWrap),
            handler: document.querySelector('.' + this.styles.modalWrap),
            move: document.querySelector('.' + this.styles.modalStoryContainer),
            xMove: true,
            yMove: true,
            whileMove: () => {
                let current = this.getCurrentActive();
                if (!this.progress[current].classList.contains('pause'))
                    this.progress[current].classList.toggle('pause');
            },
            afterMove: (e, newPos) => {
                let current = this.getCurrentActive();
                if (this.progress[current].classList.contains('pause'))
                    this.progress[current].classList.toggle('pause');


                this.currentPosition = newPos;

                if (newPos > this.dragAndMoveRange) {
                    this.playPreview();
                }
                else if (newPos < -this.dragAndMoveRange) {
                    this.playNext();
                } else {
                    this.currentPosition = null;

                    let storyContainer = document.querySelector('.' + this.styles.modalStoryContainer);

                    setTimeout(() => {
                        _doc.addStyles(storyContainer, {
                            'transition': 'all 0.3s cubic-bezier(.46,0,0,1.01) 0s',
                            'transform': 'translateX(0px)'
                        })

                        setTimeout(() => {
                            _doc.removeStyles(storyContainer, ['transform', 'transition']);
                        }, 300);
                    }, 50);
                }
            }
        });
    }


    run(startIndex = 0) {

        this.instalProgress();
        this.moveProcess(startIndex);


        this.backClick.addEventListener('click', (e) => { this.playPreview(e) }, false);
        this.nextClick.addEventListener('click', (e) => { this.playNext(e) }, false);
        this.pauseClick.addEventListener('click', (e) => { this.pauseIt(e) }, false);

        this.progress.map(el => el.addEventListener('animationend', (e) => { this.playNextAnimate(e) }, false));
        this.progress.map(el => el.addEventListener('click', (e) => { this.clickHandler(e) }, false));


        this.playNext(-1);

        this.dragAndMoveInit();

    }


    destroy() {
        while (this.progressContainer.firstChild) {
            this.progressContainer.removeChild(this.progressContainer.lastChild);
        }
    }

}


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



