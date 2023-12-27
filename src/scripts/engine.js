const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  button: document.getElementById("next-duel"),
  victoriesToWin: 10, //Vença 10 duelos para ganhar o jogo.
  timeToWinInSeconds: 120, 
  victories: {
    player: 0,
    computer: 0,
  },
  timer: null,
};

const { score, cardSprites, fieldCards, button, victoriesToWin, timeToWinInSeconds, victories, timer } = state;


const ICONS_PATH = "./src/assets/icons";

const cardData = [
  {
      id: 0,
      name: "Exodia Incarnate",
      icon: "./src/assets/icons/Attribute-exodia-trevas.webp",
      img: "./src/assets/icons/card-exodia-incarnate.gif",
      size: { height: 180, width: "auto" },
      WinOf: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      LoseOf: [],  
  },
  {
    id: 1,
    name: "Dragon Of Ra",
    icon: "./src/assets/icons/Attribute-dragon-of-ra-divino.webp",
    img: "./src/assets/icons/card-dragon-of-ra.gif",
    size: { height: 180, width: "auto" }, 
    WinOf: [2, 3, 4, 6, 7, 8, 9],
    LoseOf: [0, 5],
  },
  {
    id: 2,
    name: "Blue Eyes White Dragon",
    icon: "./src/assets/icons/Attribute-blue-eyes-luz.webp",
    img: "./src/assets/icons/card-blue-eyes.gif",
    size: { height: 100, width: "auto" }, 
    WinOf: [3, 4, 8, 9],
    LoseOf: [0, 1, 5, 6, 7],
  },
  {
    id: 3,
    name: "Red-Eyes Black Dragon",
    icon: "./src/assets/icons/Attribute-eyes-black-dragon-trevas.webp",
    img: "./src/assets/icons/card-black-dragon-yu-gi-oh.gif",
    size: { height: 180, width: "auto" }, 
    WinOf: [8, 9],
    LoseOf: [0, 2, 4, 5, 6, 7],
  },
  {
    id: 4,
    name: "Magician of Black Chaos",
    icon: "./src/assets/icons/Attribute-magician-trevas.webp",
    img: "./src/assets/icons/card-dark-magic-chaos.gif",
    size: { height: 180, width: "auto" }, 
    WinOf: [3, 8, 9],
    LoseOf: [0, 1, 2, 5, 6, 7],
  },
  {
    id: 5,
    name: "Slifer the Sky Dragon",
    icon: "./src/assets/icons/Attribute-slifer-sky-divino.webp",
    img: "./src/assets/icons/card-sliferskydragon.gif",
    size: { height: 180, width: "auto" }, 
    WinOf: [1, 2, 3, 4, 6, 7, 8, 9],
    LoseOf: [0],
  },
  {
    id: 6,
    name: "Obelisk the Tormentor",
    icon: "./src/assets/icons/Attribute-obelisk-the-divino.webp",
    img: "./src/assets/icons/card-obelisk-the.gif",
    size: { height: 180, width: "auto" }, 
    WinOf: [2, 3, 4, 7, 8, 9],
    LoseOf: [0, 5],
  },
  {
    id: 7,
    name: "Hot Red Dragon Archfiend",
    icon: "./src/assets/icons/Attribute-dragon-archfiend-trevas.webp",
    img: "./src/assets/icons/card-red-dragon-archfiend.gif",
    size: { height: 180, width: "auto" }, 
    WinOf: [2, 3, 4, 8, 9],
    LoseOf: [0, 1, 5, 6],
  },
  {
    id: 8,
    name: "Jinzo",
    icon: "./src/assets/icons/Attribute-jinzo-trevas.webp",
    img: "./src/assets/icons/card-jinzo-yugioh.gif",
    size: { height: 180, width: "auto" }, 
    WinOf: [9],
    LoseOf: [0, 1, 2, 3, 4, 5, 6, 7],
  },
  {
    id: 9,
    name: "Galaxy Dragon",
    icon: "./src/assets/icons/Attribute-galaxy-dragon-luz.webp",
    img: "./src/assets/icons/card-galaxy-dragon.gif",
    size: { height: 180, width: "auto" }, 
    WinOf: [ ],
    LoseOf: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  },
];


const playersKey = {
  player: "player",
  computer: "computer",
};

function getRandomCardId() {
  return Math.floor(Math.random() * cardData.length);
}

function drawDefaultCard() {
  cardSprites.avatar.src = `${ICONS_PATH}/card-back.png`;
  cardSprites.name.innerText = "Select";
  cardSprites.type.innerHTML = `a card`;
}

function drawSelectedCard(index) {
  const { img, name, icon } = cardData[index];
  cardSprites.avatar.src = img;
  cardSprites.name.innerText = name;
  cardSprites.type.innerHTML = `Attributes: <img src="${icon}" alt="${name} attribute" width="30" height="30">`;
}


function removeAllCard() {
  const cards = document.querySelectorAll(".card-box img");
  cards.forEach((item) => item.remove());
}


