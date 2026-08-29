/* =====================================
   WORLD.JS
   TẠO THẾ GIỚI PIXEL
===================================== */


/* KÍCH THƯỚC Ô MAP */

const TILE = 32;


/* =====================================
   RANDOM ỔN ĐỊNH
   CÙNG MỘT TỌA ĐỘ LUÔN TẠO RA
   CÙNG MỘT ĐỊA HÌNH
===================================== */

function seededRandom(x, y, seed = 1) {

    const value = Math.sin(
        x * 12.9898 +
        y * 78.233 +
        seed * 45.164
    ) * 43758.5453;

    return value - Math.floor(value);
}


/* =====================================
   NOISE MƯỢT
===================================== */

function smoothNoise(x, y, scale, seed) {

    const x0 = Math.floor(x / scale);
    const y0 = Math.floor(y / scale);

    const x1 = x0 + 1;
    const y1 = y0 + 1;

    const tx = x / scale - x0;
    const ty = y / scale - y0;

    const a = seededRandom(x0, y0, seed);
    const b = seededRandom(x1, y0, seed);
    const c = seededRandom(x0, y1, seed);
    const d = seededRandom(x1, y1, seed);

    const top = a + (b - a) * tx;
    const bottom = c + (d - c) * tx;

    return top + (bottom - top) * ty;
}


/* =====================================
   CÁC VÙNG ĐẤT
===================================== */

function getBiome(worldX, worldY) {

    const value = smoothNoise(
        worldX,
        worldY,
        900,
        77
    );

    if (value > 0.70) {
        return "forest";
    }

    if (value > 0.48) {
        return "grass";
    }

    if (value > 0.30) {
        return "rock";
    }

    return "meadow";
}


/* =====================================
   SÔNG
===================================== */

function getRiverY(worldX) {

    return (
        Math.sin(worldX / 450) * 120 +
        Math.sin(worldX / 190) * 50 +
        Math.sin(worldX / 1200) * 250
    );
}


function isRiver(worldX, worldY) {

    const riverWidth = 72;

    return Math.abs(
        worldY - getRiverY(worldX)
    ) < riverWidth;
}


/* =====================================
   TÍNH VỊ TRÍ TÀI NGUYÊN
===================================== */

function getWorldObject(cellX, cellY) {

    const r = seededRandom(
        cellX,
        cellY,
        500
    );

    const x =
        cellX * 96 +
        seededRandom(cellX, cellY, 501) * 70;

    const y =
        cellY * 96 +
        seededRandom(cellX, cellY, 502) * 70;


    if (isRiver(x, y)) {
        return null;
    }


    const biome = getBiome(x, y);


    /* RỪNG */

    if (biome === "forest") {

        if (r > 0.18) {

            return {
                type: "tree",

                x: x,
                y: y,

                health: 4,

                treeType:
                    seededRandom(
                        cellX,
                        cellY,
                        503
                    ) > 0.5
                    ? 1
                    : 2
            };
        }

        if (r > 0.08) {

            return {
                type: "bush",
                x: x,
                y: y
            };
        }
    }


    /* VÙNG CỎ */

    if (biome === "grass") {

        if (r > 0.87) {

            return {
                type: "tree",
                x: x,
                y: y,
                health: 4,
                treeType: 1
            };
        }

        if (r > 0.56) {

            return {
                type: "bush",
                x: x,
                y: y
            };
        }
    }


    /* VÙNG ĐÁ */

    if (biome === "rock") {

        if (r > 0.42) {

            return {
                type: "rock",
                x: x,
                y: y,
                health: 4,

                size:
                    12 +
                    Math.floor(
                        seededRandom(
                            cellX,
                            cellY,
                            504
                        ) * 12
                    )
            };
        }

        if (r > 0.15) {

            return {
                type: "bush",
                x: x,
                y: y
            };
        }
    }


    /* ĐỒNG CỎ NHẸ */

    if (biome === "meadow") {

        if (r > 0.94) {

            return {
                type: "tree",
                x: x,
                y: y,
                health: 4,
                treeType: 2
            };
        }

        if (r > 0.60) {

            return {
                type: "bush",
                x: x,
                y: y
            };
        }
    }


    return null;
}


