const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Kích thước màn hình game thật
canvas.width = 900;
canvas.height = 600;

// =======================
// NHÂN VẬT
// =======================

const player = {
x: 450,
y: 300,
size: 18,
speed: 3,
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

// =======================
// THẾ GIỚI
// =======================

const worldSize = 60;
const tileSize = 32;

const world = [];

// Tạo map ngẫu nhiên
for (let y = 0; y < worldSize; y++) {
world[y] = [];

```
for (let x = 0; x < worldSize; x++) {
    const random = Math.random();

    let type = "grass";

    if (random < 0.08) {
        type = "water";
    } else if (random < 0.15) {
        type = "sand";
    } else if (random < 0.25) {
        type = "forest";
    } else if (random < 0.30) {
        type = "stone";
    } else if (random < 0.33) {
        type = "coal";
    } else if (random < 0.35) {
        type = "iron";
    } else if (random < 0.36) {
        type = "gold";
    }

    world[y][x] = type;
}
```

}

// =======================
// SINH VẬT
// =======================

const animals = [
{ x: 200, y: 200, type: "sheep", dx: 0, dy: 0 },
{ x: 650, y: 400, type: "cow", dx: 0, dy: 0 },
{ x: 350, y: 500, type: "chicken", dx: 0, dy: 0 }
];

// =======================
// MÀU CÁC Ô
// =======================

const colors = {
grass: "#55a630",
water: "#219ebc",
sand: "#e9c46a",
forest: "#2d6a4f",
stone: "#6c757d",
coal: "#343a40",
iron: "#a47148",
gold: "#f4d35e"
};

// =======================
// VẼ THẾ GIỚI
// =======================

function drawWorld() {
const cameraX = player.x - canvas.width / 2;
const cameraY = player.y - canvas.height / 2;

```
for (let y = 0; y < worldSize; y++) {
    for (let x = 0; x < worldSize; x++) {
        const type = world[y][x];

        const screenX = x * tileSize - cameraX;
        const screenY = y * tileSize - cameraY;

        // Chỉ vẽ những ô đang nhìn thấy
        if (
            screenX > -tileSize &&
            screenX < canvas.width &&
            screenY > -tileSize &&
            screenY < canvas.height
        ) {
            ctx.fillStyle = colors[type];
            ctx.fillRect(screenX, screenY, tileSize, tileSize);

            // Vẽ cây
            if (type === "forest") {
                ctx.fillStyle = "#6b3e26";
                ctx.fillRect(
                    screenX + 13,
                    screenY + 18,
                    6,
                    11
                );

                ctx.fillStyle = "#1b5e20";
                ctx.beginPath();
                ctx.arc(
                    screenX + 16,
                    screenY + 12,
                    11,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }

            // Vẽ đá
            if (type === "stone") {
                ctx.fillStyle = "#adb5bd";
                ctx.beginPath();
                ctx.arc(
                    screenX + 16,
                    screenY + 16,
                    10,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }

            // Vẽ than
            if (type === "coal") {
                ctx.fillStyle = "#111";
                ctx.beginPath();
                ctx.arc(
                    screenX + 16,
                    screenY + 16,
                    9,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }

            // Vẽ sắt
            if (type === "iron") {
                ctx.fillStyle = "#c77dff";
                ctx.beginPath();
                ctx.arc(
                    screenX + 16,
                    screenY + 16,
                    9,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }

            // Vẽ vàng
            if (type === "gold") {
                ctx.fillStyle = "#ffd60a";
                ctx.beginPath();
                ctx.arc(
                    screenX + 16,
                    screenY + 16,
                    9,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    }
}
```

}

// =======================
// VẼ SINH VẬT
// =======================

function drawAnimals() {
const cameraX = player.x - canvas.width / 2;
const cameraY = player.y - canvas.height / 2;

```
for (const animal of animals) {
    const screenX = animal.x - cameraX;
    const screenY = animal.y - cameraY;

    if (animal.type === "sheep") {
        ctx.fillStyle = "white";
    } else if (animal.type === "cow") {
        ctx.fillStyle = "#5c4033";
    } else {
        ctx.fillStyle = "#f1c40f";
    }

    ctx.beginPath();
    ctx.arc(screenX, screenY, 12, 0, Math.PI * 2);
    ctx.fill();
}
```

}

// =======================
// DI CHUYỂN
// =======================

function updatePlayer() {
let newX = player.x;
let newY = player.y;

```
if (keys["w"]) newY -= player.speed;
if (keys["s"]) newY += player.speed;
if (keys["a"]) newX -= player.speed;
if (keys["d"]) newX += player.speed;

// Kiểm tra không đi vào nước
const tileX = Math.floor(newX / tileSize);
const tileY = Math.floor(newY / tileSize);

if (
    world[tileY] &&
    world[tileY][tileX] !== "water"
) {
    player.x = newX;
    player.y = newY;
}
```

}

// =======================
// SINH VẬT DI CHUYỂN
// =======================

function updateAnimals() {
for (const animal of animals) {
if (Math.random() < 0.02) {
animal.dx = (Math.random() - 0.5) * 1.5;
animal.dy = (Math.random() - 0.5) * 1.5;
}

```
    animal.x += animal.dx;
    animal.y += animal.dy;
}
```

}

// =======================
// VẼ NHÂN VẬT
// =======================

function drawPlayer() {
ctx.fillStyle = "#ff6b6b";

```
ctx.beginPath();
ctx.arc(
    canvas.width / 2,
    canvas.height / 2,
    player.size,
    0,
    Math.PI * 2
);

ctx.fill();

// Mắt
ctx.fillStyle = "white";
ctx.beginPath();
ctx.arc(
    canvas.width / 2 - 6,
    canvas.height / 2 - 3,
    3,
    0,
    Math.PI * 2
);
ctx.arc(
    canvas.width / 2 + 6,
    canvas.height / 2 - 3,
    3,
    0,
    Math.PI * 2
);
ctx.fill();
```

}

// =======================
// CẬP NHẬT CHỈ SỐ
// =======================

function updateStats() {
document.getElementById("health").textContent =
Math.floor(player.health);

```
document.getElementById("hunger").textContent =
    Math.floor(player.hunger);

document.getElementById("wood").textContent =
    player.wood;

document.getElementById("stone").textContent =
    player.stone;
```

}

// =======================
// GAME LOOP
// =======================

function gameLoop() {
updatePlayer();
updateAnimals();

```
ctx.clearRect(0, 0, canvas.width, canvas.height);

drawWorld();
drawAnimals();
drawPlayer();
updateStats();

requestAnimationFrame(gameLoop);
```

}

gameLoop();
