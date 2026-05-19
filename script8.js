// chess logic
// PIECES ON BOARD
function setPiece(id, piece, color) {
    let sq = document.getElementById(id);
    sq.innerHTML = piece;
    sq.classList.remove("white-piece");
    sq.classList.remove("black-piece");
    sq.classList.add(color + "-piece");
}
function clearSquare(id) {
    let sq = document.getElementById(id);
    sq.innerHTML = "";
    sq.classList.remove("white-piece");
    sq.classList.remove("black-piece");
    sq.classList.remove("selected");
}
// START BOARD
function spawn_pieces() {
    let all = document.querySelectorAll("td");

    for (let i = 0; i < all.length; i++) {
        all[i].innerHTML = "";
        all[i].classList.remove("white-piece");
        all[i].classList.remove("black-piece");
        all[i].classList.remove("selected");
    }

    // white
    setPiece("a1","♖","white");
    setPiece("b1","♘","white");
    setPiece("c1","♗","white");
    setPiece("d1","♕","white");
    setPiece("e1","♔","white");
    setPiece("f1","♗","white");
    setPiece("g1","♘","white");
    setPiece("h1","♖","white");

    setPiece("a2","♙","white");
    setPiece("b2","♙","white");
    setPiece("c2","♙","white");
    setPiece("d2","♙","white");
    setPiece("e2","♙","white");
    setPiece("f2","♙","white");
    setPiece("g2","♙","white");
    setPiece("h2","♙","white");

    // black
    setPiece("a8","♖","black");
    setPiece("b8","♘","black");
    setPiece("c8","♗","black");
    setPiece("d8","♕","black");
    setPiece("e8","♔","black");
    setPiece("f8","♗","black");
    setPiece("g8","♘","black");
    setPiece("h8","♖","black");

    setPiece("a7","♙","black");
    setPiece("b7","♙","black");
    setPiece("c7","♙","black");
    setPiece("d7","♙","black");
    setPiece("e7","♙","black");
    setPiece("f7","♙","black");
    setPiece("g7","♙","black");
    setPiece("h7","♙","black");
}
spawn_pieces();

// VARIABLES
let whiteTurn = true;
let selectedSquare = null;

let whiteKingMoved = false;
let blackKingMoved = false;

let whiteLeftRookMoved = false;
let whiteRightRookMoved = false;

let blackLeftRookMoved = false;
let blackRightRookMoved = false;

let lastMoveFrom = "";
let lastMoveTo = "";

let moveNumber = 0;  // ← ADD THIS
let score = 0;       // ← AND THIS

// TURN TEXT
function Turn_Order() {
    let t = document.getElementById("Turn");
    if (whiteTurn == true) {
        t.innerHTML = "White Turn";
    } else {
        t.innerHTML = "Black Turn";
    }
}
Turn_Order();

