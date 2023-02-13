const Months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];


const documentLoadEvent = (responce) => {
    console.log(responce);

    let nav = new NavConstruct;
    let cont = new ContentConstruct;

    nav.render(responce.nav);
    cont.render(responce.data)
}

fetch('/assets/frontend/var/stickers.json').then(function (response) {
    if (response.ok) {
        response.json().then(function (json) {
            documentLoadEvent(json);
        });
    } else {
        console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
    }
});

const _doc = {

    createElement(element, param = {}) {
        let el = document.createElement(element);

        for (let it in param) {
            if (it == 'innerText')
                el.innerText = param[it];
            else if (it == 'innerHTML')
                el.innerHTML = param[it];
            else if (it == 'attributes')
                for (let i = 0; i < param[it].length; i++)
                    el.setAttribute('data-' + param[it][i][0], param[it][i][1]);
            else
                el.setAttribute(it, param[it]);
        }

        return el;

    }
}


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

        let days = [];
        for (let i = 0; i < data.length; i++) {
            days[i] = new Date(data[i].date).getDate();

            if ((i == 0 && days[i] > 5) || days[i - 1] - days[i] >= 5)
                columnBody.appendChild(new Sticker().getHtml());

            console.log(days[i], data[i]);
            columnBody.appendChild(new Sticker(data[i]).getHtml());
        }

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

class Sticker {
    constructor(stickerData = null) {
        this.sticker = stickerData;
        this.type = this.sticker !== null ? this.sticker.type : 'space';

        this.stickerBoxClass = 'sticker-box';

        this.stickerInspClass = 'sticker-insp';
        this.stickerPaddingClass = 'sticker-padding';

        this.stickerSpaceClass = 'sticker-space';

        this.stickerHandWriteClass = 'sticker-hand-write';


        this.stickerTextClass = 'sticker-text';
        this.stickerDescrClass = 'sticker-descr';
        this.stickerDateClass = 'sticker-date';


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
        time = new Date(time)

        return (time.getDate() > 9 ? time.getDate() : '0' + time.getDate()) + ' ' + Months[time.getMonth()];
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

        this.stickerBox.appendChild(insp0);
        this.stickerBox.appendChild(insp1);

        return this.stickerBox;
    }

    typeHandWrite() {
        this.stickerBox = this.feelStickerBox();

        this.stickerBox.querySelector('.' + this.stickerInspClass).classList.add(this.stickerHandWriteClass);

        if (typeof this.sticker.data.text)
            this.setStickerText(this.sticker.data.text, this.stickerBox.querySelector('.' + this.stickerInspClass));


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
    }

    getHtml() {

        switch (this.type) {
            case 'sticker': return this.typeSticker();
            case 'two-stickers': return this.typeTwoStickers()
            case 'hand-write': return this.typeHandWrite();
            case 'album': return this.typeAlbum();
            case 'photo': return this.typePhoto();
            case 'animate': return this.typeAnimate();
            case 'space': return this.space();
            default: return _doc.createElement('div', { class: 'sticker-box' }); this.space();
        }

    }


}