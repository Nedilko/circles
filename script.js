(function(){
    var ctx,
        boardWidth = 800,
        boardHeight = 600,
        circleStrokeColor = '#777777';

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
    function Circle(x, y, r, n, start) {

        this.x = x;
        this.y = y;
        this.r = r;

        this.n = n;
        this.start = start;

    }

    Circle.prototype.draw = function(){
        ctx.fillStyle = '#EDEDED';
        ctx.strokeStyle = circleStrokeColor;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.stroke();

    };

    $(document).ready(function(){
        // drawing board
        var board = document.getElementById("Board");
        ctx = board.getContext("2d");

        ctx.canvas.width = boardWidth;
        ctx.canvas.height = boardHeight;

        var circleOne = new Circle(300, 300, 50, 6, 1),
            circleTwo = new Circle(300, 300, 100, 12, 7);

        circleTwo.draw();
        circleOne.draw();
    });
}());
