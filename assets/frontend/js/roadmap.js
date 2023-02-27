

class NavConstruct {

    constructor() {
        this.navTag = 'nav';
        this.defaultNavDividerWidth = '10px';
    }

    constructStep(navData) {
        return _doc.createElement('a', {
            class: "nav-step",
            innerText: navData.text,
            attributes: [
                ["nav-time", navData.t]
            ]
        });
    }

    constructDivider(index) {
        return _doc.createElement('div', { class: "space-divider step-" + index });
    }

    render(navObj) {
        let nav = _doc.createElement(this.navTag);

        for (let k in navObj) {
            nav.appendChild(this.constructDivider(parseInt(k) + 1));
            nav.appendChild(this.constructStep(navObj[k]));
        }

        document.querySelector('main').appendChild(nav);
    }
}

class ContentConstruct {
    constructor() {
        this.contentClass = 'content';

        this.columnClass = 'roadmap-column';
        this.columntitleClass = 'column-title';
        this.columnBodyClass = 'column-body';
    }

    sortData(data) {
        let formattedData = {};

        for (let k in data) {
            let date = new Date(data[k].date);
            let index = date.getFullYear() + (date.getMonth() > 9 ? date.getMonth().toString() : '0' + date.getMonth().toString());

            if (!formattedData[index])
                formattedData[index] = [];

            formattedData[index].push(data[k]);

        }

        return formattedData;

    }



    constructColumnTitle(data) {

        let date = new Date(data[0].date);

        let columnTitle = _doc.createElement('div', { class: this.columntitleClass });

        columnTitle.appendChild(_doc.createElement('span', { innerText: Months[date.getMonth()] }));
        columnTitle.appendChild(_doc.createElement('small', { innerText: date.getFullYear() }))


        return columnTitle;
    }

    constructColumnBody(data) {

        let columnBody = _doc.createElement('div', { class: this.columnBodyClass });

        let stickers = new StickerStruct(data).extract();

        stickers.forEach(stickerEl => {
            columnBody.appendChild(stickerEl);
        });


        return columnBody;
    }

    constructColumn(data) {
        let column = _doc.createElement('div', { class: this.columnClass });

        column.appendChild(this.constructColumnTitle(data));
        column.appendChild(this.constructColumnBody(data));

        return column;
    }



    render(dataObj) {

        let content = _doc.createElement('div', { class: this.contentClass });

        let sortData = this.sortData(dataObj);

        for (let k in sortData)
            content.appendChild(this.constructColumn(sortData[k]));

        document.querySelector('main').appendChild(content);
    }
}



class StickerStruct {
    constructor(stickersObj) {
        this.stickersData = stickersObj;
        this.stickers = [];
    }


    sortByDate() {
        let newData = [];

        for (let index in this.stickersData) {
            newData.push([index, this.stickersData[index]]);
        }

        newData.sort(function (a, b) {
            if (typeof a[1].date === 'undefined' || !a[1].date)
                a[1].date = 0;

            if (typeof b[1].date === 'undefined' || !b[1].date)
                b[1].date = 0;

            return a[1].date - b[1].date;
        });

        this.stickersData = [];

        for (let index in newData) {
            this.stickersData.push(newData[index][1]);
        }

    }


    extract() {
        this.sortByDate(this.stickersData);

        let days = [];
        for (let i in this.stickersData) {

            if (typeof this.stickersData[i].date === 'undefined' || !this.stickersData[i].date)
                days[i] = 0;
            else
                days[i] = new Date(this.stickersData[i].date).getDate();

            if ((i == 0 && days[i] > 5) || days[i] - days[i - 1] >= 5)
                this.stickers.push(new StickerType().getHtml());

            this.stickers.push(new StickerType(this.stickersData[i]).getHtml());
        }

        return this.stickers;
    }
}

