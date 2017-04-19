(function(){
    var ctx,
        boardWidth = 600,
        boardHeight = 500,
        circleStrokeColor = '#777777',
        startStep;

    /**
     * return radians from degrees
     * @param   {number} angle in degrees
     * @returns {number} angle in radians
     */
    function getRadians(angle){
        if(arguments !== 0){
            return angle * Math.PI / 180;
        } else {
            return null;
        }
    }

    function roundPlus(x, n){
        if(isNaN(x) || isNaN(n)) return false;
        var m = Math.pow(10,n);
        return Math.round(x*m)/m;
    }

    /**
     * Circle instance
     * @constructor
     * @this {Circle}
     * @param {number} x     x-ccordinate of circle
     * @param {number} y     y-ccordinate of circle
     * @param {number} r     radius of circle
     * @param {number} n     number of sectors
     * @param {number} start start position number
     */
    function Circle(x, y, r, n, start, color, direction, angle, speed) {

        this.x = x;
        this.y = y;
        this.r = r;

        this.n = n;
        this.start = start;

        this.angle = angle;

        this.color = color;

        // direction: 1 - CW, -1 - CCW
        this.direction = direction;

        this.speed = speed;

        this.spinning = false;

    }

    Circle.prototype.setAngle = function(angle){
        this.angle = angle;
    };

    Circle.prototype.getAngle = function(){
        return this.angle;
    };

    Circle.prototype.draw = function(){

        ctx.fillStyle = this.color;
        ctx.strokeStyle = circleStrokeColor;
        // drawing circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.stroke();
        //drawing numbers
        ctx.beginPath();
        for (var i = 0; i < this.n; i++) {
            //drawing sector lines
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x +  Math.round(this.r * Math.cos(getRadians(this.angle + i*360/this.n))),
                        this.y + Math.round(this.r * Math.sin(getRadians(this.angle + i*360/this.n))));
            //drawing numbers
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(getRadians(this.angle + i*360/this.n + 86 + 180/this.n));
            ctx.font = "20px serif";
            ctx.fillStyle = "#000000";
            ctx.textAlign = "left";
            ctx.fillText(i+this.start, 0, -(this.r - 20));
            ctx.restore();

        }
        ctx.stroke();

    };

    Circle.prototype.step = function(){
        this.angle += this.speed * this.direction;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, boardWidth, boardHeight);

        this.draw();
    };

    function drawAll(arr){
        for(var i = 0; i < arr.length; i++){
            arr[i].draw();
        }
    };


    $(document).ready(function(){
        // drawing board
        var board = document.getElementById("Board");
        ctx = board.getContext("2d");

        ctx.canvas.width = boardWidth;
        ctx.canvas.height = boardHeight;

        //main circles array
        var circles = [];

        circles.push(new Circle(300, 300, 150, 33, 21, '#A67EFF', -1, 0, 0.8));
        circles.push(new Circle(300, 300, 110, 20, 13, '#CC853C', 1, 0, 1.5));
        circles.push(new Circle(300, 300, 80, 12, 7, '#65FF79', -1, 0, 2));
        circles.push(new Circle(300, 300, 50, 6, 1, '#EDEDED', 1, 0, 1));


        function showInfo(){
            for(var i = 0; i < circles.length; i++){
                $("#angle"+(i+1)).text(roundPlus(circles[i].angle, 2));
            }
        };

        showInfo();

        drawAll(circles);

        $('#plus').click(function(){
            circles[0].angle++;
            $("#angle1").text(roundPlus(circles[0].angle, 2));

            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, boardWidth, boardHeight);

            circles[0].draw();
        });

        $('#minus').click(function(){
            circles[0].angle--;
            $("#angle1").text(roundPlus(circles[0].angle, 2));

            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, boardWidth, boardHeight);

            circles[0].draw();
        });

        function step(){
            var cancel = 0;
            for(var i = 0; i < circles.length; i++) {

                if((circles[i].angle < 360)&&(circles[i].angle > -360)) {
                        circles[i].angle += circles[i].speed * circles[i].direction;
                   } else {
                       if(circles[i].spinning === true) {
                            circles[i].spinning = false;
                            cancel++;
                       }
                   };

                if(cancel === 4){
                    cancelAnimationFrame(startStep);
                }
            };

            showInfo();

            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, boardWidth, boardHeight);

            drawAll(circles);

            startStep = requestAnimationFrame(step);
        };

        $('#spin').click(function(){
            circles.forEach(function(item){
                item.spinning = true;
            });

            circles.forEach(function(item){
                item.setAngle(0);
            });

            startStep = requestAnimationFrame(step);
        });

    });


}());
