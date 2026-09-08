/* =========================
   SCREEN CONTROL
========================= */

const screens =
    document.querySelectorAll(".screen");


function show(id) {

    screens.forEach(screen => {

        screen.classList.remove("active");

    });

    document
        .getElementById(id)
        .classList.add("active");
}


/* =========================
   PASSCODE
========================= */

/*
   Mimu's birthdate:

   10-09-2009

   Passcode:
   1009
*/

let code = "";

const PASS = "1009";


document
    .querySelectorAll("[data-n]")
    .forEach(button => {

        button.onclick = () => {

            if (code.length < 4) {

                code += button.dataset.n;


                document
                    .getElementById("display")
                    .textContent =
                    "•".repeat(code.length);


                if (code.length === 4) {

                    setTimeout(() => {

                        if (code === PASS) {

                            show("giftQuestion");

                        } else {

                            document
                                .getElementById("wrong")
                                .textContent =
                                "Wrong passcode 😅";


                            code = "";


                            setTimeout(() => {

                                document
                                    .getElementById("display")
                                    .textContent =
                                    "••••";

                            }, 300);

                        }

                    }, 250);

                }

            }

        };

    });


/* Clear */

document
    .getElementById("clear")
    .onclick = () => {

        code = "";

        document
            .getElementById("display")
            .textContent =
            "••••";

        document
            .getElementById("wrong")
            .textContent = "";
    };


/* =========================
   YES / NO
========================= */

const noButton =
    document.getElementById("no");


function moveNoButton() {

    noButton.style.transform =

        `translate(
            ${Math.random() * 160 - 80}px,
            ${Math.random() * 100 - 50}px
        )`;
}


noButton.onmouseenter =
    moveNoButton;


noButton.ontouchstart =
    moveNoButton;


/* YES */

document
    .getElementById("yes")
    .onclick = () => {

        show("giftOpen");

    };


/* =========================
   GIFT
========================= */

document
    .getElementById("openGift")
    .onclick = () => {

        document
            .getElementById("box")
            .classList.add("open");


        setTimeout(() => {

            show("cakeScreen");

        }, 1000);

    };


/* =========================
   CANDLES
========================= */

const flames =
    [
        ...document
            .querySelectorAll(".flame")
    ];


let blown = false;


function extinguish() {

    if (blown) return;

    blown = true;


    /* Wind */

    document
        .getElementById("wind")
        .classList
        .add("show");


    /* One by one */

    flames.forEach(
        (flame, index) => {

            setTimeout(() => {

                flame
                    .classList
                    .add("off");

            }, index * 180);

        }
    );


    /* Letter */

    setTimeout(() => {

        show("messageScreen");

        confetti();

    }, 1250);

}


/* =========================
   MICROPHONE
========================= */

document
    .getElementById("blow")
    .onclick = async () => {

        const status =
            document
                .getElementById("micStatus");


        try {

            const stream =
                await navigator
                    .mediaDevices
                    .getUserMedia({
                        audio: true
                    });


            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;


            const ctx =
                new AudioContext();


            const analyser =
                ctx.createAnalyser();


            analyser.fftSize = 512;


            const source =
                ctx.createMediaStreamSource(
                    stream
                );


            source.connect(analyser);


            const data =
                new Uint8Array(
                    analyser.fftSize
                );


            status.textContent =
                "Now blow into the microphone... 💨";


            let start =
                Date.now();


            function listen() {

                analyser
                    .getByteTimeDomainData(
                        data
                    );


                let sum = 0;


                for (let x of data) {

                    let v =
                        (x - 128) / 128;


                    sum +=
                        v * v;

                }


                let volume =
                    Math.sqrt(
                        sum / data.length
                    );


                /*
                   Blow detected
                */

                if (
                    volume > 0.10 ||
                    Date.now() - start > 12000
                ) {

                    stream
                        .getTracks()
                        .forEach(
                            track =>
                                track.stop()
                        );


                    ctx.close();


                    extinguish();

                    return;
                }


                requestAnimationFrame(
                    listen
                );

            }


            listen();


        } catch (error) {

            status.textContent =
                "Microphone permission পাওয়া যায়নি — নিচের button চাপো 💙";

        }

    };


/* =========================
   MIC না চললে
========================= */

document
    .getElementById("skipBlow")
    .onclick =
    extinguish;


/* =========================
   REPLAY
========================= */

document
    .getElementById("replay")
    .onclick = () => {

        location.reload();

    };


/* =========================
   CONFETTI
========================= */

function confetti() {

    const canvas =
        document
            .getElementById(
                "confettiCanvas"
            );


    const ctx =
        canvas.getContext("2d");


    canvas.width =
        innerWidth;

    canvas.height =
        innerHeight;


    let pieces =
        Array.from(
            { length: 120 },
            () => ({

                x:
                    Math.random() *
                    canvas.width,

                y:
                    -20 -
                    Math.random() *
                    canvas.height *
                    0.4,

                size:
                    4 +
                    Math.random() *
                    7,

                velocity:
                    2 +
                    Math.random() *
                    4,

                rotation:
                    Math.random() *
                    6

            })
        );


    function draw() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        pieces.forEach(piece => {

            piece.y +=
                piece.velocity;


            piece.rotation +=
                0.05;


            ctx.save();


            ctx.translate(
                piece.x,
                piece.y
            );


            ctx.rotate(
                piece.rotation
            );


            ctx.fillRect(
                0,
                0,
                piece.size,
                piece.size * 1.7
            );


            ctx.restore();

        });


        if (
            pieces.some(
                piece =>
                    piece.y <
                    canvas.height + 30
            )
        ) {

            requestAnimationFrame(draw);

        }

    }


    draw();

}