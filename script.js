$(function () {

    var myResizeTimer = null;
    var widthWindow = 0;
    var heightWindow = 0;
    var canvas = document.getElementById('canvas');
    var ctx = null;
    var particleArray = [];
    var canvasClicked = false
     var mousex, mousey;
    var dimension = 0.35;
    var r0 = 0.1;
    var initialInfect = 5;
    function init() {

        var minRadiusParticle = 5;
        var maxRadiusParticle = 50;
        var speed = 4;
        var density = 500;
        particleArray = [];
        widthWindow = window.innerWidth;
        heightWindow = window.innerHeight;

        var constColors = ["white"];

        if (canvas.getContext) {
            ctx = canvas.getContext('2d');
            canvas.setAttribute('width', widthWindow);
            canvas.setAttribute('height', heightWindow);
            var longerSide = Math.max(widthWindow, heightWindow);
            var numParticules = Math.round(((((widthWindow * heightWindow) / longerSide) / 100) * density) / maxRadiusParticle);

            for (var i = 0; i < numParticules; i++) {

                var randomRadius = Math.floor(dimension * (maxRadiusParticle - minRadiusParticle) + minRadiusParticle);
                var desise = constColors[Math.floor(Math.random() * constColors.length)];
                if (i < initialInfect) desise = "red";

                var x = (Math.random() * (widthWindow - randomRadius * 2)) + randomRadius;
                var y = (Math.random() * (heightWindow - randomRadius * 2)) + randomRadius;

                if (i !== 0) {
                    for (var j = 0; j < particleArray.length; j++) {
                        //IF PARTICLES ARE TOUCHING WHEN SPAWNING, RECALCULATE
                        if (distance(x, y, particleArray[j].x, particleArray[j].y) - particleArray[j].radius - randomRadius < 0) {
                            x = (Math.random() * (widthWindow - randomRadius * 2)) + randomRadius;
                            y = (Math.random() * (heightWindow - randomRadius * 2)) + randomRadius;
                            j = -1;
                        }
                    }
                }

                var particle = new Particle(x, y, speed, randomRadius, desise);
                particleArray.push(particle);
            }

        }
    }

    function distance(x0, y0, x1, y1) {
        var distanceX = x1 - x0;
        var distanceY = y1 - y0;

        return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2))
    }

    function Particle(X, Y, Speed, Radius, desise) {
        this.x = X;
        this.y = Y;
        this.radius = Radius;
        this.originalRadius = Radius;
        this.desise = desise;
        this.mass = 1;
        this.velocity = {
            x: (Math.random() - 0.5) * Speed,
            y: (Math.random() - 0.5) * Speed
        }
        this.collision = false;

        this.draw = function () {
            ctx.beginPath();
            ctx.arc(
                this.x,
                this.y,
                this.radius,
                0,
                2 * Math.PI
            );
            ctx.strokeStyle = this.desise;
            ctx.stroke();
        }

        this.update = function () {
            if (this.x + this.radius > widthWindow || this.x - this.radius < 0) {
                this.velocity.x = -this.velocity.x;
            }
            if (this.y + this.radius > heightWindow || this.y - this.radius < 0) {
                this.velocity.y = -this.velocity.y;
            }

            for (var i = 0; i < particleArray.length; i++) {
                if (this === particleArray[i]) continue;
                if (distance(this.x, this.y, particleArray[i].x, particleArray[i].y) - this.radius - particleArray[i].radius < 0) {
                    resolveCollision(this, particleArray[i]);
                }
            }

     
            if (isClicked(this) ) {
                this.desise = "white"; 
            }

          



            this.x += this.velocity.x;
            this.y += this.velocity.y;

            this.draw();
        }

    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, widthWindow, heightWindow);
        for (var i = 0; i < particleArray.length; i++) {
            particleArray[i].update();
        }
    }

    function rotate(velocity, angle) {
        const rotatedVelocities = {
            x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
            y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
        };

        return rotatedVelocities;
    }


    //canvas.addEventListener('click', (e) => {
    //    var canvasClicked = true;
    //    mousex: e.clientX;
    //        mousey: e.clientY;
    //    console.log("clicked")
    //    console.log("mouse: " + mousey + " . " + mousex);
    //});
    canvas.addEventListener('mousedown', function (e) {
        getCursorPosition(canvas, e)
        console.log("x: " + mousex + " y: " + mousey)
    })

    function getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect()
        mousex = event.clientX - rect.left;
        mousey = event.clientY - rect.top;
    }
    function isClicked(circle) {
        return Math.sqrt((mousex - circle.x) ** 2 + (mousey - circle.y) ** 2) < circle.radius;
    }

    function resolveCollision(particle, otherParticle) {

        const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
        const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;


        const desise1 = particle.desise;
        const xDist = otherParticle.x - particle.x;
        const yDist = otherParticle.y - particle.y;

        // Prevent accidental overlap of particles
        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

            // Grab angle between the two colliding particles
            const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

            // Store mass in var for better readability in collision equation
            const m1 = particle.mass;
            const m2 = otherParticle.mass;
            const desise2 = otherParticle.desise;
            // Velocity before equation
            const u1 = rotate(particle.velocity, angle);
            const u2 = rotate(otherParticle.velocity, angle);

            // Velocity after 1d collision equation
            const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
            const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

            // Final velocity after rotating axis back to original location
            const vFinal1 = rotate(v1, -angle);
            const vFinal2 = rotate(v2, -angle);

            // Swap particle velocities for realistic bounce effect
            particle.velocity.x = vFinal1.x;
            particle.velocity.y = vFinal1.y;

            otherParticle.velocity.x = vFinal2.x;
            otherParticle.velocity.y = vFinal2.y;
            if (desise1 === "red" && desise2 !== "blue" && Math.random() < r0) {
                otherParticle.desise = "red";
            }
            if (desise2 === "red" && desise1 !== "blue" && Math.random() < r0 ) {
                 particle.desise = "red";
            }
            //if (desise1 === "blue" && desise2 === "red") {
            //    otherParticle.desise = "white";
            //}
            //if (desise2 === "blue" && desise1 === "red") {
            //    particle.desise = "white";
            //}
        }
    }

    window.onresize = function () {
        if (myResizeTimer != null) clearTimeout(myResizeTimer);
        myResizeTimer = setTimeout(init, 100);
    }

    init();
    animate();

});