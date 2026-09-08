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

    if (
        audioCtx.state === "suspended"
    ) {

        audioCtx.resume();

    }

}



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

    osc.frequency.value = freq;


    gain.gain.setValueAtTime(
        volume,
        audioCtx.currentTime
    );


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
        audioCtx.currentTime + duration
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


    tone(
        frequency,
        duration * .85,
        .045,
        "sine"
    );


    setTimeout(() => {

        if (!musicPlaying)
            return;


        tone(
            frequency * 1.5,
            duration * .45,
            .012,
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


let letterMusicPlaying =
    false;

let letterMusicTimer =
    null;

let letterMusicStep =
    0;



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
        note[1] * .85,
        .025,
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


                tone(
                    500,
                    .06,
                    .035
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
            .08,
            .04
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

        tone(
            523.25,
            .12,
            .07
        );


        setTimeout(() => {

            tone(
                659.25,
                .12,
                .07
            );

        }, 100);


        setTimeout(() => {

            tone(
                783.99,
                .20,
                .07
            );

        }, 200);


        setTimeout(() => {

            enteredCode = "";

            display.textContent =
                "••••";


            showScreen(
                "giftQuestion"
            );

        }, 500);


    } else {

        tone(
            180,
            .15,
            .06,
            "square"
        );


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
            .12,
            .06
        );


        setTimeout(() => {

            tone(
                659.25,
                .16,
                .06
            );

        }, 100);


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
        .06,
        .025
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


        tone(
            261.63,
            .12,
            .07
        );


        setTimeout(() => {

            tone(
                329.63,
                .12,
                .07
            );

        }, 100);


        setTimeout(() => {

            tone(
                392,
                .15,
                .07
            );

        }, 200);


        setTimeout(() => {

            tone(
                523.25,
                .25,
                .07
            );

        }, 300);


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



// Manual

skipButton.addEventListener(
    "click",
    () => {

        initAudio();

        extinguishCandles();

    }
);



// Microphone

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



    // Flames

    document
        .querySelectorAll(".flame")
        .forEach(flame => {

            flame.classList.add(
                "blown"
            );

        });



    // Wind

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
    // 💨 WHOOSH SOUND
    // ======================================

    initAudio();


    const osc =
        audioCtx.createOscillator();


    const gain =
        audioCtx.createGain();


    osc.type =
        "sawtooth";


    osc.frequency.setValueAtTime(
        500,
        audioCtx.currentTime
    );


    osc.frequency.exponentialRampToValueAtTime(
        70,
        audioCtx.currentTime + .45
    );


    gain.gain.setValueAtTime(
        .055,
        audioCtx.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        .001,
        audioCtx.currentTime + .45
    );


    osc.connect(gain);

    gain.connect(
        audioCtx.destination
    );


    osc.start();


    osc.stop(
        audioCtx.currentTime + .45
    );



    // ======================================
    // ✨ SPARKLES
    // ======================================

    setTimeout(() => {

        tone(
            880,
            .12,
            .06
        );

    }, 400);


    setTimeout(() => {

        tone(
            1046.50,
            .15,
            .06
        );

    }, 520);


    setTimeout(() => {

        tone(
            1318.51,
            .25,
            .06
        );

    }, 650);



    // Confetti

    createConfetti();



    // Letter

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


        tone(
            523.25,
            .12,
            .06
        );


        setTimeout(() => {

            tone(
                659.25,
                .15,
                .06
            );

        }, 100);


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



        // Reset box

        box.classList.remove(
            "open"
        );



        // Reset microphone text

        micStatus.textContent =
            "";



        showScreen(
            "lock"
        );

    }
);