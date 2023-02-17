const Months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

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

const stickerEvents = new StickerEvents;





const documentLoadEvent = (responce) => {
    let nav = new NavConstruct;
    let cont = new ContentConstruct;

    nav.render(responce.nav);
    cont.render(responce.data);

}

makeFetchJson('/stickers', documentLoadEvent);

