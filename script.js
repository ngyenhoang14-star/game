const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 700;

const player = {
    x: 600,
    y: 350,
    size: 18,
    speed: 4,
    health: 100,
    hunger: 100,
    wood: 0,
    stone: 0
};

const keys = {};

document.addEventListener("keydown", function (event) {
    keys[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", function (event) {
    keys[event.key.toLowerCase()] = false;
});

/* CÂY */
const trees = [
    {x: 200, y: 150},
    {x: 280, y: 220},
    {x: 350, y: 130},
    {x: 900, y: 150},
    {x: 1000, y: 230},
    {x: 850, y: 300},
    {x: 180, y: 500},
    {x: 300, y: 550},
    {x: 1000, y: 500},
    {x: 900, y: 600}
];

/* ĐÁ */
const rocks = [
    {x: 450, y: 180},
    {x: 550, y: 130},
    {x: 700, y: 180},
    {x: 400, y: 550},
    {x: 700, y: 550},
    {x: 800, y: 500}
];

/* SINH VẬT */
const animals = [
    {x: 400, y: 350, type: "sheep"},
    {x: 800, y: 400, type: "cow"},
    {x: 650, y: 250, type: "chicken"}
];

function updatePlayer() {
    if (keys["w"] || keys["arrowup"]) {
        player.y -= player.speed;
    }

    if (keys["s"] || keys["arrowdown"]) {
        player.y += player.speed;
    }

    if (keys["a"] || keys["arrowleft"]) {
        player.x -= player.speed;
    }

    if (keys["d"] || keys["arrowright"]) {
        player.x += player.speed;
    }

    /* Không đi ra ngoài bản đồ */
    if (player.x < player.size) {
        player.x = player.size;
    }

    if (player.x > canvas.width - player.size) {
        player.x = canvas.width - player.size;
    }

    if (player.y < player.size) {
        player.y = player.size;
    }

    if (player.y > canvas.height - player.size) {
        player.y = canvas.height - player.size;
    }
}

/* VẼ CỎ */
function drawGround() {
    ctx.fillStyle = "#4d963f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* Chấm cỏ */
    for (let x = 0; x < canvas.width; x += 40) {
        for (let y = 0; y < canvas.height; y += 40) {
            ctx.fillStyle = "#438a37";
            ctx.fillRect(x + 10, y + 15, 2, 5);
            ctx.fillRect(x + 25, y + 5, 2, 5);
        }
    }
}

/* VẼ HỒ NƯỚC */
function drawWater() {
    ctx.fillStyle = "#2498d1";

    ctx.beginPath();
    ctx.ellipse(
        600,
        400,
        150,
        80,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#5fc3f3";

    for (let x = 500; x < 700; x += 40) {
        ctx.fillRect(x, 390, 20, 3);
    }
}

/* VẼ CÂY */
function drawTrees() {
    for (const tree of trees) {

        /* Thân cây */
        ctx.fillStyle = "#704214";
        ctx.fillRect(
            tree.x - 7,
            tree.y,
            14,
            25
        );

        /* Tán cây */
        ctx.fillStyle = "#176b2c";

        ctx.beginPath();
        ctx.arc(
            tree.x,
            tree.y - 12,
            28,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = "#25833a";

        ctx.beginPath();
        ctx.arc(
            tree.x - 12,
            tree.y - 20,
            16,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}

/* VẼ ĐÁ */
function drawRocks() {
    for (const rock of rocks) {

        ctx.fillStyle = "#777";

        ctx.beginPath();

        ctx.arc(
            rock.x,
            rock.y,
            20,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = "#aaa";

        ctx.beginPath();

        ctx.arc(
            rock.x - 6,
            rock.y - 7,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}

/* VẼ SINH VẬT */
function drawAnimals() {
    for (const animal of animals) {

        if (animal.type === "sheep") {
            ctx.fillStyle = "white";
        }

        if (animal.type === "cow") {
            ctx.fillStyle = "#704214";
        }

        if (animal.type === "chicken") {
            ctx.fillStyle = "#f5d142";
        }

        ctx.beginPath();

        ctx.arc(
            animal.x,
            animal.y,
            18,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /* Mắt */
        ctx.fillStyle = "black";

        ctx.beginPath();

        ctx.arc(
            animal.x + 6,
            animal.y - 3,
            3,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}

/* VẼ NHÂN VẬT */
function drawPlayer() {

    /* Bóng */
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";

    ctx.beginPath();
    ctx.ellipse(
        player.x,
        player.y + 17,
        18,
        7,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    /* Người chơi */
    ctx.fillStyle = "#e74c3c";

    ctx.beginPath();
    ctx.arc(
        player.x,
        player.y,
        player.size,
        0,
        Math.PI * 2
    );
    ctx.fill();

    /* Mắt */
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(player.x - 6, player.y - 3, 4, 0, Math.PI * 2);
    ctx.arc(player.x + 6, player.y - 3, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.arc(player.x - 6, player.y - 3, 2, 0, Math.PI * 2);
    ctx.arc(player.x + 6, player.y - 3, 2, 0, Math.PI * 2);
    ctx.fill();
}

/* CẬP NHẬT THÔNG SỐ */
function updateStats() {
    document.getElementById("health").textContent = player.health;
    document.getElementById("hunger").textContent = player.hunger;
    document.getElementById("wood").textContent = player.wood;
    document.getElementById("stone").textContent = player.stone;
}

/* GAME LOOP */
function gameLoop() {

    updatePlayer();

    drawGround();
    drawWater();
    drawTrees();
    drawRocks();
    drawAnimals();
    drawPlayer();

    updateStats();

    requestAnimationFrame(gameLoop);
}

gameLoop();
