/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-------------------Initialiser----------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
window.oncontextmenu = (e) => {
  e.preventDefault();
};
window.onresize = () => {
  resize(false);
};
window.onload = initaliser_jeu;

let imagehero = new Image();
imagehero.src = "image/hero.png";
let ennemi = new Image();
ennemi.src = "image/ennemi.png";
let santebonus = new Image();
santebonus.src = "image/bonus.png";
let herbe = new Image();
herbe.src = "image/epine.png";
let tresor = new Image();
tresor.src = "image/tresor.png";

let hero = {},
  ennemie = [],
  intervalle_ennemi,
  carte = [],
  blockInput = false;
//initialisation parametres jeu
function initaliser_jeu() {
  hero = {
    sante: 40,
    score: 0,
    x: 12,
    y: 7,
  };
  resize(true);
  initialiser();
  dessiner_jeu();
  addEvent();
}
// fonction definir size
function resize(init) {
  let canva_jeu = document.querySelector(".game-canvas");
  canva_jeu.width = (window.innerHeight / 2) * 1.67;
  canva_jeu.height = window.innerHeight / 2;
  if (!init) dessiner_jeu();
}
// fonction randomiser
function aleatoire(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// interaction jeu
function addEvent() {
  document.querySelector("#recommencer-jeu").onclick = recommencer_jeu;
  document.querySelector("#quitter-dungeon").onclick = partie_termine;
  document.querySelector("#bouton-droite").onclick = deplacement_droite;
  document.querySelector("#bouton-gauche").onclick = deplacement_gauche;
  document.querySelector("#bouton-bas").onclick = deplacement_bas;
  document.querySelector("#bouton-haut").onclick = deplacement_haut;
  // entrer clavier
  window.onkeydown = (e) => {
    switch (e.key) {
      default:
        break;
      case "ArrowUp":
        deplacement_haut();
        break;
      case "ArrowDown":
        deplacement_bas();
        break;
      case "ArrowLeft":
        deplacement_gauche();
        break;
      case "ArrowRight":
        deplacement_droite();
        break;
      case "E":
        partie_termine();
        break;
      case "e":
        partie_termine();
        break;
    }
  };
}

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-------------------JEU----------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// mettre a jour score
function maj_score(newScore) {
  let scoreValue = document.querySelector(".score-value");
  scoreValue.innerHTML = newScore;
}

// mettre a jour sante
function maj_sante(sante) {
  let santeValue = document.querySelector(".sante-value");
  let bar = document.querySelector(".bar");
  let ratio = sante / 40;
  bar.style.width = ratio * 55 + "vh";
  santeValue.innerHTML = sante + "/40";
}

// initialiser  jeu
function initialiser() {
  carte = [];
  ennemie = [];
  hero.score = 0;
  hero.sante = 40;
  maj_sante(hero.sante);
  maj_score(hero.score);

  for (let i = 0; i < 25; i++) {
    carte.push([]);
    for (let j = 0; j < 15; j++) {
      carte[i].push(1);
    }
  }
  for (let i = 0; i < 38; i++) {
    let place = false;
    while (!place) {
      let x = aleatoire(0, 24);
      let y = aleatoire(0, 14);
      if (x === 12 && y === 7) continue;
      if (carte[x][y] === 1) {
        place = true;
        carte[x][y] = 2;
      }
    }
  }
  for (let i = 0; i < 38; i++) {
    let place = false;
    while (!place) {
      let x = aleatoire(0, 24);
      let y = aleatoire(0, 14);
      if (x === 12 && y === 7) continue;
      if (carte[x][y] === 1) {
        place = true;
        carte[x][y] = 3;
      }
    }
  }
  let healNum = aleatoire(1, 3);
  for (let i = 0; i < healNum; i++) {
    let place = false;
    while (!place) {
      let x = aleatoire(0, 24);
      let y = aleatoire(0, 14);
      if (x === 12 && y === 7) continue;
      if (carte[x][y] === 1) {
        place = true;
        carte[x][y] = 4;
      }
    }
  }
  let enemyNum = aleatoire(1, 3);
  for (let i = 0; i < enemyNum; i++) {
    let place = false;
    while (!place) {
      let x = aleatoire(0, 24);
      let y = aleatoire(0, 14);
      if (x === 12 && y === 7) continue;
      if (carte[x][y] === 1) {
        place = true;
        ennemie.push({ x: x, y: y });
      }
    }
  }
  intervalle_ennemi = setInterval(maj_ennemi, 300);
  carte[12][7] = 0;
  hero.x = 12;
  hero.y = 7;
}

//  dessiner  jeu
function dessiner_jeu() {
  let canva_jeu = document.querySelector(".game-canvas");
  let ctx = canva_jeu.getContext("2d");
  ctx.clearRect(0, 0, canva_jeu.width, canva_jeu.height);
  let size = window.innerHeight / 2 / 15;
  for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 15; j++) {
      if (carte[i][j] === 1) {
        ctx.beginPath();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(herbe, i * size, j * size, size, size);
        ctx.closePath();
      } else if (carte[i][j] === 2) {
        ctx.beginPath();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tresor, i * size, j * size, size, size);
        ctx.closePath();
      } else if (carte[i][j] === 3) {
        ctx.beginPath();
        ctx.strokeStyle = "rgb(20,20,20)";
        ctx.fillStyle = "rgb(50,50,50)";
        ctx.rect(i * size - 0.5, j * size - 0.5, size, size);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      } else if (carte[i][j] === 4) {
        ctx.beginPath();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(santebonus, i * size, j * size, size, size);
        ctx.closePath();
      }
    }
  }
  for (let i = 0; i < ennemie.length; i++) {
    ctx.beginPath();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(ennemi, ennemie[i].x * size, ennemie[i].y * size, size, size);
    ctx.closePath();
  }
  ctx.beginPath();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(imagehero, hero.x * size, hero.y * size, size, size);
  ctx.closePath();
}

