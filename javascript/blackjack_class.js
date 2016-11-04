/// tensorflow for ai
// Test stuff
// ==========
// var fakeDeck = [{point:11,suit:"spades"},{point:11,suit:"spades"},{point:11,suit:"spades"},{point:11,suit:"spades"}]; //For Testing
// var deck = []; //For Testing

// Start ----------------------------------------------------

$(function() {

  // Initialize all variable starting values:
    var dealerCards = new Hand();
    var playerCards = new Hand();
    var deck = new Deck(6);
    var playerWin = 0;
    var dealerWin = 0;
    var draw = 0;
    var wallet = 500;
    var curBet = 0;
    var hotness = 0;

    // Hotdeck function
    function hotdeck(cards) {
      for (var k = 0; k < cards.length; k++) {
        var hotcard = cards[k].point;
        if (hotcard > 2 && hotcard < 7) {
          hotness += 1;
        } else {
          hotness -= 1;
        }
      }
    }

    // deck = fakeDeck; //Strictly for testing purposes

    $('#deal-button').attr('disabled', true);
    $('.dealerw').text(dealerWin);
    $('.draw').text(draw);
    $('.playerw').text(playerWin);
    $('#hit-button').attr('disabled', true);
    $('#stand-button').attr('disabled', true);
    $('#betAmount').text(curBet);
    $('.wallet').text(wallet);

    // Bet buttons
    $('.bet').click(function() {
      if ($(this).attr('id') === 'bet1') {
        curBet += 1;
        betDisabler();
        $('#betAmount').text(curBet);
      } else if ($(this).attr('id') === 'bet5') {
        curBet += 5;
        betDisabler();
        $('#betAmount').text(curBet);
      } else if ($(this).attr('id') === 'bet10') {
        curBet += 10;
        betDisabler();
        $('#betAmount').text(curBet);
      } else if ($(this).attr('id') === 'bet25') {
        curBet += 25;
        betDisabler();
        $('#betAmount').text(curBet);
      } else if ($(this).attr('id') === 'betAll') {
        curBet = wallet;
        $('#betAmount').text(curBet);
        $('.bet').attr('disabled',true);
      }
      $('#deal-button').attr('disabled', false);
    });

    // Stop betting once approaching wallet value
    function betDisabler() {
      if (curBet >= wallet) {
        curBet = wallet;
        $('.bet').attr('disabled',true);
      } else if (curBet >= wallet - 5) {
        $('#bet5').attr('disabled',true);
      } else if (curBet >= wallet - 10) {
        $('#bet10').attr('disabled',true);
      } else if (curBet >= wallet - 25) {
        $('#bet25').attr('disabled',true);
      }
    }

    // Deal Button
    $('#deal-button').click(function() {

        hotdeck(playerCards);
        hotdeck(dealerCards);
        console.log(hotness);

        // if (deck.length < 1) {
        //   deck = newDeck();
        // }

        // Disable betting
        $('.bet').attr('disabled',true);

        // Disable Deal and Start button
        $(this).attr('disabled', true);
        // $('#start-button').attr('disabled', true);

        // Make Hit and Stand buttons visible
        $('#hit-button').attr('disabled', false);
        $('#stand-button').attr('disabled', false);

        // Clear dealer points (either from last round or just to initialize to zero)
        $('#dealer-points').contents().remove();

        // Clear winner declaration from last round (or initialize to zero)
        $('.message').text('');

        // Intialize dealer and player hand at zero
        dealerCards = new Hand();
        playerCards = new Hand();
        deck.shuffle();

        // Clear images for cards from last round (or initalize to zero)
        $('#dealer-hand').contents().remove();
        $('#player-hand').contents().remove();

        // Render card images on page and store card values in dealerCards and playerCards variables
        deal(dealerCards,'#dealer-hand');
        deal(playerCards,'#player-hand');
        dealerCards.addCard(deck.draw());
        $('#dealer-hand').append('<img class="card" src="images/backOfCard.png">');
        deal(playerCards,'#player-hand');

        // for (var i = 0; i < 2; i++) {
        //     if (i === 0) {
        //       dealerCards.push(deck.pop());
        //       $('#dealer-hand').append(getCardImageUrl(dealerCards[i]));
        //     } else if (i === 1) {
        //       // Render card back until dealer's turn
        //       dealerCards.push(deck.pop());
        //       $('#dealer-hand').append('<img class="card" src="images/backOfCard.png">');
        //     }
        //     playerCards.push(deck.pop());
        //     $('#player-hand').append(getCardImageUrl(playerCards[i]));
        // }

        // Calculate and display Player points
        $('#player-points').text(playerCards.getPoints());

        // Make Hit and Stand buttons visible again
        $('#hit-button').attr('disabled', false);
        $('#stand-button').attr('disabled', false);

        // Check for player blackjack
        var xp = end(playerCards);
        if (xp === 'blackjack') {
            $('#hit-button').attr('disabled', true);
            $('#deal-button').attr('disabled', true);
            $('#stand-button').attr('disabled', false);
            $('.message').text('Player got blackjack');
        }

    });

    // Hit button
    $('#hit-button').click(function() {

      // if (deck.length < 1) {
      //   deck = newDeck();
      // }
      // Deal a card to the player
      deal(playerCards,'#player-hand');

        // // Push new cards to players hand
        // playerCards.push(deck.pop());
        //
        // // Render new card images to screen
        // $('#player-hand').append(getCardImageUrl(playerCards[playerCards.length - 1]));

        // Update player points
        $('#player-points').text(playerCards.getPoints());

        // Check for winning hand
        var x = end(playerCards);

        // Check for bust or blackjack
        if (x === 'bust') {
            $('.message').text('Player is busted');
            $('#hit-button').attr('disabled', true);
            $('#stand-button').attr('disabled', true);
            dealerWin += 1;
            $('.dealerw').text(dealerWin);
            wallet -= curBet;
            curBet = 0;
            $('.wallet').text(wallet);
            $('#betAmount').text(curBet);
            $('.bet').attr('disabled',false);
        } else if (x === 'blackjack') {
            $('#hit-button').attr('disabled', true);
            $('#stand-button').attr('disabled', false);
            $('#deal-button').attr('disabled', true);
            $('.message').text('Player got blackjack');
        }
    });

    // Stand button
    $('#stand-button').click(function() {

        // Clear out starting images for dealers hand (first card and card back)
        $('#dealer-hand').contents().remove();

        // Render dealers actual hand
        for (var i = 0; i < dealerCards.cards.length; i++) {
          // card = dealerCards[i];
          $('#dealer-hand').append('<img class="card" src='+dealerCards.cards[i].getImageUrl()+'>');
        }

        // Render dealer points on screen
        $('#dealer-points').text(dealerCards.getPoints());

        // Disable Hit and Stand button, Enable Deal button
        $('#hit-button').attr('disabled', true);
        $(this).attr('disabled', true);
        $('#deal-button').attr('disabled', false);

        // Dealer adds cards while hand value still under 17
        while (end(dealerCards) !== 'bust' && dealerCards.getPoints() <= playerCards.getPoints() && end(dealerCards) !== 'blackjack') {
            card = deck.draw();
            dealerCards.addCard(card);
            $('#dealer-hand').append('<img class="card" src='+card.getImageUrl()+'>');
            $('#dealer-points').text(dealerCards.getPoints());
        }

        // Store current game winner
        var whoWon = '';

        // Check for winning hand
        var y = end(dealerCards);
        if (y == 'bust') {
            $('.message').text('Dealer is busted');
            playerWin++;
            $('.playerw').text(playerWin);
            whoWon = 'player';
        } else if (dealerCards.getPoints() === playerCards.getPoints()) {
            $('.message').text('Draw!');
            draw++;
            $('.draw').text(draw);
        } else if (y === 'blackjack') {
            $('.message').text('Dealer got blackjack');
            dealerWin++;
            $('.dealerw').text(dealerWin);
            whoWon = 'dealer';
        } else if (dealerCards.getPoints() > playerCards.getPoints()) {
            $('.message').text('Dealer Won');
            dealerWin++;
            $('.dealerw').text(dealerWin);
            whoWon = 'dealer';
        } else if (dealerCards.getPoints() < playerCards.getPoints()) {
            $('.message').text('Player Won');
            playerWin++;
            $('.playerw').text(playerWin);
            whoWon = 'player';
        }

        // Add or subtract bet amount from wallet
        if (whoWon === 'dealer') {
          wallet -= curBet;
          curBet = 0;
          $('.wallet').text(wallet);
          $('#betAmount').text(curBet);
          $('.bet').attr('disabled',false);
        } else if (whoWon === 'player'){
          wallet += curBet;
          curBet = 0;
          $('.wallet').text(wallet);
          $('#betAmount').text(curBet);
          $('.bet').attr('disabled',false);
        } else {
          curBet = 0;
          $('#betAmount').text(curBet);
          $('.bet').attr('disabled',false);
        }
    });

    // Check for bust or blackjack funciton
    function end(anyHand) {
        if (anyHand.getPoints() > 21) {
            $('#hit-button').attr('disabled', true);
            $('#stand-button').attr('disabled', true);
            $('#deal-button').attr('disabled', false);
            return 'bust';
        } else if (anyHand.getPoints() === 21) {
            $('#hit-button').attr('disabled', true);
            $('#stand-button').attr('disabled', true);
            $('#deal-button').attr('disabled', false);
            return 'blackjack';
        }
    }

    //Deal function
    function deal(person,selector){
      var card = deck.draw();
      person.addCard(card);
      $(selector).append('<img class="card" src='+card.getImageUrl()+'>');
    }
});
//-----------------------------------

