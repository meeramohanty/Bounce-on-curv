let { sqrt, cos, sin, random: rnd } = Math

cnv = document.createElement`canvas`
c = cnv.getContext`2d`
w = cnv.width = innerWidth * 2
h = cnv.height = innerHeight * 2
cnv.style.width = innerWidth + 'px'
cnv.style.height = innerHeight + 'px'
document.body.append(cnv)

pnts = []
num = 23

 /** 
Original function by Pieter Iserbyt:
http://local.wasp.uwa.edu.au/~pbourke/geometry/pointline/DistancePoint.java
from Paul Bourke's website:
http://local.wasp.uwa.edu.au/~pbourke/geometry/pointline/
*/
lineDist = (x1, y1, x2, y2, x3, y3,
  dx = x2 - x1,
  dy = y2 - y1, u, cx, cy) => {

  if (dx == 0 && dy == 0) dx = dy = 1

  u = ((x3 - x1) * dx + (y3 - y1) * dy) / (dx * dx + dy * dy);
  cx = u < 0 ? x1 : u > 1 ? x2 : x1 + u * dx
  cy = u < 0 ? y1 : u > 1 ? y2 : y1 + u * dy
  return sqrt((cx - x3) ** 2 + (cy - y3) ** 2);
}

mount = () => {
  c.beginPath()
  c.moveTo(0, h - 100)
  step = w / num
  for (let i = 0; i <= num; i++) {
    x = step * i
    y = h - 600 - 450 * cos(2 + i / 8) + 50 * sin(i * 0xFFFFF)
    pnts[i] = [x, y]
    c.lineTo(x, y)
  }
  c.stroke()
  return () => {
    c.beginPath()
    c.moveTo(0, h - 100)
    for (let i = 0; i <= num; i++) {
      c.lineTo(pnts[i][0], pnts[i][1])
    }
    c.stroke()
  }
}
rst = 0.99

reflect = (vx, vy, ax, ay, bx, by,
dx = bx - ax, dy = by - ay, len = sqrt(dx * dx + dy * dy)) => {

  dx /= len
  dy /= len
  nx = -dy
  ny = dx
  dot = vx * nx + vy * ny
  vx = 0.5 * (vx - (1 + rst) * dot * nx)
  vy = 0.5 * (vy - (1 + rst) * dot * ny)
  return [vx, vy];
}

shoot = false

dot = (off, 
  x = w / 2 - 140 + off, 
  y = h / 4, 
  ox = x,
  oy = y,
  xo, yo, 
  vx = rnd() * 10 - 5,
  vy = rnd() * -10,
  s = 20,
  g = .3 + rnd() * .2,
  intersect
  ) => () => {
    x += vx
    y += vy

    if (shoot) {
      vy = rnd() * -20;
      vx = rnd() * 10 - 5
      x = ox
      y = oy
    }

    intersect = false;
    for (let i = 0; i < num - 1; i++) {
      a = pnts[i]
      b = pnts[i + 1]
      d = lineDist(a[0], a[1], b[0], b[1], x, y)
      if (d < s) {
        [rvx, rvy] = reflect(vx, vy, a[0], a[1], b[0], b[1]);
        vx = rvx  
        vy = rvy  
        x = ox;
        y = oy;
        intersect = true;
        break;
      }
    }

    vy += g
    if (!intersect) {
      ox = x;
      oy = y;
    }

    //
    // c.fillStyle = 'red'
    // c.fillRect(x, y, s, s)

    //Draw the heart shape
    c.fillStyle = 'red'
    c.beginPath();
    c.moveTo(x,y + s/4);
    c.bezierCurveTo(x - s / 2, y - s / 2, x - s, y + s / 3, x, y + s);
    c.bezierCurveTo(x + s, y + s / 3, x + s / 2, y - s / 2, x, y + s / 4);
    c.fill();
  }

onpointerdown = e => {
  shoot = true; 
} 

g = mount()

ds = []
NUM = 200
for (i = 0; i < NUM; i++) {
  ds[i] = dot(i * 4 - 200)
}

let textOpacity = 0;
let textBounce = 0;
let textGrowing = true;

loop = () => { 
  c.fillStyle = 'pink'
  c.fillRect(0, 0, w, h)

//Opacity animation

  if (textOpacity < 1) textOpacity += 0.01; 
//Bounce animation for text

if (textGrowing) {
  textBounce += 0.5;
  if (textBounce>15)textGrowing = false; 
  
} else {
  textBounce -=0.5;
  if (textBounce < 0) textGrowing = true;
  
}

const textColor = '#fff';  // White text for contrast
const shadowColor = 'rgba(173, 216, 230, 0.7)';  // Light blue glow

  // Draw animated text
  c.fillStyle = `rgba(255, 255, 255, ${textOpacity}`; // Smooth white text
c.font = 'bold 60px "Arial", sans-serif';  
c.textAlign = 'center';  
c.shadowColor = shadowColor;
c.shadowBlur = 15;

const lines =[
  "Life is not about finding yourself,",
  "it is about creating yourself."
];

const textY = h / 2 - 40;

lines.forEach((line, i)=>{
  c.fillText(line, w / 2,textY + i * 50);
});


  g()
  ds.forEach(d => d())
  shoot = false
  requestAnimationFrame(loop)
}
loop()