// GET COLOR
function getColor(square) {
    if (square.classList.contains("white-piece")) return "white";
    if (square.classList.contains("black-piece")) return "black";
    return "";
}
// FIND KING
function findKing(color) {
    let all = document.querySelectorAll("td");
    for (let i = 0; i < all.length; i++) {
        if (
            all[i].innerHTML == "♔" &&
            all[i].classList.contains(color + "-piece")
        ) {
            return all[i].id;
        }
    }
    return "";
}
// VALID MOVE
function isValidMove(fromId, toId, color) {
    let from = document.getElementById(fromId);
    let to = document.getElementById(toId);

    let piece = from.innerHTML;

    let fc = fromId.charCodeAt(0);
    let fr = parseInt(fromId[1]);

    let tc = toId.charCodeAt(0);
    let tr = parseInt(toId[1]);

    let dx = tc - fc;
    let dy = tr - fr;

    let adx = Math.abs(dx);
    let ady = Math.abs(dy);

    if (to.classList.contains(color + "-piece")) return false;
    // pawn
    if (piece == "♙") {
        let dir;

        if (color == "white") dir = 1;
        else dir = -1;

        if (dx == 0 && dy == dir && to.innerHTML == "") return true;

        if (dx == 0 && dy == dir * 2) {
            if (color == "white" && fr == 2 && to.innerHTML == "") return true;
            if (color == "black" && fr == 7 && to.innerHTML == "") return true;
        }
        if (adx == 1 && dy == dir && to.innerHTML != "") return true;

        // en passant
        if (adx == 1 && dy == dir && to.innerHTML == "") {
            if (lastMoveTo != "") {
                if (lastMoveTo[0] == toId[0]) return true;
            }
        }
        return false;
    }
    // knight
    if (piece == "♘") {
        if (adx == 1 && ady == 2) return true;
        if (adx == 2 && ady == 1) return true;
        return false;
    }
    // bishop
    if (piece == "♗") {
        if (adx == ady) return true;
        return false;
    }
    // rook
    if (piece == "♖") {
        if (fc == tc || fr == tr) return true;
        return false;
    }
    // queen
    if (piece == "♕") {
        if (fc == tc || fr == tr) return true;
        if (adx == ady) return true;
        return false;
    }
    // king
    if (piece == "♔") {
        if (adx <= 1 && ady <= 1) return true;
        // castle white
        if (color == "white" && fromId == "e1") {
            if (toId == "g1" && whiteKingMoved == false && whiteRightRookMoved == false) return true;
            if (toId == "c1" && whiteKingMoved == false && whiteLeftRookMoved == false) return true;
        }
        // castle black
        if (color == "black" && fromId == "e8") {
            if (toId == "g8" && blackKingMoved == false && blackRightRookMoved == false) return true;
            if (toId == "c8" && blackKingMoved == false && blackLeftRookMoved == false) return true;
        }
        return false;
    }
    return false;
}
// CHECK FUNCTIONS
function isSquareAttacked(squareId, enemyColor) {
    let all = document.querySelectorAll("td");

    let tc = squareId.charCodeAt(0);
    let tr = parseInt(squareId[1]);
    for (let i = 0; i < all.length; i++) {
        if (all[i].classList.contains(enemyColor + "-piece")) {
            let fromId = all[i].id;
            let piece = all[i].innerHTML;

            let fc = fromId.charCodeAt(0);
            let fr = parseInt(fromId[1]);

            let dx = tc - fc;
            let dy = tr - fr;

            let adx = Math.abs(dx);
            let ady = Math.abs(dy);
            // pawn
            if (piece == "♙") {
                if (enemyColor == "white") {
                    if (ady == 1 && dy == 1 && adx == 1) return true;
                } else {
                    if (ady == 1 && dy == -1 && adx == 1) return true;
                }
            }
            // knight
            if (piece == "♘") {
                if ((adx == 1 && ady == 2) || (adx == 2 && ady == 1)) {
                    return true;
                }
            }
            // king
            if (piece == "♔") {
                if (adx <= 1 && ady <= 1) return true;
            }
            // bishop / queen diagonal
            if (piece == "♗" || piece == "♕") {
                if (adx == ady) {
                    let stepX = dx > 0 ? 1 : -1;
                    let stepY = dy > 0 ? 1 : -1;

                    let c = fc + stepX;
                    let r = fr + stepY;

                    let blocked = false;

                    while (c != tc && r != tr) {
                        let id = String.fromCharCode(c) + r;
                        if (document.getElementById(id).innerHTML != "") {
                            blocked = true;
                            break;
                        }
                        c += stepX;
                        r += stepY;
                    }
                    if (blocked == false) return true;
                }
            }
            // rook / queen straight
            if (piece == "♖" || piece == "♕") {
                if (fc == tc || fr == tr) {
                    let blocked = false;
                    if (fc == tc) {
                        let step = dy > 0 ? 1 : -1;
                        for (let r = fr + step; r != tr; r += step) {
                            let id = String.fromCharCode(fc) + r;
                            if (document.getElementById(id).innerHTML != "") {
                                blocked = true;
                                break;
                            }
                        }
                    }
                    if (fr == tr) {
                        let step = dx > 0 ? 1 : -1;
                        for (let c = fc + step; c != tc; c += step) {
                            let id = String.fromCharCode(c) + fr;
                            if (document.getElementById(id).innerHTML != "") {
                                blocked = true;
                                break;
                            }
                        }
                    }
                    if (blocked == false) return true;
                }
            }
        }
    }
    return false;
}
function moveLeavesKingInCheck(fromId, toId, color) {
    let from = document.getElementById(fromId);
    let to = document.getElementById(toId);

    let oldFrom = from.innerHTML;
    let oldTo = to.innerHTML;

    let oldToWhite = to.classList.contains("white-piece");
    let oldToBlack = to.classList.contains("black-piece");

    to.innerHTML = from.innerHTML;
    from.innerHTML = "";

    from.classList.remove("white-piece");
    from.classList.remove("black-piece");

    to.classList.remove("white-piece");
    to.classList.remove("black-piece");
    to.classList.add(color + "-piece");

    let king = findKing(color);
    let enemy;

    if (color == "white") enemy = "black";
    else enemy = "white";

    let result = isSquareAttacked(king, enemy);

    from.innerHTML = oldFrom;
    to.innerHTML = oldTo;

    from.classList.add(color + "-piece");

    to.classList.remove("white-piece");
    to.classList.remove("black-piece");

    if (oldToWhite) to.classList.add("white-piece");
    if (oldToBlack) to.classList.add("black-piece");

    return result;
}
function hasAnyLegalMove(color) {
    let all = document.querySelectorAll("td");
    for (let i = 0; i < all.length; i++) {
        if (!all[i].classList.contains(color + "-piece")) continue;
        for (let j = 0; j < all.length; j++) {
            if (all[i].id == all[j].id) continue;

            if (isValidMove(all[i].id, all[j].id, color)) {
                if (!moveLeavesKingInCheck(all[i].id, all[j].id, color)) {
                    return true;
                }
            }
        }
    }
    return false;
}
function checkGameEnd() {
    let color;

    if (whiteTurn == true) color = "white";
    else color = "black";

    let enemy;

    if (color == "white") enemy = "black";
    else enemy = "white";

    let king = findKing(color);

    let inCheck = isSquareAttacked(king, enemy);
    let canMove = hasAnyLegalMove(color);

    if (canMove == false) {
        if (inCheck == true) {
            alert(color + " CHECKMATED!");
        } else {
            alert("STALEMATE!");
        }
    }
}
// CLICK SYSTEM
let allSquares = document.querySelectorAll("td");

