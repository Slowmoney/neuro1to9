class Button {
    constructor(xy = [0, 0, 0, 0, 50, 50], attr = [{ checkBox: true }], callback) {
        window.canvasButtons.push(this)
        this.x = (xy[0] == undefined) ? 0 : xy[0];

        this.y = (xy[1] == undefined) ? 0 : xy[1];
        this.offsetX = (xy[2] == undefined) ? 0 : xy[2];

        this.offsetY = (xy[3] == undefined) ? 0 : xy[3];
        this.boxszx = (xy[4] == undefined) ? 50 : xy[4];
        this.boxszy = (xy[5] == undefined) ? 50 : xy[5];

        this.checkBox = attr[0].checkBox;

        this.a = [];
        for (let x = 0; x < this.x; x++) {
            for (let y = 0; y < this.y; y++) {
                this.a.push({
                    x: x * this.boxszx + this.offsetX,
                    y: y * this.boxszy + this.offsetY,
                    color: "#ff0000",
                    checked: false,
                    attr: {

                    }
                });
            }
        }
        this.callback = callback;
    }
    click = (x, y) => {
        this.a.forEach((b) => {
            if ((x >= b.x && x <= b.x + this.boxszx) && (y >= b.y && y <= b.y + this.boxszy)) {
                if (this.checkBox) {
                    b.checked = !b.checked;


                }
                if (typeof (this.callback) == "function") {
                    this.callback(this);
                }

            }
        });
    }
    draw = () => {
        this.a.forEach((e) => {
            this.drawBox(e.x, e.y, e.color, e.checked, this.boxszx, this.boxszy)
        });
    }
    drawBox = (x, y, color, c, szx, szy) => {

        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, szx, szy);
        if (c) {
            ctx.fillStyle = color;
            ctx.fill()
        }
        ctx.stroke();
        ctx.restore()
    }
};

class NeuroCanvas {
    constructor(ctx, net) {
        this.ctx = ctx;
        this.net = net;

        this.xoffset = 55;
        this.leftoffset = 50;
        this.radius = 50;
        this.offset = 55;
        console.log(net)
        this.topoffset = (Math.max.apply(null, this.net.sizes) * this.offset / 2) + 300;
        this.text = {
            font: "3px serif",
            offx: 25,
            offy: 7
        };
        this.layers = [];
        this.net.sizes.forEach((e, i) => {
            this.layers.push(this.getLayer(i, e));
        });
    }
    toBIN(num) {
        var out = "", bit = 1;
        while (num > bit) {
            out = (num & bit ? 1 : 0) + out;
            bit <<= 1;
        }
        return out || "0";
    }
    drawBut = () => {
        window.canvasButtons.forEach((e) => {
            e.draw();
        })
    }
    draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);


