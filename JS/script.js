window.onload = function() {
    const gameBox = document.getElementById('gameBox');

    const timerDiv = document.getElementById('timerDiv');
    const timer = document.getElementById('timer');
    let timerTaskID = null;

    document.getElementById('startButton')
            .addEventListener('click', startGame);

    let isPlaying = false;
    let solvedNumber = 0;
    function initStatue() {
        isPlaying = true;
        solvedNumber = 0;

        timerDiv.style.visibility = 'visible';
        timer.textContent = '0';

        if (timerTaskID != null) {
            clearInterval(timerTaskID);
        }
        timerTaskID = setInterval(advanceTime, 1000);
    }

    let puzzleSize;
    const NUMBER_OF_IMAGES = 6;
    function startGame() {
        let newSize = document.getElementById('gameSize').value;
        if (newSize === '') {
            alert('Will play the default difficulty (which is 12).');
            newSize = 12;
        }

        newSize = parseFloat(newSize);
        if (isNaN(newSize)) {
            alert('Not a number.');
            return;
        }
        if (!Number.isInteger(newSize)) {
            alert('Cannot contain fraction.');
            return;
        }
        if (newSize % 2 != 0) {
            alert('Must be an even number.');
            return;
        }
        puzzleSize = newSize;

        gameBox.innerHTML = '';
        let randArray = new Array(puzzleSize);

        let generatedNumber = 1; 
        for (let i = 0; i < puzzleSize; i += 2) {
            randArray[i] = generatedNumber;
            randArray[i + 1] = generatedNumber;
            generatedNumber++;
            if (generatedNumber > NUMBER_OF_IMAGES) {
                generatedNumber = 1;
            }
        }
        shuffleArray(randArray);

        for (let i = 0; i < puzzleSize; i++) {
            const newCard = document.createElement('div');
            newCard.addEventListener('click', handleCardClick);

            const frontDiv = document.createElement('div');
            frontDiv.classList.add('face');
            frontDiv.classList.add('front');

            const backImg = document.createElement('img');
            backImg.classList.add('face');
            backImg.classList.add('back');
            backImg.src = `Media/Fruits/${randArray[i]}.png`;

            newCard.appendChild(frontDiv);
            newCard.appendChild(backImg);

            gameBox.appendChild(newCard);
        }

        initStatue();
    }

    // Fisher-Yates Shuffle Algorithm.
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[randomIndex];
            array[randomIndex] = temp;
        }
        return array; // Optional, done for chaining or if you have sent a copy.
    }

    let isFirstClick = true;
    let firstClickCardDiv = null;
    let isShowingWrongCards = false;
    function handleCardClick(event) {
        if (!isPlaying) {
            alert('The game is not started.');
        }

        if (isShowingWrongCards) {
            return;
        }

        
        const cardDiv = event.target.parentElement;
        if (cardDiv == firstClickCardDiv) {
            return;
        }
        revealCard(cardDiv);

        // First click.
        if (isFirstClick) {
            isFirstClick = false;
            firstClickCardDiv = cardDiv;
            return;
        }

        // Solved.
        if (firstClickCardDiv.children[1].src
                == cardDiv.children[1].src) {
            isFirstClick = true;
            firstClickCardDiv = null;
            solvedNumber += 2;

            // Game finished.
            if (solvedNumber == puzzleSize) {
                clearInterval(timerTaskID);
                alert("Congrats! You solved the puzzle.");
            }
            return;
        }

        // Not Solved.
        isShowingWrongCards = true;
        setTimeout(() => {
            hideCard(firstClickCardDiv);
            hideCard(cardDiv);
            isShowingWrongCards = false;
            isFirstClick = true;
            firstClickCardDiv = null;
        }, 500);
    }

    const visibleClassName = 'flipped';
    function revealCard(card) {
        card.classList.add(visibleClassName);
    }

    function hideCard(card) {
        card.classList.remove(visibleClassName);
    }

    function advanceTime() {
        let currentCount = timer.textContent;
        currentCount++;
        timer.textContent = currentCount;
    }
}