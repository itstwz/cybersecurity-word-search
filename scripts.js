const modal = document.getElementById("user-modal");
const form = document.getElementById("user-form");

let currentUserName = "";
let currentUserEmail = "";

form.addEventListener("submit", function (e) {
  e.preventDefault();

  currentUserName = document.getElementById("first-name").value.trim();
  currentUserEmail = document.getElementById("work-email").value.trim();
  const userId = document.getElementById("user-id").value.trim();

  if (currentUserName && currentUserEmail && userId) {
    modal.style.display = "none";
    console.log("User Info:", {
      currentUserName,
      currentUserEmail,
      userId
    });
  }
});

// 🌐 Global declaration
const wordList = [
  "phishing", "firewall", "encryption", "malware", "vpn",
  "password", "ransomware", "antivirus", "breach", "authentication",
  "spoofing", "token", "patch", "zero-day", "backdoor"
];

document.addEventListener("DOMContentLoaded", function () {
  const wordListEl = document.getElementById("words");
  wordListEl.innerHTML = "";

  wordList.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    wordListEl.appendChild(li);
  });
});

  const gridSize = 15;
  const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(""));

  let timerStarted = false;
  let timerInterval;
  let elapsedSeconds = 0;
  let score = 0;
  let foundWords = new Set();
  let lastWordTime = 0;
  let hasFoundFirstWord = false;
  let currentStreak = 0;
  let streakTimeout = null;

  let placementSuccessful = false;

function generateWordGrid() {
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      grid[r][c] = "";
    }
  }

  for (const word of wordList) {
    let placed = false;
    let attempts = 0;
    const directions = ["horizontal", "vertical"];

    while (!placed && attempts < 5000) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);

      if (canPlaceWord(grid, word, row, col, direction)) {
        placeWord(grid, word, row, col, direction);
        placed = true;
      }

      attempts++;
    }

    if (!placed) {
      console.warn(`🔁 Failed to place word: ${word}`);
    }
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = getRandomLetter();
      }
    }
  }
}

function renderGridFromArray() {
  const gridContainer = document.getElementById("word-grid");
  gridContainer.innerHTML = "";

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      cell.textContent = grid[r][c];
      cell.dataset.row = r;
      cell.dataset.col = c;
      gridContainer.appendChild(cell);
    }
  }

  attachCellListeners();
}

function getRandomLetter() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)];
}

function attachCellListeners() {
  const allCells = document.querySelectorAll(".grid-cell");
  allCells.forEach(cell => {
    cell.addEventListener("mouseenter", () => {
      if (!isMouseDown || selectedCells.includes(cell)) return;
      cell.classList.add("selected");
      selectedCells.push(cell);
    });
  });
}

function populateWordList() {
  const wordListEl = document.getElementById("words");
  wordListEl.innerHTML = "";
  wordList.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    wordListEl.appendChild(li);
  });
}

  while (!placementSuccessful) {
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        grid[r][c] = "";
      }
    }

    placementSuccessful = true;

    for (const word of wordList) {
      let placed = false;
      let attempts = 0;
      const directions = ["horizontal", "vertical"];

      while (!placed && attempts < 5000) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);

        if (canPlaceWord(grid, word, row, col, direction)) {
          placeWord(grid, word, row, col, direction);
          placed = true;
        }

        attempts++;
      }

      if (!placed) {
        console.warn(`🔁 Restarting grid due to failed placement: ${word}`);
        placementSuccessful = false;
        break;
      }
    }
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  const gridContainer = document.getElementById("word-grid");
  gridContainer.innerHTML = "";

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      cell.textContent = grid[r][c];
      cell.dataset.row = r;
      cell.dataset.col = c;
      gridContainer.appendChild(cell);
    }
  }

    // Selection logic
let isMouseDown = false;
let selectedCells = [];
let dragDirection = null;

gridContainer.addEventListener("mousedown", (e) => {
  if (!e.target || !e.target.classList.contains("grid-cell")) return;

  isMouseDown = true;
  selectedCells = [e.target];
  e.target.classList.add("selected");

  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  e.preventDefault();
});