/*         for (let i = 0; i < this.layers.length - 1; i++) {
            this.drawLines(this.layers[i], this.layers[i + 1], net.weights[i + 1])
        }
        this.layers.forEach((e, i) => {
            this.drawLayers(e, net.outputs[i])
        })
         */
        this.drawBut();

    }
    map = (x, in_min, in_max, out_min, out_max) => {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
    }
    minmax = (layer) => {
        let r = []
        let t = []
        layer.forEach((e) => {
            t.push(Math.max.apply(null, e))
        })
        r.push(Math.max.apply(null, t))

        t = []
        layer.forEach((e) => {
            t.push(Math.min.apply(null, e))
        })
        r.push(Math.min.apply(null, t))
        return r
    }
    getLayer = (x, count) => {
        let points = []
        let o = 0;
        let g = Math.floor(count / 2);
        if (!(count % 2)) {
            o += this.offset / 2;
        }
        for (let y = 0; y < count; y++) {
            points.push([(x * this.xoffset) + this.leftoffset, ((y - g) * (this.offset)) + (this.topoffset) + o])
        }
        return points
    }
    drawLayers = (layer, t) => {
        layer.forEach((p1, i) => {
            //this.drawCircle(p1[0], p1[1], this.radius, t[i].toFixed(3))
            this.drawBox(p1[0] - this.radius / 2, p1[1] - this.radius / 2, t[i].toFixed(3), true, this.radius, this.radius);
            this.drawText(p1[0] - this.text.offx, p1[1] + this.text.offy, t[i].toFixed(3))
        });
    }
    drawLines = (layer1, layer2, t) => {
        let mm = this.minmax(t);


        layer1.forEach((p1, il1) => {
            layer2.forEach((p2, il2) => {

                this.drawLine(p1[0], p1[1], p2[0], p2[1], this.map(t[il2][il1], mm[0], mm[1], 1, 0))
            })
        });
    }
    drawCircle = (x, y, r, color) => {
        this.ctx.save()
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#fff"
        this.ctx.strokeStyle = "rgb(" + color * 0 + "," + color * 255 + "," + 0 + ")"
        this.ctx.lineWidth = color * 5 + 1;
        this.ctx.fill();
        this.ctx.stroke()
        this.ctx.restore()
    }
    drawLine = (x0, y0, x1, y1, color) => {
        this.ctx.save()
        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        //let x   = hslToRgb(color,1,0.5)
        //this.ctx.strokeStyle = "rgb(" +x[0] + "," + x[1] + "," + x[2] + ")"
        this.ctx.strokeStyle = "rgb(" + color * 0 + "," + color * 255 + "," + 0 + ")"
        this.ctx.lineWidth = color * 5;
        this.ctx.stroke();
        this.ctx.restore()
    }
    drawText = (x, y, t) => {
        this.ctx.font = this.text.font;
        this.ctx.fillText(t, x, y);
    }
    drawBox = (x, y, color, c, szx, szy) => {

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(x, y, szx, szy);
        if (c) {
            this.ctx.fillStyle = "rgb(" + color * 0 + "," + color * 255 + "," + 0 + ")";
            this.ctx.fill()
        }
        this.ctx.strokeStyle = "rgb(" + color * 0 + "," + color * 255 + "," + 0 + ")"
        //this.ctx.lineWidth = color * 5 + 1;
        this.ctx.stroke();
        this.ctx.restore()
    }
    click = (x, y, callback) => {
        let l;
        this.layers.forEach((e, i) => {

            e.forEach((b, r) => {

                if ((x >= b[0] - this.radius && x <= b[0] + this.radius) && (y >= b[1] - this.radius && y <= b[1] + this.radius)) {
                    l = [b, i, r];
                    if (typeof (callback) == "function") {
                        callback(l);
                    }
                }

            })
        })
        return l
    }
};
window.canvasButtons = []
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 2024;
canvas.height = 2024;
const config = {
    binaryThresh: 0.5, // ¯\_(ツ)_/¯
    hiddenLayers: [7, 5, 3], // array of ints for the sizes of the hidden layers in the network
    activation: 'sigmoid' // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh']

};
const net = new brain.NeuralNetwork(config);
const trainConfig = {
    // Defaults values --> expected validation
    iterations: 10000, // the maximum times to iterate the training data --> number greater than 0
    errorThresh: 0.005, // the acceptable error percentage from training data --> number between 0 and 1
    log: false, // true to use console.log, when a function is supplied it is used --> Either true or a function
    logPeriod: 10, // iterations between logging out --> number greater than 0
    learningRate: 0.3, // scales with delta to effect training rate --> number between 0 and 1
    momentum: 0.1, // scales with next layer's change value --> number between 0 and 1
    callback: null, // a periodic call back that can be triggered while training --> null or function
    callbackPeriod: 10, // the number of iterations through the training data between callback calls --> number greater than 0
    timeout: Infinity, // the max number of milliseconds to train for --> number greater than 0
}
getTrainSet = (n, out = [0]) => {
    let trainingset = [{
        input: new Int16Array(n),
        output: out
    }]
    try {

        trainingset = JSON.parse(localStorage.getItem("trainingset"))

        if (typeof (trainingset[0]) != "object") {

            trainingset = [{
                input: new Int16Array(n),
                output: out
            }];
        }
    } catch (error) {
        trainingset = [{
            input: new Int16Array(n),
            output: out
        }]
    }
    return trainingset;
}
let trainingset = getTrainSet(4 ** 2, [0, 1]);
//net.train(trainingset, trainConfig);
let nCanvas = new NeuroCanvas(ctx, net);
let mouse = { drag: [null, null, null, false], pressed: false }
let drag = [null, null, null, false];
canvas.addEventListener("click", (e) => {
    window.canvasButtons.forEach((but) => {
        but.click(e.offsetX, e.offsetY);
    });

    nCanvas.click(e.offsetX, e.offsetY, (e) => {
        drag[0] = e[0];
        drag[1] = e[1];
        drag[2] = e[2];
        drag[3] = !drag[3];
    });
    requestAnimationFrame(loop)
});
canvas.addEventListener("mousemove", (e) => {
    if (drag[3]) {
        nCanvas.layers[drag[1]][drag[2]] = [e.offsetX, e.offsetY]
        requestAnimationFrame(loop)
    }

    if (mouse.pressed) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(e.offsetX, e.offsetY, 1, 1);
        this.ctx.stroke();
        this.ctx.restore()

    }
});
canvas.addEventListener("mousedown", (e) => {
    mouse.pressed = true;

});
canvas.addEventListener("mouseup", (e) => {
    mouse.pressed = false;

});
loop = () => {
/*     let run = [];
    buttons.a.forEach((b) => {
        run.push(b.checked ? 1 : 0)
    })

    net.run(run); */
    nCanvas.draw();


}
let offx = 0;
let offy = 0;
let buttons = new Button([20, 20, 0, 0, 30, 30], [{ checkBox: true }]);
/* let outputs = new Button([1, 2, 800, 0], [{ checkBox: true }]);
let funcbut = new Button([1, 1, 500, 0], [{ checkBox: false }], () => {

    let input = [];
    buttons.a.forEach((b) => {
        input.push(b.checked ? 1 : 0)
    });
    let output = [];
    outputs.a.forEach((b) => {
        output.push(b.checked ? 1 : 0)
    });
    trainingset.push({
        input: input,
        output: output
    });
    console.log(trainingset)
    net.train(trainingset, trainConfig);
    localStorage.setItem("trainingset", JSON.stringify(trainingset))
});
let random = new Button([1, 1, 600, 0], [{ checkBox: false }], () => {

    buttons.a.forEach((e) => {
        e.checked = Math.random() > 0.5 ? true : false


    })

});
let box = new Button([1, 1, 700, 0], [{ checkBox: false }], () => {
    buttons.a.forEach((e) => { e.checked = false })
    let szx = 2;
    let szy = 2;
    if (offx > szx) {
        offx = 0;
        offy++;
    }
    if (offy > szy) {
        offx = 0;
        offy = 0;
    }

    for (let y = 0; y < szy; y++) {
        for (let x = 0; x < szx; x++) {
            buttons.a[(x + offy) + (y + offx) * 4].checked = true;

        }
    }
    offx++;




}); */

requestAnimationFrame(loop)

