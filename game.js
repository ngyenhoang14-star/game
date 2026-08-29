/* =====================================
   GAME.JS - PIXEL FARM
===================================== */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

/* KÍCH THƯỚC MÀN HÌNH */

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

function resizeCanvas() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    canvas.width = screenWidth;
    canvas.height = screenHeight;

    ctx.imageSmoothingEnabled = false;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


/* =====================================
   NGƯỜI CHƠI
===================================== */

const player = {
    x: 250,
    y: 250,

    width: 22,
    height: 30,

    speed: 230,

    direction: "down",

    moving: false,
    walkTime: 0,

    health: 100,
    energy: 100
};


/* CAMERA */

const camera = {
    x: player.x,
    y: player.y
};


/* =====================================
   TÚI ĐỒ
===================================== */

const inventoryData = {
    wood: 0,
    stone: 0,
    seeds: 5
};


/* =====================================
   ĐIỀU KHIỂN
===================================== */

const keys = {};

window.addEventListener("keydown", (event) => {

    const key = event.key.toLowerCase();

    keys[key] = true;


    /* CHỌN HOTBAR 1-5 */

    if (
        event.key >= "1" &&
        event.key <= "5"
    ) {
        selectSlot(
            Number(event.key) - 1
        );
    }


    /* E = TƯƠNG TÁC */

    if (key === "e") {
        useTool();
    }


    /* I = MỞ TÚI */

    if (key === "i") {
        toggleInventory();
    }
});


window.addEventListener("keyup", (event) => {

    keys[
        event.key.toLowerCase()
    ] = false;
});


/* =====================================
   HOTBAR
===================================== */

let selectedSlot = 0;

const slotNames = [
    "axe",
    "pickaxe",
    "seed",
    "wood",
    "stone"
];


function selectSlot(index) {

    selectedSlot = index;

    document
        .querySelectorAll(".slot")
        .forEach((slot) => {

            slot.classList.remove(
                "selected"
            );
        });


    const selected =
        document.querySelector(
            `.slot[data-slot="${index}"]`
        );

    if (selected) {
        selected.classList.add(
            "selected"
        );
    }
}


/* =====================================
   MOBILE CONTROLS
===================================== */

const mobileMove = {
    up: false,
    down: false,
    left: false,
    right: false
};


function setupMoveButton(
    id,
    direction
) {

    const button =
        document.getElementById(id);

    if (!button) return;


    const start = (event) => {

        event.preventDefault();

        mobileMove[
            direction
        ] = true;
    };


    const end = (event) => {

        event.preventDefault();

        mobileMove[
            direction
        ] = false;
    };


    button.addEventListener(
        "pointerdown",
        start
    );

    button.addEventListener(
        "pointerup",
        end
    );

    button.addEventListener(
        "pointercancel",
        end
    );

    button.addEventListener(
        "pointerleave",
        end
    );
}


setupMoveButton(
    "upButton",
    "up"
);

setupMoveButton(
    "downButton",
    "down"
);

setupMoveButton(
    "leftButton",
    "left"
);

setupMoveButton(
    "rightButton",
    "right"
);


/* NÚT HÀNH ĐỘNG */

const actionButton =
    document.getElementById(
        "actionButton"
    );

if (actionButton) {

    actionButton.addEventListener(
        "pointerdown",
        (event) => {

            event.preventDefault();

            useTool();
        }
    );
}


/* =====================================
   TÚI ĐỒ UI
===================================== */

const inventoryPanel =
    document.getElementById(
        "inventory"
    );


function toggleInventory() {

    inventoryPanel.classList.toggle(
        "hidden"
    );
}


const inventoryButton =
    document.getElementById(
        "inventoryButton"
    );

const closeInventory =
    document.getElementById(
        "closeInventory"
    );


if (inventoryButton) {

    inventoryButton.addEventListener(
        "click",
        toggleInventory
    );
}


if (closeInventory) {

    closeInventory.addEventListener(
        "click",
        toggleInventory
    );
}


/* =====================================
   HIỂN THỊ TÚI ĐỒ
===================================== */

