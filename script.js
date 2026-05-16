(function () {
  "use strict";

  var canvas = document.getElementById("particles");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var particles = [];
  var count = 70;
  var mouse = { x: -9999, y: -9999 };
  var connectDist = 100;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticle() {
    return {
      x: random(0, canvas.width),
      y: random(0, canvas.height),
      size: random(1.5, 4),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.6, 0.4),
      opacity: random(0.2, 0.8),
    };
  }

  function initParticles() {
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var dx = mouse.x - p.x;
      var dy = mouse.y - p.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140 && dist > 0) {
        p.x -= (dx / dist) * 0.8;
        p.y -= (dy / dist) * 0.8;
      }
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(46, 230, 168, " + p.opacity + ")";
      ctx.fill();
    }

    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var p1 = particles[a];
        var p2 = particles[b];
        var ddx = p1.x - p2.x;
        var ddy = p1.y - p2.y;
        var d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < connectDist) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = "rgba(46, 230, 168, " + (0.25 * (1 - d / connectDist)) + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  resize();
  initParticles();
  window.addEventListener("resize", function () {
    resize();
    initParticles();
  });
  document.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  drawParticles();

  // Click ripples
  var ripplesEl = document.getElementById("ripples");
  document.addEventListener("click", function (e) {
    if (!ripplesEl) return;
    var ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = e.clientX + "px";
    ripple.style.top = e.clientY + "px";
    ripple.style.width = "40px";
    ripple.style.height = "40px";
    ripplesEl.appendChild(ripple);
    setTimeout(function () {
      ripple.remove();
    }, 800);
  });

  // Typing + letter pop + skill bar
  var nameEl = document.getElementById("name-text");
  var courseEl = document.getElementById("course-text");
  var nameHeading = document.querySelector(".name");
  var skillFill = document.getElementById("skill-fill");

  function wrapLetters(text) {
    var html = "";
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      if (ch === " ") {
        html += " ";
      } else {
        html +=
          '<span class="letter" style="animation-delay:' +
          i * 0.04 +
          's">' +
          ch +
          "</span>";
      }
    }
    return html;
  }

  if (nameEl && nameHeading) {
    var fullName = nameEl.textContent;
    var fullCourse = courseEl ? courseEl.textContent : "";

    nameEl.textContent = "";
    if (courseEl) courseEl.textContent = "";
    nameHeading.classList.add("typing-active");

    var charIndex = 0;

    function typeName() {
      if (charIndex < fullName.length) {
        nameEl.textContent += fullName.charAt(charIndex);
        charIndex++;
        setTimeout(typeName, 50);
      } else {
        nameHeading.classList.remove("typing-active");
        nameHeading.classList.add("name-done");
        nameEl.innerHTML = wrapLetters(fullName);

        if (courseEl && fullCourse) {
          setTimeout(function () {
            typeCourse(fullCourse);
          }, 350);
        }

        if (skillFill) {
          setTimeout(function () {
            skillFill.classList.add("filled");
          }, 600);
        }
      }
    }

    function typeCourse(text) {
      var j = 0;
      function step() {
        if (j < text.length) {
          courseEl.textContent += text.charAt(j);
          j++;
          setTimeout(step, 60);
        }
      }
      step();
    }

    setTimeout(typeName, 900);
  }

  // Card tilt
  var card = document.querySelector(".card");
  if (card) {
    setTimeout(function () {
      card.classList.add("is-ready");
    }, 1200);

    document.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var rotX = ((e.clientY - cy) / rect.height) * -10;
      var rotY = ((e.clientX - cx) / rect.width) * 10;
      card.style.transform =
        "perspective(900px) rotateX(" +
        rotX +
        "deg) rotateY(" +
        rotY +
        "deg) translateY(-6px) scale(1.02)";
    });

    document.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  }

  // Icon chips bounce on click
  var chips = document.querySelectorAll(".icon-chip");
  for (var c = 0; c < chips.length; c++) {
    chips[c].addEventListener("click", function () {
      this.style.animation = "none";
      var el = this;
      setTimeout(function () {
        el.style.animation = "";
      }, 10);
    });
  }
})();
