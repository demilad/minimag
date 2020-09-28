// ------------------------------------------
// Minimag.js
// Micro library to make dom elements react magnetically to the mouse
// Copyright (c) 2020 Demilade Olaleye (@demiladeHQ)
// MIT license
// ------------------------------------------

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory)
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but only CommonJS-like environments that support module.exports,like Node.
    module.exports = factory()
  } else {
    // Browser globals (root is window)
    root.Minimag = factory()
  }
}(typeof window !== 'undefined' ? window : global, function () {
  var Minimag = function () {
    'use strict'
    var mouseTimeout = null
    var mouse = {
      x: 0,
      y: 0,
      moving: false
    }
    var transformStyles = {
      tx: { previous: 0, current: 0, ease: 0.1 },
      ty: { previous: 0, current: 0, ease: 0.1 }
    }
    var defaults = {
      distance: 40,
      distanceMultiplier: 20,
      friction: 0.5
    }
    var minimagEls = document.querySelectorAll('[data-minimag]')
    function lerp (a, b, n) {
      return (1 - n) * a + n * b
    };
    function getDistance (x1, y1, x2, y2) {
      var a = x1 - x2
      var b = y1 - y2
      return Math.hypot(a, b)
    };
    function setActive (el) {
      el.dataset.minimag = 'active'
    }
    function removeActive (el) {
      el.dataset.minimag = ''
    }
    function magnetize () {
      if (mouse.moving) {
        minimagEls.forEach(el => {
          var elRect = el.getBoundingClientRect()
          var elCenterX = elRect.left + elRect.width / 2
          var elCenterY = elRect.top + elRect.height / 2
          var triggerDistance = el.dataset.magDist * defaults.distanceMultiplier || defaults.distance
          var direction = triggerDistance < 0 ? -1 : 1
          var deltaX = ((mouse.x - elCenterX) * defaults.friction) * direction
          var deltaY = ((mouse.y - elCenterY) * defaults.friction) * direction

          var distanceFromEl = getDistance(mouse.x, mouse.y, elCenterX, elCenterY)
          if (distanceFromEl < Math.abs(triggerDistance)) {
            setActive(el)
            el.style.transition = ''
            transformStyles.tx.current = deltaX
            transformStyles.ty.current = deltaY
            for (var key in transformStyles) {
              transformStyles[key].previous = lerp(transformStyles[key].previous, transformStyles[key].current, transformStyles[key].ease)
            }
            el.style.transform = 'translate3d('.concat(transformStyles.tx.previous, 'px, ').concat(transformStyles.ty.previous, 'px, 0)')
          } else {
            el.style.transform = null
            el.style.transition = 'transform .4s cubic-bezier(.75,-0.5,0,1.75)'
            removeActive(el)
          };
        })
      };
      requestAnimationFrame(magnetize)
    };
    magnetize()
    document.addEventListener('mousemove', function (e) {
      mouse.moving = true
      mouse.x = e.pageX
      mouse.y = e.pageY
      clearTimeout(mouseTimeout)
      mouseTimeout = setTimeout(() => {
        mouse.moving = false
      }, 100)
    })
  }
  return Minimag
}))