function updateInventoryUI() {

    document.getElementById(
        "woodCount"
    ).textContent =
        inventoryData.wood;

    document.getElementById(
        "stoneCount"
    ).textContent =
        inventoryData.stone;

    document.getElementById(
        "seedCount"
    ).textContent =
        inventoryData.seeds;
}


/* =====================================
   THÔNG BÁO
===================================== */

const messageElement =
    document.getElementById(
        "message"
    );

let messageTimeout;


function showMessage(text) {

    messageElement.textContent = text;

    clearTimeout(messageTimeout);

    messageTimeout =
        setTimeout(() => {

            messageElement.textContent = "";

        }, 2200);
}


/* =====================================
   DÙNG CÔNG CỤ
===================================== */

let actionCooldown = 0;


function useTool() {

    if (actionCooldown > 0) {
        return;
    }


    const tool =
        slotNames[selectedSlot];


    /* RÌU */

    if (tool === "axe") {

        const object =
            getNearbyObject(
                player.x,
                player.y,
                80
            );


        if (
            object &&
            object.type === "tree"
        ) {

            actionCooldown = 0.35;

            object.health--;


            if (
                object.health <= 0
            ) {

                destroyWorldObject(
                    object
                );

                inventoryData.wood +=
                    3;

                player.energy =
                    Math.max(
                        0,
                        player.energy - 4
                    );

                showMessage(
                    "🪵 Bạn nhận được 3 gỗ!"
                );
            }

            else {

                player.energy =
                    Math.max(
                        0,
                        player.energy - 1
                    );

                showMessage(
                    "🪓 Chặt cây..."
                );
            }
        }

        else {

            showMessage(
                "Hãy đến gần một cái cây!"
            );
        }
    }


    /* CUỐC ĐÁ */

    if (tool === "pickaxe") {

        const object =
            getNearbyObject(
                player.x,
                player.y,
                80
            );


        if (
            object &&
            object.type === "rock"
        ) {

            actionCooldown = 0.35;

            object.health--;


            if (
                object.health <= 0
            ) {

                destroyWorldObject(
                    object
                );

                inventoryData.stone +=
                    2;

                player.energy =
                    Math.max(
                        0,
                        player.energy - 4
                    );

                showMessage(
                    "🪨 Bạn nhận được 2 đá!"
                );
            }

            else {

                player.energy =
                    Math.max(
                        0,
                        player.energy - 1
                    );

                showMessage(
                    "⛏️ Đang đào đá..."
                );
            }
        }

        else {

            showMessage(
                "Hãy đến gần một tảng đá!"
            );
        }
    }


    /* HẠT GIỐNG */

    if (tool === "seed") {

        if (
            inventoryData.seeds <= 0
        ) {

            showMessage(
                "Bạn đã hết hạt giống!"
            );

            return;
        }


        inventoryData.seeds--;

        showMessage(
            "🌱 Đã trồng một hạt!"
        );
    }


    updateInventoryUI();
}


/* =====================================
   CẬP NHẬT DI CHUYỂN
===================================== */

function updatePlayer(deltaTime) {

    let moveX = 0;
    let moveY = 0;


    /* BÀN PHÍM */

    if (
        keys["w"] ||
        keys["arrowup"]
    ) {
        moveY -= 1;
    }

    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {
        moveY += 1;
    }

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {
        moveX -= 1;
    }

    if (
        keys["d"] ||
        keys["arrowright"]
    ) {
        moveX += 1;
    }


    /* ĐIỆN THOẠI */

    if (mobileMove.up) {
        moveY -= 1;
    }

    if (mobileMove.down) {
        moveY += 1;
    }

    if (mobileMove.left) {
        moveX -= 1;
    }

    if (mobileMove.right) {
        moveX += 1;
    }


    /* CHÉO KHÔNG NHANH HƠN */

    if (
        moveX !== 0 ||
        moveY !== 0
    ) {

        const length =
            Math.sqrt(
                moveX * moveX +
                moveY * moveY
            );

        moveX /= length;
        moveY /= length;


        player.x +=
            moveX *
            player.speed *
            deltaTime;

        player.y +=
            moveY *
            player.speed *
            deltaTime;


        player.moving = true;

        player.walkTime +=
            deltaTime * 12;


        /* HƯỚNG NHÌN */

        if (
            Math.abs(moveX) >
            Math.abs(moveY)
        ) {

            player.direction =
                moveX > 0
                ? "right"
                : "left";
        }

        else {

            player.direction =
                moveY > 0
                ? "down"
                : "up";
        }
    }

    else {

        player.moving = false;
    }


    /* CAMERA ĐUỔI THEO */

    const followSpeed = 8;

    camera.x +=
        (player.x - camera.x) *
        Math.min(
            1,
            followSpeed * deltaTime
        );

    camera.y +=
        (player.y - camera.y) *
        Math.min(
            1,
            followSpeed * deltaTime
        );
}


