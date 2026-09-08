// ==========================================
// MIMU BIRTHDAY SURPRISE 🎂💙
// ==========================================

const PASS = "1009";

let enteredCode = "";
let audioCtx = null;
let candlesBlown = false;

let musicPlaying = false;
let musicTimer = null;
let musicStep = 0;


// ==========================================
// 🔊 SOUND ENGINE
// ==========================================

function initAudio() {

    if (!audioCtx) {

        audioCtx =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

    if (audioCtx.state === "suspended") {

        audioCtx.resume();

    }

}


// ==========================================
// 🎵 MAIN TONE FUNCTION
// ==========================================

function tone(
    freq,
    duration = 0.15,
    volume = 0.06,
    type = "sine"
) {

    initAudio();

    const osc =
        audioCtx.createOscillator();

    const gain =
        audioCtx.createGain();


    osc.type = type;

    osc.frequency.setValueAtTime(
        freq,
        audioCtx.currentTime
    );


    // Smooth attack
    gain.gain.setValueAtTime(
        0.001,
        audioCtx.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        volume,
        audioCtx.currentTime + 0.025
    );


    // Smooth fade out
    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration
    );


    osc.connect(gain);

    gain.connect(
        audioCtx.destination
    );


    osc.start();


    osc.stop(
        audioCtx.currentTime +
        duration +
        0.03
    );

}


// ==========================================
// 🎵 BIRTHDAY MUSIC
// ==========================================

const birthdayMelody = [

    [392, .25],
    [392, .25],
    [440, .45],
    [392, .45],
    [523.25, .45],
    [494, .80],

    [392, .25],
    [392, .25],
    [440, .45],
    [392, .45],
    [587.33, .45],
    [523.25, .80],

    [392, .25],
    [392, .25],
    [783.99, .45],
    [659.25, .45],
    [523.25, .45],
    [494, .45],
    [440, .80],

    [698.46, .25],
    [698.46, .25],
    [659.25, .45],
    [523.25, .45],
    [587.33, .45],
    [523.25, .90]

];


function playBirthdayMusic() {

    if (musicPlaying)
        return;


    initAudio();

    musicPlaying = true;

    musicStep = 0;

    playNextBirthdayNote();

}


function playNextBirthdayNote() {

    if (!musicPlaying)
        return;


    const note =
        birthdayMelody[musicStep];


    if (!note) {

        musicStep = 0;

        playNextBirthdayNote();

        return;

    }


    const frequency =
        note[0];

    const duration =
        note[1];


    // Main note
    tone(
        frequency,
        duration * .90,
        .065,
        "sine"
    );


    // Soft harmony
    setTimeout(() => {

        if (!musicPlaying)
            return;


        tone(
            frequency * 1.5,
            duration * .45,
            .018,
            "sine"
        );

    }, duration * 300);


    musicStep++;


    musicTimer =
        setTimeout(
            playNextBirthdayNote,
            duration * 1000 + 80
        );

}


function stopBirthdayMusic() {

    musicPlaying = false;


    if (musicTimer) {

        clearTimeout(
            musicTimer
        );

        musicTimer = null;

    }

}


// ==========================================
// 💌 LETTER MUSIC
// ==========================================

const letterMelody = [

    [261.63, .45],
    [329.63, .45],
    [392, .65],

    [349.23, .45],
    [329.63, .45],
    [293.66, .65],

    [261.63, .45],
    [293.66, .45],
    [329.63, .65],

    [392, .45],
    [349.23, .45],
    [329.63, .85]

];


let letterMusicPlaying = false;

let letterMusicTimer = null;

let letterMusicStep = 0;


function playLetterMusic() {

    stopBirthdayMusic();


    if (letterMusicPlaying)
        return;


    initAudio();

    letterMusicPlaying = true;

    letterMusicStep = 0;

    playNextLetterNote();

}


function playNextLetterNote() {

    if (!letterMusicPlaying)
        return;


    const note =
        letterMelody[
            letterMusicStep
        ];


    if (!note) {

        letterMusicStep = 0;

        playNextLetterNote();

        return;

    }


    tone(
        note[0],
        note[1] * .90,
        .040,
        "sine"
    );


    letterMusicStep++;


    letterMusicTimer =
        setTimeout(
            playNextLetterNote,
            note[1] * 1000 + 150
        );

}


