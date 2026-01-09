// import { Maze } from "./maze.js";
// import { DFSPathfinder } from "./pathfinding.js";
// import { Player } from "./player.js";
// import { Cheese } from "./cheese.js";
// import { Game } from "./game.js";
// import { UIController } from "./ui.js";
// import { Emoji, PlayerTypes } from "./utils.js";

// Canvas initialization
const canvas = document.getElementById("gameCanvas");

if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Canvas element not found or invalid");
}

const ctx = canvas.getContext("2d");

if (!ctx) {
    throw new Error("Failed to get 2D context");
}

// TODO: move to utils.js and change pieces of code that use these atts
const CELL_SIZE = 20;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const maze = new Maze(CANVAS_WIDTH, CANVAS_HEIGHT, CELL_SIZE);

const entrances = [
    { row: 0, col: Math.floor(maze.cols / 2) },                 // Top
    { row: maze.rows - 1, col: Math.floor(maze.cols / 2) },     // Bottom
    { row: Math.floor(maze.rows / 2), col: 0 },                 // Left
    { row: Math.floor(maze.rows / 2), col: maze.cols - 1 }      // Right
];

/**
 * Pick different entrances to spawn the Cat and Mouse
 * @param {Array} list array of entrances objects
 * @returns array of entrance positions
 */
function pickTwoDifferentEntrances(list) {
    const firstIndex = Math.floor(Math.random() * list.length);

    let secondIndex;
    do {
        secondIndex = Math.floor(Math.random() * list.length);
    } while (secondIndex === firstIndex);

    return [list[firstIndex], list[secondIndex]];
}

const [mouseStart, catStart] = pickTwoDifferentEntrances(entrances);

const cheeseRow = Math.floor(maze.rows / 2);
const cheeseCol = Math.floor(maze.cols / 2);

const cheese = new Cheese(cheeseRow, cheeseCol);

const mouse = new Player({
    row: mouseStart.row,
    col: mouseStart.col,
    emoji: Emoji.MOUSE,
    speed: 1.0
});

const catSpeed = 1 + (Math.random() * 0.05 + 0.15); // random number between 1.15 and 1.20

const cat = new Player({
    row: catStart.row,
    col: catStart.col,
    emoji: Emoji.CAT,
    speed: catSpeed
});

const pathfinder = new DFSPathfinder(maze);

const game = new Game(ctx, maze, cat, mouse, cheese, pathfinder);

new UIController(game);