class Sticker
{
    constructor()
    {
        this.sticker = null;

        this.type = 'space';


        this.stickerBoxClass = 'sticker-box';

        this.stickerInspClass = 'sticker-insp';
        this.stickerPaddingClass = 'sticker-padding';

        this.stickerSpaceClass = 'sticker-space';

        this.stickerHandWriteClass = 'sticker-hand-write';


        this.stickerTextClass = 'sticker-text';
        this.stickerDescrClass = 'sticker-descr';
        this.stickerDateClass = 'sticker-date';


        this.sticker3dClass = 'sticker-3d';
        this.stickerColorClass = 'sticker-color';


        this.stickerImgSoloClass = 'sticker-img-solo';
        this.stickerImgGroupClass = 'sticker-img-group';
        this.stickerImgBoxClass = 'sticker-img-box';
        this.stickerImgClass = 'sticker-img';


        this.stickerFullClass = 'sticker-full';
        this.stickerFullImgClass = 'sticker-full-img';



        this.animateClass = 'animate';
        this.stickerAnimateClass = 'sticker-animate';
        this.StickerAnimateImgClass = 'sticker-animate-img';


        this.stickerEventedClass = 'evented';
    }

    setStuckerData(stickerData) {
        this.sticker = stickerData;

        this.type = this.sticker !== null ? this.sticker.type : 'space';
    }

    createStickerBox() {
        return _doc.createElement('div', { class: this.stickerBoxClass });
    }

    feelStickerBoxInsp() {
        let stickerInsp = _doc.createElement('div', { class: this.stickerInspClass });
        let sitckerPadding = _doc.createElement('div', { class: this.stickerPaddingClass });

        stickerInsp.appendChild(sitckerPadding);

        return stickerInsp;
    }

    feelStickerBox() {
        let stickerBox = this.createStickerBox();

        stickerBox.appendChild(this.feelStickerBoxInsp());

        return stickerBox;
    }



    getStickerText(text) {
        return _doc.createElement('p', { class: this.stickerTextClass, innerText: text });
    }

    getStickerDescr(descr) {
        return _doc.createElement('p', { class: this.stickerDescrClass, innerText: descr });
    }

    getStickerDate(date) {
        return _doc.createElement('small', { class: this.stickerDateClass, innerText: date });
    }



    setStickerText(text, stickerInsp) {
        return stickerInsp.querySelector('.' + this.stickerPaddingClass).appendChild(this.getStickerText(text));
    }

    setStickerDescr(descr, stickerInsp) {
        return stickerInsp.querySelector('.' + this.stickerPaddingClass).appendChild(this.getStickerDescr(descr));
    }

    setStickerDate(time, stickerInsp) {
        time = this.timeToFormat(time);
        return stickerInsp.querySelector('.' + this.stickerPaddingClass).appendChild(this.getStickerDate(time));
    }



    setDefaultData(data, stickerInsp) {
        if (typeof data.text != 'undefined')
            this.setStickerText(data.text, stickerInsp);
        if (typeof data.descr != 'undefined')
            this.setStickerDescr(data.descr, stickerInsp);
        if (typeof data.time != 'undefined')
            this.setStickerDate(data.time, stickerInsp);
        if (typeof this.sticker.event != 'undefined')
            this.stickerEventSet(this.sticker.event, stickerInsp);
    }



    timeToFormat(time) {
        if (!time)
            return '';

        time = new Date(time)

        return (time.getDate() > 9 ? time.getDate() : '0' + time.getDate()) + ' ' + Months[time.getMonth()];
    }

}



class StickerType extends Sticker {
    constructor(stickerData = null) {
        super();

        this.setStuckerData(stickerData);
    }

    space() {
        let space = this.createStickerBox();

        space.classList.add(this.stickerSpaceClass);

        return space;
    }


    typeSticker() {
        this.stickerBox = this.feelStickerBox();

        let data = this.sticker.data;

        if (typeof this.sticker.color != 'undefined')
            this.stickerBox.querySelector('.' + this.stickerInspClass).classList.add(this.stickerColorClass + '-' + this.sticker.color);


        this.setDefaultData(data, this.stickerBox.querySelector('.' + this.stickerInspClass));


        return this.stickerBox;
    }

