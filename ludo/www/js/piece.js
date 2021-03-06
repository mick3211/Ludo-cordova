import { table } from './index.js';
import { movePieceState, rollDiceState } from './states.js';
import { game } from './index.js';

const animation = 'animate__animated animate__fadeInDown';

class Piece {
    constructor(lockId, player) {
        this.path = table.mainPath;
        this.player = player;
        this.lock = document.getElementById(lockId);
        this.face = document.createElement('div');
        this.clickEvent = false;
        this.reset();

        this.face.addEventListener('click', () => {
            if (this.clickEvent) {
                if (!this.move(game.useSelectedDice())) {
                    console.log('vai pro movepiece');
                    movePieceState();
                }
            }
        });

        this.face.addEventListener('animationend', () => {
            if (this.path.cells[this.pos]) this.path.cells[this.pos].organize();
        });
    }

    reset() {
        if (this.pos) {
            this.path.cells[this.pos].popPiece(this);
        }
        this.lock.appendChild(this.face);
        this.pos = -1;
        this.steps = 0;
        this.locked = true;
        this.path = table.mainPath;
    }

    unlock() {
        this.path.cells[this.startPos].addPiece(this);
        this.pos = this.startPos;
        console.log('desbloqueado at:', this.pos);
        this.locked = false;
    }
    /////////////////////////////////////////////////////////////
    move(n) {
        console.log('movendo ' + n + ' casas');
        let roll = false;
        if (this.locked) {
            if (n === 6) {
                this.unlock();
            }
        } else if (this.steps + n < 57) {
            this.steps = this.steps + n;
            this.path.cells[this.pos].popPiece(this);
            this.path.cells[this.pos].organize();

            this.pos = (this.pos + n) % 52;
            if (this.steps > 50) {
                this.pos = this.steps - 51;
                this.path = this.finalPath;
            }

            if (this.path.checkForKill(this, this.pos) || this.steps === 56) {
                rollDiceState();
                roll = true;
            }
            if (this.steps === 56) {
                this.player.score++;
            }
            this.path.cells[this.pos].addPiece(this);
            console.log('roll', roll);
        }

        return roll;
    }
}

export class GreenPiece extends Piece {
    constructor(lockId, player) {
        super(lockId, player);
        this.color = 'green';
        this.startPos = 0;
        this.face.className = 'piece green ' + animation;
        this.mainPath = table.mainPath;
        this.finalPath = table.greenPath;
    }
}
export class YellowPiece extends Piece {
    constructor(lockId, player) {
        super(lockId, player);
        this.color = 'yellow';
        this.startPos = 13;
        this.face.className = 'piece yellow ' + animation;
        this.mainPath = table.mainPath;
        this.finalPath = table.yellowPath;
    }
}
export class BluePiece extends Piece {
    constructor(lockId, player) {
        super(lockId, player);
        this.color = 'blue';
        this.startPos = 26;
        this.face.className = 'piece blue ' + animation;
        this.mainPath = table.mainPath;
        this.finalPath = table.bluePath;
    }
}
export class RedPiece extends Piece {
    constructor(lockId, player) {
        super(lockId, player);
        this.color = 'red';
        this.startPos = 39;
        this.face.className = 'piece red ' + animation;
        this.mainPath = table.mainPath;
        this.finalPath = table.redPath;
    }
}