/* =====================================
   VẼ NGƯỜI CHƠI PIXEL
===================================== */

function drawPlayer() {

    const x =
        Math.floor(
            player.x -
            camera.x +
            screenWidth / 2
        );

    const y =
        Math.floor(
            player.y -
            camera.y +
            screenHeight / 2
        );


    const walking =
        player.moving;

    const legOffset =
        walking
        ? Math.sin(
            player.walkTime
        ) * 3
        : 0;


    /* BÓNG */

    ctx.fillStyle =
        "rgba(0,0,0,0.25)";

    ctx.fillRect(
        x - 11,
        y + 12,
        22,
        8
    );


    /* CHÂN */

    ctx.fillStyle = "#25324a";

    ctx.fillRect(
        x - 7,
        y + 9,
        6,
        11 + legOffset
    );

    ctx.fillRect(
        x + 1,
        y + 9,
        6,
        11 - legOffset
    );


    /* ÁO */

    ctx.fillStyle = "#3d6f9e";

    ctx.fillRect(
        x - 10,
        y - 5,
        20,
        17
    );


    /* TAY */

    ctx.fillStyle = "#e1a475";

    const armSwing =
        walking
        ? Math.sin(
            player.walkTime
        ) * 3
        : 0;

    ctx.fillRect(
        x - 14,
        y - 2 + armSwing,
        5,
        12
    );

    ctx.fillRect(
        x + 9,
        y - 2 - armSwing,
        5,
        12
    );


    /* ĐẦU */

    ctx.fillStyle = "#e7ae7d";

    ctx.fillRect(
        x - 9,
        y - 22,
        18,
        18
    );


    /* TÓC */

    ctx.fillStyle = "#3a261d";

    ctx.fillRect(
        x - 10,
        y - 25,
        20,
        7
    );

    ctx.fillRect(
        x - 10,
        y - 21,
        5,
        8
    );


    /* MẮT */

    ctx.fillStyle = "#1b1b1b";

    if (
        player.direction === "down"
    ) {

        ctx.fillRect(
            x - 5,
            y - 14,
            3,
            3
        );

        ctx.fillRect(
            x + 3,
            y - 14,
            3,
            3
        );
    }


    /* CHI TIẾT ÁO */

    ctx.fillStyle =
        "rgba(255,255,255,0.18)";

    ctx.fillRect(
        x - 5,
        y - 3,
        10,
        3
    );
}


/* =====================================
   VẼ KHUNG CHỈ DẪN GẦN TÀI NGUYÊN
===================================== */

function drawInteractionHint() {

    const object =
        getNearbyObject(
            player.x,
            player.y,
            70
        );


    if (!object) {
        return;
    }


    const screenX =
        object.x -
        camera.x +
        screenWidth / 2;

    const screenY =
        object.y -
        camera.y +
        screenHeight / 2;


    ctx.strokeStyle =
        "rgba(255,230,100,0.85)";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        screenX - 30,
        screenY - 60,
        60,
        75
    );
}


/* =====================================
   VẼ GAME
===================================== */

