class Network {
    constructor(input, hidden, output) {
        this.input = input;
        this.hidden = hidden;
        this.output = output;
    }
    step = () => {
        let o = [0, 1, 1, 0];
        let i = [[0, 0], [0, 1], [1, 0], [1, 1]]

        for (let ii = 0; ii < i.length; ii++) {


            inputLayer.layer[0] = i[ii][0];
            inputLayer.layer[1] = i[ii][1];
            this.calc(this.input, this.hidden);
            this.calc(this.hidden, this.output);
            console.log(this.input.layer);
            console.log(this.output.layer);
            this.output.error = [this.output.layer[0] - o[ii]];
            this.output.layer.forEach((e, i) => {
                this.backProp(this.output.layer[i], this.hidden.weight, this.hidden.error, i);
            });

            this.hidden.layer.forEach((v, i) => {
                this.backProp(this.hidden.layer[i], this.input.weight, this.input.error, i);
            });




            //   let error = (((o[ii] - this.output.layer[0]) ** 2) / 1) * 100;
            //    console.log('Error: ', (((o[ii] - this.output.layer[0]) ** 2) / 1) * 100);

            //   console.log((o[ii] - this.output.layer[0]) * ((o[ii] - this.output.layer[0]) * this.output.layer[0]));


        }






    }
    run = () => {
        let o = [1, 0, 0,1];
        let i = [[0, 0], [0, 1], [1, 0], [1, 1]]

        for (let ii = 0; ii < o.length; ii++) {


            inputLayer.layer[0] = i[ii][0];
            inputLayer.layer[1] = i[ii][1];
            this.calc(this.input, this.hidden);
            this.calc(this.hidden, this.output);
            console.log(this.input.layer);
            console.log(this.output.layer);

            console.log(this.output.error);
        }
    }
    backProp = (result, weights, errors, w) => {
        errors = [];
        let sdx = result * (1 - result);
        let dw = result * sdx;


        console.log("dw ", dw);

        //вычисление весов перед выходом
        weights.forEach((weight, i, a) => {

            weights[i][w] = weights[i][w] - weights[i][w] * 0.1 * dw;
            errors.push(weights[i][w] * dw);
            console.log("new weight", weights[i][w]);


        });
        console.log(errors);
    }

    calc = (inp, out) => {
        for (let j = 0; j < out.layer.length; j++) {
            let r = 0;
            for (let i = 0; i < inp.layer.length; i++) {
                r += inp.layer[i] * inp.weight[i][j]; // выход
                //r += inp.layer[i] * inp.weight[j + i * out.layer.length]; // выход
            }
            out.layer[j] = this.sigmoid(r);
        }
    }
    sigmoid = (x) => {
        return 1 / (1 + Math.exp(-x));
    }
}
class Layer {
    constructor(n) {
        this.layer = new Float64Array(n);
        this.error = [];
    }
    project = (layer) => {
        this.weight = Array.apply(null, new Array(this.layer.length)).map(function () { return Array.apply(null, new Array(layer.layer.length)); });

        //  this.weight = new Float64Array(this.layer.length * layer.layer.length);
        this.weight.forEach((y, i) => {
            y.forEach((e, w) => {
                this.weight[i][w] = Math.random();
            });

        });
    }
}

var inputLayer = new Layer(2);
var hiddenLayer = new Layer(3);
var outputLayer = new Layer(1);
inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);
inputLayer.layer[0] = 0;
inputLayer.layer[1] = 0;

var net = new Network(inputLayer, hiddenLayer, outputLayer);



