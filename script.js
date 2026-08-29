const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


// ===============================
// CHỈNH KÍCH THƯỚC MÀN HÌNH
// ===============================

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// ===============================
// NHÂN VẬT
// ===============================

const player = {

    x: 0,
    y: 0,

    speed: 4,

    health: 100,
    energy: 100,

    direction: "down"

};


// ===============================
// BÀN PHÍM
// ===============================

const keys = {};

document.addEventListener("keydown", function(event) {

    keys[event.key.toLowerCase()] = true;

});

document.addEventListener("keyup", function(event) {

    keys[event.key.toLowerCase()] = false;

});


// ===============================
// HÀM NGẪU NHIÊN THEO TỌA ĐỘ
//
// CÙNG MỘT VỊ TRÍ SẼ LUÔN CÓ
// CÙNG MỘT MẢNH THẾ GIỚI
// ===============================

function random(x, y, seed = 1) {

    const value = Math.sin(
        x * 12.9898 +
        y * 78.233 +
        seed * 37.719
    ) * 43758.5453;

    return value - Math.floor(value);

}


// ===============================
// DI CHUYỂN
// ===============================

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


    // Không cho đi chéo nhanh hơn

    if (moveX !== 0 && moveY !== 0) {

        moveX *= 0.707;
        moveY *= 0.707;

    }


    player.x += moveX * player.speed;
    player.y += moveY * player.speed;

}


// ===============================
// VẼ NỀN PIXEL
// ===============================

function drawGround() {

    // Nền cỏ

    ctx.fillStyle = "#4f913e";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    const pixelSize = 12;


    // Tọa độ thế giới đang nhìn thấy

    const startX =
        Math.floor(
            (player.x - canvas.width / 2) /
            pixelSize
        );

    const startY =
        Math.floor(
            (player.y - canvas.height / 2) /
            pixelSize
        );


    const endX =
        startX +
        Math.ceil(canvas.width / pixelSize) +
        2;

    const endY =
        startY +
        Math.ceil(canvas.height / pixelSize) +
        2;


    // Sinh chi tiết cỏ tự nhiên

    for (
        let worldY = startY;
        worldY < endY;
        worldY++
    ) {

        for (
            let worldX = startX;
            worldX < endX;
            worldX++
        ) {

            const r =
                random(
                    worldX,
                    worldY,
                    1
                );


            const screenX =
                worldX * pixelSize -
                player.x +
                canvas.width / 2;

            const screenY =
                worldY * pixelSize -
                player.y +
                canvas.height / 2;


            // Cỏ đậm ngẫu nhiên

            if (r > 0.82) {

                ctx.fillStyle = "#3f7f34";

                ctx.fillRect(
                    screenX + 3,
                    screenY + 4,
                    2,
                    5
                );

                ctx.fillRect(
                    screenX + 7,
                    screenY + 2,
                    2,
                    7
                );

            }


            // Cỏ sáng

            if (r > 0.74 && r < 0.78) {

                ctx.fillStyle = "#70ae48";

                ctx.fillRect(
                    screenX + 5,
                    screenY + 5,
                    2,
                    4
                );

            }

        }

    }

}


// ===============================
// VẼ NHÂN VẬT PIXEL
// ===============================

function drawPlayer() {

    const x =
        Math.floor(canvas.width / 2);

    const y =
        Math.floor(canvas.height / 2);


    // BÓNG

    ctx.fillStyle =
        "rgba(0,0,0,0.25)";

    ctx.fillRect(
        x - 10,
        y + 13,
        20,
        5
    );


    // CHÂN

    ctx.fillStyle = "#2c2c32";

    ctx.fillRect(
        x - 8,
        y + 8,
        6,
        10
    );

    ctx.fillRect(
        x + 2,
        y + 8,
        6,
        10
    );


    // ÁO

    ctx.fillStyle = "#34495e";

    ctx.fillRect(
        x - 9,
        y - 5,
        18,
        14
    );


    // TAY

    ctx.fillStyle = "#e2a37d";

    ctx.fillRect(
        x - 12,
        y - 3,
        3,
        9
    );

    ctx.fillRect(
        x + 9,
        y - 3,
        3,
        9
    );


    // ĐẦU

    ctx.fillStyle = "#e2a37d";

    ctx.fillRect(
        x - 7,
        y - 15,
        14,
        11
    );


    // TÓC

    ctx.fillStyle = "#5a351f";

    ctx.fillRect(
        x - 8,
        y - 18,
        16,
        5
    );

    ctx.fillRect(
        x - 8,
        y - 14,
        4,
        4
    );


    // MẮT

    if (
        player.direction === "down"
    ) {

        ctx.fillStyle = "#222";

        ctx.fillRect(
            x - 4,
            y - 11,
            2,
            2
        );

        ctx.fillRect(
            x + 2,
            y - 11,
            2,
            2
        );

    }

}


// ===============================
// CẬP NHẬT HUD
// ===============================

function updateHUD() {

    document.getElementById(
        "healthText"
    ).textContent =
        player.health + "/100";


    document.getElementById(
        "energyText"
    ).textContent =
        player.energy + "/100";


    document.getElementById(
        "healthFill"
    ).style.width =
        player.health + "%";


    document.getElementById(
        "energyFill"
    ).style.width =
        player.energy + "%";

}


// ===============================
// GAME LOOP
// ===============================

function gameLoop() {

    updatePlayer();

    drawGround();

    drawPlayer();

    updateHUD();

    requestAnimationFrame(gameLoop);

}

gameLoop();
