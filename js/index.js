const urlParams = new URLSearchParams(window.location.search);
const playerList = urlParams.get('playerList').split(',');

const defaultPicture = 'https://www.chess.com/bundles/web/images/user-image.007dad08.svg';

let isEnded = false;
let round = 0;
let score = 0;
let maxRound = 7;
let players = [];
let selected = playerList[0]
let game = {};
loadGame();

function newGame(){
    round = 0;
    score = 0;
    loadGame();
    document.querySelector('.score').textContent = "Score: " + score + " / " + round;
    isEnded = false;
    document.querySelector('.score').classList.toggle('over');
    for (let el of document.querySelectorAll('.info > h1, .info > a')){el.textContent = "";}
}

function buildInfo(){
    let time;
    if (game['time_control'].includes('+')){
        time = game['time_control'].split('+')[0] / 60 + " | " + game['time_control'].split('+')[1];
    } else {
        time = game['time_control'].split('+')[0] / 60 + " | 0"
    }
    let url = game['url'];
    document.querySelector('.time').textContent = "time: " + time;
    document.querySelector('.white').textContent = "white: " + players[0];
    document.querySelector('.black').textContent = "black: " + players[1];
    document.querySelector('.gameLink').textContent = "See Game";
    document.querySelector('.gameLink').href = url;
}

function guess(){
    if (isEnded){return;}
    if (players.includes(selected)){
            score++;
        }
    if(round < maxRound){
        round++;
    }
    if (round == maxRound){
        isEnded = true;
        document.querySelector('.score').classList.toggle('over');
    }
    else{loadGame();}
    document.querySelector('.score').textContent = "Score: " + score + " / " + round;
    buildInfo();
}


function select(player){
    for (let card of document.getElementsByClassName('card')){
        if (card.classList.contains('selected')){
            card.classList.remove('selected');
        }
    }
    selected = player.querySelector('h1').textContent;
    player.classList.add('selected');
}

async function loadGame(){
    let url = 'https://api.chess.com/pub/player/' + playerList[Math.floor(Math.random() * playerList.length)] + '/games/archives'
    let archives = await fetch(url);
    console.log(url);
    let archivesJson = await archives.json();
    let partita;
    do {
        let data = await fetch(archivesJson.archives[Math.floor(Math.random() * archivesJson['archives'].length)]);
        let dataJson = await data.json();
        partita = dataJson.games[Math.floor(Math.random() * dataJson['games'].length)];
    } while (partita.rules !== 'chess');
    game = partita;
    players[0] = partita.white.username.toLowerCase();
    players[1] = partita.black.username.toLowerCase();
    delBoard();
    createBoard(partita.pgn);
}

//document.body.textContent = playerList;
function createCard(playerObj){
    let card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('onclick', 'select(this)')
    card.id = playerObj.username;
    let playerImg = document.createElement('img');
    playerImg.src = (playerObj.hasOwnProperty('avatar')) ? playerObj.avatar : defaultPicture;
    playerImg.classList.add('propic');
    let h1 = document.createElement('h1');
    h1.textContent = playerObj.username;
    card.appendChild(playerImg);
    card.appendChild(h1);
    document.querySelector('.player-section').appendChild(card);
}

async function getData(user) {
    try {
        const response = await fetch('https://api.chess.com/pub/player/' + user);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const playerObj = await response.json();
        console.log(playerObj);
        createCard(playerObj);
    } catch (error) {
    console.error(error);
    }
}

for (let el of playerList){
    getData(el);
}


function delBoard(){
    document.getElementsByTagName('ct-pgn-viewer')[0].remove();
}

function createBoard(pgn){
    let board = document.createElement('ct-pgn-viewer');
    board.textContent = pgn;
    document.querySelector('.main').appendChild(board);
//    document.querySelector('ct-pgn-viewer > div > div.ct-pgn-viewer-move-list-and-controls.mdc-card.ct-elev--z8 > game-header > div.ct-game-header-players-and-result').style.display = "none";
}

//delBoard();
