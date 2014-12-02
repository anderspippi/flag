flag.js
=======
A simple JavaScript "library" to distort a piece of text.
It's a bit like a flag, waving in the wind.

This effect was common in demos in the 1990s, although they usually looked a lot better.

Usage
-----
The library, when loaded, will animate all `<canvas>` elements with the attribute `class="flag"`.

It supports the following attributes:
- Use `flagtext` to set the text to animate.
- Use `flagfx` to set the desired sine/cosine functions to apply along the text.

Function specification
----------------------
The  `flagfx` string is a comma-separated list of functions, where each function is:
- `s` or `c` for sine or cosine, respectively
- An optional angle scaling expression of the form `*NUM` or `/NUM`.

The string `flagfx=s,s/3,c/5` corresponds to the expression `sin(angle) + sin(angle / 3) + cos(angle / 5)`.
