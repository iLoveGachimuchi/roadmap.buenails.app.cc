const Months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const stickerRequest = '/stickers';
const stickerEvents = new StickerEvents;

const _doc = {

    createElement(element, param = {}) {
        let el = document.createElement(element);

        for (let it in param) {
            if (it == 'innerText')
                el.innerText = param[it];
            else if (it == 'innerHTML')
                el.innerHTML = param[it];
            else if (it == 'attributes') {
                for (let i = 0; i < param[it].length; i++)
                    el.setAttribute('data-' + param[it][i][0], param[it][i][1]);
            } else if (it == 'style' && typeof param[it] === 'object') {
                for (let itstyle in param[it])
                    el.style[itstyle] = param[it][itstyle];
            } else if (it == 'cssText')
                el.style += param[it];
            else
                el.setAttribute(it, param[it]);
        }

        return el;

    },

    addStyles(element, param) {
        if (typeof element.length !== 'undefined') {
            element.forEach(el => {
                _doc.addStyles(el, param);
            });
        } else {
            if (typeof param === 'string')
                element.style.cssText += param;
            else
                for (let style in param) {
                    let styleParam = param[style];

                    element.style[style] = styleParam;
                }
        }
    },

    removeStyles(element, param) {
        if (typeof element.length !== 'undefined') {
            element.forEach(el => {
                _doc.removeStyles(el, param);
            });
        }
        else {
            if (typeof param === 'string') {
                element.style[param] = null;
            }
            else if (Array.isArray(param)) {
                param.forEach(el => {
                    element.style[el] = null;
                });
            } else {
                for (let style in param) {
                    element[style] = null;
                }
            }
        }
    },

    htmlToElement(htmltext) {
        htmltext = htmltext.replace('    ', '').replace("\n", '');

        let element = _doc.createElement('div', { innerHTML: htmltext });

        if (element.children.length > 1)
            return element.childNodes;

        return element.firstChild;
    }
}

const makeFetchJson = (request, callback) => {
    fetch(request).then((response) => {
        if (response.ok) {
            response.json().then((resp) => {
                callback(resp);
            });
        } else {
            console.log('Network request to "' + request + '" failed with response ' + response.status + ': ' + response.statusText);
        }
    });
}


const documentLoadEvent = (responce) => {
    let nav = new NavConstruct;
    let cont = new ContentConstruct;

    if (typeof responce.nav !== 'undefined')
        nav.render(responce.nav);

    cont.render(responce.data);

}

makeFetchJson(stickerRequest, documentLoadEvent);

