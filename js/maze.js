/**
 * Maze Generator Class
 */
export class Maze {
    /**
     * Constructor for Maze class
     * @param {Number} canvasWidth 
     * @param {Number} canvasHeight 
     * @param {Number} cellSize 
     */
    constructor(canvasWidth, canvasHeight, cellSize = 20) {
        this.cellSize = cellSize;

        // Calculate grid size safely
        this.cols = Math.floor(canvasWidth / cellSize);
        this.rows = Math.floor(canvasHeight / cellSize);

        // 2D grid of cells
        this.grid = [];

        this.#createGrid();
        this.#generateMaze();
        this.#createEntrances();
        this.#clearCenter();
        this.#removeDeadEnds();
    }

    /**
     * Create empty grid based on calculated cols and rows
     */
    #createGrid() {
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = {
                    row,
                    col,
                    visited: false,
                    walls: {
                        top: true,
                        right: true,
                        bottom: true,
                        left: true
                    }
                };
            }
        }
    }

    /**
     * Generate maze based on the grid cells letting open walls
     */
    #generateMaze() {
        const stack = [];
        let current = this.grid[0][0];
        current.visited = true;

        do {
            const next = this.#getRandomUnvisitedNeighbor(current);

            if (next) {
                stack.push(current);
                this.#removeWalls(current, next);
                next.visited = true;
                current = next;
            } else {
                current = stack.pop();
            }
        } while (stack.length > 0);
    }

    /**
     * Get a random neighbor cell from the one given
     * @param {Object} cell 
     * @returns cell obj if not null
     */
    #getRandomUnvisitedNeighbor(cell) {
        const { row, col } = cell;
        const neighbors = [];

        const directions = [
            { r: -1, c: 0},
            { r: 1, c: 0 },
            { r: 0, c: -1},
            { r: 0, c: 1 }
        ];

        for (const d of directions) {
            const nr = row + d.r;
            const nc = col + d.c;

            if (
                nr >=0 && nr < this.rows &&
                nc >=0 && nc < this.cols &&
                !this.grid[nr][nc].visited
            ) {
                neighbors.push(this.grid[nr][nc]);
            }
        }

        if (neighbors.length === 0) return null;

        const index = Math.floor(Math.random() * neighbors.length);
        return neighbors[index];
    }

    /**
     * Remove neighbor cells' walls based on their positions
     * @param {Object} a 
     * @param {Object} b 
     */
    #removeWalls(a, b) {
        const x = a.col - b.col;
        const y = a.row - b.row;

        if (x === 1) {
            a.walls.left = false;
            b.walls.right = false;
        } else if (x === -1) {
            a.walls.right = false;
            b.walls.left = false;
        }

        if (y === 1) {
            a.walls.top = false;
            b.walls.bottom = false;
        } else if (y === -1) {
            a.walls.bottom = false;
            b.walls.top = false;
        }
    }

    /**
     * Create the 4 entrances to the maze
     */
    #createEntrances() {
        const midCol = Math.floor(this.cols / 2);
        const midRow = Math.floor(this.rows / 2);

        // Top
        this.grid[0][midCol].walls.top = false;
        // Bottom
        this.grid[this.rows - 1][midCol].walls.bottom = false;
        // Left
        this.grid[midRow][0].walls.left = false;
        // Right
        this.grid[midRow][this.cols - 1].walls.right = false;
    }

    /**
     * Clear the center of the maze where the cheese will sit
     */
    #clearCenter() {
        const centerRow = Math.floor(this.rows / 2);
        const centerCol = Math.floor(this.cols / 2);

        for (let r = centerRow - 1; r <= centerRow + 1; r++) {
            for (let c = centerCol - 1; c <= centerCol + 1; c++) {
                const cell = this.grid[r][c];
        cell.walls.top = false;
        cell.walls.bottom = false;
        cell.walls.left = false;
        cell.walls.right = false;
            }
        }
    }

    /**
     * Remove the walls from closed cells - >= 3 walls
     */
    #removeDeadEnds() {
        for (let row = 1; row < this.rows - 1; row++) {
            for (let col = 1; col < this.cols - 1; col++) {
                const cell = this.grid[row][col];

                // Getting the walls attribute of the current cell
                const walls = Object.values(cell.walls).filter(w => w).length;

                // If it's almost closed -> open one more wall
                if (walls >= 3) {
                    const directions = ["top", "right", "bottom", "left"];
                    const dir = directions[Math.floor(Math.random() * directions.length)];
                    cell.walls[dir] = false;
                }
            }
        }
    }

    /**
     * Public method for collision grid
     * @param {Number} row 
     * @param {Number} col 
     * @param {String} direction 
     * @returns 
     */
    isBlocked(row, col, direction) {
        return this.grid[row][col].walls[direction];
    }
}