//----------------------------------

// function getCardImageUrl(card) {
//     var name = '';
//
//     if (card.point === 1) {
//         name = 'ace';
//     } else if (card.point === 11) {
//         name = 'jack';
//     } else if (card.point === 12) {
//         name = 'queen';
//     } else if (card.point === 13) {
//         name = 'king';
//     } else {
//         name = card.point;
//     }
//
//     return '<img class="card" src="images/' + name + '_of_' + card.suit + '.png">';
//
// }
//
// //------------------------
//
// function calculatePoints(cards) {
//     var sum = 0;
//     cards = cards.slice(0);
//     cards.sort(function(b, a) {
//         return a.point - b.point;
//     });
//
//     for (var i = 0; i < cards.length; i++) {
//         if (cards[i].point === 1) {
//             if ((sum + 11) > 21) {
//                 sum += 1;
//             } else {
//                 sum += 11;
//             }
//         } else if (cards[i].point > 1 && cards[i].point < 10) {
//             sum += cards[i].point;
//         } else {
//             sum += 10;
//         }
//     }
//     return sum;
// }
//
//
// function newDeck(numOfDecks) {
//     var suit = ['spades', 'hearts', 'clubs', 'diamonds'];
//     var card = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
//     var deck = [];
//     if (numOfDecks === undefined) {
//         for (var j = 0; j < card.length; j++) {
//             for (var i = 0; i < suit.length; i++) {
//                 deck.push({
//                     'suit': suit[i],
//                     'point': card[j]
//                 });
//             }
//         }
//     } else {
//         for (var c = 0; c < numOfDecks; c++) {
//             for (var k = 0; k < card.length; k++) {
//                 for (var h = 0; h < suit.length; h++) {
//                     deck.push({
//                         'suit': suit[h],
//                         'point': card[k]
//                     });
//                 }
//             }
//         }
//     }
//
//     return deck;
// }
//
// function shuffle(array) {
//     var currentIndex = array.length,
//         temporaryValue, randomIndex;
//
//     // While there remain elements to shuffle...
//     while (0 !== currentIndex) {
//
//         // Pick a remaining element...
//         randomIndex = Math.floor(Math.random() * currentIndex);
//         currentIndex -= 1;
//
//         // And swap it with the current element.
//         temporaryValue = array[currentIndex];
//         array[currentIndex] = array[randomIndex];
//         array[randomIndex] = temporaryValue;
//     }
//
//     return array;
// }


