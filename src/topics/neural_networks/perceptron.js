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
        constructor(x, y, o) {
            this.input = [x, y, 1];
            this.output = o;
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
    let out = 1;
    let learningRate = 0.05;

    p.setup = () => {
        p.createCanvas(500, 500);
        p.frameRate(2);
        perceptron = new Perceptron(3, learningRate);
    }

    p.draw = () => {
        p.background(255);
        p.stroke(0);

        let p1 = new Point(-1, perceptron.guessY(-1));
        let p2 = new Point(1, perceptron.guessY(1));
        p.line(p1.pixelX(), p1.pixelY(), p2.pixelX(), p2.pixelY());

        point.forEach(pt => {
            pt.draw();
            perceptron.train(pt.input, pt.output);
        });

        p.noStroke();
        p.fill(0);
        p.text('Click anywhere to add data points', 5, 15);
        p.text(`Use 'T' to toggle type`, 5, 45);
        p.text(`Use 'W' or 'S' to adjust learning rate`, 5, 30);
        p.text(`Learning rate : ${learningRate}`, p.width - 120, 30);
        p.text('Next type : ', p.width - 100, 15);

        p.stroke(0);
        if(out == -1)
            p.fill(0);
        else
            p.fill(255);
        p.ellipse(p.width - 30, 10, 10);
    }

    p.keyPressed = () => {
        switch(p.key) {
            case 'T':
                out *= -1;
                break;
            case 'W':
                learningRate += 0.001;
                break;
            case 'S':
                learningRate -= 0.001;
                break;
        }

        return false;
    }

    p.mousePressed = () => {
        let x = p.map(p.mouseX, 0, p.width, -1, 1);
        let y = p.map(p.mouseY, p.height, 0, -1, 1);
        point.push(new Point(x, y, out));

        return false;
    }
}