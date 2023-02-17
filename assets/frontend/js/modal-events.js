function bithShowsMe(e)
{
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

    console.log(_doc.htmlToElement(text));

    document.querySelector('main').appendChild(_doc.htmlToElement(text));


    setTimeout(() => {
        document.querySelector('main').removeChild(document.querySelector('.confetti'));
    }, 3000);

}

function bithShowsMe2(e)
{

    console.log('Woof');

    return;
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
    </div>
    `;


    document.querySelector('main').innerHTML += text;


    setTimeout(() => {}, 7000);

}