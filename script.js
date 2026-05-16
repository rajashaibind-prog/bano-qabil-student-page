(function () {
  "use strict";

  // --- Floating particles (canvas) ---
  var canvas = document.getElementById("particles");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var particles = [];
  var count = 55;
  var mouse = { x: -9999, y: -9999 };

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
      size: random(2, 5),
      speedX: random(-0.4, 0.4),
      speedY: random(-0.5, 0.3),
      opacity: random(0.2, 0.7),
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
      if (dist < 120 && dist > 0) {
        p.x -= (dx / dist) * 0.6;
        p.y -= (dy / dist) * 0.6;
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

  // --- Typing effect on name ---
  var nameEl = document.getElementById("name-text");
  var courseEl = document.getElementById("course-text");
  var nameHeading = document.querySelector(".name");

  if (nameEl && nameHeading) {
    var fullName = nameEl.textContent;
    var fullCourse = courseEl ? courseEl.textContent : "";

    nameEl.textContent = "";
    if (courseEl) courseEl.textContent = "";
    nameHeading.classList.add("typing-active");

    var charIndex = 0;

    function typeText(el, text, speed, done) {
      var i = 0;
      function step() {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(step, speed);
        } else if (done) {
          done();
        }
      }
      step();
    }

    function typeName() {
      if (charIndex < fullName.length) {
        nameEl.textContent += fullName.charAt(charIndex);
        charIndex++;
        setTimeout(typeName, 55);
      } else {
        nameHeading.classList.remove("typing-active");
        if (courseEl && fullCourse) {
          setTimeout(function () {
            typeText(courseEl, fullCourse, 65, null);
          }, 400);
        }
      }
    }

    setTimeout(typeName, 900);
  }

  // --- Card tilt on mouse move (after entrance) ---
  var card = document.querySelector(".card");
  if (card) {
    setTimeout(function () {
      card.classList.add("is-ready");
    }, 1200);

    document.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var rotX = ((e.clientY - cy) / rect.height) * -8;
      var rotY = ((e.clientX - cx) / rect.width) * 8;

      card.style.transform =
        "perspective(800px) rotateX(" + rotX + "deg) rotateY(" + rotY + "deg) translateY(-4px)";
    });

    document.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  }
})();
