import { createContext, useReducer, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import Board from "./Board";
import Keyboard from "./Keyboard";
import wordList from "./resources/wordList";
import generateCharacterMap from "./resources/generateCharacterMap";

const wordLength = 5;

const defaultBoard = Array(wordLength + 1).fill(Array(wordLength).fill(""));
const defaultTileColors = Array(wordLength + 1).fill(
  Array(wordLength).fill("")
);

const wordIndex = Math.round(Math.random() * (wordList.length - 1));
const word = wordList[wordIndex].toUpperCase().split("");
/* const word = "LLAMA".split(""); */
const characterMap = generateCharacterMap(word);

export const WordleContext = createContext();

const showToast = (msg, type="default") => {
  switch(type) {
    case "info": return toast.info(msg);
    case "success": return toast.success(msg);
    case "warning": return toast.warning(msg);
    case "error": return toast.error(msg);
    default: return toast(msg);
  }
};

const boardReducer = (board, action) => {
  const updatedBoard = board.board.slice();
  let updatedAttempt = null;
  if(action.attempt < 6) updatedAttempt = updatedBoard[action.attempt].slice();
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
              if (originalPosArr.includes(attemptPosArr[i])) {
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
  const outcome = ["lose", "win"];
  const [gameResult, setGameResult] = useState();

  const updateGameResult = () => {
    if (currAttempt.attempt > 0) {
      let countCorrectTiles = 0;
      const prevAttemptColors = board.tileColors[currAttempt.attempt - 1];
      for (let i = 0; i < prevAttemptColors.length; i++) {
        if(prevAttemptColors[i] === "correct") countCorrectTiles++;
      }
      if(countCorrectTiles === 5) {
        setGameResult(outcome[1]);
        showToast("Magnificient! You won!", "success");
      } else {
        if(currAttempt.attempt === 6) {
          setGameResult(outcome[0]);
          showToast(word.join("") + ".\nBetter luck next time!");
        }
      }
    }
  }

  return (
    <div>
      <ToastContainer position="top-center" theme="dark" pauseOnHover={false} draggable closeOnClick/>
      <WordleContext.Provider
        value={{
          word,
          wordLength,
          board,
          setBoard,
          currAttempt,
          setCurrAttempt,
          showToast,
          outcome,
          gameResult,
          updateGameResult,
        }}
      >
        <div
          style={{ height: "calc(100vh - 135px)" }}
          className="flex flex-col gap-5 items-center justify-between"
        >
          <span className="d-block"></span>
          <Board />
          <Keyboard />
        </div>
      </WordleContext.Provider>
    </div>
  );
};

export default Wordle;
