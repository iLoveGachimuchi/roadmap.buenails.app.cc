const liveConstruct = () => {
    liveConstructTemoholder = null;

    let color = document.querySelector('input[name="color"]:checked');
    let type = document.querySelector('select[name="type"]');
    let date = document.querySelector('input[name="date"]').value;
    let time = document.querySelector('input[name="time"]:checked');

    color = color == null ? 1 : color.value;
    type = type.selectedIndex ? type.options[type.selectedIndex].value : 'sticker';
    date = new Date(date);
    time = time ? date.getTime() : 0;

    data = {
        'id': 1,
        'date': date.getTime(),
        'type': type,
        'version': '1.00',
        "event": null,
        "color": color,
        'data': {
            'time': time,
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

    if (!document.querySelector('input[name="date"]').value)
        document.querySelector('input[name="date"]').valueAsDate = new Date();

    let eventFunc = (el) => {
        el.addEventListener('change', () => {
            if (liveConstructTemoholder !== null)
                clearTimeout(liveConstructTemoholder);
            liveConstructTemoholder = setTimeout(liveConstruct, 200);
        }, false)
    };


    document.querySelectorAll('.sticker-create input').forEach(eventFunc);
    document.querySelectorAll('.sticker-create textarea').forEach(eventFunc);
    document.querySelectorAll('.sticker-create select').forEach(eventFunc);


    liveConstruct();

});