for (let i = 0; i < allSquares.length; i++) {
    allSquares[i].onclick = function () {
        if (selectedSquare == null) {
            if (this.innerHTML == "") return;
            if (whiteTurn == true && this.classList.contains("white-piece")) {
                selectedSquare = this.id;
                this.classList.add("selected");
                return;
            }
            if (whiteTurn == false && this.classList.contains("black-piece")) {
                selectedSquare = this.id;
                this.classList.add("selected");
                return;
            }
            return;
        }
        if (this.id == selectedSquare) {
            this.classList.remove("selected");
            selectedSquare = null;
            return;
        }
        let oldSquare = document.getElementById(selectedSquare);
        let color = getColor(oldSquare);

        if (isValidMove(selectedSquare, this.id, color) == false) return;
        if (moveLeavesKingInCheck(selectedSquare, this.id, color)) return;

        let piece = oldSquare.innerHTML;
        // en passant
        if (
            piece == "♙" &&
            selectedSquare[0] != this.id[0] &&
            this.innerHTML == ""
        ) {
            clearSquare(this.id[0] + selectedSquare[1]);
        }
        // move piece
        this.innerHTML = piece;
        this.classList.remove("white-piece");
        this.classList.remove("black-piece");
        this.classList.add(color + "-piece");

        clearSquare(selectedSquare);
        // castle rook move
        if (piece == "♔") {
            if (color == "white") {
                whiteKingMoved = true;
                if (this.id == "g1") {
                    setPiece("f1","♖","white");
                    clearSquare("h1");
                }
                if (this.id == "c1") {
                    setPiece("d1","♖","white");
                    clearSquare("a1");
                }
            }
            if (color == "black") {
                blackKingMoved = true;
                if (this.id == "g8") {
                    setPiece("f8","♖","black");
                    clearSquare("h8");
                }
                if (this.id == "c8") {
                    setPiece("d8","♖","black");
                    clearSquare("a8");
                }
            }
        }
        if (selectedSquare == "a1") whiteLeftRookMoved = true;
        if (selectedSquare == "h1") whiteRightRookMoved = true;
        if (selectedSquare == "a8") blackLeftRookMoved = true;
        if (selectedSquare == "h8") blackRightRookMoved = true;

        lastMoveFrom = selectedSquare;
        lastMoveTo = this.id;

        selectedSquare = null;

        whiteTurn = !whiteTurn;

        Turn_Order();

        checkGameEnd();
    };
}
// BUTTONS
let button1 = document.querySelector(".button1");
let button2 = document.querySelector(".button2");
let button3 = document.querySelector(".button3");
let ClearBoard = document.querySelector(".ClearBoard");