/* =====================================
   TÀI NGUYÊN ĐÃ BỊ PHÁ
===================================== */

const destroyedObjects = new Set();


function getObjectID(object) {

    return (
        object.type + "_" +
        Math.floor(object.x) + "_" +
        Math.floor(object.y)
    );
}


function isObjectDestroyed(object) {

    return destroyedObjects.has(
        getObjectID(object)
    );
}


/* =====================================
   VẼ MẶT ĐẤT
===================================== */

function drawWorldGround(ctx, cameraX, cameraY, width, height) {

    const startX =
        Math.floor(
            (cameraX - width / 2) / TILE
        ) - 2;

    const startY =
        Math.floor(
            (cameraY - height / 2) / TILE
        ) - 2;

    const endX =
        startX +
        Math.ceil(width / TILE) + 4;

    const endY =
        startY +
        Math.ceil(height / TILE) + 4;


    for (
        let tileY = startY;
        tileY < endY;
        tileY++
    ) {

        for (
            let tileX = startX;
            tileX < endX;
            tileX++
        ) {

            const worldX =
                tileX * TILE;

            const worldY =
                tileY * TILE;


            const screenX =
                Math.floor(
                    worldX -
                    cameraX +
                    width / 2
                );

            const screenY =
                Math.floor(
                    worldY -
                    cameraY +
                    height / 2
                );


            /* NƯỚC */

            if (
                isRiver(
                    worldX,
                    worldY
                )
            ) {

                const wave =
                    Math.sin(
                        worldX / 25 +
                        Date.now() / 250
                    );

                ctx.fillStyle =
                    wave > 0
                    ? "#397da2"
                    : "#2d6f94";

                ctx.fillRect(
                    screenX,
                    screenY,
                    TILE + 1,
                    TILE + 1
                );


                if (
                    seededRandom(
                        tileX,
                        tileY,
                        900
                    ) > 0.74
                ) {

                    ctx.fillStyle =
                        "rgba(220,245,255,0.35)";

                    ctx.fillRect(
                        screenX + 6,
                        screenY + 14,
                        15,
                        3
                    );
                }

                continue;
            }


            /* BIOME */

            const biome =
                getBiome(
                    worldX,
                    worldY
                );

            let groundColor =
                "#5c9f48";


            if (biome === "forest") {
                groundColor = "#47873e";
            }

            if (biome === "grass") {
                groundColor = "#5d9f48";
            }

            if (biome === "rock") {
                groundColor = "#71875c";
            }

            if (biome === "meadow") {
                groundColor = "#74ab52";
            }


            ctx.fillStyle = groundColor;

            ctx.fillRect(
                screenX,
                screenY,
                TILE + 1,
                TILE + 1
            );


            /* CỎ NHỎ */

            const grassRandom =
                seededRandom(
                    tileX,
                    tileY,
                    901
                );


            if (grassRandom > 0.78) {

                ctx.fillStyle =
                    "rgba(30,95,32,0.55)";

                ctx.fillRect(
                    screenX + 9,
                    screenY + 17,
                    3,
                    9
                );

                ctx.fillRect(
                    screenX + 16,
                    screenY + 11,
                    3,
                    15
                );
            }


            /* HOA */

            if (grassRandom > 0.975) {

                ctx.fillStyle = "#f2eadb";

                ctx.fillRect(
                    screenX + 13,
                    screenY + 13,
                    7,
                    7
                );

                ctx.fillStyle = "#e6ba43";

                ctx.fillRect(
                    screenX + 15,
                    screenY + 15,
                    3,
                    3
                );
            }
        }
    }
}


/* =====================================
   VẼ CÂY
===================================== */