gridContainer.addEventListener("mouseup", () => {
  isMouseDown = false;
  dragDirection = null;

  if (selectedCells.length < 2) {
    selectedCells.forEach(cell => cell.classList.remove("selected"));
    selectedCells = [];
    return;
  }

  const sortedSubset = sortCellsByGridPosition(selectedCells);
  const candidateWord = sortedSubset.map(c => c.textContent).join("").toLowerCase();

  if (wordList.includes(candidateWord) && isStraightLine(sortedSubset)) {
    if (!foundWords.has(candidateWord)) {
      foundWords.add(candidateWord);

      const progressBar = document.getElementById("progress-bar");
      const progressCount = document.getElementById("progress-count");

      progressBar.value = foundWords.size;
      progressCount.textContent = `${foundWords.size} / ${wordList.length}`;
    }

    score += 100;

    // 🟢 Update streak
    currentStreak++;
    const streakEl = document.getElementById("streak");
    streakEl.textContent = currentStreak;
    streakEl.classList.add("streak-animate");
    setTimeout(() => streakEl.classList.remove("streak-animate"), 400);

    // 🕒 Reset streak if no word found in 15s
    clearTimeout(streakTimeout);
    streakTimeout = setTimeout(() => {
      currentStreak = 0;
      streakEl.textContent = currentStreak;
    }, 15000);

    const now = elapsedSeconds;
    const timeSinceLast = now - lastWordTime;
    lastWordTime = now;

    let speedBonusAwarded = false;
    if (hasFoundFirstWord && timeSinceLast <= 10) {
      score += 50;
      speedBonusAwarded = true;
    }

    hasFoundFirstWord = true;

    if (speedBonusAwarded) {
      const bonusTag = document.getElementById("bonus-tag");
      if (bonusTag) {
        bonusTag.textContent = "+50";
        bonusTag.classList.add("bonus-visible");
        setTimeout(() => {
          bonusTag.classList.remove("bonus-visible");
          bonusTag.textContent = "";
        }, 1000);
      }
    }

    const scoreEl = document.getElementById("score");
    if (scoreEl) {
      scoreEl.textContent = score;
      scoreEl.classList.add("score-animate");
      setTimeout(() => scoreEl.classList.remove("score-animate"), 300);
    }

    sortedSubset.forEach(cell => {
      cell.classList.remove("selected");
      cell.classList.add("found");
    });

    const wordItems = document.querySelectorAll("#words li");
    wordItems.forEach(item => {
      const itemText = item.textContent.toLowerCase();
      if (itemText === candidateWord) {
        item.classList.add("found");
      }
    });

    selectedCells = selectedCells.filter(c => !sortedSubset.includes(c));
    checkGameComplete();

  } else {
    console.log("❌ No valid word found in selection");

    // 🔄 Reset streak immediately
    currentStreak = 0;
    document.getElementById("streak").textContent = currentStreak;

    sortedSubset.forEach(cell => {
      cell.classList.remove("selected");
    });
    selectedCells = [];
  }
});

const allCells = document.querySelectorAll(".grid-cell");
allCells.forEach(cell => {
  cell.addEventListener("mouseenter", () => {
    if (!isMouseDown || selectedCells.includes(cell)) return;

    cell.classList.add("selected");
    selectedCells.push(cell);
  });
});

gridContainer.addEventListener("mouseleave", () => {
  isMouseDown = false;
});

// Timer function
function startTimer() {
  const timerDisplay = document.getElementById("timer");
  if (!timerDisplay) {
    console.warn("Timer element not found in DOM.");
    return;
  }

  timerInterval = setInterval(() => {
    elapsedSeconds++;
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = formatted;
  }, 1000);
}

// ✅ Updated game completion check
function checkGameComplete() {
  const allFound = wordList.every(word =>
    foundWords.has(word.toLowerCase())
  );

  if (allFound) {
  clearInterval(timerInterval);
  showLeaderboard(score); // ✅ Trigger leaderboard only
}
}

// Placement helpers
function canPlaceWord(grid, word, row, col, direction) {
  const len = word.length;

  switch (direction) {
    case "horizontal":
      if (col + len > gridSize) return false;
      for (let i = 0; i < len; i++) {
        if (grid[row][col + i] !== "" && grid[row][col + i] !== word[i].toUpperCase()) return false;
      }
      break;

    case "vertical":
      if (row + len > gridSize) return false;
      for (let i = 0; i < len; i++) {
        if (grid[row + i][col] !== "" && grid[row + i][col] !== word[i].toUpperCase()) return false;
      }
      break;

    case "diagonal-down":
      if (row + len > gridSize || col + len > gridSize) return false;
      for (let i = 0; i < len; i++) {
        if (grid[row + i][col + i] !== "" && grid[row + i][col + i] !== word[i].toUpperCase()) return false;
      }
      break;

    case "diagonal-up":
      if (row - len < -1 || col + len > gridSize) return false;
      for (let i = 0; i < len; i++) {
        if (grid[row - i][col + i] !== "" && grid[row - i][col + i] !== word[i].toUpperCase()) return false;
      }
      break;
  }

  return true;
}

