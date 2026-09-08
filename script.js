const themeButton =
    document.getElementById("themeButton");


// Check previously selected theme

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    themeButton.textContent = "☀️";

}


// Change theme

themeButton.addEventListener("click", function () {

    document.body.classList.toggle("dark");


    if (document.body.classList.contains("dark")) {

        themeButton.textContent = "☀️";

        localStorage.setItem("theme", "dark");

    } else {

        themeButton.textContent = "🌙";

        localStorage.setItem("theme", "light");

    }

});


// Scroll animations: fade/slide in tiles as they enter view

const photoTiles =
    document.querySelectorAll(".photo-tile");

if (photoTiles.length) {

    const tileObserver = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry, i) {

                if (entry.isIntersecting) {

                    // Small stagger so cards don't all pop in at once

                    setTimeout(function () {

                        entry.target.classList.add("in-view");

                    }, i * 100);

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.15,
        }
    );

    photoTiles.forEach(function (tile) {

        tileObserver.observe(tile);

    });

}


// =========================
//   ANIMATED STAT COUNTERS
// =========================

const statElements = document.querySelectorAll(".stat strong");

if (statElements.length) {

    const statObserver = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    const el = entry.target;
                    const target = parseInt(el.textContent, 10);
                    const duration = 1500;
                    const startTime = performance.now();

                    function animate(currentTime) {

                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.round(eased * target);

                        el.textContent = String(current).padStart(2, "0");

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }

                    }

                    requestAnimationFrame(animate);
                    observer.unobserve(el);

                }

            });

        },
        { threshold: 0.5 }
    );

    statElements.forEach(function (stat) {

        statObserver.observe(stat);

    });

}


// =========================
//   3D TILT ON HOVER
// =========================

const tiltTiles = document.querySelectorAll(".photo-tile");

tiltTiles.forEach(function (tile) {

    tile.addEventListener("mousemove", function (e) {

        const rect = tile.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        tile.style.transform =
            "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-8px)";

    });

    tile.addEventListener("mouseleave", function () {

        tile.style.transform = "";

    });

});


// =========================
//   CURSOR SPOTLIGHT
// =========================

const spotlight = document.createElement("div");
spotlight.classList.add("cursor-spotlight");
document.body.appendChild(spotlight);

document.addEventListener("mousemove", function (e) {

    spotlight.style.left = e.clientX + "px";
    spotlight.style.top = e.clientY + "px";

});


// =========================
//   HANGING LAMP
// =========================

const lamp = document.createElement("div");
lamp.classList.add("hanging-lamp");
lamp.innerHTML =
    '<div class="lamp-wire"></div>' +
    '<div class="lamp-bulb">💡</div>' +
    '<div class="lamp-hint">Drag to toggle theme</div>';
document.body.appendChild(lamp);

let lampDragging = false;
let lampStartY = 0;
let lampPullDistance = 0;
const LAMP_THRESHOLD = 80;

lamp.addEventListener("mousedown", function (e) {

    lampDragging = true;
    lampStartY = e.clientY;
    lampPullDistance = 0;
    lamp.classList.add("dragging");
    e.preventDefault();

});

document.addEventListener("mousemove", function (e) {

    if (!lampDragging) return;

    lampPullDistance = e.clientY - lampStartY;

    if (lampPullDistance < 0) lampPullDistance = 0;

    const maxPull = 150;
    const pull = Math.min(lampPullDistance, maxPull);
    const wire = lamp.querySelector(".lamp-wire");

    wire.style.height = (40 + pull) + "px";

    lamp.style.transform = "translateY(" + pull + "px)";

});

document.addEventListener("mouseup", function () {

    if (!lampDragging) return;

    lampDragging = false;
    lamp.classList.remove("dragging");

    const wire = lamp.querySelector(".lamp-wire");
    wire.style.height = "";
    lamp.style.transform = "";

    if (lampPullDistance >= LAMP_THRESHOLD) {

        themeButton.click();

    }

    lampPullDistance = 0;

});
