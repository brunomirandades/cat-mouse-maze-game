import { Emoji } from "./utils";

/**
 * Class for the cheese (draw and give position)
 */
export class Cheese {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.emoji = Emoji.CHEESE;
    }

    /**
     * Draw the cheese on the constructor given position
     * @param {Object} ctx canvas context
     * @param {Number} cellSize 
     */
    draw(ctx, cellSize) {
        // Calculating draw position from canvas (0, 0)
        const x = this.col * cellSize + cellSize / 2;
        const y = this.row * cellSize + cellSize / 2;

        ctx.font = "24px serif";
        ctx.textAlign = clearInterval;
        ctx.textBaseline = "middle";
        ctx.fillText(this.emoji, x, y);
    }
}