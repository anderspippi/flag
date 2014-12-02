/*
 * 
*/

var flags = [];

var Flag = function(canvas, text) {
	this.canvas = canvas
	this.context = canvas.getContext("2d");
	this.text = text

	this.textbuf = document.createElement("canvas");
	//document.body.appendChild(this.textbuf);
	this.textcontext = this.textbuf.getContext("2d");
	var tm = this.textcontext.measureText(this.text);
	this.textbuf.width = tm.width;
	this.textbuf.height = 20;
	this.textcontext.textAlign = "center";
	this.textcontext.textBaseline = "middle";
	this.textcontext.fillText(text, this.textbuf.width / 2, this.textbuf.height / 2, this.textbuf.width);

	this.dw = this.canvas.width / this.textbuf.width;

	this.radius = (this.canvas.height - this.textcontext.canvas.height) / 4;

	this.angle = 0.0;

	this.render = function() {
		var src = this.textcontext;
		var dst = this.context;
		var angle = this.angle;
		var cy = (dst.canvas.height - src.canvas.height) / 2;
		dst.clearRect(0, 0, dst.canvas.width, dst.canvas.height);
		for(var x = 0; x < src.canvas.width; ++x) {
			var dx = x * this.dw;
			var dy = this.radius * Math.sin(angle) * Math.cos(angle / 3) * Math.sin(angle / 5);
			dst.drawImage(src.canvas, x, 0, 1, src.canvas.height, dx, dy, this.dw, dst.canvas.height);
			angle += 0.2;
		}
	};
};

// Find all flag-classed canvases in the page.
var canvases = document.body.getElementsByTagName("canvas");
for(var i = 0; i < canvases.length; ++i) {
	if(canvases[i].className == "flag") {
		var text = canvases[i].getAttribute("flagtext");
		if(text) {
			flags.push(new Flag(canvases[i], text));
		}
	}
}

function renderFlags() {
	requestAnimationFrame(renderFlags);
	for(var i = 0; i < flags.length; ++i) {
		flags[i].render();
		flags[i].angle += 0.1;
/*		while(flags[i].angle >= 2 * Math.PI) {
			flags[i].angle -= 2 * Math.PI;
		}
*/	}
}

renderFlags();
