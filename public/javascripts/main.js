let player = document.querySelectorAll("#player div img"); //get array player
let com = document.querySelectorAll("#com div img"); //get array com
let output = document.querySelectorAll("#output div"); //get array hasil
const btnReset = document.getElementById("btnReset"); //get button reset
let action = true;

class Game {
  constructor(player, com) {
    this.player = player;
    this.com = com;
  }
  start() {
    for (let index = 0; index < player.length; index++) {
      player[index].addEventListener("click", () => {
        if (action) {
          this.player = index;
          this.com = this.iRandom();
          player[this.player].classList.toggle("selectedColor");
          com[this.com].classList.add("selectedColor");
          let result = this.compare();
          this.displayOutput(result);
          this.reset();
          action = false;
        } else {
          alert("Silahkan klik tombol reset");
        }
      });
    }
  }
  iRandom() {
    return Math.floor(Math.random() * 3);
  }
  // 0batu, 1kertas, 2gunting
  compare() {
    let result;
    if (this.player == this.com) {
      result = "seri";
    } else {
      if (this.player == 0) {
        this.com == 2 ? (result = "menang") : (result = "kalah");
      } else if (this.player == 1) {
        this.com == 0 ? (result = "menang") : (result = "kalah");
      } else if (this.player == 2) {
        this.com == 1 ? (result = "menang") : (result = "kalah");
      }
    }
    return result;
  }

  displayOutput(result) {
    for (let index = 0; index < output.length; index++) {
      if (output[index].classList.contains(result)) {
        output[0].classList.add("visually-hidden");
        output[index].classList.remove("visually-hidden");
      }
    }
  }
  reset() {
    btnReset.addEventListener("click", () => {
      this.iRandom();
      player.forEach((element) => {
        element.classList.remove("selectedColor");
      });
      com.forEach((element) => {
        element.classList.remove("selectedColor");
      });
      output.forEach((element) => {
        element.classList.add("visually-hidden");
      });
      output[0].classList.remove("visually-hidden");
      action = true;
    });
  }
}
let Hasil = new Game();
Hasil.start();
