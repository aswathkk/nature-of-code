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

        guessY(x) {
            let m = -this.weights[0] / this.weights[1];
            let c = -this.weights[2] / this.weights[1];
            return m * x + c;
        }
    }

    class Point {
        constructor(x, y) {
            this.input = [x, y, 1];
            let lineY = f(x);
            if(y > lineY)
                this.output = 1;
            else
                this.output = -1;
        }

        pixelX() {
            return p.map(this.input[0], -1, 1, 0, p.width);
        }

        pixelY() {
            return p.map(this.input[1], -1, 1, p.height, 0);
        }

        draw() {
            if(this.output == -1)
                p.fill(0);
            else
                p.fill(255);
            
            let x = this.pixelX();
            let y = this.pixelY();
            p.ellipse(x, y, 15);
        }
    }

    let f = (x) => {
        // y = mx + c
        return .2 * x + .3;
    }

    let perceptron;
    let point = [];
    let count = 0;

    p.setup = () => {
        p.createCanvas(500, 500);
        p.frameRate(2);
        perceptron = new Perceptron(3, .005);
        
        for(let i = 0; i < 50; i++)
            point.push(new Point(p.random(-1, 1), p.random(-1, 1)));
    }

    p.draw = () => {
        p.background(255);
        p.stroke(0);

        let p1 = new Point(-1, f(-1));
        let p2 = new Point(1, f(1));
        p.line(p1.pixelX(), p1.pixelY(), p2.pixelX(), p2.pixelY());

        let p3 = new Point(-1, perceptron.guessY(-1));
        let p4 = new Point(1, perceptron.guessY(1));
        p.line(p3.pixelX(), p3.pixelY(), p4.pixelX(), p4.pixelY());

        point.forEach(pt => pt.draw());

        point.forEach( pt => {
            let target = pt.output;
            perceptron.train(pt.input, target);
            let guess = perceptron.feedForward(pt.input);
            if(guess === target)
                p.fill(0, 255, 0);
            else
                p.fill(255, 0, 0);
            
            p.noStroke();
            p.ellipse(pt.pixelX(), pt.pixelY(), 8);
        });
    }
}