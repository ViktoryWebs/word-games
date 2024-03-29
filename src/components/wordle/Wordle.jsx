import { createContext, useEffect, useReducer, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Board from "./Board";
import Keyboard from "./Keyboard";
//import wordList from "./resources/wordList";
// import generateCharacterMap from "./resources/generateCharacterMap";
import TitleScreen from "./TitleScreen";
import boardReducer from "./resources/boardReducer";

const wordLength = 5;

// const wordIndex = Math.round(Math.random() * (wordList.length - 1));
// const word = wordList[wordIndex].toUpperCase().split("");
// const word = "LLAMA".split("");
// const characterMap = generateCharacterMap(word);

export const WordleContext = createContext();

const showToast = (msg, type = "default", autoClose = true) => {
  switch (type) {
    case "info":
      return toast.info(msg, { autoClose: autoClose });
    case "success":
      return toast.success(msg, { autoClose: autoClose });
    case "warning":
      return toast.warning(msg, { autoClose: autoClose });
    case "error":
      return toast.error(msg, { autoClose: autoClose });
    default:
      return toast(msg, { autoClose: autoClose });
  }
};

const Wordle = () => {
  const [word, setWord] = useState([]);
  const [board, setBoard] = useReducer(boardReducer, () => {
    const loadBoard = localStorage.getItem("board");
    console.log(loadBoard);
    console.log(JSON.parse(loadBoard));
    return JSON.parse(loadBoard);
  });
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
  const tileAnimProps = useRef({ animDuration: 0,  animDelay: 0 });
  const outcome = ["lose", "win"];
  const [gameResult, setGameResult] = useState();

  const updateGameResult = () => {
    if (currAttempt.attempt > 0) {
      let countCorrectTiles = 0;
      const prevAttemptColors = board.tileColors[currAttempt.attempt - 1];
      for (let i = 0; i < prevAttemptColors.length; i++) {
        if (prevAttemptColors[i] === "correct") countCorrectTiles++;
      }
      if (countCorrectTiles === 5) {
        setGameResult(outcome[1]);
        showToast("Magnificient! You won!", "success");
      } else {
        if (currAttempt.attempt === 6) {
          setGameResult(outcome[0]);
          showToast(
            word.join("") + ".\nBetter luck next time!",
            "default",
            false
          );
        }
      }
    }
  };

  useEffect(() => {
    setBoard({ type: "initialize" });
  }, []);

  return (
    <div>
      <ToastContainer
        position="top-center"
        theme="dark"
        pauseOnHover={false}
        draggable
        closeOnClick
      />
      <WordleContext.Provider
        value={{
          wordLength,
          board,
          setBoard,
          currAttempt,
          setCurrAttempt,
          showToast,
          outcome,
          gameResult,
          updateGameResult,
          tileAnimProps,
        }}
      >
        {word.length === 0 ? (
          <TitleScreen setWord={setWord} />
        ) : (
          <div
            style={{ height: "calc(100vh - 135px)" }}
            className="flex flex-col gap-5 items-center justify-between"
          >
            <span className="d-block"></span>
            <Board />
            <Keyboard />
          </div>
        )}
      </WordleContext.Provider>
    </div>
  );
};

export default Wordle;
