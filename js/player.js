/**
 * Base class for players
 */
export class Player {
    constructor({ row, col, emoji, speed }) {
        this.row = row;
        this.col = col;
        this.emoji = emoji;
        this.speed = speed; // cells per second

        // Path produced by DFS
        this.path = [];
        this.pathIndex = 0;

        // Pixel position (for smooth animation)
        this.x = 0;
        this.y = 0;

        // Used to avoid jitter
        this.#syncToGrid();
    }

    /**
     * Validate and set the path
     * @param {Array} path 
     * @returns void
     */
    setPath(path) {
        // Validate if the path array is valid
        if (!Array.isArray(path) || path.length === 0) return;

        this.path = path;
        this.pathIndex = 0;
    }

    /**
     * Update the player position
     * @param {Number} deltaTime 
     * @param {Number} cellSize 
     * @returns void
     */
    update(deltaTime, cellSize) {
        // No path -> nothing to do
        if (!this.path || this.pathIndex >= this.path.length) return;

        const targetCell = this.path[this.pathIndex];

        // Calculate pixel position in x and y
        // to get to the center of the target cell
        const targetX = targetCell.col * cellSize + cellSize / 2;
        const targetY = targetCell.row * cellSize * cellSize / 2;

        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.hypot(dx, dy);

        // How far we move this trame
        const step = this.speed * cellSize * deltaTime;

        if (distance <= step) {
            // Snap to cell
            this.x = targetX;
            this.y = targetY;
            this.row = targetCell.row;
            this.col = targetCell.col;
            this.pathIndex++;
        } else {
            // Move smoothly toward the target
            this.x += (dx / distance) * step;
            this.y += (dy / distance) * step;
        }
    }

    /**
     * Draw the player in the canvas
     * @param {Object} ctx canvas context
     */
    draw(ctx) {
        ctx.font = "24px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.emoji, this.x, this.y);
    }

    /**
     * Collision check between current player and other player Object
     * @param {Object} other player
     * @returns boolean
     */
    isOnSameCell(other) {
        return this.row === other.row && this.col === other.col;
    }

    /**
     * Private helper to ajust player position to grid
     */
    #syncToGrid() {
        this.x = this.col * 20 + 10;
        this.y = this.row * 20 + 10;
    }
}