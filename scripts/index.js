const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
let flowField;
let flowFieldAnimation;

window.onload = function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
  flowField.animate(0);
};

window.addEventListener("resize", () => {
  cancelAnimationFrame(flowFieldAnimation);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
  flowField.animate(0);
});

const mouse = {
  x: null,
  y: null,
};

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

class FlowFieldEffect {
  #ctx;
  #width;
  #height;
  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#ctx.strokeStyle = "white";
    this.#width = width;
    this.#height = height;
    this.angle = 0;
    this.lastTime = 0;
    this.interval = 1000 / 60;
    this.timer = 0;
    this.cellSize = 15;
    this.gradient;
    this.#createGradient();
    this.#ctx.strokeStyle = this.gradient;
    this.radius = 0
    this.vr = 0.05
  }
  #createGradient() {
    this.gradient = this.#ctx.createLinearGradient(
      0,
      0,
      this.#width,
      this.#height
    );
    this.gradient.addColorStop("0.1", "#fffc33");
    this.gradient.addColorStop("0.2", "#fff6b3");
    this.gradient.addColorStop("0.3", "#ccccff");
    this.gradient.addColorStop("0.4", "#b3ffff");
    this.gradient.addColorStop("0.5", "#80ff80");
    this.gradient.addColorStop("0.6", "#ffff33");
    this.gradient.addColorStop("0.7", "#ff2fb0");
    this.gradient.addColorStop("0.8", "#fffc03");
    this.gradient.addColorStop("0.9", "#2ffc33");
  }
  #drawLine(angle, x, y) {
    let dx = mouse.x - x
    let dy = mouse.y - y
    let distance = (dx * dx + dy * dy );
    if(distance > 100000){
      distance = 600000
    }
    let length = distance / 10000
    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);
    this.#ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    this.#ctx.stroke();
  }
  animate(timeStamp) {
    const deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;
    if (this.timer > this.interval) {
      this.#ctx.clearRect(0, 0, this.#width, this.#height);
      this.radius += this.vr
      if(this.radius > 7 || this.radius < -7){
        this.vr *= -1
      }
      for (let y = 0; y < this.#height; y += this.cellSize) {
        for (let x = 0; x < this.#width; x += this.cellSize) {
          const angle = (Math.cos(x * mouse.x * 0.0001) + Math.sin(y * mouse.y * 0.0001)) * this.radius;
          this.#drawLine(angle, x, y);
        }
      }
      this.timer = 0;
    } else {
      this.timer += deltaTime;
    }
    flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
  }
}
