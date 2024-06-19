document.addEventListener('DOMContentLoaded', () => {
    let playerText = document.getElementById('playerText');
    let restartButton = document.getElementById('restartButton');
    let miniBoards = Array.from(document.getElementsByClassName('mini-board'));
    let currentPlayer = 'X';
    let gameState = Array(9).fill().map(() => Array(9).fill(null));
    let mainBoard = Array(9).fill(null);
    let activeMiniBoard = null;
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    miniBoards.forEach((board, index) => {
        for (let i = 0; i < 9; i++) {
            let box = document.createElement('div');
            box.classList.add('box');
            box.id = `${index}-${i}`;
            box.addEventListener('click', boxClicked);
            board.appendChild(box);
        }
    });

    function boxClicked(e) {
        const [boardIndex, boxIndex] = e.target.id.split('-').map(Number);
        if (!gameState[boardIndex][boxIndex] && (activeMiniBoard === null || activeMiniBoard === boardIndex)) {
            gameState[boardIndex][boxIndex] = currentPlayer;
            e.target.innerText = currentPlayer;

            if (checkWin(gameState[boardIndex])) {
                mainBoard[boardIndex] = currentPlayer;
                document.getElementById(`mini-board-${boardIndex}`).style.border = '3px solid var(--winning-blocks)';
                if (checkWin(mainBoard)) {
                    playerText.innerText = `${currentPlayer} has won the game!`;
                    return;
                }
            }

            activeMiniBoard = boxIndex;
            if (mainBoard[boxIndex] !== null) {
                activeMiniBoard = null;
            }

            updateBoardState();

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            playerText.innerText = `Player ${currentPlayer}'s Turn`;
        }
    }

    function checkWin(board) {
        for (const combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return true;
            }
        }
        return false;
    }

    function updateBoardState() {
        document.querySelectorAll('.box').forEach(box => {
            const [boardIndex, boxIndex] = box.id.split('-').map(Number);
            if (mainBoard[boardIndex] !== null || (activeMiniBoard !== null && activeMiniBoard !== boardIndex)) {
                box.classList.add('disabled');
                box.classList.remove('active');
            } else {
                box.classList.remove('disabled');
                box.classList.add('active');
            }
        });
    }

    restartButton.addEventListener('click', restartGame);
    function restartGame() {
        gameState = Array(9).fill().map(() => Array(9).fill(null));
        mainBoard = Array(9).fill(null);
        activeMiniBoard = null;
        currentPlayer = 'X';
        playerText.innerText = 'Player X\'s Turn';
        document.querySelectorAll('.box').forEach(box => {
            box.innerText = '';
            box.classList.remove('disabled', 'active');
        });
        miniBoards.forEach(board => {
            board.style.border = '1px solid #fff';
        });
        updateBoardState();
    }

    updateBoardState();
});
