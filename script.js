
// ==========================================
// AARAV & ANANYA — WEDDING INVITATION
// ==========================================


// ==========================================
// 1. AUTOMATIC BOW OPENING
// ==========================================

const bowScreen = document.getElementById("bowScreen");
const invitationSite = document.getElementById("invitationSite");
const invitationReveal = document.getElementById("invitationReveal");

let openingStarted = false;


function openInvitation() {
    setTimeout(() => {
        bowScreen.classList.add("untying");

        setTimeout(() => {
            bowScreen.classList.add("screen-closing");

            setTimeout(() => {
                bowScreen.style.display = "none";
                invitationSite.classList.add("site-visible");
                invitationReveal.classList.add("revealed");
                window.scrollTo(0, 0);
            }, 500);

        }, 1200);

    }, 1000);
}


// ==========================================
// 2. SCRATCH-TO-REVEAL DATE CARD
// ==========================================

const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");
const scratchHint = document.getElementById("scratchHint");

let scratching = false;
let scratchComplete = false;
let strokes = 0;

function setupScratchCard() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(1, window.devicePixelRatio || 1);

    if (rect.width === 0 || rect.height === 0) return;

    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);

    // Draw using CSS pixel coordinates on high-density screens.
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.globalCompositeOperation = "source-over";

    // Luxurious plum and rose scratch coating.
    const gradient = ctx.createLinearGradient(
        0, 0, rect.width, rect.height
    );

    gradient.addColorStop(0, "#291629");
    gradient.addColorStop(0.45, "#704362");
    gradient.addColorStop(1, "#a85f7e");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Main scratch instruction.
    ctx.fillStyle = "#fff3e8";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "500 11px Montserrat, sans-serif";

    ctx.fillText(
        "SCRATCH TO REVEAL",
        rect.width / 2,
        rect.height / 2 - 13
    );

    // Decorative symbols.
    ctx.font = "25px Georgia, serif";
    ctx.fillStyle = "#f0d9a9";

    ctx.fillText(
        "✧  ♡  ✧",
        rect.width / 2,
        rect.height / 2 + 20
    );

    // Fine inner gold border.
    ctx.strokeStyle = "rgba(240, 217, 169, 0.8)";
    ctx.lineWidth = 1;
    ctx.strokeRect(
        9,
        9,
        rect.width - 18,
        rect.height - 18
    );
}

function scratchAt(event) {
    if (!scratching || scratchComplete) return;

    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    strokes++;
}

function checkScratch() {
    if (scratchComplete || strokes < 8) return;

    const image = ctx.getImageData(
        0, 0, canvas.width, canvas.height
    );

    let transparent = 0;
    let sampled = 0;

    // Sample the canvas to estimate the scratched area.
    for (let i = 3; i < image.data.length; i += 64) {
        sampled++;

        if (image.data[i] < 30) {
            transparent++;
        }
    }

    // Reveal the complete date when enough has been scratched.
    if (sampled > 0 && transparent / sampled > 0.42) {
        scratchComplete = true;
        scratching = false;

        canvas.classList.add("scratch-complete");

        // Remove the overlay after its fade animation.
        window.setTimeout(() => {
            canvas.style.display = "none";
        }, 600);

        scratchHint.textContent =
            "The date is revealed! See you on our special day. ♡";
    }
}

canvas.addEventListener("pointerdown", (event) => {
    if (scratchComplete) return;

    event.preventDefault();

    scratching = true;
    strokes = 0;

    if (canvas.setPointerCapture) {
        canvas.setPointerCapture(event.pointerId);
    }

    scratchAt(event);
});

canvas.addEventListener("pointermove", scratchAt);

canvas.addEventListener("pointerup", () => {
    scratching = false;
    checkScratch();
});

canvas.addEventListener("pointercancel", () => {
    scratching = false;
});


// ==========================================
// 3. LIVE WEDDING COUNTDOWN
// ==========================================

// February is month 1 in JavaScript Date.
// The date and time use the visitor's local timezone.
const weddingDate = new Date(2026, 10, 8, 10, 0, 0);

const countdown = document.getElementById("countdown");

function updateCountdown() {
    const difference = weddingDate.getTime() - Date.now();

    if (difference <= 0) {
        countdown.innerHTML =
            '<p class="countdown-finished">Today is our special day! ♥</p>';

        return;
    }

    const days = Math.floor(difference / 86400000);
    const hours = Math.floor(difference / 3600000) % 24;
    const minutes = Math.floor(difference / 60000) % 60;
    const seconds = Math.floor(difference / 1000) % 60;

    document.getElementById("days").textContent =
        String(days).padStart(3, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 1000);


// ==========================================
// 4. RSVP CHOICES
// ==========================================

const rsvpChoices = document.querySelectorAll(".rsvp-choice");
const rsvpMessage = document.getElementById("rsvpMessage");

rsvpChoices.forEach((button) => {
    button.addEventListener("click", () => {

        // Clear the previous selection.
        rsvpChoices.forEach((choice) => {
            choice.classList.remove("selected");
            choice.setAttribute("aria-pressed", "false");
        });

        // Highlight the selected choice.
        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");

        // Display a response for the visitor.
        if (button.dataset.response === "yes") {
            rsvpMessage.textContent =
                "Yay! We're so happy you'll celebrate with us. ♡";
        } else {
            rsvpMessage.textContent =
                "We'll miss you! Sending love and warm wishes. ♡";
        }
    });
});


// ==========================================
// 5. INITIALIZE THE PAGE
// ==========================================

function initializeInvitation() {
    setupScratchCard();
    openInvitation();
}

if (document.readyState === "complete") {
    initializeInvitation();
} else {
    window.addEventListener("load", initializeInvitation, {
        once: true
    });
}
