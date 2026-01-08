import { GameState } from "./utils";

/**
 * UI Controller class
 */
export class UIController {
    /**
     * UI Controller class constructor
     * @param {Object} game instance of game class
     */
    constructor(game) {
        this.game = game;

        this.startBtn = document.getElementById("startBtn");
        this.stopBtn = document.getElementById("stopBtn");
        this.resetBtn = document.getElementById("resetBtn");

        this.#validate();
        this.#bind();
    }

    /**
     * Validate DOM references
     */
    #validate() {
        if (!this.startBtn || !this.stopBtn || !this.resetBtn) {
            throw new Error("UI elements not found");
        }
    }

    /**
     * Bind the UI elements to the game methods
     */
    #bind() {
        this.startBtn.addEventListener("click", () => {
            if (this.game.state !== GameState.RUNNING) {
                this.game.start();
            }
        });

        this.stopBtn.addEventListener("click", () => {
            this.game.stop();
        });

        this.resetBtn.addEventListener("click", () => {
            window.location.reload();
        });
    }
}