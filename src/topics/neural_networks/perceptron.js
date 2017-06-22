module.exports = function (p) {

    class Perceptron {
        constructor(inputSize, learningRate) {
            this.weights = [];
            this.learningRate = learningRate;

            for(let i = 0; i < inputSize; i++)
                this.weights[i] = p.random(-1, 1);
        }

        feedForward(input) {
            return this.activate(this.weights.reduce((p, c, i) => p + c * input[i], 0));
        }

        train(input, output) {
            let guess = this.feedForward(input);
            let error = output - guess;
            this.weights = this.weights.map((weight, i) => weight + input[i] * error * this.learningRate);
        }

        activate(sum) {
            if(sum > 0)
                return 1;
            return -1;
        }
    }

    class Point {
        constructor(x, y) {
            this.input = [x, y, 1];
            if(x > y)
                this.output = 1;
            else
                this.output = -1;
        }

        draw() {
            if(this.output == -1)
                p.fill(255, 0, 0);
            else
                p.fill(0, 255, 0);
            
            p.ellipse(this.input[0], this.input[1], 10);
        }
    }

    let perceptron;
    let point = [];
    let count = 0;

    p.setup = () => {
        p.createCanvas(400, 400);
        p.frameRate(1);
        perceptron = new Perceptron(3, 0.01);

        for(let i = 0; i < 20; i++)
            point.push(new Point(p.random(10, p.width - 10), p.random(10, p.height - 10)));
    }

    p.draw = () => {
        p.background(255);
        p.noStroke();
        for(let i = 0; i < point.length; i++)
            point[i].draw();

        perceptron.train(point[count].input, point[count].output)
        count = (count + 1) % point.length;

        p.noStroke();
        p.fill(0);
        p.text(perceptron.weights[0], 5, 15);
        p.text(perceptron.weights[1], 5, 30);
        p.text(perceptron.weights[2], 5, 45);
    }
}