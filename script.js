const gameContainer = document.getElementById('game');
const cells = document.querySelectorAll('.cell');
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let moves = 0;
let gameActive = true;
let moveMode = false; // For moving pieces
let selectedPieceIndex = null;

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
});

function renderBoard() {
    cells.forEach((cell, index) => {
        const content = board[index];
        const contentElement = document.createElement('div');
        contentElement.textContent = content;
        cell.innerHTML = '';
        cell.appendChild(contentElement);
        cell.style.color = content === 'X' ? '#b5dcf7' : (content === 'O' ? '#edc174' : 'inherit');
        cell.classList.toggle('selected', selectedPieceIndex === index);
    });
    if (gameActive) {
        gameContainer.style.backgroundColor = currentPlayer === 'X' ? '#b5dcf7' : '#edc174';
    }
}

function handleCellClick(index) {
    if (!gameActive) return;

    if (moveMode) {
        if (selectedPieceIndex === null && board[index] === currentPlayer) {
            selectedPieceIndex = index;
        } else if (selectedPieceIndex !== null && board[index] === '') {
            board[selectedPieceIndex] = '';
            board[index] = currentPlayer;
            selectedPieceIndex = null;
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            checkWinner();
        } else if (selectedPieceIndex !== null && board[index] === currentPlayer) {
            selectedPieceIndex = index;
        }
    } else {
        if (board[index] === '') {
            board[index] = currentPlayer;
            moves++;
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (moves >= 6) {
                moveMode = true;
            }
            checkWinner();
        } else if (selectedPieceIndex === index) { // Desfazer seleção se clicar na peça selecionada
            selectedPieceIndex = null;
        } else if (board[index] === currentPlayer) {
            selectedPieceIndex = index;
        }
    }
    renderBoard();
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameActive = false;
            highlightWinner(pattern);
            return;
        }
    }
    if (!board.includes('')) {
        gameActive = false;
    }
}

function highlightWinner(pattern) {
    const [a,  b, c] = pattern;
    const winnerColor = board[a] === 'X' ? '#b5dcf7' : '#edc174';
    gameContainer.style.backgroundColor = winnerColor;
    cells[a].classList.add('blink-twice');
    cells[b].classList.add('blink-twice');
    cells[c].classList.add('blink-twice');
    setTimeout(() => {
        cells[a].classList.remove('blink-twice');
        cells[b].classList.remove('blink-twice');
        cells[c].classList.remove('blink-twice');
        cells[a].classList.add('blink-thrice');
        cells[b].classList.add('blink-thrice');
        cells[c].classList.add('blink-thrice');
    }, 200); // 200ms para a segunda piscada
    setTimeout(() => {
        cells[a].classList.remove('blink-thrice');
        cells[b].classList.remove('blink-thrice');
        cells[c].classList.remove('blink-thrice');
        cells[a].style.backgroundColor = '#4d4957';
        cells[b].style.backgroundColor = '#4d4957';
        cells[c].style.backgroundColor = '#4d4957';
    }, 600); // 600ms para mudar permanentemente a cor
}

renderBoard();