function drawTree(
    ctx,
    screenX,
    screenY,
    treeType
) {

    /* BÓNG */

    ctx.fillStyle =
        "rgba(0,0,0,0.25)";

    ctx.fillRect(
        screenX - 30,
        screenY + 17,
        60,
        12
    );


    /* THÂN */

    ctx.fillStyle = "#3d2417";

    ctx.fillRect(
        screenX - 7,
        screenY - 3,
        14,
        32
    );

    ctx.fillStyle = "#75472a";

    ctx.fillRect(
        screenX - 3,
        screenY,
        7,
        26
    );


    if (treeType === 1) {

        /* LÁ TỐI */

        ctx.fillStyle = "#173d24";

        ctx.fillRect(
            screenX - 30,
            screenY - 37,
            60,
            31
        );

        ctx.fillRect(
            screenX - 22,
            screenY - 52,
            44,
            20
        );

        ctx.fillRect(
            screenX - 12,
            screenY - 63,
            24,
            15
        );


        /* LÁ CHÍNH */

        ctx.fillStyle = "#276b38";

        ctx.fillRect(
            screenX - 26,
            screenY - 34,
            52,
            27
        );

        ctx.fillRect(
            screenX - 18,
            screenY - 48,
            36,
            20
        );


        /* ÁNH SÁNG */

        ctx.fillStyle = "#478f4a";

        ctx.fillRect(
            screenX - 19,
            screenY - 35,
            18,
            14
        );

        ctx.fillRect(
            screenX + 7,
            screenY - 38,
            14,
            16
        );

        ctx.fillRect(
            screenX - 5,
            screenY - 53,
            12,
            10
        );
    }


    else {

        /* LÁ TỐI */

        ctx.fillStyle = "#1b4728";

        ctx.fillRect(
            screenX - 27,
            screenY - 36,
            54,
            35
        );

        ctx.fillRect(
            screenX - 17,
            screenY - 55,
            34,
            25
        );


        /* LÁ */

        ctx.fillStyle = "#357b40";

        ctx.fillRect(
            screenX - 23,
            screenY - 33,
            46,
            30
        );

        ctx.fillRect(
            screenX - 14,
            screenY - 50,
            28,
            22
        );


        /* ÁNH SÁNG */

        ctx.fillStyle = "#579a4d";

        ctx.fillRect(
            screenX - 13,
            screenY - 37,
            15,
            14
        );

        ctx.fillRect(
            screenX + 6,
            screenY - 29,
            12,
            12
        );
    }
}


/* =====================================
   VẼ ĐÁ
===================================== */

function drawRock(
    ctx,
    screenX,
    screenY,
    size
) {

    /* BÓNG */

    ctx.fillStyle =
        "rgba(0,0,0,0.22)";

    ctx.fillRect(
        screenX - size,
        screenY + size / 2,
        size * 2 + 5,
        size / 2
    );


    /* VIỀN ĐÁ */

    ctx.fillStyle = "#394247";

    ctx.fillRect(
        screenX - size,
        screenY - size / 2,
        size * 2,
        size * 1.5
    );

    ctx.fillRect(
        screenX - size / 2,
        screenY - size,
        size,
        size * 2
    );


    /* MẶT ĐÁ */

    ctx.fillStyle = "#68757a";

    ctx.fillRect(
        screenX - size + 4,
        screenY - size / 2 + 4,
        size * 2 - 8,
        size
    );

    ctx.fillRect(
        screenX - size / 2 + 3,
        screenY - size + 4,
        size - 6,
        size * 1.5
    );


    /* ÁNH SÁNG */

    ctx.fillStyle = "#a0aaa9";

    ctx.fillRect(
        screenX - size / 2,
        screenY - size / 2,
        size / 2,
        Math.max(3, size / 3)
    );
}


/* =====================================
   VẼ BỤI CÂY
===================================== */

