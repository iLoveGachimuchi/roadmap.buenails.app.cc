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

        switch (this.modal.view) {
            case 'album': modalView = new ModalAlbum(this.modal); break;
            case 'field': modalView = new ModalField(this.modal); break;
            case 'story': modalView = new ModalStory(this.modal); break;
            default: return;
        }

        let elementClick = document.querySelector("[data-event-click=\"" + eventCallName + "\"]").parentNode;

        modalView.render(elementClick);

    }
}







class ModalStruct {
    constructor(modalData) {
        this.data = modalData;
        this.modal = null;

        this.hotkeyCloseHandler = null;

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

        this.desctructTimeOut = 300;
        this.onDesctruct = null;

        this.modalEvents = typeof this.data.events !== 'undefined' ? this.data.events : {};

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
        this.modal = _doc.createElement('div', { class: this.styles.modalWrap });
        this.modalApplyParams();

        this.callModalEvents('onstart');

        return this.modal;
    }









    modalApplyParams() {

        if (typeof this.data.params['overlay-blur'] !== 'undefined')
            this.modal.classList.add(this.styles.modalBlur)

        if (typeof this.data.params['overlay-click-to-close'] !== 'undefined') {
            this.modal.classList.add(this.styles.modalCursorPointer);
            this.modal.addEventListener('click', (e) => {

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
        element.appendChild(this.modal);

        this.callModalEvents('onload');
    }




    hotkeyCloseEvent(evt) {
        evt = evt || window.event;

        if (("key" in evt && (evt.key === "Escape" || evt.key === "Esc") || evt.keyCode === 27)) {
            this.destroy();
        }

    }




    destroy() {

        if (this.hotkeyCloseHandler)
            document.removeEventListener('keyup', this.hotkeyCloseHandler);


        if (!this.modal)
            this.modal = document.querySelector('.modal-wrap');

        if (this.onDesctruct)
            this.onDesctruct();


        this.modal.style.opacity = '0';

        setTimeout(() => {
            this.modal.style.opacity = '0';

            setTimeout(() => {
                if (this.modal.parentNode)
                    this.modal.parentNode.removeChild(this.modal);

                this.modal = null;
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
            return this.modal.appendChild(modalAlbumlayer);



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


        return this.modal.appendChild(modalAlbumlayer);
    }



    // DONT TOUCH - tce zalupa, yebet
    infoCardAnimateIn(element) {
        this.originalElementPosition = element;


        let imgs = element.querySelectorAll('.sticker-img-box');

        if (imgs.length == 0)
            imgs = element.querySelectorAll('.sticker-padding');



        let modalWrap = document.querySelector('.modal-wrap');
        let animateElment = modalWrap.querySelectorAll('.modal-album-layer .modal-photo');


        let infoCardAnimate = document.querySelector('.modal-info-card');
        if (!infoCardAnimate)
            infoCardAnimate = null;



        let clonnedNodesContainer = _doc.createElement('div', { class: "clone-album-container" });
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
        this.originalElementPosition = null;

        let imgs = element.querySelectorAll('.sticker-img-box');

        if (imgs.length == 0)
            imgs = element.querySelectorAll('.sticker-padding');



        let modalWrap = document.querySelector('.modal-wrap');
        let animateElment = modalWrap.querySelectorAll('.modal-album-layer .modal-photo');


        let infoCardAnimate = document.querySelector('.modal-info-card');
        if (infoCardAnimate) {
            _doc.addStyles(infoCardAnimate, { transform: 'translateX(35%) translateY(250%)' });

            setTimeout(() => {
                _doc.addStyles(infoCardAnimate, { display: 'none' });
            }, 500);
        }




        let clonnedNodesContainer = _doc.createElement('div', { class: "clone-album-container" });
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

            modalWrap.removeChild(clonnedNodesContainer);

        }, 600);



    }




    albumDestruct() {
        this.infoCardAnimateOut(this.originalElementPosition);

        this.onDesctruct = null;
        this.destroy();
    }


    render(callelement) {

        if (!this.modalDataIsset())
            return;

        this.addStyles(this.getLocalStyles());
        this.setModalWrap();

        this.innerPreload();

        this.modalPreload(this.getImages(), () => {

            this.removePreload();
            this.makeModalAlbum();

            this.infoCardAnimateIn(callelement)

            this.desctructTimeOut = 600;
            this.onDesctruct = () => {
                this.infoCardAnimateOut(callelement);
            }

        });

        this.innerModal(document.querySelector('body'));
    }

}

class ModalField extends ModalStruct { }

class ModalStory extends ModalStruct {
    getLocalStyles() {
        return {

        }
    }

    getImages() {
        let imgs = [];

        this.data.content.forEach(el => {
            imgs.push(el.src);
        });

        return imgs;
    }

    render(callelement) {

        if (!this.modalDataIsset())
            return;

        this.addStyles(this.getLocalStyles());
        this.setModalWrap();

        this.innerPreload();

        this.modalPreload(this.getImages(), () => {

            this.removePreload();


        });

        this.innerModal(document.querySelector('body'));
    }

}