function placeWord(grid, word, row, col, direction) {
  for (let i = 0; i < word.length; i++) {
    switch (direction) {
      case "horizontal":
        grid[row][col + i] = word[i].toUpperCase();
        break;
      case "vertical":
        grid[row + i][col] = word[i].toUpperCase();
        break;
      case "diagonal-down":
        grid[row + i][col + i] = word[i].toUpperCase();
        break;
      case "diagonal-up":
        grid[row - i][col + i] = word[i].toUpperCase();
        break;
    }
  }
}

function isStraightLine(cells) {
  if (cells.length < 2) return true;

  const positions = cells.map(cell => {
    const index = Array.from(gridContainer.children).indexOf(cell);
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    return { row, col };
  });

  const rowDiff = positions[1].row - positions[0].row;
  const colDiff = positions[1].col - positions[0].col;

  for (let i = 1; i < positions.length; i++) {
    const expectedRow = positions[0].row + rowDiff * i;
    const expectedCol = positions[0].col + colDiff * i;
    if (positions[i].row !== expectedRow || positions[i].col !== expectedCol) {
      return false;
    }
  }

  return true;
}

function sortCellsByGridPosition(cells) {
  if (cells.length < 2) return cells;

  const positions = cells.map(cell => {
    const index = Array.from(gridContainer.children).indexOf(cell);
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    return { cell, row, col };
  });

  const dx = positions[1].col - positions[0].col;
  const dy = positions[1].row - positions[0].row;

  return positions
    .sort((a, b) => {
      return (dy !== 0 ? a.row - b.row : 0) + (dx !== 0 ? a.col - b.col : 0);
    })
    .map(p => p.cell);
}

function getCellPosition(cell) {
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  return { row, col };
}

// Optional test function for bonus tag
function testBonusTag() {
  const bonusTag = document.getElementById("bonus-tag");
  if (bonusTag) {
    bonusTag.textContent = "+50";
    bonusTag.classList.add("bonus-visible");
    setTimeout(() => {
      bonusTag.classList.remove("bonus-visible");
      bonusTag.textContent = "";
    }, 1000);
  }
}

function showLeaderboard(finalScore) {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || {};

  const previousEntry = leaderboard[currentUserEmail];

  if (!previousEntry || finalScore > previousEntry.score) {
    leaderboard[currentUserEmail] = {
      name: currentUserName,
      score: finalScore
    };
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  }

  displayLeaderboard(leaderboard);
}

function displayLeaderboard(data) {
  const body = document.getElementById("leaderboard-body");
  body.innerHTML = "";

  const sorted = Object.entries(data)
    .sort(([, a], [, b]) => b.score - a.score)
    .slice(0, 50); // 🔝 Limit to top 50

  sorted.forEach(([email, entry]) => {
    const row = document.createElement("tr");

    if (email === currentUserEmail) {
      row.classList.add("highlight");
    }

    const emailCell = document.createElement("td");
    emailCell.textContent = email;

    const scoreCell = document.createElement("td");
    scoreCell.textContent = entry.score;

    row.appendChild(emailCell);
    row.appendChild(scoreCell);
    body.appendChild(row);
  });

  const modal = document.getElementById("leaderboard-modal");
  modal.style.display = "flex";
  modal.classList.add("show");
}

document.getElementById("close-leaderboard").addEventListener("click", () => {
  const modal = document.getElementById("leaderboard-modal");
modal.classList.remove("show");
setTimeout(() => {
  modal.style.display = "none";
}, 500); // match transition duration
});

document.getElementById("play-again").addEventListener("click", () => {
  resetGame();
});

function resetGame() {
  // 🏁 Hide leaderboard modal
  document.getElementById("leaderboard-modal").style.display = "none";

  // 🧹 Clear grid
  const allCells = document.querySelectorAll(".grid-cell");
  allCells.forEach(cell => {
    cell.classList.remove("selected", "found");
    cell.textContent = "";
  });

  // 🧠 Reset game state
  selectedCells = [];
  foundWords.clear();
  score = 0;
  currentStreak = 0;
  lastWordTime = 0;
  hasFoundFirstWord = false;

  // ⏱️ Reset timer
  elapsedSeconds = 0;
  timerStarted = false;
  document.getElementById("timer").textContent = "00:00";

  // 🎯 Reset score and streak UI
  document.getElementById("score").textContent = "000";
  document.getElementById("streak").textContent = "0";

  // 📊 Reset progress bar
  const progressBar = document.getElementById("progress-bar");
  const progressCount = document.getElementById("progress-count");
  progressBar.value = 0;
  progressCount.textContent = `0 / ${wordList.length}`;

  generateWordGrid();       // fills the array with words and letters
  renderGridFromArray();    // renders the array into the DOM
  populateWordList();       // resets the word list UI


  // 🧼 Reset word list UI
  const wordItems = document.querySelectorAll("#words li");
  wordItems.forEach(item => {
    item.classList.remove("found");
  });
}
