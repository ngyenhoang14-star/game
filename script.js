const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


// =====================
// NHÂN VẬT
// =====================

const player = {
    x: 0,
    y: 0,

    speed: 4,

    health: 100,
    energy: 100,

    direction: "down",

    moving: false,

    walkFrame: 0,
    animationTime: 0,

    idleTime: 0
};

const keys = {};

document.addEventListener("keydown", function(event) {
    keys[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", function(event) {
    keys[event.key.toLowerCase()] = false;
});


// =====================
// RANDOM THEO TỌA ĐỘ
// =====================

function random(x, y, seed = 1) {
    const value = Math.sin(
        x * 12.9898 +
        y * 78.233 +
        seed * 37.719
    ) * 43758.5453;

    return value - Math.floor(value);
}


// =====================
// NOISE MỀM
// TẠO CÁC VÙNG TỰ NHIÊN
// =====================

function smoothNoise(x, y, scale, seed) {
    const x0 = Math.floor(x / scale);
    const y0 = Math.floor(y / scale);

    const x1 = x0 + 1;
    const y1 = y0 + 1;

    const tx = (x / scale) - x0;
    const ty = (y / scale) - y0;

    const a = random(x0, y0, seed);
    const b = random(x1, y0, seed);
    const c = random(x0, y1, seed);
    const d = random(x1, y1, seed);

    const top = a + (b - a) * tx;
    const bottom = c + (d - c) * tx;

    return top + (bottom - top) * ty;
}


// =====================
// XÁC ĐỊNH BIOME
// =====================

function getBiome(worldX, worldY) {

    const value = smoothNoise(
        worldX,
        worldY,
        900,
        10
    );

    if (value > 0.67) {
        return "forest";
    }

    if (value > 0.48) {
        return "grassland";
    }

    if (value > 0.30) {
        return "rocky";
    }

    return "meadow";
}


// =====================
// DI CHUYỂN
// =====================

function updatePlayer() {

    let moveX = 0;
    let moveY = 0;

    if (keys["w"]) {
        moveY -= 1;
        player.direction = "up";
    }

    if (keys["s"]) {
        moveY += 1;
        player.direction = "down";
    }

    if (keys["a"]) {
        moveX -= 1;
        player.direction = "left";
    }

    if (keys["d"]) {
        moveX += 1;
        player.direction = "right";
    }


    // KIỂM TRA CÓ ĐANG DI CHUYỂN KHÔNG

    player.moving =
        moveX !== 0 ||
        moveY !== 0;


    // ĐI CHÉO KHÔNG NHANH HƠN

    if (moveX !== 0 && moveY !== 0) {
        moveX *= 0.707;
        moveY *= 0.707;
    }


    // DI CHUYỂN

    player.x += moveX * player.speed;
    player.y += moveY * player.speed;


    // ANIMATION ĐI BỘ

    if (player.moving) {

        player.animationTime += 0.18;

        player.walkFrame =
            Math.sin(player.animationTime) * 4;

    } else {

        player.idleTime += 0.08;

        player.walkFrame = 0;

    }
}


// =====================
// VẼ CỎ + BIOME
// =====================

function drawGround() {

    const tileSize = 16;

    const startX = Math.floor(
        (player.x - canvas.width / 2) / tileSize
    );

    const startY = Math.floor(
        (player.y - canvas.height / 2) / tileSize
    );

    const endX = startX +
        Math.ceil(canvas.width / tileSize) + 2;

    const endY = startY +
        Math.ceil(canvas.height / tileSize) + 2;


    for (let tileY = startY; tileY < endY; tileY++) {

        for (let tileX = startX; tileX < endX; tileX++) {

            const worldX = tileX * tileSize;
            const worldY = tileY * tileSize;

            const biome = getBiome(worldX, worldY);

            let groundColor = "#4f913e";

            if (biome === "forest") {
                groundColor = "#417c38";
            }

            if (biome === "grassland") {
                groundColor = "#5b9b43";
            }

            if (biome === "rocky") {
                groundColor = "#69834e";
            }

            if (biome === "meadow") {
                groundColor = "#6ba84c";
            }


            const screenX =
                worldX - player.x + canvas.width / 2;

            const screenY =
                worldY - player.y + canvas.height / 2;


            ctx.fillStyle = groundColor;

            ctx.fillRect(
                Math.floor(screenX),
                Math.floor(screenY),
                tileSize + 1,
                tileSize + 1
            );


            // Cỏ pixel ngẫu nhiên

            const r = random(tileX, tileY, 1);

            if (r > 0.78) {

                ctx.fillStyle = "#397632";

                ctx.fillRect(
                    screenX + 3,
                    screenY + 7,
                    2,
                    5
                );

                ctx.fillRect(
                    screenX + 7,
                    screenY + 4,
                    2,
                    8
                );

            }


            // Hoa

            if (r > 0.965) {

                ctx.fillStyle = "#f2e66b";

                ctx.fillRect(
                    screenX + 6,
                    screenY + 6,
                    4,
                    4
                );

                ctx.fillStyle = "#ffffff";

                ctx.fillRect(
                    screenX + 5,
                    screenY + 4,
                    3,
                    3
                );

                ctx.fillRect(
                    screenX + 8,
                    screenY + 4,
                    3,
                    3
                );

            }

        }
    }
}


// =====================
// VẼ CÂY PIXEL
// =====================

function drawTree(x, y, type) {

    // Bóng cây

    ctx.fillStyle = "rgba(0,0,0,0.18)";

    ctx.fillRect(
        x - 13,
        y + 8,
        28,
        10
    );


    // Thân

    ctx.fillStyle = "#69411f";

    ctx.fillRect(
        x - 4,
        y,
        9,
        22
    );

    ctx.fillStyle = "#9a6530";

    ctx.fillRect(
        x + 2,
        y + 2,
        3,
        18
    );


    // Tán loại 1

    if (type === 1) {

        ctx.fillStyle = "#245c2e";

        ctx.fillRect(x - 16, y - 28, 32, 30);
        ctx.fillRect(x - 21, y - 20, 42, 22);
        ctx.fillRect(x - 11, y - 36, 22, 12);

        ctx.fillStyle = "#3d8037";

        ctx.fillRect(x - 12, y - 30, 18, 14);
        ctx.fillRect(x - 18, y - 16, 16, 12);
    }


    // Tán loại 2

    if (type === 2) {

        ctx.fillStyle = "#1d5428";

        ctx.fillRect(x - 20, y - 25, 40, 24);
        ctx.fillRect(x - 13, y - 35, 26, 15);

        ctx.fillStyle = "#367735";

        ctx.fillRect(x - 10, y - 30, 18, 12);
        ctx.fillRect(x + 5, y - 20, 13, 10);
    }

}


// =====================
// VẼ ĐÁ PIXEL
// =====================

function drawRock(x, y, size) {

    ctx.fillStyle = "#485057";

    ctx.fillRect(
        x - size,
        y - size / 2,
        size * 2,
        size
    );

    ctx.fillRect(
        x - size / 2,
        y - size,
        size,
        size * 2
    );

    ctx.fillStyle = "#7f8990";

    ctx.fillRect(
        x - size / 2,
        y - size / 2,
        size,
        size / 2
    );

    ctx.fillStyle = "#30363b";

    ctx.fillRect(
        x + size / 2,
        y,
        size / 2,
        size / 2
    );

}


// =====================
// VẼ BỤI CÂY
// =====================

function drawBush(x, y) {

    ctx.fillStyle = "#2f7133";

    ctx.fillRect(x - 10, y - 8, 20, 16);
    ctx.fillRect(x - 14, y - 3, 28, 10);

    ctx.fillStyle = "#4d9443";

    ctx.fillRect(x - 8, y - 11, 10, 8);
    ctx.fillRect(x + 3, y - 7, 8, 8);

}


// =====================
// VẼ ĐỒ VẬT TỰ NHIÊN
// =====================

function drawNature() {

    const cellSize = 80;

    const startCellX = Math.floor(
        (player.x - canvas.width / 2) / cellSize
    ) - 1;

    const startCellY = Math.floor(
        (player.y - canvas.height / 2) / cellSize
    ) - 1;

    const endCellX = startCellX +
        Math.ceil(canvas.width / cellSize) + 3;

    const endCellY = startCellY +
        Math.ceil(canvas.height / cellSize) + 3;


    for (let cellY = startCellY; cellY < endCellY; cellY++) {

        for (let cellX = startCellX; cellX < endCellX; cellX++) {

            const worldX = cellX * cellSize;
            const worldY = cellY * cellSize;

            const biome = getBiome(worldX, worldY);

            const r = random(cellX, cellY, 50);


            const x =
                worldX +
                random(cellX, cellY, 51) * cellSize;

            const y =
                worldY +
                random(cellX, cellY, 52) * cellSize;


            const screenX =
                Math.floor(
                    x - player.x + canvas.width / 2
                );

            const screenY =
                Math.floor(
                    y - player.y + canvas.height / 2
                );


            // RỪNG: rất nhiều cây

            if (biome === "forest") {

                if (r > 0.25) {

                    const type =
                        random(cellX, cellY, 53) > 0.5
                        ? 1
                        : 2;

                    drawTree(
                        screenX,
                        screenY,
                        type
                    );

                }

            }


            // ĐỒNG CỎ: ít cây + bụi

            if (biome === "grassland") {

                if (r > 0.88) {

                    drawTree(
                        screenX,
                        screenY,
                        1
                    );

                } else if (r > 0.65) {

                    drawBush(
                        screenX,
                        screenY
                    );

                }

            }


            // VÙNG ĐÁ

            if (biome === "rocky") {

                if (r > 0.45) {

                    const size =
                        7 +
                        Math.floor(
                            random(
                                cellX,
                                cellY,
                                60
                            ) * 8
                        );

                    drawRock(
                        screenX,
                        screenY,
                        size
                    );

                } else if (r > 0.25) {

                    drawBush(
                        screenX,
                        screenY
                    );

                }

            }


            // ĐỒNG HOA

            if (biome === "meadow") {

                if (r > 0.94) {

                    drawTree(
                        screenX,
                        screenY,
                        2
                    );

                } else if (r > 0.60) {

                    drawBush(
                        screenX,
                        screenY
                    );

                }

            }

        }
    }
}


// =====================
// VẼ NHÂN VẬT PIXEL
// =====================

function drawPlayer() {

    const x = Math.floor(canvas.width / 2);
    const y = Math.floor(canvas.height / 2);


    // Bóng

    ctx.fillStyle = "rgba(0,0,0,0.25)";

    ctx.fillRect(x - 10, y + 13, 20, 5);


    // Chân

    ctx.fillStyle = "#25272b";

    ctx.fillRect(x - 8, y + 8, 6, 10);
    ctx.fillRect(x + 2, y + 8, 6, 10);


    // Áo

    ctx.fillStyle = "#365d7d";

    ctx.fillRect(x - 9, y - 5, 18, 14);


    // Tay

    ctx.fillStyle = "#e2a37d";

    ctx.fillRect(x - 12, y - 3, 3, 9);
    ctx.fillRect(x + 9, y - 3, 3, 9);


    // Đầu

    ctx.fillStyle = "#e2a37d";

    ctx.fillRect(x - 7, y - 15, 14, 11);


    // Tóc

    ctx.fillStyle = "#56351f";

    ctx.fillRect(x - 8, y - 18, 16, 5);
    ctx.fillRect(x - 8, y - 14, 4, 4);


    // Mắt khi nhìn xuống

    if (player.direction === "down") {

        ctx.fillStyle = "#222";

        ctx.fillRect(x - 4, y - 11, 2, 2);
        ctx.fillRect(x + 2, y - 11, 2, 2);

    }

}


// =====================
// HUD
// =====================

function updateHUD() {

    document.getElementById("healthText").textContent =
        player.health + "/100";

    document.getElementById("energyText").textContent =
        player.energy + "/100";

    document.getElementById("healthFill").style.width =
        player.health + "%";

    document.getElementById("energyFill").style.width =
        player.energy + "%";
}


// =====================
// GAME LOOP
// =====================

function gameLoop() {

    updatePlayer();

    drawGround();

    drawNature();

    drawPlayer();

    updateHUD();

    requestAnimationFrame(gameLoop);
}

gameLoop();
