import { Emoji, GameState, PlayerTypes } from "./utils.js";

/**
 * Class for the game engine
 */
export class Game {
    constructor(ctx, maze, cat, mouse, cheese, pathfinder) {
        this.ctx = ctx;
        this.maze = maze;
        this.cat = cat;
        this.mouse = mouse;
        this.cheese = cheese;
        this.pathfinder = pathfinder;

        this.state = GameState.STOPPED;
        this.lastTime = 0;
        this.winner = null;
    }

    /**
     * Start the game
     * @returns void
     */
    start() {
        if (this.state === GameState.RUNNING) return;

        this.state = GameState.RUNNING;
        this.lastTime = performance.now();
        requestAnimationFrame(this.#loop.bind(this));
    }

    /**
     * Change the state of the game to STOPPED;
     * @returns void
     */
    stop() {
        if (this.state !== GameState.RUNNING) return;
        this.state = GameState.STOPPED;
    }

    /**
     * Main game loop
     * @param {Number} timeStamp 
     * @returns void
     */
    #loop(timeStamp) {
        if (this.state !== GameState.RUNNING) return;

        // Time difference (delta) between loop calls in seconds
        const deltaTime = (timeStamp - this.lastTime) / 1000;
        this.lastTime = timeStamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.#loop.bind(this));
    }

    /**
     * Update game conditions logic
     * @param {Number} deltaTime 
     */
    update(deltaTime) {
        // Recalculate paths
        this.mouse.setPath(
            this.pathfinder.findPath(this.mouse, this.cheese)
        );

        this.cat.setPath(
            this.pathfinder.findPath(this.cat, this.mouse)
        );

        // Move players
        this.mouse.update(deltaTime, this.maze.cellSize);
        this.cat.update(deltaTime, this.maze.cellSize);

        // Check win conditions
        this.#checkWin();
    }

    /**
     * Win logic
     */
    #checkWin() {
        if (this.mouse.isOnSameCell(this.cheese)) {
            this.winner = PlayerTypes.MOUSE;
            this.state = GameState.ENDED;
        }

        if (this.cat.isOnSameCell(this.mouse)) {
            this.winner = PlayerTypes.CAT;
            this.state = GameState.ENDED;
        }
    }

    /**
     * Render elements onscreen
     */
    render() {
        this.ctx.clearRect(0, 0, 800, 600);

        this.#drawMaze();
        this.cheese.draw(this.ctx, this.maze.cellSize);
        this.mouse.draw(this.ctx);
        this.cat.draw(this.ctx);

        if (this.state === GameState.ENDED) {
            this.#drawWinScreen();
        }
    }

    /**
     * Draw the maze on canvas based on the maze grid
     */
    #drawMaze() {
        const size = this.maze.cellSize;
        const ctx = this.ctx;

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;

        for (const row of this.maze.grid) {
            for (const cell of row) {
                const x = cell.col * size;
                const y = cell.row * size;

                if (cell.walls.top) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + size, y);
                    ctx.stroke();
                }
                if (cell.walls.right) {
                    ctx.beginPath();
                    ctx.moveTo(x + size, y);
                    ctx.lineTo(x + size, y + size);
                    ctx.stroke();
                }
                if (cell.walls.bottom) {
                    ctx.beginPath();
                    ctx.moveTo(x + size, y + size);
                    ctx.lineTo(x, y + size);
                    ctx.stroke();
                }
                if (cell.walls.left) {
                    ctx.beginPath();
                    ctx.moveTo(x, y + size);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            }
        }
    }

    #drawWinScreen() {
        const ctx = this.ctx;

        // Dark background
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        // TODO: get the canvas size as parameter and change references
        ctx.fillRect(0, 0, 800, 600);

        // Box geometry
        const boxW = 300;
        const boxH = 180;
        const x = (800 - boxW) / 2;
        const y = (600 - boxH) / 2;
        const r = 20;

        // Enable shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 8;

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + boxW - r, y);
        ctx.quadraticCurveTo(x + boxW, y, x + boxW, y + r);
        ctx.lineTo(x + boxW, y + boxH - r);
        ctx.quadraticCurveTo(x + boxW, y + boxH, x + boxW - r, y + boxH);
        ctx.lineTo(x + r, y + boxH);
        ctx.quadraticCurveTo(x, y + boxH, x, y + boxH - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();

        // Enable shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Text
        ctx.fillStyle = "#000"
        ctx.font = "32px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";

        const emoji = this.winner === PlayerTypes.CAT ? Emoji.CAT : Emoji.MOUSE;
        ctx.fillText(`${emoji} WINS!`, 400, 300);
    }
}