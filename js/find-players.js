async function getData(user) {
    try {
        const response = await fetch('https://api.chess.com/pub/player/' + user);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const playerObj = await response.json();
        console.log(playerObj);
        buildPlayerCard(playerObj);
    } catch (error) {
    console.error(error);
    }
}

function buildPlayerCard(playerObj){
    if (playerList.includes(playerObj.username)){return;}
    if (playerList.length > 5){return;}
    let card = document.createElement('div');
    card.classList.add('card');
    card.id = playerObj.username;
    let playerImg = document.createElement('img');
    playerImg.src = (playerObj.hasOwnProperty('avatar')) ? playerObj.avatar : defaultPicture;
    playerImg.classList.add('propic');
    let h1 = document.createElement('h1');
    h1.textContent = playerObj.username;
    let del = document.createElement('div');
    del.setAttribute('onclick', "del('" + playerObj.username + "')");
    del.textContent = 'X';
    del.classList.add('del');
    card.appendChild(del);
    card.appendChild(playerImg);
    card.appendChild(h1);
    document.querySelector('.playersSection').appendChild(card);
    playerList.push(playerObj.username);
}

function submitPlayer(){
    let user = document.querySelector('#username').value;
    getData(user);
    document.querySelector('#username').value = '';
}

function del(id){
    document.getElementById(id).remove();
    playerList = playerList.filter(i => i != id);
}

function carica(){
    let str = "";
    for (let el of playerList){
        str += el + ',';
    }
    window.open('index.html?playerList=' + str.substring(0, str.length -1));
}

function trash(){
     document.querySelector('.playersSection').innerHTML = "";
     playerList = [];
}

function createCards(gamers){
    for (let gamer of gamers){
        getData(gamer);
    }
}

const defaultPicture = 'https://www.chess.com/bundles/web/images/user-image.007dad08.svg';
let playerList = [];

let presets = {
    'ChessSociety': ['chesssociety', 'louiscarline', 'andreasperelli1', 'not_arcipelago', 'kingindian'],
    'chessComIT': ['chesssociety', 'parthenope', 'AlessiaSanteramo', 'chessburger_tv'],
    'Streamers': ['alexandrabotez', 'Hikaru', 'gothamchess', 'annacramling', 'danielnaroditsky'],
    'SuperGM': ['magnuscarlsen', 'hikaru', 'fabianocaruana', 'Firouzja2003', 'Chefshouse', 'lachesisQ']
}

for (const [key, value] of Object.entries(presets)){
    let btn = document.createElement('button');
    btn.id = key;
    btn.textContent = key;
    btn.classList.add('submitButton');
    btn.addEventListener('click', (e) => {createCards(value);});
    document.querySelector('.preset').appendChild(btn);
}
