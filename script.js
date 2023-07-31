const c = document.getElementById("canvas");
let ctx = c.getContext("2d");
c.width = 750;
c.height = 500;
let circles = [];
let circleId = 0;
let lines = [];
let lineId = 0;
let scircles = [];
let scircleId = 0;
const gravity = 9.80665;
let e = 0.5;
let f = 0.985;
let ag = 0.997;
let inMouseTouch = false;
let cx = 0;
let cy = 0;
let timer = 0;
let cArray = [];
let contentWidth = window.innerWidth;
let contentHeight = window.innerHeight;
c.width = Math.min(1000, contentWidth);
c.height = Math.floor(c.width / contentWidth * contentHeight);
let mouseScaleX = contentWidth / c.width;
let mouseScaleY = contentHeight / c.height;

c.addEventListener("mousedown", function (e) {
    e.preventDefault()
    cx = e.pageX / mouseScaleX;
    cy = e.pageY / mouseScaleY;
    inMouseTouch = false;
    for (let i = 0; i < circles.length; i++) {
        if (circles[i].inMouse(cx, cy)) {
            c.pos = {
                x: circles[i].x,
                y: circles[i].y,
                vx: circles[i].vecx,
                vy: circles[i].vecy,
                m: circles[i].m,
                mx: cx,
                my: cy,
                id: i,
                isCircle: true
            }
            inMouseTouch = true;
            circles[c.pos.id].isFixing = true;
            c.style.cursor = "move"
        }
    }
    for (let i = 0; i < scircles.length; i++) {
        if (scircles[i].inMouse(cx, cy)) {
            c.pos = {
                x: scircles[i].x,
                y: scircles[i].y,
                mx: cx,
                my: cy,
                id: i,
                isCircle: false
            }
            inMouseTouch = true;
            c.style.cursor = "move";
        }
    }
});

c.addEventListener("mousemove", function (e) {
    e.preventDefault();
    localStorage.cx = cx;
    localStorage.cy = cy;
    cx = e.pageX / mouseScaleX;
    cy = e.pageY / mouseScaleY;
    if (inMouseTouch) {
        if(c.pos.isCircle) {
            cArray = circles;
        } else {
            cArray = scircles;
        }
        cArray[c.pos.id].x = c.pos.x + (cx - c.pos.mx);
        cArray[c.pos.id].y = c.pos.y + (cy - c.pos.my);
        cArray[c.pos.id].vecx = (cx - localStorage.cx);
        cArray[c.pos.id].vecy = (cy - localStorage.cy);
        cArray[c.pos.id].isFixing = true;
        cArray[c.pos.id].m = 1000;
        c.style.cursor = "move"
    }
})

c.addEventListener("mouseup", function (e) {
    e.preventDefault()
    if (inMouseTouch) {
        if(c.pos.isCircle) {
            cArray = circles;
        } else {
            cArray = scircles;
        }
        localStorage.cx = cx;
        localStorage.cy = cy;
        cx = e.pageX / mouseScaleX;
        cy = e.pageY / mouseScaleY;
        cArray[c.pos.id].isFixing = false;
        cArray[c.pos.id].m = c.pos.m;
        c.pos = null;
        inMouseTouch = false;
    }
    c.style.cursor = "auto"
})

c.addEventListener("touchstart", function (e) {
    e.preventDefault()
    let touch = e.changedTouches;
    cx = touch[0].pageX / mouseScaleX;
    cy = touch[0].pageY / mouseScaleY;
    inMouseTouch = false;
    for (let i = 0; i < circles.length; i++) {
        if (circles[i].inMouse(cx, cy)) {
            c.pos = {
                x: circles[i].x,
                y: circles[i].y,
                vx: circles[i].vecx,
                vy: circles[i].vecy,
                m: circles[i].m,
                mx: cx,
                my: cy,
                id: i,
                isCircle: true
            }
            inMouseTouch = true;
            circles[c.pos.id].isFixing = true;
            c.style.cursor = "move"
        }
    }
    for (let i = 0; i < scircles.length; i++) {
        if (scircles[i].inMouse(cx, cy)) {
            c.pos = {
                x: scircles[i].x,
                y: scircles[i].y,
                mx: cx,
                my: cy,
                id: i,
                isCircle: false
            }
            inMouseTouch = true;
            c.style.cursor = "move";
        }
    }
});