// affichage partie termine
function partie_termine() {
  clearInterval(intervalle_ennemi);
  let partie_termineScore = document.querySelector("#fin-score");
  let partie_termineMask = document.querySelector(".banniere-termine");
  partie_termineScore.innerHTML = "Score: " + hero.score;
  partie_termineMask.style.display = "block";
}

// recommencer le jeu
function recommencer_jeu() {
  let partie_termineMask = document.querySelector(".banniere-termine");
  partie_termineMask.style.display = "none";
  initialiser();
  dessiner_jeu();
}

// mettre a jour ennemi
function maj_ennemi() {
  for (let i = 0; i < ennemie.length; i++) {
    let dir = aleatoire(0, 3);
    switch (dir) {
      default:
        break;
      case 0:
        if (ennemie[i].y > 0 && carte[ennemie[i].x][ennemie[i].y - 1] != 3)
          ennemie[i].y--;
        break;
      case 1:
        if (ennemie[i].y < 14 && carte[ennemie[i].x][ennemie[i].y + 1] != 3)
          ennemie[i].y++;
        break;
      case 2:
        if (ennemie[i].x > 0 && carte[ennemie[i].x - 1][ennemie[i].y] != 3)
          ennemie[i].x--;
        break;
      case 3:
        if (ennemie[i].x < 14 && carte[ennemie[i].x + 1][ennemie[i].y] != 3)
          ennemie[i].x++;
        break;
    }
  }
  collision_ennemi();
  dessiner_jeu();
}
function collision_ennemi() {
  for (let i = 0; i < ennemie.length; i++) {
    if (ennemie[i].x === hero.x && ennemie[i].y === hero.y) {
      ennemie.splice(i, 1);
      hero.sante -= 5;
      hero.score -= 1000;
      if (hero.sante <= 0) {
        hero.sante = 0;
        partie_termine();
      }
      maj_sante(hero.sante); // mettre a jour niveau sante
      maj_score(hero.score); // mettre a jour niveau score
    }
  }
}

/*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------HERO-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

//Deplacer hero en haut
function deplacement_haut() {
  if (!blockInput) {
    if (hero.y > 0 && carte[hero.x][hero.y - 1] != 3) {
      hero.y--;
      if (carte[hero.x][hero.y] === 0) hero.score -= 10;
      else if (carte[hero.x][hero.y] === 2) hero.score += 1000;
      else if (carte[hero.x][hero.y] === 4) {
        hero.sante += 5;
        if (hero.sante > 40) hero.sante = 40;
      } else if (carte[hero.x][hero.y] === 1) {
        hero.score -= 50;
        hero.sante--;
        if (hero.sante === 0) partie_termine();
      }
      collision_ennemi();
      carte[hero.x][hero.y] = 0;
      maj_sante(hero.sante);
      maj_score(hero.score);
      dessiner_jeu();
    }
  }
}
//Deplacer hero en bas
function deplacement_bas() {
  if (!blockInput) {
    if (hero.y < 14 && carte[hero.x][hero.y + 1] != 3) {
      hero.y++;
      if (carte[hero.x][hero.y] === 0) hero.score -= 10;
      else if (carte[hero.x][hero.y] === 2) hero.score += 1000;
      else if (carte[hero.x][hero.y] === 4) {
        hero.sante += 5;
        if (hero.sante > 40) hero.sante = 40;
      } else if (carte[hero.x][hero.y] === 1) {
        hero.score -= 50;
        hero.sante--;
        if (hero.sante === 0) partie_termine();
      }
      collision_ennemi();
      carte[hero.x][hero.y] = 0;
      maj_sante(hero.sante);
      maj_score(hero.score);
      dessiner_jeu();
    }
  }
}

//Deplacer hero a gauche
function deplacement_gauche() {
  if (!blockInput) {
    if (hero.x > 0 && carte[hero.x - 1][hero.y] != 3) {
      hero.x--;
      if (carte[hero.x][hero.y] === 0) hero.score -= 10;
      else if (carte[hero.x][hero.y] === 2) hero.score += 1000;
      else if (carte[hero.x][hero.y] === 4) {
        hero.sante += 5;
        if (hero.sante > 40) hero.sante = 40;
      } else if (carte[hero.x][hero.y] === 1) {
        hero.score -= 50;
        hero.sante--;
        if (hero.sante === 0) partie_termine();
      }
      collision_ennemi();
      carte[hero.x][hero.y] = 0;
      maj_sante(hero.sante);
      maj_score(hero.score);
      dessiner_jeu();
    }
  }
}

//Deplacer hero a droite
function deplacement_droite() {
  if (!blockInput) {
    if (hero.x < 24 && carte[hero.x + 1][hero.y] != 3) {
      hero.x++;
      if (carte[hero.x][hero.y] === 0) hero.score -= 10;
      else if (carte[hero.x][hero.y] === 2) hero.score += 1000;
      else if (carte[hero.x][hero.y] === 4) {
        hero.sante += 5;
        if (hero.sante > 40) hero.sante = 40;
      } else if (carte[hero.x][hero.y] === 1) {
        hero.score -= 50;
        hero.sante--;
        if (hero.sante === 0) partie_termine();
      }
      collision_ennemi();
      carte[hero.x][hero.y] = 0;
      maj_sante(hero.sante);
      maj_score(hero.score);
      dessiner_jeu();
    }
  }
}
