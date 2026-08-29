const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


// ===============================
// NHÂN VẬT
// ===============================

const player = {
    x: 0,
    y: 0,
    size: 16,
    speed: 4,
    health: 100,
    hunger: 100,
    wood: 0,
    stone: 0
};

const keys = {};

document.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});


// ===============================
// THẾ GIỚI CHIA THEO CHUNK
// ===============================

// Mỗi chunk là một khu vực 400 x 400
const chunkSize = 400;

// Lưu những chunk đã tạo
const chunks = new Map();


// Hàm tạo số ngẫu nhiên giống nhau
// cùng một vị trí luôn tạo ra cùng thế giới
function randomFromSeed(x, y, seed = 1) {
    const number =
        Math.sin(
            x * 12.9898 +
            y * 78.233 +
            seed * 37.719
        ) * 43758.5453;

    return number - Math.floor(number);
}


// ===============================
// TẠO MỘT CHUNK TỰ NHIÊN
// ===============================

function generateChunk(chunkX, chunkY) {

    const key = chunkX + "," + chunkY;

    if (chunks.has(key)) {
        return chunks.get(key);
    }

    const chunk = {
        trees: [],
        rocks: [],
        coal: [],
        iron: [],
        gold: [],
        water: [],
        grass: []
    };

    // Vị trí thật của chunk
    const startX = chunkX * chunkSize;
    const startY = chunkY * chunkSize;


    // -------------------------------
    // ĐỊA HÌNH CỎ
    // -------------------------------

    for (let i = 0; i < 100; i++) {

        const x =
            startX +
            randomFromSeed(
                i,
                chunkX * 100 + chunkY,
                1
            ) * chunkSize;

        const y =
            startY +
            randomFromSeed(
                i,
                chunkX * 200 + chunkY,
                2
            ) * chunkSize;

        chunk.grass.push({
            x: x,
            y: y
        });
    }


    // -------------------------------
    // CÂY NGẪU NHIÊN
    // -------------------------------

    // Có vùng rừng rất dày
    const forestLevel =
        randomFromSeed(chunkX, chunkY, 10);

    let treeCount;

    if (forestLevel > 0.75) {
        treeCount = 90;
    } else if (forestLevel > 0.5) {
        treeCount = 50;
    } else {
        treeCount = 20;
    }

    for (let i = 0; i < treeCount; i++) {

        const x =
            startX +
            randomFromSeed(
                i,
                chunkX,
                chunkY + 20
            ) * chunkSize;

        const y =
            startY +
            randomFromSeed(
                i,
                chunkY,
                chunkX + 30
            ) * chunkSize;

        const size =
            20 +
            randomFromSeed(
                i,
                chunkX + chunkY,
                40
            ) * 16;

        chunk.trees.push({
            x: x,
            y: y,
            size: size
        });
    }


    // -------------------------------
    // ĐÁ
    // -------------------------------

    const rockCount =
        10 +
        Math.floor(
            randomFromSeed(chunkX, chunkY, 50) * 30
        );

    for (let i = 0; i < rockCount; i++) {

        const x =
            startX +
            randomFromSeed(
                i,
                chunkX + 50,
                chunkY
            ) * chunkSize;

        const y =
            startY +
            randomFromSeed(
                i,
                chunkY + 70,
                chunkX
            ) * chunkSize;

        chunk.rocks.push({
            x: x,
            y: y,
            size: 12 + Math.random() * 12
        });
    }


    // -------------------------------
    // THAN
    // -------------------------------

    const coalCount =
        Math.floor(
            randomFromSeed(chunkX, chunkY, 70) * 12
        );

    for (let i = 0; i < coalCount; i++) {

        chunk.coal.push({
            x:
                startX +
                randomFromSeed(
                    i,
                    chunkX + 90,
                    chunkY
                ) * chunkSize,

            y:
                startY +
                randomFromSeed(
                    i,
                    chunkY + 100,
                    chunkX
                ) * chunkSize
        });
    }


    // -------------------------------
    // SẮT
    // -------------------------------

    const ironCount =
        Math.floor(
            randomFromSeed(chunkX, chunkY, 80) * 8
        );

    for (let i = 0; i < ironCount; i++) {

        chunk.iron.push({
            x:
                startX +
                randomFromSeed(
                    i,
                    chunkX + 120,
                    chunkY
                ) * chunkSize,

            y:
                startY +
                randomFromSeed(
                    i,
                    chunkY + 130,
                    chunkX
                ) * chunkSize
        });
    }


    // -------------------------------
    // VÀNG - HIẾM
    // -------------------------------

    if (
        randomFromSeed(
            chunkX,
            chunkY,
            200
        ) > 0.7
    ) {

        const goldCount =
            1 +
            Math.floor(
                randomFromSeed(
                    chunkX,
                    chunkY,
                    210
                ) * 4
            );

        for (let i = 0; i < goldCount; i++) {

            chunk.gold.push({
                x:
                    startX +
                    randomFromSeed(
                        i,
                        chunkX + 220,
                        chunkY
                    ) * chunkSize,

                y:
                    startY +
                    randomFromSeed(
                        i,
                        chunkY + 230,
                        chunkX
                    ) * chunkSize
            });
        }
    }


    // -------------------------------
    // HỒ NƯỚC NGẪU NHIÊN
    // -------------------------------

    if (
        randomFromSeed(
            chunkX,
            chunkY,
            300
        ) > 0.72
    ) {

        const waterX =
            startX +
            randomFromSeed(
                chunkX,
                chunkY,
                301
            ) * chunkSize;

        const waterY =
            startY +
            randomFromSeed(
                chunkX,
                chunkY,
                302
            ) * chunkSize;

        chunk.water.push({
            x: waterX,
            y: waterY,

            width:
                50 +
                randomFromSeed(
                    chunkX,
                    chunkY,
                    303
                ) * 120,

            height:
                30 +
                randomFromSeed(
                    chunkX,
                    chunkY,
                    304
                ) * 80
        });
    }


    chunks.set(key, chunk);

    return chunk;
}


