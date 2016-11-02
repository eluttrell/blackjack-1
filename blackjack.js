var dealerCards = [];
var playerCards = [];
var deck = newDeck();
var deck2 = newDeck();
deck = deck.concat(deck).concat(deck).concat(deck).concat(deck);
function end(cards) {
    if (calculatePoints(cards) > 21) {
      $('#hit-button').attr('disabled',true);
      $('#stand-button').attr('disabled',true);
      $('#deal-button').attr('disabled',false);
      return 'bust';
    }
    else if (calculatePoints(cards) === 21) {
      $('#hit-button').attr('disabled',true);
      $('#stand-button').attr('disabled',true);
      $('#deal-button').attr('disabled',false);
      return 'blackjack';
    }

}

$(function() {
  $('#hit-button').attr('disabled',true);
  $('#stand-button').attr('disabled',true);
  $('#deal-button').click(function() {
    $('.message').text('');
    dealerCards = [];
    playerCards = [];
    shuffle(deck);
    $('#dealer-hand').contents().remove();
    $('#player-hand').contents().remove();
    for(var i=0;i<2;i++){
    dealerCards.push(deck.pop());
    $('#dealer-hand').append(getCardImageUrl(dealerCards[i]));
    playerCards.push(deck.pop());
    $('#player-hand').append(getCardImageUrl(playerCards[i]));
    var xp = end(playerCards);
    var yp = end(dealerCards);
    if (xp === 'blackjack') {
      $('#hit-button').attr('disabled',true);
      $('#deal-button').attr('disabled',true);
      $('.message').text('Player got blackjack');
    }
    else if (yp === 'blackjack') {
      $('#hit-button').attr('disabled',true);
      $('#stand-button').attr('disabled',true);
      $('#deal-button').attr('disabled',false);
      $('.message').text('Dealer got blackjack');

    }

  }
    $(this).attr('disabled',true);
    $('#dealer-points').text(calculatePoints(dealerCards));
    $('#player-points').text(calculatePoints(playerCards));
    $('#hit-button').attr('disabled',false);
    $('#stand-button').attr('disabled',false);
  });
  $('#hit-button').click(function() {
    playerCards.push(deck.pop());
    $('#player-hand').append(getCardImageUrl(playerCards[playerCards.length-1]));
    $('#player-points').text(calculatePoints(playerCards));
    var x = end(playerCards);

    if (x === 'bust') {
      $('.message').text('Player is busted');
      $('#hit-button').attr('disabled',true);
      $('#stand-button').attr('disabled',true);
    }
    else if (calculatePoints(dealerCards) === calculatePoints(playerCards)){
      $('.message').text('Draw!');
      $('#hit-button').attr('disabled',true);
      $('#stand-button').attr('disabled',true);
      $('#deal-button').attr('disabled',false);
    }
    else if (x === 'blackjack') {
      $('#hit-button').attr('disabled',true);
      $('#stand-button').attr('disabled',false);
      $('#deal-button').attr('disabled',true);
      $('.message').text('Player got blackjack');
    }
  });
  $('#stand-button').click(function() {
    $('#hit-button').attr('disabled',true);
    $(this).attr('disabled',true);
    $('#deal-button').attr('disabled',false);
    while (end(dealerCards) !== 'bust' && calculatePoints(dealerCards) <= 17 && end(dealerCards) !== 'blackjack') {
      dealerCards.push(deck.pop());
      $('#dealer-hand').append(getCardImageUrl(dealerCards[dealerCards.length-1]));
      $('#dealer-points').text(calculatePoints(dealerCards));
    }
    var y = end(dealerCards);
    if(y == 'bust'){$('.message').text('Dealer is busted');}
    else if (calculatePoints(dealerCards) === calculatePoints(playerCards)){
      $('.message').text('Draw!');
    }
    else if (y === 'blackjack') {
      $('.message').text('Dealer got blackjack');
    }

    else if (calculatePoints(dealerCards) > calculatePoints(playerCards)){
      $('.message').text('Dealer Won');
    }
    else if(calculatePoints(dealerCards) < calculatePoints(playerCards)){
      $('.message').text('Player Won');
    }
  });
});































//----------------------------------

function getCardImageUrl(card){
  var name = '';


  if      (card.point === 1) {name = 'ace';}
  else if (card.point === 11) {name ='jack';}
  else if (card.point === 12) {name ='queen';}
  else if (card.point === 13) {name ='king';}
  else {name = card.point;}

  return '<img src="images/'+name+'_of_'+card.suit+'.png" width="100px" height="140px">';

}



// function getCardImageUrl(card){
//
//   var arr = [{point:1,name:'ace'},{point:11,name:'jack'},{point:12,name:'queen'},{point:13,name:'king'}];
//
//   var name = arr.filter(function(arr){
//     if(arr.point === card.point){
//       return arr.name;
//     }
//   });
//
//   if(name === isNaN) {
//     name = card.point;
//   }
//
//   return 'images/'+name+'_of_'+card.suit+'.png';
//
// }
//------------------------


function calculatePoints(cards){
  var sum = 0;
  cards.sort(function(b,a){
    return a.point - b.point;
  });

  for (var i =0; i<cards.length;i++){
      if(cards[i].point === 1) {
        if((sum + 11) > 21) {
          sum += 1;
        }
        else {
          sum += 11;
        }
      }
      else if (cards[i].point > 1 && cards[i].point < 10){
        sum += cards[i].point;
      }

      else {
        sum += 10;
      }
}
return sum;
}


function newDeck(){
var suit = ['spades','hearts','clubs','diamonds'];
var card = [1,2,3,4,5,6,7,8,9,10,11,12,13];
var deck = [];
for (var j=0;j<card.length;j++){
  for (var i =0;i<suit.length;i++){
    deck.push({'suit':suit[i],'point':card[j]});
  }
}
return deck;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}