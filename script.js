let HighScore = document.getElementById('high_score');
let Score = document.getElementById('score');
let HighScore2 = document.getElementById('high_score2');
let Score2 = document.getElementById('score2');
const startScreen = document.getElementById('startScreen');
const StartBtn = document.getElementById('start_btn');
const GameOver = document.getElementById('game_over');
const PlayAgainBtn = document.getElementById('play_again_btn');

StartBtn.addEventListener('click', function () {
  startScreen.style.display = 'none';

  Game();
});

PlayAgainBtn.addEventListener('click', function () {
  GameOver.style.display = 'none';
  score_count = 0;
  Score.innerText = 0;
  high_score =
    localStorage.getItem('HighScore') &&
    JSON.parse(localStorage.getItem('HighScore'));
  HighScore.innerText = high_score;
  Game();
});

let score_count = 0;
let high_score =
  localStorage.getItem('HighScore') &&
  JSON.parse(localStorage.getItem('HighScore'));

HighScore.innerText = high_score;
HighScore2.innerText = high_score;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function Game() {
  let PlayerColor = `hsla(${19}, 100%, 50%, 1)`;

  const canvas = document.querySelector('canvas'); // Grab canvas from DOM
  const c = canvas.getContext('2d'); // Get context to access 2D canvas functions
  canvas.width = window.innerWidth; // Set canvas' width to full width of window
  canvas.height = window.innerHeight; // Set canvas' height to full height of window

  let Playerradius = 20;
  //(canvas.getWidth()-gBall.getWidth())/2
  //(canvas.getHeight()-gBall.getHeight())/2
  let x = (canvas.width + Playerradius) / 2;
  let y = (canvas.height + Playerradius) / 2;

  function drawPlayer() {
    c.beginPath();
    c.strokeStyle = PlayerColor;
    c.fillStyle = PlayerColor;
    c.arc(x, y, Playerradius, 0, 2 * Math.PI);
    c.fill();
    c.stroke();
  }

  ////////////////////////////////
  function Bullets(radius, vx, vy) {
    this.x = (canvas.width + Playerradius) / 2;
    this.y = (canvas.height + Playerradius) / 2;
    this.radius = radius;
    this.vx = vx;
    this.vy = vy;
  }

  Bullets.prototype.draw = function () {
    c.beginPath();
    c.fillStyle = PlayerColor;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  };

  Bullets.prototype.update = function () {
    this.draw();
    this.y += this.vy * 10;
    this.x += this.vx * 10;
  };
  /////////////////////////////////

  function Objects(x, y, radius, color, vx, vy) {
    this.x = x; //Math.floor(Math.random() * (xMax - xMin) + xMin) * 2;
    this.y = y; // Math.floor(Math.random() * (yMax - yMin) + yMin) * 2;
    this.radius = radius;
    this.color = color;
    this.vy = vy;
    this.vx = vx;
  }

  Objects.prototype.draw = function () {
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  };

  Objects.prototype.update = function () {
    this.draw();

    this.y += this.vy * Math.random();
    this.x += this.vx * Math.random();
  };

  ///////////////

  let bulletsArray = [];
  //let bullet = new Bullets(25, 0, 0);

  let enemyArr = [];
  let debris = [];

  function SpawnEnemies() {}
  for (let i = 0; i < 10; i++) {
    const color = `rgb(${(Math.random() + 5) * 255},${Math.random() * 255},${
      Math.random() * 255
    })`;

    let xList = [getRandomInt(0, -1000), getRandomInt(canvas.width, 1000)];
    let yList = [getRandomInt(0, -1000), getRandomInt(canvas.height, 1000)];

    let x = xList[Math.floor(Math.random() * 2)];
    let y = yList[Math.floor(Math.random() * 2)];

    targetX = canvas.width / 2 - Playerradius;
    targetY = canvas.height / 2 - Playerradius;

    let newX = targetX - x;
    let newY = targetY - y;
    let distance = Math.sqrt(newX * newX + newY * newY);

    let vx = (newX / distance) * 2;
    let vy = (newY / distance) * 2;

    let radiusChoice = [25, 25, 35, 25, 45, 55, 25, 37, 25, 40];
    let radius = radiusChoice[Math.floor(Math.random() * 10)];

    enemyArr.push(new Objects(x, y, radius, color, vx, vy));
  }

  function BulletLogic(e) {
    bulletX = canvas.width / 2 - Playerradius;
    bulletY = canvas.height / 2 - Playerradius;
    clickedX = e.clientX;
    clickedY = e.clientY;

    let newX = clickedX - bulletX;
    let newY = clickedY - bulletY;

    let distance = Math.hypot(clickedX - bulletX, clickedY - bulletY);

    let vx = newX / distance;
    let vy = newY / distance;

    bulletsArray.push(new Bullets(6, vx, vy));
  }

  document.addEventListener('click', (e) => {
    BulletLogic(e);
  });
  let animationId;
  function animate() {
    animationId = requestAnimationFrame(animate); // Create an animation loop
    c.fillStyle = ' rgba(0,0,0,0.3)';
    c.fillRect(0, 0, canvas.width, canvas.height); // Erase whole canvas

    drawPlayer();
    bulletsArray.forEach((bullet, index) => {
      bullet.update();
      if (
        bullet.x > canvas.width ||
        bullet.x < 0 ||
        bullet.y > canvas.height ||
        bullet.y < 0
      ) {
        bulletsArray.splice(index, 1);
      }
    });
    enemyArr.forEach((enemy) => enemy.update());
    debris.forEach((debri, index) => {
      debri.update();
      if (
        debri.x > canvas.width ||
        debri.x < 0 ||
        debri.y > canvas.height ||
        debri.y < 0
      ) {
        debris.splice(index, 1);
      }
    });

    enemyArr.forEach((enemy, EnemyIndex) => {
      const dist = Math.hypot(enemy.x - x, enemy.y - y);
      if (dist - enemy.radius - Playerradius < 1) {
        Score2.innerText = score_count;
        HighScore2 = high_score;
        cancelAnimationFrame(animationId);
        GameOver.style.display = 'grid';
      }

      bulletsArray.forEach((bullet, bulletIndex) => {
        const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);

        if (dist - enemy.radius < 1) {
          score_count += 5;
          Score.innerText = score_count;
          if (score_count % 100 == 0) {
            PlayerColor = `hsla(${getRandomInt(1, 360)}, 100%, 50%, 1)`;
          }

          enemy.radius = enemy.radius - 16;
          bulletsArray.splice(bulletIndex, 1);
          if (enemy.radius < 25) {
            enemyArr.splice(EnemyIndex, 1);
          }

          if (score_count > high_score) {
            high_score = score_count;
            localStorage.setItem('HighScore', JSON.stringify(high_score));
          }

          for (let i = 0; i < 80; i++) {
            debris.push(
              new Objects(
                enemy.x,
                enemy.y,
                2,
                enemy.color,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
              )
            );
          }
          let escalateSpawn = 1;
          escalateSpawn += 0.05;
          let val = Math.floor(escalateSpawn);

          setTimeout(() => {
            for (let i = 0; i < val; i++) {
              const color = `rgb(${Math.random() * 255},${
                Math.random() * 255
              },${(Math.random() + 5) * 255})`;

              let xList = [
                getRandomInt(0, -1000),
                getRandomInt(canvas.width, 1000),
              ];
              let yList = [
                getRandomInt(0, -1000),
                getRandomInt(canvas.height, 1000),
              ];

              let x = xList[Math.floor(Math.random() * 2)];
              let y = yList[Math.floor(Math.random() * 2)];

              targetX = canvas.width / 2 - Playerradius;
              targetY = canvas.height / 2 - Playerradius;

              let newX = targetX - x;
              let newY = targetY - y;
              let distance = Math.sqrt(newX * newX + newY * newY);

              let vx = newX / distance;
              let vy = newY / distance;

              let radiusChoice = [25, 25, 35, 25, 45, 35, 25, 27, 25, 40];
              let radius = radiusChoice[Math.floor(Math.random() * 10)];

              enemyArr.push(new Objects(x, y, radius, color, vx, vy));
            }
          }, 1);
        }
      });
    });
  }

  animate();
}
