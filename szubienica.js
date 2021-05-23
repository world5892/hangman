// Item Controller
const ItemCtrl = (function() {
  const letters = [
    'A', 'Ą', 'B', 'C', 'Ć', 'D', 'E', 'Ę', 'F',
    'G', 'H', 'I', 'J', 'K', 'L', 'Ł', 'M', 'N',
    'Ń', 'O', 'Ó', 'P', 'Q', 'R', 'S', 'Ś', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z', 'Ź', 'Ż'
  ]

  const clues = [
    'A bad workman always blames his tools',
    'A bird in hand is worth two in the bush',
    'Absence makes the heart grow fonder',
    'A chain is only as strong as its weakest link',
    'Actions speak louder than words',
    'Adversity and loss make a man wise',
    'Always put your best foot forward',
    'An apple a day keeps the doctor away',
    'Appearances can be deceptive',
    'Clothes do not make the man'
  ];

  const getRandomClue = function(clues) {
    const randomNum = Math.floor(Math.random() * (clues.length + 1));

    return clues[randomNum].toUpperCase();
  }

  const data = {
    clue: 'DIY STORE'.toUpperCase(),
    correctAttempt: 0,
    totalAttempts: 0,
    stringClue: '',
    currClue: '',
    yes: new Audio('yes.wav'),
    no: new Audio('no.wav')
  };

  // Public methods and data
  return {
    letters,
    data,

    hasLetter: function(letter, clueDiv) {
      const clue = data.clue.split('');

      data.totalAttempts++;

      if (clue.includes(letter)) {
        for (count = 0; count < clue.length; count++) {
          if (clue[count] === letter) {
            data.stringClue.splice(count, 1, letter);
            data.currClue = data.stringClue.join('');
          }
          document.querySelector(clueDiv).textContent = data.currClue;
        }
        return true;
      } else {
        data.correctAttempt++;

        return false;
      }
    }
  }
})();


// UI Controller
const UICtrl = (function() {
  const selectors = {
    alphabetDiv: '#alfabet',
    clueDiv: '#plansza',
    gallows: '#szubienica'
  };

  // Public methods and data
  return {
    selectors,

    hideClue: function(clue) {
      let hiddenClue = clue.split('');
      let string = '';
      console.log(hiddenClue);

      for (count1 = 0; count1 < hiddenClue.length; count1++) {
        if (hiddenClue[count1] === ' ') {
          string += ' ';
        } else {
          string += '_';
        }
      }
      console.log(ItemCtrl.data.stringClue);
      document.querySelector(selectors.clueDiv).textContent = string;

      return string;
    },

    displayClue: function(clue) {
      // document.querySelector(selectors.clueDiv).textContent = clue;
    },

    getAlphabetBtns: function(letters) {
      for (let count = 0; count < letters.length; count++) {
        const html = `
          <div class="litera" id="item-${count}">${letters[count]}</div>
        `;

        document.querySelector(selectors.alphabetDiv).insertAdjacentHTML('beforeend', html);
      }
    },

    showNextImg: function(correctAtt) {
      if (correctAtt < 10) {
        document.querySelector(selectors.gallows).children[0].src = `img/s${correctAtt}.jpg`;
      }
    },

    paintLetter: function(letterBtn, guess) {

      if (guess) {
        letterBtn.style = 'border: 3px solid green; background-color: green; pointer-events: none;';
        ItemCtrl.data.yes.play();
      } else {
        letterBtn.style = 'border: 3px solid red; background-color: red; pointer-events: none;';
        ItemCtrl.data.no.play();
      }
    },

    showResult: function(correctAtt, totalAtt, clue, currClue) {
      if (correctAtt === 9) {
        const html = `
                      <p>Unfortunately, you've run out of attempts</p>
                      <p class="fail">GAME OVER</p>
                      <p>The clue was: '${clue}'</p>
                      <div><a class="reset">PLAY AGAIN?</a></div>
                    `;

        document.querySelector(selectors.alphabetDiv).innerHTML = html;
      } else if (currClue === clue) {
        const html = `
                      <p>Well done! You've guessed the clue in ${totalAtt} attempts</p>
                      <div><a class="reset">PLAY AGAIN?</a></div>
                    `;

        document.querySelector(selectors.alphabetDiv).innerHTML = html;
      }
    }
  }
})();


// App Controller
const AppCtrl = (function(ItemCtrl, UICtrl) {
  const selectors = UICtrl.selectors;
  const alphabet = ItemCtrl.letters;
  const data = ItemCtrl.data;

  const loadEventListeners = function() {
    document.querySelector(selectors.alphabetDiv).addEventListener('click', (e) => {
      e.preventDefault();

      if (e.target.classList.contains('litera')) {
        const guess = ItemCtrl.hasLetter(e.target.textContent, selectors.clueDiv);

        UICtrl.showNextImg(data.correctAttempt);

        UICtrl.paintLetter(e.target, guess);

        UICtrl.showResult(data.correctAttempt, data.totalAttempts, data.clue, data.currClue);
      }
    });

    document.querySelector(selectors.alphabetDiv).addEventListener('click', (e) => {
      e.preventDefault();

      if (e.target.classList.contains('reset')) {
        window.location.reload();
      }
    });
  };

  const init = function() {
    UICtrl.getAlphabetBtns(alphabet);

    const stringClue = UICtrl.hideClue(data.clue).split('');
    data.stringClue = stringClue;

    //UICtrl.displayClue(data.clue);

    loadEventListeners();
  }

  // Public methods and data
  return {
    init
  }
})(ItemCtrl, UICtrl);


AppCtrl.init();

//FINISH HASLETTER FUNCTION