function drawBush(
    ctx,
    screenX,
    screenY
) {

    /* BÓNG */

    ctx.fillStyle =
        "rgba(0,0,0,0.18)";

    ctx.fillRect(
        screenX - 19,
        screenY + 10,
        38,
        8
    );


    /* BỤI TỐI */

    ctx.fillStyle = "#245e31";

    ctx.fillRect(
        screenX - 16,
        screenY - 12,
        32,
        23
    );

    ctx.fillRect(
        screenX - 21,
        screenY - 4,
        42,
        17
    );


    /* BỤI SÁNG */

    ctx.fillStyle = "#438d45";

    ctx.fillRect(
        screenX - 13,
        screenY - 16,
        16,
        12
    );

    ctx.fillRect(
        screenX + 4,
        screenY - 11,
        14,
        12
    );


    /* QUẢ */

    ctx.fillStyle = "#c34f49";

    ctx.fillRect(
        screenX - 8,
        screenY - 3,
        4,
        4
    );

    ctx.fillRect(
        screenX + 7,
        screenY + 2,
        4,
        4
    );
}


/* =====================================
   VẼ TOÀN BỘ ĐỐI TƯỢNG
===================================== */

function drawWorldObjects(
    ctx,
    cameraX,
    cameraY,
    width,
    height
) {

    const cellSize = 96;


    const startCellX =
        Math.floor(
            (cameraX - width / 2) /
            cellSize
        ) - 2;

    const startCellY =
        Math.floor(
            (cameraY - height / 2) /
            cellSize
        ) - 2;


    const endCellX =
        startCellX +
        Math.ceil(
            width / cellSize
        ) + 4;

    const endCellY =
        startCellY +
        Math.ceil(
            height / cellSize
        ) + 4;


    for (
        let cellY = startCellY;
        cellY < endCellY;
        cellY++
    ) {

        for (
            let cellX = startCellX;
            cellX < endCellX;
            cellX++
        ) {

            const object =
                getWorldObject(
                    cellX,
                    cellY
                );


            if (!object) {
                continue;
            }


            if (
                isObjectDestroyed(
                    object
                )
            ) {
                continue;
            }


            const screenX =
                Math.floor(
                    object.x -
                    cameraX +
                    width / 2
                );

            const screenY =
                Math.floor(
                    object.y -
                    cameraY +
                    height / 2
                );


            if (
                object.type === "tree"
            ) {

                drawTree(
                    ctx,
                    screenX,
                    screenY,
                    object.treeType
                );
            }


            if (
                object.type === "rock"
            ) {

                drawRock(
                    ctx,
                    screenX,
                    screenY,
                    object.size
                );
            }


            if (
                object.type === "bush"
            ) {

                drawBush(
                    ctx,
                    screenX,
                    screenY
                );
            }
        }
    }
}


/* =====================================
   TÌM VẬT GẦN NHÂN VẬT
===================================== */

function getNearbyObject(
    playerX,
    playerY,
    range = 75
) {

    const cellSize = 96;

    const currentCellX =
        Math.floor(
            playerX / cellSize
        );

    const currentCellY =
        Math.floor(
            playerY / cellSize
        );


    let closest = null;
    let closestDistance = range;


    /* KIỂM TRA 9 Ô XUNG QUANH */

    for (
        let y = currentCellY - 1;
        y <= currentCellY + 1;
        y++
    ) {

        for (
            let x = currentCellX - 1;
            x <= currentCellX + 1;
            x++
        ) {

            const object =
                getWorldObject(x, y);


            if (!object) {
                continue;
            }


            if (
                isObjectDestroyed(object)
            ) {
                continue;
            }


            if (
                object.type === "bush"
            ) {
                continue;
            }


            const dx =
                object.x - playerX;

            const dy =
                object.y - playerY;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance <
                closestDistance
            ) {

                closest =
                    object;

                closestDistance =
                    distance;
            }
        }
    }


    return closest;
}


/* =====================================
   PHÁ ĐỐI TƯỢNG
===================================== */

function destroyWorldObject(object) {

    destroyedObjects.add(
        getObjectID(object)
    );
}
