(function () {
  'use strict';
  var ctx,
    boardWidth = 400,
    boardHeight = 400,
    circleStrokeColor = '#555555',
    startStep,
    ID = 1,
    iterator = 0;

/**
 * return radians from degrees
 * @param   {number} angle in degrees
 * @returns {number} angle in radians
 */
  function getRadians (angle) {
    if (arguments !== 0) {
      return angle * Math.PI / 180;
    } else {
      return null;
    }
  }

/**
 * Circle instance
 * @constructor
 * @this {Circle}
 * @param {number}  x           x-ccordinate of circle
 * @param {number}  y           y-ccordinate of circle
 * @param {number}  r           radius of circle
 * @param {number}  n           number of sectors
 * @param {number}  start       start position number
 * @param {text}    color       color of circle
 * @param {number}  direction   1 CC; -1 CCW
 * @param {number}  speed       speed of spining
 * @param {font}    font        font size and family
 */
  function Circle (x, y, r, n, start, color, direction, speed, font) {
    this.x = x;
    this.y = y;
    this.r = r;

    this.n = n;
    this.start = start;

    this.angle = Math.round(Math.random() * 360);

    this.color = color;

    this.direction = direction;

    this.speed = speed;

    this.spinning = false;

    this.font = font;

    this.id = ID++;
  }

  Circle.prototype.setAngle = function (angle) {
    if (angle > 360) {
      this.angle = angle - 360;
    } else if (angle < 0) {
      this.angle = 360 + angle;
    } else {
      this.angle = angle;
    };
  };

  Circle.prototype.getAngle = function () {
    return this.angle;
  };

  Circle.prototype.incrementAngle = function () {
    let angle = this.angle += this.direction;
    this.setAngle(angle);
  };

  Circle.prototype.setStart = function (start) {
    this.start = start;
  };

  Circle.prototype.setNumber = function (number) {
    this.n = number;
  };

  Circle.prototype.setSpeed = function (speed) {
    this.speed = speed;
  };

  Circle.prototype.setDirection = function (direction) {
    this.direction = direction;
  };

  Circle.prototype.draw = function (selected) {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = circleStrokeColor;
    // drawing circle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();
    // drawing numbers
    ctx.beginPath();
    for (let i = 0; i < this.n; i++) {
      // drawing sector lines
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + Math.round(this.r * Math.cos(getRadians(this.getAngle() + i * 360 / this.n))),
                  this.y + Math.round(this.r * Math.sin(getRadians(this.getAngle() + i * 360 / this.n))));
      // drawing numbers
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(getRadians(this.getAngle() + i * 360 / this.n + 90 + 180 / this.n));
      ctx.font = this.font;
      if (arguments.length > 0 && !this.spinning) {
        if (i === (selected - this.start)) {
          ctx.fillStyle = '#00FF0F';
        } else {
          ctx.fillStyle = '#000000';
        }
      } else {
        ctx.fillStyle = '#000000';
      }
      ctx.textAlign = 'center';
      ctx.fillText(i + this.start, 0, -(this.r - 20));
      ctx.restore();
    }
    ctx.stroke();
  };

  Circle.prototype.step = function () {
    this.incrementAngle();

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, boardWidth, boardHeight);

    this.draw();
  };

  function matchAngle (item, number) {
    let angle;
    if ((number < item.start) || (number > (item.start + item.n))) {
      return false;
    }
    angle = 360 - Math.round((360 / item.n) * (number - item.start) + (360 / item.n) / 2);
    return angle;
  }

  function drawAll (arr, lock) {
    for (let i = 0; i < arr.length; i++) {
      if (arguments.length > 1) {
        arr[i].draw(lock[arr.length - i - 1]);
      } else {
        arr[i].draw();
      }
    }
  }

  $(document).ready(function () {
    // drawing board
    var board = document.getElementById('Board'),
      circles = [], // main circles array
      lockArray = []; // main lock array
    ctx = board.getContext('2d');

    ctx.canvas.width = boardWidth;
    ctx.canvas.height = boardHeight;

    circles.push(new Circle(200, 200, 150, 33, 39, '#CC2115', -1, 3.8, '14px serif'));
    circles.push(new Circle(200, 200, 110, 20, 19, '#297F48', 1, 3.5, '16px serif'));
    circles.push(new Circle(200, 200, 80, 12, 7, '#3D66E0', -1, 4, '18px serif'));
    circles.push(new Circle(200, 200, 50, 6, 1, '#0ADBFF', 1, 6.1, '20px serif'));

    lockArray.push([1, 11, 30, 50], [4, 9, 29, 55], [6, 18, 25, 45]);
    drawAll(circles);

    function showInfo (arr) {
      arr.forEach(function (item, i) {
        var elem = arr.length - 1 - i;
        $('#circle' + (i + 1) + '-start').val(arr[elem].start);
        $('#circle' + (i + 1) + '-number').val(arr[elem].n);
        $('#circle' + (i + 1) + '-speed').val(arr[elem].speed);
        if (arr[elem].direction === 1) {
          $('#circle' + (i + 1) + '-direction').prop('checked', true);
        } else {
          $('#circle' + (i + 1) + '-direction').prop('checked', false);
        }
        $('#circle' + (i + 1) + '-caption').css('background-color', arr[elem].color);
        $('#circle' + (i + 1) + '-numbers').css('border-left-color', arr[elem].color);
      });
    };

    showInfo(circles);

    function isSpinning (item) {
      return item.spinning;
    }

    $('#circles-data').bind('change', function (event) {
      var files = event.target.files[0],
        fileReader = new FileReader();
      fileReader.onload = function (event) {
        var array = event.target.result.split('\n');
        array.forEach(function (item, i) {
          lockArray.push(item.split(',').map(Number));
        });
      };
      fileReader.readAsText(files);
    });

    function step () {
      circles.filter(function (item) {
        return item.spinning;
      }).forEach(function (item) {
        if (item.getAngle() === matchAngle(item, lockArray[iterator][circles.length - item.id])) {
          item.spinning = false;
        } else {
          item.incrementAngle();
        }
      });

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, boardWidth, boardHeight);

      drawAll(circles, lockArray[iterator]);

      startStep = requestAnimationFrame(step);

      if (!circles.some(isSpinning)) {
        cancelAnimationFrame(startStep);
        setTimeout(function () {
          iterator = iterator + 1;
          if (iterator < lockArray.length) {
            circles.forEach(function (item) {
              item.spinning = true;
            });

            startStep = requestAnimationFrame(step);
          } else {
            iterator = 0;
            circles.forEach(function (item) {
              item.spinning = false;
            });
          }
        }, 1000);
      };
    };

    $('#spin').click(function () {
      if (!circles.some(isSpinning)) {
        circles.forEach(function (item) {
          item.spinning = true;
        });

        startStep = requestAnimationFrame(step);
      }
    });

    $('#stop').click(function () {
      if (circles.some(isSpinning)) {
        circles.forEach(function (item) {
          item.spinning = false;
        });

        cancelAnimationFrame(startStep);
      }
    });

    $('#reset').click(function () {
      circles.forEach(function (item) {
        item.spinning = false;
        item.setAngle(0);
      });

      cancelAnimationFrame(startStep);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, boardWidth, boardHeight);

      drawAll(circles);
    });

    function bindInputs (arr) {
      arr.forEach(function (item, i) {
        var elem = arr.length - 1 - i;
        $('#circle' + (i + 1) + '-start').bind('keyup input', function () {
          arr[elem].setStart(parseInt($(this).val()));
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, boardWidth, boardHeight);
          drawAll(circles);
        });

        $('#circle' + (i + 1) + '-number').bind('keyup input', function () {
          arr[elem].setNumber(parseInt($(this).val()));
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, boardWidth, boardHeight);
          drawAll(circles);
        });

        $('#circle' + (i + 1) + '-speed').bind('keyup input', function () {
          arr[elem].setSpeed(parseFloat($(this).val()));
        });

        $('#circle' + (i + 1) + '-direction').change(function () {
          if ($(this).prop('checked')) {
            circles[elem].setDirection(1);
          } else {
            circles[elem].setDirection(-1);
          }
        });
      });
    }

    bindInputs(circles);
  });
}());