function stopLetterMusic() {

    letterMusicPlaying = false;


    if (letterMusicTimer) {

        clearTimeout(
            letterMusicTimer
        );

        letterMusicTimer = null;

    }

}


// ==========================================
// 🖥️ SCREEN CHANGE
// ==========================================

function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove(
                "active"
            );

        });


    document
        .getElementById(id)
        .classList.add(
            "active"
        );

}


// ==========================================
// 🔐 PASSCODE
// ==========================================

const display =
    document.getElementById(
        "display"
    );


const wrong =
    document.getElementById(
        "wrong"
    );


const numberButtons =
    document.querySelectorAll(
        "[data-n]"
    );


const clearButton =
    document.getElementById(
        "clear"
    );


numberButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                initAudio();


                if (
                    enteredCode.length >= 4
                )
                    return;


                enteredCode +=
                    button.dataset.n;


                display.textContent =
                    "•".repeat(
                        enteredCode.length
                    ) +
                    "•".repeat(
                        4 -
                        enteredCode.length
                    );


                // 🔢 Longer key sound
                tone(
                    500,
                    .12,
                    .045
                );


                wrong.textContent =
                    "";


                if (
                    enteredCode.length === 4
                ) {

                    setTimeout(
                        checkPassword,
                        250
                    );

                }

            }
        );

    }
);


// ==========================================
// ⌫ CLEAR
// ==========================================

clearButton.addEventListener(
    "click",
    () => {

        initAudio();


        enteredCode = "";


        display.textContent =
            "••••";


        wrong.textContent =
            "";


        tone(
            300,
            .14,
            .045
        );

    }
);


// ==========================================
// 🔑 CHECK PASSWORD
// ==========================================

function checkPassword() {

    if (
        enteredCode === PASS
    ) {

        // 🔓 Success sound

        tone(
            523.25,
            .25,
            .075
        );


        setTimeout(() => {

            tone(
                659.25,
                .25,
                .075
            );

        }, 150);


        setTimeout(() => {

            tone(
                783.99,
                .40,
                .085
            );

        }, 300);


        setTimeout(() => {

            enteredCode = "";

            display.textContent =
                "••••";


            showScreen(
                "giftQuestion"
            );

        }, 650);


    } else {

        // ❌ Wrong password

        tone(
            180,
            .35,
            .065,
            "square"
        );


        setTimeout(() => {

            tone(
                140,
                .25,
                .035,
                "square"
            );

        }, 120);


        wrong.textContent =
            "Oops! Wrong passcode 😅 Try again!";


        enteredCode = "";

        display.textContent =
            "••••";

    }

}


// ==========================================
// 💙 YES / NO
// ==========================================

const yesButton =
    document.getElementById(
        "yes"
    );


const noButton =
    document.getElementById(
        "no"
    );


yesButton.addEventListener(
    "click",
    () => {

        initAudio();


        tone(
            523.25,
            .25,
            .065
        );


        setTimeout(() => {

            tone(
                659.25,
                .35,
                .075
            );

        }, 150);


        setTimeout(() => {

            tone(
                783.99,
                .45,
                .075
            );

        }, 320);


        showScreen(
            "giftOpen"
        );

    }
);


// ==========================================
// 😈 NO BUTTON ESCAPES
// ==========================================

function moveNoButton() {

    const x =
        Math.random() * 160 - 80;


    const y =
        Math.random() * 100 - 50;


    noButton.style.transform =
        `translate(${x}px, ${y}px)`;


    tone(
        250,
        .12,
        .03
    );

}


noButton.addEventListener(
    "mouseenter",
    moveNoButton
);


noButton.addEventListener(
    "touchstart",
    e => {

        e.preventDefault();

        moveNoButton();

    }
);


// ==========================================
// 🎁 OPEN GIFT
// ==========================================

const openGiftButton =
    document.getElementById(
        "openGift"
    );