    typeSticker3d() {
        this.typeSticker();

        this.stickerBox.querySelector('.' + this.stickerInspClass).classList.add(this.sticker3dClass);

        return this.stickerBox;
    }

    typeTwoStickers() {
        this.stickerBox = this.createStickerBox();

        let data0 = null;
        let data1 = null;

        if (Array.isArray(this.sticker.data)) {
            data0 = this.sticker.data[0];
            data1 = this.sticker.data[1];

            // this.stickerBox.appendChild(this.feelStickerBoxInsp());
        } else return this.typeSticker();


        let insp0 = this.feelStickerBoxInsp();
        let insp1 = this.feelStickerBoxInsp();

        if (typeof data0.color != 'undefined')
            insp0.classList.add(this.stickerColorClass + '-' + data0.color);
        if (typeof data1.color != 'undefined')
            insp1.classList.add(this.stickerColorClass + '-' + data1.color);

        this.setDefaultData(data0, insp0);
        this.setDefaultData(data1, insp1);

        if (typeof data0.event != 'undefined')
            this.stickerEventSet(data0.event, insp0);
        if (typeof data1.event != 'undefined')
            this.stickerEventSet(data1.event, insp1);


        if (typeof data0['insp-mod'] != 'undefined')
            insp0.classList.add(data0['insp-mod']);
        if (typeof data1['insp-mod'] != 'undefined')
            insp1.classList.add(data1['insp-mod']);


        this.stickerBox.appendChild(insp0);
        this.stickerBox.appendChild(insp1);

        return this.stickerBox;
    }

    typeHandWrite() {
        this.stickerBox = this.feelStickerBox();

        this.stickerBox.querySelector('.' + this.stickerInspClass).classList.add(this.stickerHandWriteClass);

        if (typeof this.sticker.data.text === 'string')
            this.setStickerText(this.sticker.data.text, this.stickerBox.querySelector('.' + this.stickerInspClass));

        if (typeof this.sticker.data.rotate !== 'undefined')
            this.stickerBox.querySelector('.' + this.stickerTextClass).style.transform = 'rotate(' + this.sticker.data.rotate + (typeof this.sticker.data.rotate === 'string' ? + '' : 'deg') + ')';

        return this.stickerBox;
    }

    typeAlbum() {
        this.typeSticker();

        let img = this.sticker.data.img;

        if (!Array.isArray(img))
            return this.stickerBox;

        let stickerPadding = this.stickerBox.querySelector('.' + this.stickerPaddingClass);


        let stickerImgGroup = null;

        if (img.length == 1)
            stickerImgGroup = _doc.createElement('div', { class: this.stickerImgSoloClass })
        else stickerImgGroup = _doc.createElement('div', { class: this.stickerImgGroupClass });

        for (let i = 0; i < 3; i++) {
            if (typeof img[i] === 'undefined')
                continue;

            let stickerImgBox = _doc.createElement('div', { class: this.stickerImgBoxClass });
            let stickerImg = _doc.createElement('div', { class: this.stickerImgClass });
            let elementImg = _doc.createElement('img', img[i]);

            stickerImg.appendChild(elementImg);
            stickerImgBox.appendChild(stickerImg);
            stickerImgGroup.appendChild(stickerImgBox);
        }
        stickerPadding.appendChild(stickerImgGroup);

        return this.stickerBox;
    }


    typePhoto() {
        this.typeSticker();


        let stickerInsp = this.stickerBox.querySelector('.' + this.stickerInspClass);

        stickerInsp.classList.add(this.stickerFullClass);

        let stickerFullImg = _doc.createElement('div', { class: this.stickerFullImgClass });
        let elementImg = _doc.createElement('img', this.sticker.data.img);

        stickerFullImg.appendChild(elementImg);
        stickerInsp.insertBefore(stickerFullImg, stickerInsp.firstChild);

        return this.stickerBox;
    }

