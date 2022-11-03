const c = document.getElementById("canvas");
c.height = innerHeight;
c.width = innerHeight / 9 * 16;
const mag = c.width / 800;
let ctx = c.getContext("2d");
let circles = [];
let circleId = 0;
const gravity = 0;
let e = 1;
let inCircleTouch = false;
let cx = 0;
let cy = 0;

window.addEventListener("resize", function (e) {
    c.height = innerHeight;
    c.width = innerHeight / 9 * 16;
    const mag = c.width / 800;
})


c.addEventListener("mousedown", function (e) {
    e.preventDefault()
    cx = e.pageX - (innerWidth - c.width) / 2;
    cy = e.pageY - (innerHeight - c.height) / 2;
    inCircleTouch = false;
    for (let i = 0; i < circles.length; i++) {
        if (circles[i].inCircle(cx, cy) == true) {
            console.log(circles[i])
            c.pos = {
                x: circles[i].x,
                y: circles[i].y,
                vx: circles[i].vecx,
                vy: circles[i].vecy,
                m: circles[i].m,
                mx: cx,
                my: cy,
                id: i
            }
            inCircleTouch = true;
            circles[c.pos.id].isFixing = true;
            c.style.cursor = "move"
        }
    }
});

c.addEventListener("mousemove", function (e) {
    e.preventDefault();
    localStorage.cx = cx;
    localStorage.cy = cy;
    cx = e.pageX - (innerWidth - c.width) / 2;
    cy = e.pageY - (innerHeight - c.height) / 2;
    if (inCircleTouch == true) {
        circles[c.pos.id].x = c.pos.x + (cx - c.pos.mx);
        circles[c.pos.id].y = c.pos.y + (cy - c.pos.my);
        circles[c.pos.id].vecx = (cx - localStorage.cx);
        circles[c.pos.id].vecy = (cy - localStorage.cy);
        circles[c.pos.id].isFixing = true;
        c.style.cursor = "move"
    }
})

c.addEventListener("mouseup", function (e) {
    e.preventDefault()
    if (inCircleTouch == true) {
        localStorage.cx = cx;
        localStorage.cy = cy;
        cx = e.pageX - (innerWidth - c.width) / 2;
        cy = e.pageY - (innerHeight - c.height) / 2;
        circles[c.pos.id].isFixing = false;
        c.pos = null;
        inCircleTouch = false;
    }
    c.style.cursor = "auto"
})

c.addEventListener("touchstart", function (e) {
    e.preventDefault()
    let touch = e.changedTouches;
    cx = touch[0].pageX - (innerWidth - c.width) / 2;
    cy = touch[0].pageY - (innerHeight - c.height) / 2;
    inCircleTouch = false;
    for (let i = 0; i < circles.length; i++) {
        if (circles[i].inCircle(cx, cy) == true) {
            console.log(circles[i])
            c.pos = {
                x: circles[i].x,
                y: circles[i].y,
                vx: circles[i].vecx,
                vy: circles[i].vecy,
                m: circles[i].m,
                mx: cx,
                my: cy,
                id: i
            }
            inCircleTouch = true;
            circles[c.pos.id].isFixing = true;
        }
    }
});

c.addEventListener("touchmove", function (e) {
    e.preventDefault();
    localStorage.cx = cx;
    localStorage.cy = cy;
    let touch = e.changedTouches;
    cx = touch[0].pageX - (innerWidth - c.width) / 2;
    cy = touch[0].pageY - (innerHeight - c.height) / 2;
    if (inCircleTouch == true) {
        circles[c.pos.id].x = c.pos.x + (cx - c.pos.mx);
        circles[c.pos.id].y = c.pos.y + (cy - c.pos.my);
        circles[c.pos.id].vecx = (cx - localStorage.cx);
        circles[c.pos.id].vecy = (cy - localStorage.cy);
        circles[c.pos.id].isFixing = true;
        circles[c.pos.id].m = 100;
    }
})

c.addEventListener("touchend", function (e) {
    e.preventDefault()
    if (inCircleTouch == true) {
        localStorage.cx = cx;
        localStorage.cy = cy;
        let touch = e.changedTouches;
        cx = touch[0].pageX - (innerWidth - c.width) / 2;
        cy = touch[0].pageY - (innerHeight - c.height) / 2;
        circles[c.pos.id].m = c.pos.m;
        circles[c.pos.id].isFixing = false;
        c.pos = null;
        inCircleTouch = false;
    }
})

