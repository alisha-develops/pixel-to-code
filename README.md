# art into code

this is a little browser-based pixel art editor i built to experiment with turning visual art into code. the idea is pretty simple: you draw pixel art on a grid, choose your colors, and the tool turns what you drew into actual CSS. you can then take that generated HTML/CSS and test it immediately inside the same website.

> **draw it → turn it into code → test it**

## huh? what exactly?

<table>
  <tr>
    <td align="center">
      <img src="https://cdn.hackclub.com/01a0204a-27c7-7dad-992e-86d6f8bee1b9/art2code%20test.png" width="400">
    </td>
    <td align="center">
      <img src="https://cdn.hackclub.com/01a0204a-28dc-7682-9eb1-bdd29b190c3b/art2code.png" width="400">
    </td>
  </tr>
</table>

there's a pixel grid where you can paint, one of the things i really wanted was a custom color picker. i didn't want to just use the generic browser `<input type="color">`:<input type="color"> option. so i made the whole thing myself using canvas and HSV, the hue strip, the saturation/value square, and the HSV → HEX conversion are all custom (took some help with chatgpt in fixing this part though). then it also has a CSS output box, and a little testing area underneath.

you can choose between 8×8, 16×16 and 32×32 grids, drag across the grid to paint, clear everything, generate the CSS, and copy it.

the generated artwork uses `box-shadow` to turn a 1×1 element into a pixel-art image.

## everything here is custom (i love itt)

this was probably the part i had the most fun with. i don't really like keeping things generic or just taking whatever the browser has to offer. even if the project idea itself is super simple, i think it stops feeling generic when you actually put your own personality into every part of it.

the HTML/CSS testing area is custom too. i mean just see the difference:
<table>
  <tr>
    <td align="center" width="50%" valign="top">
      <p><b>before:</b></p>
      <img src="https://cdn.hackclub.com/01a02052-39c2-7aa9-a41b-42bf2f4fee9f/testing%20area%20before.png" width="100%">
    </td>
    <td align="center" width="50%" valign="top">
      <p><b>after:</b></p>
      <img src="https://cdn.hackclub.com/01a02069-d412-7612-80bb-4db699d9d84f/after%20pinkish%20theme.png" width="100%">
    </td>
  </tr>
</table>

## why CSS?

i could have just exported the drawing as an image, but that felt a little boring.

i wanted the output itself to be code.

a pixel drawing becomes something like:

```css
.pixel-art {
    width: 1px;
    height: 1px;
    box-shadow:
        0px 0px 0 #fca1f9,
        1px 0px 0 #64123f,
        2px 0px 0 #fca1f9;
}
```

so instead of downloading an image, you get something you can actually put into a website.

## where this is going

right now this is intentionally pretty basic.

i was required to log **5 hours** for this project, so i didn't want to spend a lot building every possible feature into the first version just for the sake of making it bigger.

instead, i wanted to get the core idea working properly first.

i'd like to ship a much bigger update to #haj4ever or another YSWS later, where this can become an actual pixel-art/sprite tool rather than just a small CSS experiment.

some things i'd love to add:

- undo / redo & erase

- palette with my api: i have made a little api before that generates random color palettes, so i'd like to connect that to this at some point. instead of manually picking every color, you could just generate a palette and start drawing with it. having preset palettes would make it much easier to create artwork that actually feels like it belongs to a specific game/art style.

- horizontal and vertical mirror modes so you can paint one side of a sprite and have the other side update automatically. this would be especially useful for character sprites.

- this is probably the feature i'm most excited about: instead of only making one 16×16 drawing, you could make multiple 16×16 frames and turn them into an animated sprite sheet.

- the generated CSS could then use `@keyframes` and `steps()` to stitch the frames together into something like a walking animation.

i'd especially like to make this useful with **Phaser.js**, since that's where i think this project could become more interesting than just a CSS art generator.

the goal would eventually be something like:

**draw sprite → animate it → export it → use it in a game**

there are also a bunch of smaller things i'd like to improve:

- grid zoom in/out, better cell hover highlighting, coordinate readouts, keyboard shortcuts, and being able to move a cursor around the grid with the arrow keys.

## built with

just a lot of custom JavaScript and CSS. and yes, the entire thing is very pink.