c.addEventListener("touchmove", function (e) {
    e.preventDefault();
    localStorage.cx = cx;
    localStorage.cy = cy;
    let touch = e.changedTouches;
    cx = touch[0].pageX / mouseScaleX;
    cy = touch[0].pageY / mouseScaleY;
    if (inMouseTouch) {
        if(c.pos.isCircle) {
            cArray = circles;
        } else {
            cArray = scircles;
        }
        cArray[c.pos.id].x = c.pos.x + (cx - c.pos.mx);
        cArray[c.pos.id].y = c.pos.y + (cy - c.pos.my);
        cArray[c.pos.id].vecx = (cx - localStorage.cx);
        cArray[c.pos.id].vecy = (cy - localStorage.cy);
        cArray[c.pos.id].isFixing = true;
        cArray[c.pos.id].m = 1000;
        c.style.cursor = "move"
    }
})

c.addEventListener("touchend", function (e) {
    e.preventDefault();
    let touch = e.changedTouches;
    if (inMouseTouch) {
        if(c.pos.isCircle) {
            cArray = circles;
        } else {
            cArray = scircles;
        }
        localStorage.cx = cx;
        localStorage.cy = cy;
        cx = touch[0].pageX / mouseScaleX;
        cy = touch[0].pageY / mouseScaleY;
        cArray[c.pos.id].isFixing = false;
        cArray[c.pos.id].m = c.pos.m;
        c.pos = null;
        inMouseTouch = false;
    }
})

function Circle(ctx, x, y, vecx, vecy, r, m, color) {
    this.ctx = ctx;
    this.x = x || 0;
    this.y = y || 0;
    this.vecx = vecx || 0;
    this.vecy = vecy || 0;
    this.r = r || 0;
    this.m = r || 0;
    this.color = color || "white";
    this.isFixing = false;
    this.isTouchGround = false;
}

Circle.prototype = {
    draw: function () {
        ctx = ctx;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.r, 0 * Math.PI / 180, 360 * Math.PI / 180);
        ctx.fill();
        ctx.closePath();
    },
    isTouched: function (cx, cy, cr) {
        if (this.x - this.r <= cx + cr && cx - cr <= this.x + this.r && this.y - this.r <= cy + cr && cy - cr <= this.y + this.r) {
            return (this.x - cx) * (this.x - cx) + (this.y - cy) * (this.y - cy) <= (this.r + cr) * (this.r + cr)
        } else {
            return false;
        }
    },
    inMouse: function (cx, cy) {
        return (this.x - cx) * (this.x - cx) + (this.y - cy) * (this.y - cy) <= this.r * this.r
    },
    reflect: function () {

        this.vecy += gravity* 0.025;
        this.vecx += 0;

        this.x += this.vecx;
        this.y += this.vecy;

        if (this.isTouchGround) {
            this.vecx *= f;
            this.vecy *= f;
        } else {
            this.vecx *= ag;
            this.vecy *= ag;
        }
        this.isTouchGround = false;
    }
}

function Line(ctx, x, y, x2, y2, color) {
    this.ctx = ctx;
    this.x = x || 0;
    this.y = y || 0;
    this.x2 = x2 || 0;
    this.y2 = y2 || 0;
    this.color = color || "white";
}

Line.prototype = {
    draw: function () {
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        ctx.closePath();
    },
    caldisline: function (p) {
        dx = this.x2 - this.x;
        dy = this.y2 - this.y;
        a = dx * dx + dy * dy;

        if (a === 0) {
            return Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y));
        }

        b = dx * (this.x - p.x) + dy * (this.y - p.y);
        t = -(b / a);

        if (t < 0) {
            t = 0;
        }
        if (t > 1) {
            t = 1;
        }

        ax = t * dx + this.x;
        ay = t * dy + this.y;

        t = Math.sqrt((ax - p.x) * (ax - p.x) + (ay - p.y) * (ay - p.y));

        return t < p.r;
    }
}

function SCircle(ctx, x, y, r, color) {
    this.ctx = ctx;
    this.x = x || 0;
    this.y = y || 0;
    this.r = r || 0;
    this.color = color || "white";
}