function Circle(ctx, x, y, vecx, vecy, r, m, color) {
    this.ctx = ctx;
    this.x = x || 0;
    this.y = y || 0;
    this.vecx = vecx || 0;
    this.vecy = vecy || 0;
    this.r = r || 0;
    this.m = m || 0;
    this.color = color || 0;
    this.isFixing = false;
}

Circle.prototype = {
    draw: function () {
        ctx = ctx;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.r, 0 * Math.PI / 180, 360 * Math.PI / 180);
        ctx.lineTo(this.x, this.y)
        ctx.stroke();
        ctx.closePath();
    },
    isTouched: function (cx, cy, cr) {
        return (this.x - cx) * (this.x - cx) + (this.y - cy) * (this.y - cy) <= (this.r + cr) * (this.r + cr)
    },
    inCircle: function (cx, cy) {
        return (this.x - cx) * (this.x - cx) + (this.y - cy) * (this.y - cy) <= this.r * this.r
    },
    wall: function () {

        if (this.y - this.r < 50) {
            this.vecy *= -e;
            this.y = 50 + this.r;
        }
        if (this.y + this.r > canvas.height - 50) {
            this.vecy *= -e;
            this.y = (canvas.height - 50) - this.r;
        }
        if (this.x - this.r < 50) {
            this.vecx *= -e;
            this.x = 50 + this.r;
        }
        if (this.x + this.r > canvas.width - 50) {
            this.vecx *= -e;
            this.x = (canvas.width - 50) - this.r;
        }
    },
    reflect: function () {

        this.vecy += gravity / 50;
        this.vecx += 0;

        this.vecx *= 0.995;
        this.vecy *= 0.995;

        this.x += this.vecx;
        this.y += this.vecy;
    }
}

// 円を召喚
for (let i = 0; i < 20; i++) {
    circles[circleId] = new Circle(ctx, Math.floor(Math.random() * (canvas.width - 50)) + 50, canvas.height / 2 + (Math.random() - 0.5), (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.floor(Math.random() * 20) + 10) * mag, (Math.floor(Math.random() * 20) + 10) * mag, "rgb(" + Math.round(Math.random() * 255) + ", " + Math.round(Math.random() * 255) + ", " + Math.round(Math.random() * 255) + ")")
    circleId++
}

console.log(c.pos)
function display() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = "2"
    ctx.strokeRect(0, canvas.height - 50, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, 50);
    ctx.strokeRect(0, 0, 50, canvas.height);
    ctx.strokeRect(canvas.width - 50, 0, canvas.width, canvas.height);
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++)
            if (circles[i].isTouched(circles[j].x, circles[j].y, circles[j].r)) {
                calVec(circles[i], circles[j])
            }
        circles[i].wall();
        if (circles[i].isFixing == false) {
            circles[i].reflect();
        }
        circles[i].draw();
    }
}

function calVec(p1, p2) {
    var distance = p1.r + p2.r - calDis(p1, p2);
    var reSp = {
        x: p2.vecx - p1.vecx,
        y: p2.vecy - p1.vecy
    };
    var collDir = {
        x: nor(p1, p2)[0],
        y: nor(p1, p2)[1]
    };
    var j1 = -(e + 1) * (dot(reSp, collDir));
    var j2 = (1 / p1.m + 1 / p2.m);
    var j3 = j1 / j2;

    p1.x -= collDir.x * (distance + 0.005)
    p1.y -= collDir.y * (distance + 0.005)
    p1.vecx += (collDir.x * -1 * j3) / p1.m;
    p1.vecy += (collDir.y * -1 * j3) / p1.m;
    p2.x += collDir.x * (distance + 0.005)
    p2.y += collDir.y * (distance + 0.005)
    p2.vecx += (collDir.x * j3) / p2.m;
    p2.vecy += (collDir.y * j3) / p2.m;
}

function nor(v1, v2) {
    var X = v2.x - v1.x;
    var Y = v2.y - v1.y;
    var mag = Math.sqrt(X * X + Y * Y);
    return [X / mag, Y / mag]
}

function dot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
}

function calDis(v1, v2) {
    var X = v2.x - v1.x;
    var Y = v2.y - v1.y;
    return Math.sqrt(X * X + Y * Y);
}

(function loop() {
    display();
    window.requestAnimationFrame(loop);
}());
