function bithShowsMe(e) {
    let text = `
    <div class="confetti">
        <div class="squareOne"></div>
        <div class="squareTwo"></div>
        <div class="squareThree"></div>
        <div class="squareFour"></div>
        <div class="squareFive"></div>
        <div class="squareSix"></div>
        <div class="squareSeven"></div>
        <div class="squareEight"></div>
        <div class="squareNine"></div>
        <div class="squareTen"></div>
    </div>`;

    document.querySelector('.modal-wrap').appendChild(_doc.htmlToElement(text));


    setTimeout(() => {
        try {
            document.querySelector('.modal-wrap').removeChild(document.querySelector('.confetti'));
        } catch { }
    }, 3000);

}

function bithShowsMe2(e) {

    console.log('Woof');

}

function bithShowsMe3(e) {

    console.log('Meow');

}