    typeAnimate() {

        this.typeSticker();
        let stickerInsp = this.stickerBox.querySelector('.' + this.stickerInspClass);


        if (typeof this.sticker.data.img == 'undefined')
            return this.stickerBox;

        this.stickerBox.classList.add(this.animateClass);

        let stickerAnimate = _doc.createElement('div', { class: this.stickerAnimateClass });
        let stickerAnimateImg = _doc.createElement('div', { class: this.StickerAnimateImgClass });
        let elementImg = _doc.createElement('img', this.sticker.data.img);

        stickerAnimateImg.appendChild(elementImg);
        stickerAnimate.appendChild(stickerAnimateImg);

        stickerInsp.appendChild(stickerAnimate);

        return this.stickerBox;
    }




    stickerEventSet(event, stickerInsp) {
        if (event === null || typeof event == 'undefined')
            return;

        stickerInsp.classList.add(this.stickerEventedClass);

        if (typeof event === 'object')
            stickerEvents.add(event, stickerInsp);
    }




    getHtml() {
        switch (this.type) {
            case 'sticker': return this.typeSticker();
            case 'sticker-3d': return this.typeSticker3d();
            case 'two-stickers': return this.typeTwoStickers()
            case 'hand-write': return this.typeHandWrite();
            case 'album': return this.typeAlbum();
            case 'photo': return this.typePhoto();
            case 'animate': return this.typeAnimate();
            case 'space': return this.space();
            default: return this.space();
        }

    }
}


class StickerEvents {
    constructor() {
        this.stickerEvents = {};
    }

    add(eventObj, element) {
        let type = (typeof eventObj.type == 'undefined' ? null : eventObj.type);
        let call = (typeof eventObj.call == 'undefined' ? null : eventObj.call);
        let event = (typeof eventObj.event == 'undefined' ? null : eventObj.event);
        let func = (typeof eventObj.func == 'undefined' ? null : eventObj.func);
        let eventdata = (typeof eventObj.data == 'undefined' ? null : eventObj.data);

        let eventFunc = null;

        let genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

        let eventName = genRanHex(8);




        switch (type) {
            case 'modal': eventFunc = new ModalConstruct(eventObj); break;
            default: break;
        }



        let stickerEvent = (e, k) => {
            e.preventDefault();

            if (typeof func === 'string')
                func = window[func];

            if (typeof func === 'object' && func !== null) {
                func.call(eventName);
            } else if (typeof func === 'function')
                func(eventName);



            if (typeof eventFunc === 'object') {
                eventFunc.call(eventName);
            } else if (typeof eventFunc === 'function')
                eventFunc(eventName);
        }



        element.addEventListener(event, stickerEvent);
        element.setAttribute('data-event-' + event, eventName);

        this.stickerEvents[eventName] = {
            "data": eventObj.data,
            "type": type,
            "call": call,
            "event": event,
            "func": stickerEvent,
        }
    }

    remove(eventName, element) {
        let eventData = this.get(eventName);

        if (!eventData)
            return false;

        element.removeEventListener(eventData.event, eventData.func);

        element.classList.remove('evented');

        if (typeof element.getAttribute('data-event-' + eventData.event) !== 'undefined')
            delete element.removeAttribute('data-event-' + eventData.event);

        delete this.stickerEvents[eventName];

        return true;
    }

    get(eventName) {
        if (typeof this.stickerEvents[eventName] !== 'undefined')
            return this.stickerEvents[eventName];
        return null;
    }
}



// TODO: make scroll effects on sticker load
// {
//     out {
//         opacity: 0;
//         transform: scale(0.35) translateZ(0px);
//         transition: 0s;
//     }
//     in {
//         opacity: 1;
//         transition: .3s;
//     }
// }