const box =
    document.getElementById(
        "box"
    );


openGiftButton.addEventListener(
    "click",
    () => {

        initAudio();


        // 🎁 Magical opening melody

        tone(
            261.63,
            .25,
            .075
        );


        setTimeout(() => {

            tone(
                329.63,
                .25,
                .075
            );

        }, 180);


        setTimeout(() => {

            tone(
                392,
                .30,
                .075
            );

        }, 360);


        setTimeout(() => {

            tone(
                523.25,
                .50,
                .085
            );

        }, 540);


        // ✨ High sparkle

        setTimeout(() => {

            tone(
                783.99,
                .35,
                .040
            );

        }, 700);


        box.classList.add(
            "open"
        );


        setTimeout(() => {

            showScreen(
                "cakeScreen"
            );


            playBirthdayMusic();

        }, 900);

    }
);


// ==========================================
// 🕯️ CANDLE
// ==========================================

const blowButton =
    document.getElementById(
        "blow"
    );


const skipButton =
    document.getElementById(
        "skipBlow"
    );


const micStatus =
    document.getElementById(
        "micStatus"
    );


// ==========================================
// MANUAL BLOW
// ==========================================

skipButton.addEventListener(
    "click",
    () => {

        initAudio();

        extinguishCandles();

    }
);


// ==========================================
// MICROPHONE BUTTON
// ==========================================

blowButton.addEventListener(
    "click",
    () => {

        initAudio();

        startMicrophone();

    }
);


// ==========================================
// 🎤 MICROPHONE
// ==========================================

async function startMicrophone() {

    if (candlesBlown)
        return;


    try {

        const stream =
            await navigator.mediaDevices
                .getUserMedia({
                    audio: true
                });


        micStatus.textContent =
            "🎤 Microphone ready! এবার ফুঁ দাও... 💨";


        const analyser =
            audioCtx.createAnalyser();


        analyser.fftSize =
            512;


        const microphone =
            audioCtx
                .createMediaStreamSource(
                    stream
                );


        microphone.connect(
            analyser
        );


        const data =
            new Uint8Array(
                analyser.fftSize
            );


        function detectBlow() {

            if (candlesBlown) {

                stream
                    .getTracks()
                    .forEach(
                        track =>
                            track.stop()
                    );

                return;

            }


            analyser.getByteTimeDomainData(
                data
            );


            let sum = 0;


            for (
                let i = 0;
                i < data.length;
                i++
            ) {

                const value =
                    (
                        data[i] - 128
                    ) / 128;


                sum +=
                    value * value;

            }


            const volume =
                Math.sqrt(
                    sum /
                    data.length
                );


            if (
                volume > .12
            ) {

                extinguishCandles();


                stream
                    .getTracks()
                    .forEach(
                        track =>
                            track.stop()
                    );


                return;

            }


            requestAnimationFrame(
                detectBlow
            );

        }


        detectBlow();


    } catch (error) {

        micStatus.textContent =
            "Microphone permission পাওয়া যায়নি 😅 নিচের button চাপো।";

    }

}


// ==========================================
// 💨 EXTINGUISH CANDLES
// ==========================================

