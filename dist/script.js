/* eslint-env es6 */
(function () {
  'use strict'
  var ctx,
    boardWidth = 400,
    boardHeight = 400,
    circleStrokeColor = '#555555',
    startStep

/**
 * return radians from degrees
 * @param   {number} angle in degrees
 * @returns {number} angle in radians
 */
  function getRadians (angle) {
    if (arguments !== 0) {
      return angle * Math.PI / 180
    } else {
      return null
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
 * @param {number}  spins       number of full spins
 * @param {font}    font        font size and family
 */
  function Circle (x, y, r, n, start, color, direction, speed, spins, font) {
    this.x = x
    this.y = y
    this.r = r

    this.n = n
    this.start = start

    this.angle = Math.round(Math.random() * 360)

    this.color = color

    this.direction = direction

    this.speed = speed

    this.spinning = false
    this.spins = spins

    this.font = font
  }

  Circle.prototype.setAngle = function (angle) {
    this.angle = angle
  }

  Circle.prototype.getAngle = function () {
    return this.angle
  }

  Circle.prototype.setStart = function (start) {
    this.start = start
  }

  Circle.prototype.setNumber = function (number) {
    this.n = number
  }

  Circle.prototype.setSpeed = function (speed) {
    this.speed = speed
  }

  Circle.prototype.setSpins = function (spins) {
    this.spins = spins
  }

  Circle.prototype.setDirection = function (direction) {
    this.direction = direction
  }

  Circle.prototype.draw = function () {
    ctx.fillStyle = this.color
    ctx.strokeStyle = circleStrokeColor
    // drawing circle
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
    ctx.fill()
    ctx.lineWidth = 1
    ctx.stroke()
    // drawing numbers
    ctx.beginPath()
    for (var i = 0; i < this.n; i++) {
        // drawing sector lines
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(this.x + Math.round(this.r * Math.cos(getRadians(this.angle + i * 360 / this.n))),
                  this.y + Math.round(this.r * Math.sin(getRadians(this.angle + i * 360 / this.n))))
      // drawing numbers
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(getRadians(this.angle + i * 360 / this.n + 86 + 180 / this.n))
      ctx.font = this.font
      ctx.fillStyle = '#000000'
      ctx.textAlign = 'left'
      ctx.fillText(i + this.start, 0, -(this.r - 20))
      ctx.restore()
    }
    ctx.stroke()
  }

  Circle.prototype.step = function () {
    this.angle += this.speed * this.direction

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, boardWidth, boardHeight)

    this.draw()
  }

  function drawAll (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].draw()
    }
  }

  $(document).ready(function () {
    // drawing board
    var board = document.getElementById('Board'),
      circles = [], // main circles array
      lockArray = [] // main lock array
    ctx = board.getContext('2d')

    ctx.canvas.width = boardWidth
    ctx.canvas.height = boardHeight

    circles.push(new Circle(200, 200, 150, 33, 39, '#CC2115', -1, 0.8, 1, '14px serif'))
    circles.push(new Circle(200, 200, 110, 20, 19, '#297F48', 1, 1.5, 1, '16px serif'))
    circles.push(new Circle(200, 200, 80, 12, 7, '#3D66E0', -1, 2, 1, '18px serif'))
    circles.push(new Circle(200, 200, 50, 6, 1, '#0ADBFF', 1, 5.1, 2, '20px serif'))

    drawAll(circles)
    lockArray.push([3, 10, 30, 50], [4, 9, 29, 55])

    function showInfo (arr) {
      arr.forEach(function (item, i) {
        var elem = arr.length - 1 - i
        $('#circle' + (i + 1) + '-start').val(arr[elem].start)
        $('#circle' + (i + 1) + '-number').val(arr[elem].n)
        $('#circle' + (i + 1) + '-speed').val(arr[elem].speed)
        $('#circle' + (i + 1) + '-spins').val(arr[elem].spins)
        if (arr[elem].direction === 1) {
          $('#circle' + (i + 1) + '-direction').prop('checked', true)
        } else {
          $('#circle' + (i + 1) + '-direction').prop('checked', false)
        }
        $('#circle' + (i + 1) + '-caption').css('background-color', arr[elem].color)
        $('#circle' + (i + 1) + '-numbers').css('border-left-color', arr[elem].color)
      })
    };

    showInfo(circles)

    function step () {
      var cancel = 0
      for (let i = 0; i < circles.length; i++) {
        if ((circles[i].angle < 360 * circles[i].spins) && (circles[i].angle > -360 * circles[i].spins)) {
          circles[i].angle += circles[i].speed * circles[i].direction
        } else {
          if (circles[i].spinning === true) {
            circles[i].spinning = false
            cancel++
          }
        };

        if (cancel === 4) {
          cancelAnimationFrame(startStep)

          circles.forEach(function (item) {
            item.spinning = false
          })

          circles.forEach(function (item) {
            item.setAngle(0)
          })
        }
      };

      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, boardWidth, boardHeight)

      drawAll(circles)

      startStep = requestAnimationFrame(step)
    };

    function isSpinning (item) {
      return item.spinning
    }

    $('#spin').click(function () {
      if (!circles.some(isSpinning)) {
        circles.forEach(function (item) {
          item.spinning = true
        })

        startStep = requestAnimationFrame(step)
      }
    })

    $('#stop').click(function () {
      if (circles.some(isSpinning)) {
        circles.forEach(function (item) {
          item.spinning = false
        })

        cancelAnimationFrame(startStep)
      }
    })

    $('#reset').click(function () {
      circles.forEach(function (item) {
        item.spinning = false
      })

      circles.forEach(function (item) {
        item.setAngle(0)
      })

      cancelAnimationFrame(startStep)

      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, boardWidth, boardHeight)

      drawAll(circles)
    })

    function bindInputs (arr) {
      arr.forEach(function (item, i) {
        var elem = arr.length - 1 - i
        $('#circle' + (i + 1) + '-start').bind('keyup input', function () {
          arr[elem].setStart(parseInt($(this).val()))
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, boardWidth, boardHeight)
          drawAll(circles)
        })
        $('#circle' + (i + 1) + '-number').bind('keyup input', function () {
          arr[elem].setNumber(parseInt($(this).val()))
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, boardWidth, boardHeight)
          drawAll(circles)
        })
        $('#circle' + (i + 1) + '-speed').bind('keyup input', function () {
          arr[elem].setSpeed(parseFloat($(this).val()))
        })
        $('#circle' + (i + 1) + '-spins').bind('keyup input', function () {
          arr[elem].setSpins(parseFloat($(this).val()))
        })
        $('#circle' + (i + 1) + '-direction').change(function () {
          if ($(this).prop('checked')) {
            circles[elem].setDirection(1)
          } else {
            circles[elem].setDirection(-1)
          }
        })
      })
    }

    bindInputs(circles)
  })
}())
