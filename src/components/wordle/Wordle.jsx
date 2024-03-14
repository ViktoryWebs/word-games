import { createContext, useReducer, useState } from "react";
import Board from "./Board";
import Keyboard from "./Keyboard";
import fiveLetterWords from "./resources/fiveLetterWords";

const wordLength = 5;

const defaultBoard = Array(wordLength + 1).fill(Array(wordLength).fill(""));
const defaultTileColors = Array(wordLength + 1).fill(
  Array(wordLength).fill("")
);

const wordIndex = Math.round(Math.random() * (fiveLetterWords.length - 1));
/* const word = fiveLetterWords[wordIndex].toUpperCase().split(""); */
const word = "FEAST".split("");
const characterMap = {};

const generateCharacterMap = () => {
  for (let i = 0; i < wordLength; i++) {
    let c = word[i];
    if (characterMap[c]) {
      characterMap[c] = {
        freq: characterMap[c].freq + 1,
        pos: [...characterMap[c].pos, i],
      };
    } else {
      characterMap[c] = {
        freq: 1,
        pos: [i],
      };
    }
  }
};

generateCharacterMap();

export const WordleContext = createContext();

const boardReducer = (board, action) => {
  const updatedBoard = board.board.slice();
  const updatedAttempt = updatedBoard[action.attempt].slice();
  const updatedTileColors = board.tileColors.slice();
  let prevAttempt = [];
  let updatedAttemptTileColors = [];

  switch (action.type) {
    case "letter":
      updatedAttempt[action.letterPos] = action.key;
      updatedBoard[action.attempt] = updatedAttempt;
      return { board: [...updatedBoard], tileColors: [...board.tileColors] };

    case "enter":
      prevAttempt = board.board[action.attempt - 1].slice();
      updatedAttemptTileColors = updatedTileColors[action.attempt - 1].slice();

      for (let i = 0; i < wordLength; i++) {
        if (prevAttempt[i] === word[i]) {
          updatedAttemptTileColors[i] = "correct";
        } else {
          if (word.includes(prevAttempt[i])) {
            let positions = characterMap[prevAttempt[i]].pos;
            
            updatedAttemptTileColors[i] = "present";
          } else {
            updatedAttemptTileColors[i] = "incorrect";
          }
        }
      }
      updatedTileColors[action.attempt - 1] = updatedAttemptTileColors;
      return { board: [...board.board], tileColors: [...updatedTileColors] };

    case "delete":
      updatedAttempt[action.letterPos] = "";
      updatedBoard[action.attempt] = updatedAttempt;
      return { board: [...updatedBoard], tileColors: [...board.tileColors] };

    default:
      throw Error("Unknown action: " + action.type);
  }
};

const Wordle = () => {
  const [board, setBoard] = useReducer(boardReducer, {
    board: defaultBoard,
    tileColors: defaultTileColors,
  });
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });

  console.log(characterMap);

  return (
    <div className="mt-4">
      <WordleContext.Provider
        value={{ wordLength, board, setBoard, currAttempt, setCurrAttempt }}
      >
        <div className="flex flex-col gap-6 items-center justify-between">
          <Board />
          <span className="dark:text-white">
            {/* {wordIndex} <br /> */}
            {word}
            {/*  <br /> */}
            {/* {currAttempt.attempt + ", " + currAttempt.letterPos} */}
          </span>
          <Keyboard />
        </div>
      </WordleContext.Provider>
    </div>
  );
};

export default Wordle;