/////////////////--------------------------------------------------------------------///////////////////////////////

function Card(point,suit){
  this.point = point;
  this.suit = suit;
}

Card.prototype.getImageUrl = function(){
var str = '';
if (this.point == 1){
  str = 'ace';
} else if (this.point == 11){
  str = 'jack';
} else if (this.point == 12){
  str = 'queen';
} else if (this.point == 13){
  str = 'king';
} else {
    str = (this.point).toString();
  }
return 'images/'+str+'_of_'+this.suit+'.png';
};

//<img class="card" src="images/' + name + '_of_' + card.suit + '.png">
//-----------

function Hand(){
  this.cards = [];
}

Hand.prototype.addCard = function(card){
 this.cards.push(card);
};

Hand.prototype.getPoints = function(){
  return this.cards.reduce(function(a,b){
    return a + b.point;
  },0);
};

//--------------

function Deck(n){
  this.deck = [];
  for(var j=0;j<n;j++){
  for (var i=1;i<14;i++){
    this.deck.push(new Card(i,'spades'));
    this.deck.push(new Card(i,'diamonds'));
    this.deck.push(new Card(i,'clubs'));
    this.deck.push(new Card(i,'hearts'));
    }
  }
}

Deck.prototype.draw = function(){
  return this.deck.pop();
};

Deck.prototype.numCardsLeft = function(){
  return this.deck.length;
};

Deck.prototype.shuffle = function(){

  var currentIndex = this.deck.length,
      temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = this.deck[currentIndex];
      this.deck[currentIndex] = this.deck[randomIndex];
      this.deck[randomIndex] = temporaryValue;
  }

  return this.deck;
};
