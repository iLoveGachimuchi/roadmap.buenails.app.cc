const liveConstruct = () => {
    liveConstructTemoholder = null;

    let color = document.querySelector('input[name="color"]:checked');

    color = color == null ? 1 : color.value;

    data = {
        'id': 1,
        'date': new Date().getTime(),
        'type': 'sticker',
        'version': '1.00',
        "event": null,
        "color": color,
        'data': {
            'time': new Date().getTime(),
            'text': document.querySelector('input[name="title"]').value.trim(),
            'descr': document.querySelector('textarea[name="description"]').value.trim(),
            'rotate': 15
        }
    };
    // console.log(new StickerType(data).getHtml());


    document.querySelector('.sticker-example .sticker-view').innerHTML = '';
    document.querySelector('.sticker-example .sticker-view').appendChild(new StickerType(data).getHtml());
}

let liveConstructTemoholder = null;




document.addEventListener('DOMContentLoaded', () => {

    if (!document.querySelector('input[name="color"]:checked'))
        document.querySelector('input[name="color"]').checked = true;

    let eventFunc = (el) => {
        el.addEventListener('change', () => {
            if (liveConstructTemoholder !== null)
                clearTimeout(liveConstructTemoholder);
            liveConstructTemoholder = setTimeout(liveConstruct, 200);
        }, false)
    };


    document.querySelectorAll('.sticker-create input').forEach(eventFunc);
    document.querySelectorAll('.sticker-create textarea').forEach(eventFunc);


    liveConstruct();

});
