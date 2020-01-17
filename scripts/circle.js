const COLOR = (a) => {
    return `rgba(51,195,240,${a})`;
};
const canvas = document.getElementById("beats--anime");
const context = canvas.getContext("2d");

const WIDTH = canvas.width = 200;
const HEIGHT = canvas.height = 200;

class Circle {
    constructor(lineWidth, size, tick, timeStamp) {
        this.lineWidth = lineWidth;
        this.size = size;
        this.radius = size;
        this.tick = tick;
        this.timeStamp = timeStamp;
    };

    draw() {
        context.beginPath();
        context.strokeStyle = COLOR(0.5);
        context.fillStyle = COLOR(0.1);
        context.lineWidth = this.lineWidth;
        context.arc(WIDTH / 2, HEIGHT / 2, this.radius, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
        context.stroke();
        context.fill();
    };

    update(time) {
        const angle = time * Math.PI / this.tick;
        this.radius = this.size * (1 - Math.sin(angle));
    };
}

export function initCircle() {
    const circle = new Circle(1, WIDTH / 2 - 3, 0, 0);
    circle.draw();
};

export function startCircleAnimation(tempo) {
    const timeStamp = performance.now();
    const tick = 60 / tempo * 1000;
    const circle = new Circle(1, WIDTH / 2 - 3, tick, timeStamp);
    let time = performance.now() - circle.timeStamp;
    const loop = () => {
        context.fillStyle = 'rgba(255, 255, 255, 0.9)';
        context.fillRect(0, 0, WIDTH, HEIGHT);

        circle.update(time);
        circle.draw();

        time = performance.now() - circle.timeStamp;
        if (time < circle.tick) {
            requestAnimationFrame(loop);
        }
    };
    loop();
};