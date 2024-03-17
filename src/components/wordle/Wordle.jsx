import { createContext, useReducer, useState } from "react";
import Board from "./Board";
import Keyboard from "./Keyboard";
import fiveLetterWords from "./resources/fiveLetterWords";
import generateCharacterMap from "./resources/generateCharacterMap";

const wordLength = 5;

const defaultBoard = Array(wordLength + 1).fill(Array(wordLength).fill(""));
const defaultTileColors = Array(wordLength + 1).fill(
  Array(wordLength).fill("")
);

const wordIndex = Math.round(Math.random() * (fiveLetterWords.length - 1));
const word = fiveLetterWords[wordIndex].toUpperCase().split("");
/* const word = "LLAMA".split(""); */
const characterMap = generateCharacterMap(word);

export const WordleContext = createContext();

const boardReducer = (board, action) => {
  const updatedBoard = board.board.slice();
  const updatedAttempt = updatedBoard[action.attempt].slice();
  const updatedTileColors = board.tileColors.slice();
  let prevAttempt = [];
  let updatedAttemptTileColors = [];
  let prevAttemptCharacterMap = {};

  switch (action.type) {
    case "letter":
      updatedAttempt[action.letterPos] = action.key;
      updatedBoard[action.attempt] = updatedAttempt;
      return { board: [...updatedBoard], tileColors: [...board.tileColors] };

    case "enter":
      prevAttempt = board.board[action.attempt - 1].slice();
      prevAttemptCharacterMap = generateCharacterMap(prevAttempt);
      updatedAttemptTileColors = updatedTileColors[action.attempt - 1].slice();

      Object.keys(prevAttemptCharacterMap).forEach((key) => {
        if (!characterMap[key]) {
          for (let pos of prevAttemptCharacterMap[key].pos) {
            updatedAttemptTileColors[pos] = "incorrect";
          }
        } else {
          const originalPosArr = characterMap[key].pos.toSorted();
          const attemptPosArr = prevAttemptCharacterMap[key].pos.toSorted();

          if (prevAttemptCharacterMap[key].freq === characterMap[key].freq) {
            for (let i = 0; i < prevAttemptCharacterMap[key].freq; i++) {
              if (originalPosArr[i] === attemptPosArr[i]) {
                updatedAttemptTileColors[attemptPosArr[i]] = "correct";
              } else {
                updatedAttemptTileColors[attemptPosArr[i]] = "present";
              }
            }
          } else {
            let matches = 0;
            for (let i = 0; i < prevAttemptCharacterMap[key].freq; i++) {
              if (originalPosArr.includes(attemptPosArr[i])) {
                updatedAttemptTileColors[attemptPosArr[i]] = "correct";
                matches++;
              } else {
                updatedAttemptTileColors[attemptPosArr[i]] = "incorrect";
              }
            }
            if (matches < characterMap[key].freq) {
              for (let i = matches; i < characterMap[key].freq; i++) {
                updatedAttemptTileColors[attemptPosArr[i]] = "present";
              }
            }
          }
        }
      });

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

  return (
    <div className="mt-4">
      <WordleContext.Provider
        value={{
          word,
          wordLength,
          board,
          setBoard,
          currAttempt,
          setCurrAttempt,
        }}
      >
        <div className="flex flex-col gap-6 items-center justify-between">
          <Board />
          <span className="dark:text-white">{word}</span>
          <Keyboard />
        </div>
      </WordleContext.Provider>
    </div>
  );
};

export default Wordle;