let boxes = document.querySelectorAll("td");
button1.onclick = function () {
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].classList.contains("dark")) {
            boxes[i].style.background = "red";
        }
    }
};
button2.onclick = function () {
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].classList.contains("dark")) {
            boxes[i].style.background = "#90EE90";
        }
    }
};
button3.onclick = function () {
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].classList.contains("dark")) {
            boxes[i].style.background = "#ADD8E6";
        }
    }
};
ClearBoard.onclick = function () {
    spawn_pieces();

    whiteTurn = true;
    selectedSquare = null;

    whiteKingMoved = false;
    blackKingMoved = false;

    whiteLeftRookMoved = false;
    whiteRightRookMoved = false;

    blackLeftRookMoved = false;
    blackRightRookMoved = false;

    lastMoveFrom = "";
    lastMoveTo = "";

    Turn_Order();
};
function saveGame() {

    let data = {};

    let squares = document.querySelectorAll("td");

    for (let i = 0; i < squares.length; i++) {
        let id = squares[i].id;

        data[id] = squares[i].innerHTML;

        if (squares[i].classList.contains("white-piece")) {
            data[id + "_color"] = "white";
        } else if (squares[i].classList.contains("black-piece")) {
            data[id + "_color"] = "black";
        } else {
            data[id + "_color"] = "";
        }
    }

    data.turn_number = moveNumber;
    data.turn_color  = whiteTurn ? "White" : "Black";
    data.score       = score;

    fetch("save.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

function loadGame() {
    fetch("load.php")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.error) {
            alert("No saved game found.");
            return;
        }

        let squares = document.querySelectorAll("td");
        for (let i = 0; i < squares.length; i++) {
            squares[i].innerHTML = "";
            squares[i].classList.remove("white-piece");
            squares[i].classList.remove("black-piece");
            squares[i].classList.remove("selected");
        }

        let cols = ["a","b","c","d","e","f","g","h"];
        let rows = [1,2,3,4,5,6,7,8];

        for (let c = 0; c < cols.length; c++) {
            for (let r = 0; r < rows.length; r++) {
                let id    = cols[c] + rows[r];
                let piece = data[id];
                let color = data[id + "_color"];

                if (piece != "" && color != "") {
                    setPiece(id, piece, color);
                }
            }
        }

        moveNumber = parseInt(data.turn_number);
        whiteTurn  = data.turn_color === "White";
        score      = parseInt(data.score);

        selectedSquare = null;
        lastMoveFrom   = "";
        lastMoveTo     = "";

        whiteKingMoved      = true;
        blackKingMoved      = true;
        whiteLeftRookMoved  = true;
        whiteRightRookMoved = true;
        blackLeftRookMoved  = true;
        blackRightRookMoved = true;

        Turn_Order();

        alert("Game loaded!");
    });
}

console.log("9");