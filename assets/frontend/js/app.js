const Months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const stickerRequest = '/stickers';
const stickerEvents = new StickerEvents;


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

