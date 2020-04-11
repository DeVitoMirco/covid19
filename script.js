$(function () { 
    var myResizeTimer = null;
    var widthWindow = 0;
    var heightWindow = 0;
    var canvas = document.getElementById('canvas');
    var ctx = null;
    var particleArray = []; 
    var mousex, mousey;
    var endLevel = false;
    var colorInit = 150;
    var desiseInit = 149;
    var desiseIntensity = 0;
    var redDesise = 0;
    var colorDesise = rgb(redDesise, desiseIntensity, desiseIntensity);
    var sec = 3;
    var nSick = 0;
    var secFlag = false;
    var idAnimation;
    var lv = 1;
    var started = false;
    var startFlag = true;
    var nextLvFlag = false;
    var nextLv = false;
    var city = ["A bat", "Whuan","Codogno", "Bergamo", "Lombardia", "Italy", "Spain", "Europe", "NewYork", "USA", "Globe", "Galaxy", "Universe"];
    var velDesise; //velocity of contagius  0.1 very slow 1 normal 10 super fast
    var touchSensibility; // piu basso piu difficile 
    var density;  //max 1300
    var radius;  //piu piccolo piu difficile
    var r0; //piu alto piu difficle 
    var initialInfect; //piu alto piu difficile 
    //lv difficulty   ?touch=15&den=40&radius=20&r=50&infet=2
    //var touchSensibility = parseInt(getParameterByName('touch')); // piu basso piu difficile 
    //var densityLV = parseInt(getParameterByName('den'));  //10-100 piu grande piu difficile
    //var radius = parseInt(getParameterByName('radius'));  //piu piccolo piu difficile
    //var r0 = parseInt(getParameterByName('r')); //piu alto piu difficle 
    //var initialInfect = parseInt(getParameterByName('infet')); //piu alto piu difficile 

    
    //if (lv == 2) {
    //      touchSensibility = 15; // piu basso piu difficile 
    //      densityLV = 40;  //10-100 piu grande piu difficile
    //      radius = 16;  //piu piccolo piu difficile
    //      r0 = 60;   //piu alto piu difficle 
    //      initialInfect = 2; //piu alto piu difficile 
    //}
    //if (lv == 3) {
    //      touchSensibility = 12; // piu basso piu difficile 
    //      densityLV = 60;  //10-100 piu grande piu difficile
    //      radius = 14;  //piu piccolo piu difficile
    //      r0 = 90;   //piu alto piu difficle 
    //      initialInfect = 3; //piu alto piu difficile 
    //}
    //if (lv == 4) {
    //      touchSensibility = 10; // piu basso piu difficile 
    //      densityLV = 80;  //10-100 piu grande piu difficile
    //      radius = 12;  //piu piccolo piu difficile
    //      r0 = 120;   //piu alto piu difficle 
    //      initialInfect = 4; //piu alto piu difficile 
    //}
    //if (lv > 4) {
    //     touchSensibility = 5; // piu basso piu difficile 
    //     densityLV = 100;  //10-100 piu grande piu difficile
    //     radius = 10;  //piu piccolo piu difficile
    //     r0 = 150;   //piu alto piu difficle 
    //     initialInfect = 5; //piu alto piu difficile 
    //}

    var someSick = false;
    var tick = true; 

    function init() { 


       
        velDesise = 0.1 + ( lv/10 )  ; //velocity of contagius  0.1 very slow 1 normal 10 super fast
        touchSensibility = 20  ; // piu basso piu difficile 
        density = 350 + (lv*7) ;  //max 1300
        radius = 20 - (lv/10) ;  //piu piccolo piu difficile
        r0 = 150; //piu alto piu difficle 
        initialInfect = 0 + lv; //piu alto piu difficile 
        var speed = 4 + (lv/10);

        var minRadiusParticle = 5;
        var maxRadiusParticle = 50; 
       
        particleArray = [];
        widthWindow = window.innerWidth;
        heightWindow = window.innerHeight;

        var constColors = [colorInit];

        if (canvas.getContext) {
          

            ctx = canvas.getContext('2d');
            canvas.setAttribute('width', widthWindow);
            canvas.setAttribute('height', heightWindow);
            var longerSide = Math.max(widthWindow, heightWindow);
            var numParticules = Math.round(((((widthWindow * heightWindow) / longerSide) / 100) * density) / maxRadiusParticle); 


          
            
            for (var i = 0; i < numParticules; i++) {

                var randomRadius = radius;
                var desise = colorInit;
                if (i < initialInfect) desise = desiseInit;

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
        this.dred =  colorInit + (colorInit - this.desise) + 1;
        this.mass = 1;
        this.isCured = this.desise == colorInit;
        this.velocity = {
            x: (Math.random() - 0.5) * Speed,
            y: (Math.random() - 0.5) * Speed
        }
        this.collision = false;

        this.draw = function (desise) {
            ctx.beginPath(); 
          
            var gradient = ctx.createRadialGradient(this.x, this.y, 1, this.x - 4, this.y - 4, 20);
            if (this.desise >= colorInit) {
                gradient.addColorStop(0, 'white');
                gradient.addColorStop(1, rgb(this.desise, this.desise, this.desise));
            }
             
            if (this.desise < colorInit) {
                //red
                gradient.addColorStop(0, rgb(255,colorInit + this.desise,  colorInit + this.desise));
                gradient.addColorStop(1, rgb(this.dred,this.desise,  this.desise));
                //  //green
                //gradient.addColorStop(0, rgb(colorInit + this.desise, 255,  colorInit + this.desise));
                //gradient.addColorStop(1, rgb(this.desise, this.dred,this.desise));

                //  //blue
                //gradient.addColorStop(0, rgb(colorInit + this.desise, colorInit + this.desise ,255));
                //gradient.addColorStop(1, rgb(this.desise, this.desise, this.dred)); 
            } 
             
            ctx.arc(
                this.x,
                this.y,
                this.radius,
                0,
                2 * Math.PI
            );
            //ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
          
                ctx.fillStyle = gradient;
                ctx.fill(); 
        } 
     
        this.update = function () {
            if (this.x + this.radius > widthWindow || this.x - this.radius < 0) {
                this.velocity.x = -this.velocity.x;
            }
            if (this.y + this.radius > heightWindow || this.y - this.radius < 0) {
                this.velocity.y = -this.velocity.y;
            }
             
            if (this.desise >= velDesise && this.desise < colorInit ) {
                this.desise-=velDesise;
                if (this.dred <= 255-velDesise)
                    this.dred+=velDesise;
                
            } 
            
            for (var i = 0; i < particleArray.length; i++) {
                if (this === particleArray[i]) continue;
                if (distance(this.x, this.y, particleArray[i].x, particleArray[i].y) - this.radius - particleArray[i].radius < 0) {
                    resolveCollision(this, particleArray[i]);
                }
            }
            //HELP
            if (lv == 1) {
                ctx.fillStyle = "#ff5b5b";
                ctx.font = "20px 'Roboto', sans-serif"; 
                ctx.fillText("The red subject are infected", (widthWindow / 2) - 120, (heightWindow / 2) -100);
                ctx.fillText("TAP to cure them", (widthWindow / 2) - 90, (heightWindow / 2) - 60);
            }
            if (lv == 2) {
                ctx.fillStyle = "#ff5b5b";
                ctx.font = "18px 'Roboto', sans-serif"; 
                ctx.fillText("The virus spreads by contact", (widthWindow / 2) - 110, (heightWindow / 2) +60);
                ctx.fillText("the redest are the most contagious", (widthWindow / 2) - 140, (heightWindow / 2) +100);
            }
     
            if (isClicked(this)) { 
                this.desise = colorInit;  
            } 

            this.x += this.velocity.x;
            this.y += this.velocity.y;
           
            this.draw(this.desise); 
        }

    }

    function animate() {
        idAnimation = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, widthWindow, heightWindow);
        if (!started) {
            ctx.fillStyle = "white";
            ctx.font = "40px  'Creepster', cursive";
            ctx.fillText("Covid19 the game", (widthWindow / 2) - 130, (heightWindow / 2) - 60);
            ctx.font = "18px  'Creepster', cursive"; 
            ctx.fillText("Tap to start", (widthWindow / 2) - 40, (heightWindow / 2)-30); 
        }
        if (started) { 
            startFlag = false; 
        } 

       
        someSick = false;
        for (var i = 0; i < particleArray.length; i++) {  //control for the endgame
            if (particleArray[i].desise < colorInit) {
                someSick = true;
                break;
            } 
        } 
        nSick = 0;
        allSick = false;
        for (var i = 0; i < particleArray.length; i++) {  //control for the endgame
            if (particleArray[i].desise < colorInit) {
                nSick++;
                if (nSick > particleArray.length - 5 && started)
                    allSick = true;
            }
        } 
        
        if (someSick && !allSick && started) {
            for (var i = 0; i < particleArray.length; i++) {
                particleArray[i].update();
            }
        }
        else {  
            if (!someSick) {
                nextLvFlag = true;
                ctx.font = "30px  'Creepster', cursive";
                ctx.fillText("Level " + (lv + 1) + ": " + city[lv], (widthWindow / 2) - 90, (heightWindow / 2) - 30);
                ctx.font = "14px  'Creepster', cursive";
                ctx.fillText("Tap to start", (widthWindow / 2) - 30, (heightWindow / 2));
                ctx.font = "40px  'Creepster', cursive";  
                if (secFlag) {  

                    ctx.fillText(sec, (widthWindow / 2), (heightWindow / 2) + 80);
                    setTimeout(function () {
                        if(sec==3) sec=2;
                        ctx.fillText(sec, (widthWindow / 2), (heightWindow / 2) + 80);
                        setTimeout(function () {
                            if (sec == 2) sec = 1;
                            ctx.fillText(sec, (widthWindow / 2), (heightWindow / 2) + 80);
                            setTimeout(function () {
                                if (sec == 1) sec = 3;
                                ctx.fillText(sec, (widthWindow / 2), (heightWindow / 2) + 80);
                            }, 800);
                        }, 1000);
                    }, 1000);
                 
                   
                    
                }

                if (nextLv) {
                    nextLv = false; 
                    sec = 3;
                    secFlag = false; 
                    nextLvFlag = false;
                    nextLevel();   
                } 
            }
            if (allSick) { 
                nextLvFlag = true;
                ctx.font = "30px  'Creepster', cursive";
                ctx.fillText("You Died at lv " + lv, (widthWindow / 2) - 90, (heightWindow / 2) - 30); 
                ctx.font = "14px  'Creepster', cursive";
                ctx.fillText("Tap to restart", (widthWindow / 2) - 40, (heightWindow / 2)   ); 
                if (nextLv) {
                    nextLv = false;
                    nextLvFlag = false;
                    restart(); 
                } 
            }
        }
       
    }

    function rotate(velocity, angle) {
        const rotatedVelocities = {
            x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
            y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
        };

        return rotatedVelocities;
    }
    function rgb(r, g, b) {
        return ["rgb(", r, ",", g, ",", b, ")"].join("");
    } 

    canvas.addEventListener('mousedown', function (e) {
        getCursorPosition(canvas, e);
    })

    
    function getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect()
        mousex = event.clientX - rect.left;
        mousey = event.clientY - rect.top;
    }
    function isClicked(circle) {
        return Math.sqrt((mousex - circle.x) ** 2 + (mousey - circle.y) ** 2) < circle.radius + touchSensibility; 
    }

    $("#canvas").click(function (e) { 
        if (nextLvFlag) {
            secFlag = true;
            setTimeout(function () { nextLv = true; }, 2700);
        }
        if (startFlag) {
             started = true;  
        }
    });
 

    function nextLevel() { 
        someSick = true;
        lv++;
        console.log(lv);
        init(); 
    }
    function restart() {
        someSick = true;
        lv=1;
        console.log(lv);
        init();
    }
     
    function resolveCollision(particle, otherParticle) {

        const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
        const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;


        const desise1 = particle.desise;
        const desise2 = otherParticle.desise;
        const xDist = otherParticle.x - particle.x;
        const yDist = otherParticle.y - particle.y;

        // Prevent accidental overlap of particles
        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

            // Grab angle between the two colliding particles
            const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

            // Store mass in var for better readability in collision equation
            const m1 = particle.mass;
            const m2 = otherParticle.mass; 
            
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
            var r = Math.random() * colorInit;
            //100%
            if (desise2 == 0 && desise1 == colorInit  ) {
                
                particle.desise--; 
            }
            if (desise1 == 0 && desise2 == colorInit  ) {
                otherParticle.desise--; 
            }

            //50%
           
            if (desise1 == colorInit && desise2 > 0 && desise2 < colorInit  && r>(desise2+(1*(colorInit-r0))) ){
                otherParticle.desise--; 
            }
            
            if (desise2 == colorInit && desise1 > 0 && desise1 < colorInit && r > (desise1 + (1 * (colorInit - r0)) ) ) {
                otherParticle.desise--; 
            } 
        }
    }

    window.onresize = function () {
        if (myResizeTimer != null) clearTimeout(myResizeTimer);
        myResizeTimer = setTimeout(init, 100);
    }
     
    init();  

    animate();

});
 