function playAudio(result) {
  if (result !== "Draw") {
    const audio = new Audio(`./src/assets/audios/${result.toLowerCase()}.wav`);
    audio.play();
    audio.volume = 0.2;
  }
}

function checkDuelResult(playerCard, computerCard) {
  if (playerCard.WinOf.includes(computerCard.id)) {
    score.playerScore++;
    return "Win";
  }

  if (playerCard.LoseOf.includes(computerCard.id)) {
    score.computerScore++;
    return "Lose";
  }

  return "Draw";
}

function updateScore(duelResult) {
  if (duelResult !== "Draw") {
    score.scoreBox.innerText = `Win: ${score.playerScore} | Lose: ${score.computerScore}`;
    
    if (duelResult === "Win") {
      victories.player++;
    } else {
      victories.computer++;
    }

    if (victories.player === victoriesToWin || victories.computer === victoriesToWin) {
      endGame();
    }
  }
}


function drawButton(result) {
  button.style.display = "block";
  button.innerText = result;
}

function setCardsFieldDisplay(display) {
  fieldCards.player.style.display = display;
  fieldCards.computer.style.display = display;
}

function setCardsFieldImages(playerCard, computerCard) {
  fieldCards.player.src = playerCard.img;
  fieldCards.computer.src = computerCard.img;
}

function setCardsField(cardId) {
  removeAllCard();

  setCardsFieldDisplay("block");

  const computerCardId = getRandomCardId();

  const computerCard = cardData[computerCardId];
  const playerCard = cardData[cardId];

  setCardsFieldImages(playerCard, computerCard);

  const duelResult = checkDuelResult(playerCard, computerCard);

  playAudio(duelResult);
  updateScore(duelResult);
  drawButton(duelResult);
  drawDefaultCard();
}
/** Nesta lógica todas as cartas estão acessíveis. *
   
async function createCardImage(fieldSide) {
  const randonId = getRandomCardId();

  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", `${ICONS_PATH}/card-back.png`);
  cardImage.setAttribute("data-id", randonId);

  if (playersKey.player === fieldSide) {
    cardImage.classList.add("card");
    cardImage.addEventListener("mouseover", () => drawSelectedCard(randonId));
    cardImage.addEventListener("mouseleave", drawDefaultCard);
    cardImage.addEventListener("click", () => setCardsField(randonId));
  }

  return cardImage;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const cardImage = await createCardImage(fieldSide);
    document.getElementById(`${fieldSide}-cards`).appendChild(cardImage);
  }
}
=========================================================================== */

// As cartas MAIS PODEROSAS só ficam acessíveis quando alguém atinge 5 win no duelo, aumentando a dificuldade.
function createCardImage(fieldSide) {
  const randonId = getRandomCardId();
  
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", `${ICONS_PATH}/card-back.png`);
  cardImage.setAttribute("data-id", randonId);

  if (playersKey.player === fieldSide) {
    cardImage.classList.add("card");

    if ((randonId === 0 || randonId === 1 || randonId === 5) && (victories.player < 5 && victories.computer < 5)) {
      cardImage.classList.add("disabled");
    } else {
      cardImage.addEventListener("mouseover", () => drawSelectedCard(randonId));
      cardImage.addEventListener("mouseleave", drawDefaultCard);
      cardImage.addEventListener("click", () => setCardsField(randonId));
    }
  }

  return cardImage;
}

function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const cardImage = createCardImage(fieldSide);
    document.getElementById(`${fieldSide}-cards`).appendChild(cardImage);
  }
//===========================================================================

}
function init() {
  setCardsFieldDisplay("none");
  drawCards(6, playersKey.player);
  drawCards(6, playersKey.computer);

  const bgm = document.getElementById("bgm");
  bgm.play();
}

function resetDuel() {
  init();
  drawDefaultCard();
  button.style.display = "none";
}

init();

function displayResultMessage(result) {
  const resultModal = document.getElementById("result-modal");
  const resultMessage = document.getElementById("result-message");

  if (result === "Win") {
    resultMessage.innerText = "Parabéns! Você venceu o jogo!";
  } else {
    resultMessage.innerText = "Game over! Você perdeu.";
  }

  resultModal.style.display = "flex";
}

function hideResultMessage() {
  const resultModal = document.getElementById("result-modal");
  resultModal.style.display = "none";
}

function resetGame() {
  hideResultMessage();
  clearInterval(timer);
  victories.player = 0;
  victories.computer = 0;
  score.playerScore = 0;
  score.computerScore = 0;
  score.scoreBox.innerText = `Win: 0 | Lose: 0`;
  init();
}

function endGame() {
  clearInterval(timer);
  button.style.display = "none";

  setTimeout(() => {
    if (victories.player === victoriesToWin) {
      displayResultMessage("Win");
    } else {
      displayResultMessage("Lose");
    }
  }, 500);
}

function openDescriptions() {
  window.open('./descriptions.html', '_blank', 'width=300,height=439');
}