// ===============================
// VẼ CỎ
// ===============================

function drawGrass(chunk) {

    for (const grass of chunk.grass) {

        ctx.fillStyle = "#3d8a36";

        ctx.fillRect(
            grass.x - player.x + canvas.width / 2,
            grass.y - player.y + canvas.height / 2,
            2,
            5
        );
    }
}


// ===============================
// VẼ HỒ
// ===============================

function drawWater(chunk) {

    for (const water of chunk.water) {

        const x =
            water.x -
            player.x +
            canvas.width / 2;

        const y =
            water.y -
            player.y +
            canvas.height / 2;

        ctx.fillStyle = "#2496d3";

        ctx.beginPath();

        ctx.ellipse(
            x,
            y,
            water.width,
            water.height,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle = "#5bc0eb";
        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.ellipse(
            x,
            y,
            water.width,
            water.height,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }
}


// ===============================
// VẼ CÂY
// ===============================

function drawTrees(chunk) {

    for (const tree of chunk.trees) {

        const x =
            tree.x -
            player.x +
            canvas.width / 2;

        const y =
            tree.y -
            player.y +
            canvas.height / 2;


        // Thân
        ctx.fillStyle = "#704214";

        ctx.fillRect(
            x - 5,
            y,
            10,
            tree.size
        );


        // Tán cây
        ctx.fillStyle = "#176b2c";

        ctx.beginPath();

        ctx.arc(
            x,
            y - tree.size / 2,
            tree.size,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Lá sáng
        ctx.fillStyle = "#25833a";

        ctx.beginPath();

        ctx.arc(
            x - tree.size / 3,
            y - tree.size / 2,
            tree.size * 0.6,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


// ===============================
// VẼ ĐÁ
// ===============================

function drawRocks(chunk) {

    for (const rock of chunk.rocks) {

        const x =
            rock.x -
            player.x +
            canvas.width / 2;

        const y =
            rock.y -
            player.y +
            canvas.height / 2;

        ctx.fillStyle = "#666";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            rock.size,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle = "#999";

        ctx.beginPath();

        ctx.arc(
            x - rock.size / 3,
            y - rock.size / 3,
            rock.size / 3,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


// ===============================
// VẼ KHOÁNG SẢN
// ===============================

function drawMineral(
    minerals,
    color,
    size = 10
) {

    for (const mineral of minerals) {

        const x =
            mineral.x -
            player.x +
            canvas.width / 2;

        const y =
            mineral.y -
            player.y +
            canvas.height / 2;

        ctx.fillStyle = color;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


// ===============================
// VẼ THẾ GIỚI
// ===============================

function drawWorld() {

    // Nền cỏ vô tận
    ctx.fillStyle = "#4d963f";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    const currentChunkX =
        Math.floor(player.x / chunkSize);

    const currentChunkY =
        Math.floor(player.y / chunkSize);


    // Tạo và vẽ 9 chunk xung quanh
    // Đi sang vùng mới sẽ tự sinh thêm
    for (
        let y = currentChunkY - 2;
        y <= currentChunkY + 2;
        y++
    ) {

        for (
            let x = currentChunkX - 2;
            x <= currentChunkX + 2;
            x++
        ) {

            const chunk =
                generateChunk(x, y);

            drawGrass(chunk);
            drawWater(chunk);
            drawTrees(chunk);
            drawRocks(chunk);

            drawMineral(
                chunk.coal,
                "#222",
                8
            );

            drawMineral(
                chunk.iron,
                "#a65d36",
                8
            );

            drawMineral(
                chunk.gold,
                "#ffd60a",
                8
            );
        }
    }
}


// ===============================
// DI CHUYỂN
// ===============================

function updatePlayer() {

    let dx = 0;
    let dy = 0;

    if (keys["w"]) dy -= 1;
    if (keys["s"]) dy += 1;
    if (keys["a"]) dx -= 1;
    if (keys["d"]) dx += 1;


    // Di chuyển chéo không nhanh hơn
    if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
    }

    player.x += dx * player.speed;
    player.y += dy * player.speed;
}


// ===============================
// VẼ NGƯỜI CHƠI
// ===============================

function drawPlayer() {

    const x = canvas.width / 2;
    const y = canvas.height / 2;


    // Bóng
    ctx.fillStyle = "rgba(0,0,0,0.25)";

    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 16,
        18,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Nhân vật
    ctx.fillStyle = "#e74c3c";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        player.size,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Mắt
    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
        x - 6,
        y - 3,
        4,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 6,
        y - 3,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle = "black";

    ctx.beginPath();

    ctx.arc(
        x - 6,
        y - 3,
        2,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 6,
        y - 3,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// ===============================
// THÔNG SỐ
// ===============================

function updateStats() {

    document.getElementById("health").textContent =
        Math.floor(player.health);

    document.getElementById("hunger").textContent =
        Math.floor(player.hunger);

    document.getElementById("wood").textContent =
        player.wood;

    document.getElementById("stone").textContent =
        player.stone;
}


// ===============================
// GAME LOOP
// ===============================

function gameLoop() {

    updatePlayer();

    drawWorld();

    drawPlayer();

    updateStats();

    requestAnimationFrame(gameLoop);
}

gameLoop();
