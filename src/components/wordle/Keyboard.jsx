import { useCallback, useContext, useEffect, useState } from "react";
import { WordleContext } from "./Wordle";
import { MdOutlineBackspace } from "react-icons/md";
import keys from "./resources/keys";
import fiveLetterWords from "./resources/wordList";

const Keyboard = () => {
  const {
    wordLength,
    board,
    setBoard,
    currAttempt,
    setCurrAttempt,
    showToast,
    gameResult,
    updateGameResult
  } = useContext(WordleContext);

  const [keyColors, setKeyColors] = useState({});
  const [prevAttempt, setPrevAttempt] = useState(0);

  const correctBtnColor = "bg-green-600 text-white";
  const presentBtnColor = "bg-yellow-600 text-white";
  const incorrectBtnColor = "bg-gray-500 text-white dark:bg-gray-700";
  const defaultBtnColor = "bg-gray-300 dark:text-white dark:bg-gray-500";

  const updateKeyColors = useCallback(() => {
    if (currAttempt.attempt > 0) {
      const prevAttemptBoard = board.board[currAttempt.attempt - 1];
      const prevAttemptColors = board.tileColors[currAttempt.attempt - 1];
      const updatedKeyColors = Object(keyColors);

      for (let i = 0; i < prevAttemptBoard.length; i++) {
        if (!keyColors[prevAttemptBoard[i]]) {
          keyColors[prevAttemptBoard[i]] = prevAttemptColors[i];
        } else {
          if (
            (updatedKeyColors[prevAttemptBoard[i]] === "incorrect" ||
              updatedKeyColors[prevAttemptBoard[i]] === "present") &&
            prevAttemptColors[i] === "correct"
          ) {
            updatedKeyColors[prevAttemptBoard[i]] = prevAttemptColors[i];
          }
        }
      }
      setKeyColors(updatedKeyColors);
    }
  }, [board.board, board.tileColors, currAttempt.attempt, keyColors]);

  useEffect(() => {
    if (currAttempt.attempt > prevAttempt) {
      updateKeyColors();
      setPrevAttempt(currAttempt.attempt);
      updateGameResult();
    }
  }, [currAttempt.attempt, prevAttempt, updateGameResult, updateKeyColors])

  const handleKeyClick = (key) => {
    if (key === "ENTER") {
      if (currAttempt.attempt < 6) {
        const currAttemptWord = board.board[currAttempt.attempt]
          .slice()
          .join("");
        if (currAttemptWord.length < wordLength) {
          console.log("Not enough letters!");
          showToast("Not enough letters!", "warning");
          return;
        }
        if (!fiveLetterWords.includes(currAttemptWord.toLowerCase())) {
          console.log("Not in word list!");
          showToast("Not in word list!", "error");
          return;
        }
        setBoard({
          type: "enter",
          attempt: currAttempt.attempt + 1,
          letterPos: 0,
        });
        setCurrAttempt({
          attempt: currAttempt.attempt + 1,
          letterPos: 0,
        });
      }
    } else if (key === "DELETE") {
      if (currAttempt.letterPos > 0) {
        setBoard({
          type: "delete",
          attempt: currAttempt.attempt,
          letterPos: currAttempt.letterPos - 1,
        });
        setCurrAttempt({
          attempt: currAttempt.attempt,
          letterPos: currAttempt.letterPos - 1,
        });
      }
    } else {
      if (currAttempt.letterPos < wordLength) {
        setBoard({
          type: "letter",
          key: key,
          attempt: currAttempt.attempt,
          letterPos: currAttempt.letterPos,
        });
        setCurrAttempt({
          attempt: currAttempt.attempt,
          letterPos: currAttempt.letterPos + 1,
        });
      }
    }
  };

  // document.addEventListener("keydown", (e) => {
  //   if (e.key.length === 1 && e.key.match(/[A-Za-z]/)) {
  //     handleKeyClick(e.key.toUpperCase());
  //   }
  //   else if (e.key === "Enter") {
  //     handleKeyClick(e.key.toUpperCase());
  //   }
  //   else if (e.key === "Backspace" || e.key === "Delete") {
  //     handleKeyClick("DELETE");
  //   }
  // });

  return (
    <div className="flex flex-col gap-1.5 items-center">
      {keys.map((row, rowIndex) => {
        return (
          <div className="flex flex-row gap-1.5 items-center" key={rowIndex}>
            {row.map((key, index) => {
              return (
                <button
                  className={
                    "flex items-center justify-center max-sm:min-w-8 sm:min-w-9 md:min-w-10 h-14 rounded font-semibold " +
                    `${
                      keyColors[key]
                        ? keyColors[key] === "correct"
                          ? correctBtnColor
                          : keyColors[key] === "present"
                          ? presentBtnColor
                          : incorrectBtnColor
                        : defaultBtnColor
                    }`
                  }
                  key={index}
                  onClick={() => handleKeyClick(key)}
                  disabled={currAttempt.attempt === 6 || gameResult}
                >
                  {key === "ENTER" ? (
                    <span className="text-sm px-2 font-bold">{key}</span>
                  ) : key === "DELETE" ? (
                    <span className="text-lg px-4">
                      {" "}
                      <MdOutlineBackspace />{" "}
                    </span>
                  ) : (
                    <span className="text-xl font-semibold">{key}</span>
                  )}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Keyboard;
