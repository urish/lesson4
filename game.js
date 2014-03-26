/* Simple 2^11 game
 * Technion Web Lab 2014
 * Copyright (C) 2014, Uri Shaked. Code released under the MIT License.
 */

// We wrap all our code in an anonymous function. This ensures we don't pollute the global scope
(function () {
	'use strict';

	// How many squares?
	var squareCount = 16;

	// Game board will contain the numbers in each squares. 0 means an empty square.
	var gameBoard = [];

	// The element that will hold all the board squares
	var boardElement = document.getElementById('game-board');

	// Array with the actual DOM elements the contain the squares
	var squareElements = [];

	/**
	 * Creates the initial board model (gameBoard) and also the DOM representation of the board.
	 */
	function createBoard() {
		for (var i = 0; i < squareCount; i++) {
			var newSquare = document.createElement('div');
			newSquare.className = 'game-square square-0';
			gameBoard.push(0);
			squareElements.push(newSquare);
			boardElement.appendChild(newSquare);
		}
	}

	/**
	 * Updates the DOM representation of the board based on our model (gameBoard array)
	 */
	function updateBoard() {
		for (var i = 0; i < gameBoard.length; i++) {
			squareElements[i].textContent = gameBoard[i] ? gameBoard[i].toString() : '';
			squareElements[i].className = 'game-square square-' + gameBoard[i];
		}
	}

	/**
	 * Randomally chooses one of the empty squares and puts there the number 2.
	 *
	 * @return true if an empty square was found and replaced with the number 2, false if the board is already full.
	 */
	function addNewNumber() {
		var emptySquares = [];
		for (var i = 0; i < gameBoard.length; i++) {
			if (gameBoard[i] === 0) {
				emptySquares.push(i);
			}
		}
		if (emptySquares.length > 0) {
			// Pick a random number between 0 and emptySquares.length - 1.
			// See http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
			var randomIndex = Math.floor(Math.random() * emptySquares.length);
			// We get the index of the chosen square from the empty squares array
			var squareIndex = emptySquares[randomIndex];
			gameBoard[squareIndex] = 2;
			return true;
		} else {
			// no empty squares found :-(
			return false;
		}
	}

	/**
	 * This function moves all the squares in the board to one direction.
	 * The direction is defined by the given moveSquareFunction function: the function is called with
	 * a square number and should return the number of the adjacent square in the desired direction, or null
	 * if there is no adjacent square in that direction.
	 *
	 * For example, if we want to move all square left, the moveSquareFunction should return the given number
	 * minus 1, except for left-most squares, for which the function will return null.
	 *
	 * @param moveSquareFunction
	 */
	function moveSquares(moveSquareFunction) {
		var boardChanged = false;

		do {
			var changedInLastIteration = false;
			for (var sourceSquare = 0; sourceSquare < gameBoard.length; sourceSquare++) {
				var targetSquare = moveSquareFunction(sourceSquare);

				// This square does not have an adjacent source square - skip it
				if (sourceSquare === null) {
					continue;
				}

				// Case 1: Join adjacent squares with equal numbers
				if (gameBoard[targetSquare] && (gameBoard[targetSquare] === gameBoard[sourceSquare])) {
					gameBoard[targetSquare] += gameBoard[sourceSquare];
					gameBoard[sourceSquare] = 0;
					// Trick to assign same value to 2 variables at once
					boardChanged = changedInLastIteration = true;
				}

				// Case 2: Adjacent square has a number and we don't
				if (gameBoard[targetSquare] === 0 && gameBoard[sourceSquare]) {
					gameBoard[targetSquare] = gameBoard[sourceSquare];
					gameBoard[sourceSquare] = 0;
					boardChanged = changedInLastIteration = true;
				}
			}
		} while (changedInLastIteration);

		if (boardChanged) {
			addNewNumber();
			updateBoard();
		}
	}

	function handleKeyDown(e) {
		// You can find all key codes here: http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
		// or simply by using console.log...
		switch (e.keyCode) {
		case 37: // left arrow
			moveSquares(function(square) {
				return (square % 4 > 0) ? (square - 1) : null;
			});
			break;
		case 38: // up arrow
			moveSquares(function(square) {
				return (square > 3) ? (square - 4) : null;
			});
			break;
		case 39: // right arrow
			moveSquares(function(square) {
				return (square % 4 < 3) ? (square + 1) : null;
			});
			break;
		case 40: // down arrow
			moveSquares(function(square) {
				return (square < 12) ? (square + 4) : null;
			});
			break;
		}
	}

	/**
	 * Initializes the game and registers all event listeners
	 */
	function initGame() {
		createBoard();
		addNewNumber();
		updateBoard();
		document.body.addEventListener('keydown', handleKeyDown);

		document.getElementById('restart-button').addEventListener('click', function () {
			for (var i = 0; i < gameBoard.length; i++) {
				gameBoard[i] = 0;
			}
			addNewNumber();
			updateBoard();
		});
	}

	initGame();
})();