function extinguishCandles() {

    if (candlesBlown)
        return;


    candlesBlown = true;


    stopBirthdayMusic();


    // ======================================
    // 🔥 FLAMES
    // ======================================

    document
        .querySelectorAll(".flame")
        .forEach(flame => {

            flame.classList.add(
                "blown"
            );

        });


    // ======================================
    // 💨 WIND ANIMATION
    // ======================================

    const wind =
        document.getElementById(
            "wind"
        );


    if (wind) {

        wind.classList.remove(
            "show"
        );


        void wind.offsetWidth;


        wind.classList.add(
            "show"
        );

    }


    // ======================================
    // 💨 LONG WHOOSH SOUND
    // ======================================

    initAudio();


    const osc =
        audioCtx.createOscillator();


    const gain =
        audioCtx.createGain();


    osc.type =
        "sawtooth";


    // High → Low

    osc.frequency.setValueAtTime(
        650,
        audioCtx.currentTime
    );


    osc.frequency.exponentialRampToValueAtTime(
        55,
        audioCtx.currentTime + .95
    );


    // Smooth volume

    gain.gain.setValueAtTime(
        0.001,
        audioCtx.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        .075,
        audioCtx.currentTime + .08
    );


    gain.gain.exponentialRampToValueAtTime(
        .001,
        audioCtx.currentTime + .95
    );


    osc.connect(gain);

    gain.connect(
        audioCtx.destination
    );


    osc.start();


    osc.stop(
        audioCtx.currentTime + 1.0
    );


    // ======================================
    // ✨ SPARKLES
    // ======================================

    setTimeout(() => {

        tone(
            880,
            .25,
            .065
        );

    }, 550);


    setTimeout(() => {

        tone(
            1046.50,
            .30,
            .065
        );

    }, 720);


    setTimeout(() => {

        tone(
            1318.51,
            .45,
            .070
        );

    }, 920);


    // ======================================
    // 🎉 CONFETTI
    // ======================================

    createConfetti();


    // ======================================
    // 💌 LETTER
    // ======================================

    setTimeout(() => {

        showScreen(
            "messageScreen"
        );


        playLetterMusic();

    }, 1600);

}


// ==========================================
// 🎉 CONFETTI
// ==========================================

const canvas =
    document.getElementById(
        "confettiCanvas"
    );


const ctx =
    canvas.getContext(
        "2d"
    );


function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}


resizeCanvas();


window.addEventListener(
    "resize",
    resizeCanvas
);


function createConfetti() {

    const pieces = [];


    for (
        let i = 0;
        i < 150;
        i++
    ) {

        pieces.push({

            x:
                Math.random() *
                canvas.width,

            y: -20,

            size:
                Math.random() *
                8 + 4,

            speed:
                Math.random() *
                4 + 2,

            rotation:
                Math.random() *
                360,

            rotationSpeed:
                Math.random() *
                8 - 4,

            hue:
                Math.random() *
                360

        });

    }


    function animate() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        pieces.forEach(
            piece => {

                piece.y +=
                    piece.speed;


                piece.rotation +=
                    piece.rotationSpeed;


                ctx.save();


                ctx.translate(
                    piece.x,
                    piece.y
                );


                ctx.rotate(
                    piece.rotation *
                    Math.PI / 180
                );


                ctx.fillStyle =
                    `hsl(
                        ${piece.hue},
                        80%,
                        65%
                    )`;


                ctx.fillRect(
                    -piece.size / 2,
                    -piece.size / 2,
                    piece.size,
                    piece.size
                );


                ctx.restore();

            }
        );


        if (
            pieces.some(
                piece =>
                    piece.y <
                    canvas.height + 30
            )
        ) {

            requestAnimationFrame(
                animate
            );

        } else {

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

        }

    }


    animate();

}


// ==========================================
// 🔄 REPLAY
// ==========================================

const replayButton =
    document.getElementById(
        "replay"
    );


replayButton.addEventListener(
    "click",
    () => {

        initAudio();


        stopBirthdayMusic();

        stopLetterMusic();


        // Replay sound

        tone(
            523.25,
            .25,
            .065
        );


        setTimeout(() => {

            tone(
                659.25,
                .30,
                .075
            );

        }, 150);


        setTimeout(() => {

            tone(
                783.99,
                .40,
                .075
            );

        }, 300);


        candlesBlown = false;


        // Reset flames

        document
            .querySelectorAll(".flame")
            .forEach(flame => {

                flame.classList.remove(
                    "blown"
                );

            });


        // Reset wind

        const wind =
            document.getElementById(
                "wind"
            );


        if (wind) {

            wind.classList.remove(
                "show"
            );

        }


        // Reset code

        enteredCode = "";


        display.textContent =
            "••••";


        wrong.textContent =
            "";


        // Reset no button

        noButton.style.transform =
            "translate(0, 0)";


        // Reset gift

        box.classList.remove(
            "open"
        );


        // Reset microphone

        micStatus.textContent =
            "";


        // Go back

        showScreen(
            "lock"
        );

    }
);