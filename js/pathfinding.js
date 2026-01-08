/**
 * Class for the DFS Pathfinding for the Maze
 */
export class DFSPathfinder {
    /**
     * Constructor for the DFS path finder
     * @param {Object} maze 
     */
    constructor(maze) {
        this.maze = maze;
    }

    /**
     * Find path from start to target
     * @param {Object} start 
     * @param {Object} target 
     */
    findPath(start, target){
        // Validate input safely
        if (!this.#isValidCell(start) || !this.#isValidCell(target)) {
            return [];
        }

        const stack = [];
        const visited = new Set();
        const parentMap = new Map();

        const key = (r, c) => `${r},${c}`;

        stack.push(start);
        visited.add(key(start.row, start.col));

        while (stack.length > 0) {
            const current = stack.pop();

            // Stop when target is found
            if (current.row === target.row && current.col === target.col) {
                return this.#reconstructPath(parentMap, current);
            }

            const neighbors = this.#getValidNeighbors(current);

            for (const next of neighbors) {
                const k = key(next.row, next.col);

                if (!visited.has(k)) {
                    visited.add(k);
                    parentMap.set(k, current);
                    stack.push(next);
                }
            }
        }

        // No path (should never happen)
        return [];
    }

    /**
     * Get the valid neighbors of a cell (cleared path)
     * @param {Object} cell 
     * @returns an array of objects containing valid neighbors' row and columns
     */
    #getValidNeighbors(cell) {
        const { row, col } = cell;
        const result = [];

        const maze = this.maze;

        if (!maze.isBlocked(row, col, "top") && row > 0)
            result.push({ row: row - 1, col});

        if (!maze.isBlocked(row, col, "bottom") && row < maze.rows - 1)
            result.push({ row: row + 1, col });

        if (!maze.isBlocked(row, col, "left") && col > 0)
            result.push({ row, col: col - 1 });

        if(!maze.isBlocked(row, col, "right") && col < maze.cols - 1)
            result.push({ row, col: col + 1 });

        return result;
    }

    /**
     * Follow the path from the parent map up to the end cell
     * @param {Map} parentMap 
     * @param {Object} endCell 
     * @returns array with reversed path with related cells
     */
    #reconstructPath(parentMap, endCell) {
        const path = [];
        let current = endCell;

        const key = (r, c) => `${r},${c}`;

        while (current) {
            path.push(current);
            current = parentMap.get(key(current.row, current.col));
        }

        return path.reverse();
    }

    /**
     * Validate if cell is valid checking row and column values
     * and if they do not go beyond the maze limits
     * @param {Object} cell 
     * @returns boolean
     */
    #isValidCell(cell) {
        return (
            cell &&
            Number.isInteger(cell.row) &&
            Number.isInteger(cell.col) &&
            cell.row >= 0 &&
            cell.row < this.maze.rows &&
            cell.col >= 0 &&
            cell.col < this.maze.cols
        );
    }
}