/*
 * flags.js
 *
 * A very simplistic sine flag rendering thingie.
 *
 * Copyright (c) 2014 by Emil Brink.
 *
 * This is MIT licensed, see the LICENSE file (or
 * http://opensource.org/licenses/MIT) for details.
*/

var flags = [];

var Flag = function(canvas, text, fx) {
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

	// Analyze the fx string, which controls the flag effect. Very basic.
	// Use e.g. "s,s/3,s*5" to get sin(angle) * sin(angle / 3) * sin(angle * 5)
	// No support for scaling the term value itself.
	var FlagFxTerm = function(fxp) {
		this.func = fxp[0] == "s" ? Math.sin : Math.cos;
		this.scale = 1;
		if(fxp[1] == "/") {
			this.scale = 1.0 / Number(fxp.substring(2));
		}
		else if(fxp[1] == "*") {
			this.scale = Number(fxp.substring(2));
		}
		this.eval = function(angle) {
			return this.func(angle * this.scale);
		};
	};
	this.fxterms = []
	if(fx.length > 0) {
		var fxp = fx.split(",");
		for(var i = 0; i < fxp.length; ++i) {
			this.fxterms.push(new FlagFxTerm(fxp[i]));
		}
	}

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
			var dy = this.radius;
			// Apply the effect terms to the radius, this makes the flag wave.
			for(var i = 0; i < this.fxterms.length; ++i) {
				dy *= this.fxterms[i].eval(angle);
			}
			dst.drawImage(src.canvas, x, 0, 1, src.canvas.height, dx, dy, this.dw + 0.5, dst.canvas.height);
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
			var fx = canvases[i].getAttribute("flagfx");
			flags.push(new Flag(canvases[i], text, fx));
		}
	}
}

// Render all the flags on the page.
function renderFlags() {
	requestAnimationFrame(renderFlags);
	for(var i = 0; i < flags.length; ++i) {
		flags[i].render();
		flags[i].angle += 0.1;
/*		while(flags[i].angle >= Math.PI) {
			flags[i].angle -= Math.PI;
		}
*/	}
}

renderFlags();