function drawGame() {

    ctx.clearRect(
        0,
        0,
        screenWidth,
        screenHeight
    );


    /* MẶT ĐẤT */

    drawWorldGround(
        ctx,
        camera.x,
        camera.y,
        screenWidth,
        screenHeight
    );


    /* CÂY - ĐÁ - BỤI */

    drawWorldObjects(
        ctx,
        camera.x,
        camera.y,
        screenWidth,
        screenHeight
    );


    /* KHUNG TƯƠNG TÁC */

    drawInteractionHint();


    /* NHÂN VẬT */

    drawPlayer();


    /* BÓNG TỐI NHẸ Ở VIỀN */

    const gradient =
        ctx.createRadialGradient(
            screenWidth / 2,
            screenHeight / 2,
            Math.min(
                screenWidth,
                screenHeight
            ) * 0.25,

            screenWidth / 2,
            screenHeight / 2,
            Math.max(
                screenWidth,
                screenHeight
            ) * 0.8
        );

    gradient.addColorStop(
        0,
        "rgba(0,0,0,0)"
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,0.18)"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        screenWidth,
        screenHeight
    );
}


/* =====================================
   HUD
===================================== */

function updateHUD() {

    player.energy =
        Math.min(
            100,
            player.energy + 0.8 / 60
        );


    document.getElementById(
        "healthBar"
    ).style.width =
        player.health + "%";

    document.getElementById(
        "energyBar"
    ).style.width =
        player.energy + "%";


    document.getElementById(
        "healthText"
    ).textContent =
        Math.floor(
            player.health
        );

    document.getElementById(
        "energyText"
    ).textContent =
        Math.floor(
            player.energy
        );
}


/* =====================================
   LƯU GAME
===================================== */

function saveGame() {

    const data = {

        player: {
            x: player.x,
            y: player.y,

            health:
                player.health,

            energy:
                player.energy
        },

        inventory:
            inventoryData,

        destroyed:
            Array.from(
                destroyedObjects
            )
    };


    localStorage.setItem(
        "pixelFarmSave",
        JSON.stringify(data)
    );
}


function loadGame() {

    const saved =
        localStorage.getItem(
            "pixelFarmSave"
        );


    if (!saved) {
        return;
    }


    try {

        const data =
            JSON.parse(saved);


        if (data.player) {

            player.x =
                data.player.x ??
                player.x;

            player.y =
                data.player.y ??
                player.y;

            player.health =
                data.player.health ??
                player.health;

            player.energy =
                data.player.energy ??
                player.energy;
        }


        if (data.inventory) {

            inventoryData.wood =
                data.inventory.wood ?? 0;

            inventoryData.stone =
                data.inventory.stone ?? 0;

            inventoryData.seeds =
                data.inventory.seeds ?? 5;
        }


        if (data.destroyed) {

            data.destroyed.forEach(
                (id) => {

                    destroyedObjects.add(
                        id
                    );
                }
            );
        }


        camera.x = player.x;
        camera.y = player.y;

        showMessage(
            "💾 Đã tải game!"
        );
    }

    catch (error) {

        console.log(
            "Không thể tải save"
        );
    }
}


/* TỰ ĐỘNG LƯU */

setInterval(
    saveGame,
    5000
);

window.addEventListener(
    "beforeunload",
    saveGame
);


/* =====================================
   GAME LOOP
===================================== */

let lastTime =
    performance.now();


function gameLoop(currentTime) {

    let deltaTime =
        (currentTime - lastTime) /
        1000;

    lastTime =
        currentTime;


    /* TRÁNH GAME NHẢY QUÁ XA */

    deltaTime =
        Math.min(
            deltaTime,
            0.05
        );


    /* COOLDOWN */

    if (
        actionCooldown > 0
    ) {

        actionCooldown -=
            deltaTime;
    }


    updatePlayer(
        deltaTime
    );

    updateHUD();

    drawGame();

    requestAnimationFrame(
        gameLoop
    );
}


/* =====================================
   KHỞI ĐỘNG
===================================== */

loadGame();

updateInventoryUI();

showMessage(
    "🌲 Hãy khám phá thế giới!"
);

requestAnimationFrame(
    gameLoop
);