SCircle.prototype = {
    draw: function () {
        ctx = ctx;
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.r, 0 * Math.PI / 180, 360 * Math.PI / 180);
        ctx.stroke();
        ctx.closePath();
    },
    isTouched: function (p) {
        if (this.x - this.r <= p.x + p.r && p.x - p.r <= this.x + this.r && this.y - this.r <= p.y + p.r && p.y - p.r <= this.y + this.r) {
            t = Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y))
            return t <= this.r + p.r;
        }
    },
    inMouse: function (cx, cy) {
        return (this.x - cx) * (this.x - cx) + (this.y - cy) * (this.y - cy) <= this.r * this.r
    }
}

// 円を召喚
for (let i = 0; i < 8; i++) {
    circles[circleId] = new Circle(ctx, c.width / 2 - 100 + Math.random() * 200, c.height / 3 - 50 + Math.random() * 50, 0, 0, Math.random() * 10 + 20, 1, "white");
    circleId++;
}
lines[lineId] = new Line(ctx, c.width / 2 - 200, c.height / 2 + 200, c.width / 2 + 200, c.height / 2 + 200, "white");
lineId++;
lines[lineId] = new Line(ctx, c.width / 2 - 250, c.height / 2 + 150, c.width / 2 - 200, c.height / 2 + 200, "white");
lineId++;
lines[lineId] = new Line(ctx, c.width / 2 + 200, c.height / 2 + 200, c.width / 2 + 250, c.height / 2 + 150, "white");
lineId++;
scircles[scircleId] = new SCircle(ctx, c.width / 2 - 150, c.height / 2 + 50, 50, "white");
scircleId++;
scircles[scircleId] = new SCircle(ctx, c.width / 2 + 100, c.height / 2 - 50, 40, "white");
scircleId++;

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (circles[i].isTouched(circles[j].x, circles[j].y, circles[j].r)) {
                this.isTouchGround = true;
                calVec(circles[i], circles[j]);
            }
        }
        if (circles[i].isFixing == false) {
            circles[i].reflect();
        }
        circles[i].draw();
    }
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < circles.length; j++) {
            if (lines[i].caldisline(circles[j])) {
                circles[j].x = ax + (circles[j].r * (circles[j].x - ax) / t);
                circles[j].y = ay + (circles[j].r * (circles[j].y - ay) / t);
                t = -((circles[j].x - ax) * circles[j].vecx + (circles[j].y - ay) * circles[j].vecy) / ((circles[j].x - ax) * (circles[j].x - ax) + (circles[j].y - ay) * (circles[j].y - ay));
                circles[j].vecx = circles[j].vecx + t * 2 * (circles[j].x - ax) * e;
                circles[j].vecy = circles[j].vecy + t * 2 * (circles[j].y - ay) * e;
                if (i == 6) {
                    circles[j].vecy = -12;
                }
            }
        }
        lines[i].draw();

    }
    for (let i = 0; i < scircles.length; i++) {
        for (let j = 0; j < circles.length; j++) {
            if (scircles[i].isTouched(circles[j])) {
                t = (scircles[i].r + circles[j].r - t) / t

                circles[j].x += (circles[j].x - scircles[i].x) * t;
                circles[j].y += (circles[j].y - scircles[i].y) * t;
                t = -((circles[j].x - scircles[i].x) * circles[j].vecx + (circles[j].y - scircles[i].y) * circles[j].vecy) / ((circles[j].x - scircles[i].x) * (circles[j].x - scircles[i].x) + (circles[j].y - scircles[i].y) * (circles[j].y - scircles[i].y))
                circles[j].vecx = circles[j].vecx + t * 2 * (circles[j].x - scircles[i].x) * e;
                circles[j].vecy = circles[j].vecy + t * 2 * (circles[j].y - scircles[i].y) * e;
            }
        }
        scircles[i].draw();

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
    render();
    window.requestAnimationFrame(loop);
}());

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, -Math.PI, -(Math.PI / 2), false);
    ctx.lineTo(x + w - 2 * r, y - r);
    ctx.arc(x + w - 2 * r, y, r, -(Math.PI / 2), 0, false);
    ctx.lineTo(x + w - r, y + h - 2 * r);
    ctx.arc(x + w - 2 * r, y + h - 2 * r, r, 0, Math.PI / 2, false);
    ctx.lineTo(x, y + h - r);
    ctx.arc(x, y + h - 2 * r, r, Math.PI / 2, Math.PI, false);
    ctx.lineTo(x - r, y + h - 2 * r);
    ctx.closePath();
    ctx.stroke();
}
