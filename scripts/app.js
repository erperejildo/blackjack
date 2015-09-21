'use strict';

angular
	.module('blackjackApp', [])
	.controller('MainCtrl', function($scope) {

		var suitsCards = ['clover-', 'spade-', 'heart-', 'rhombu-'];

		// randomize array order
		var shuffle = function(o){
		    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		    return o;
		};

		$scope.goHit = function() {
            new Audio('sounds/card.wav').play();
			$scope.getCard('dealer');
			$scope.getCard('player');
		};

		$scope.goStick = function() {
            new Audio('sounds/add.wav').play();
			$scope.stick = true;
			$scope.end = true;
			if ($scope.playerHand.points > $scope.dealerHand.points && $scope.playerHand.points < 22) {
				new Audio('sounds/win.wav').play();
				$scope.youWin = true;
			} else {
				$scope.youWin = false;
			}
		};

		$scope.getCard = function(who) {
			var number = parseInt($scope.deck[0].split('-')[1]);
			if (number > 10) {
				number = 10;
			}

			$scope[who+'Hand'].cards.push($scope.deck[0]);
			$scope[who+'Hand'].points = $scope[who+'Hand'].points + number;

			// ace (1 or 11)
			// just treat each ace as 11 (before we added 1) while the value is over 21
			if (number == 1) {
				$scope[who+'Hand'].ace = $scope[who+'Hand'].ace + 1;
				$scope[who+'Hand'].points = $scope[who+'Hand'].points + 10;
			}
			// if we have +21 and aces, we're subtract 10 from each ace
			if ($scope[who+'Hand'].points > 21) {
				for (var i = 0; i < $scope[who+'Hand'].ace; i++) {
					$scope[who+'Hand'].points = $scope[who+'Hand'].points - 10;
					if ($scope[who+'Hand'].points < 22) {
						break;	
					}
				}
			}

			if ($scope.playerHand.points > 20 || $scope.dealerHand.points > 20) {
				$scope.goStick();
			} else {
				$scope.deck.splice(0, 1);
			}
		};

		$scope.playAgain = function() {
			$scope.end = false;
			$scope.deck = [];
			for (var a = 0; a < 4; a ++) {
				for (var b = 1; b < 14; b ++) {
					$scope.deck.push(suitsCards[a] + (b+''));
				}
			}
			$scope.deck = shuffle($scope.deck);

			$scope.dealerHand = {
				cards: [],
				points: 0,
				ace: 0
			};

			$scope.playerHand = {
				cards: [],
				points: 0,
				ace: 0
			};

			// first hand
			$scope.getCard('dealer');
			$scope.getCard('player');
			$scope.getCard('player');
		};

		$scope.playAgain();

	});