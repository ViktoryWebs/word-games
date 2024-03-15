import { useContext, useState } from "react";
import { WordleContext } from "./Wordle";
import { FaDeleteLeft } from "react-icons/fa6";
import keys from "./resources/keys";
import fiveLetterWords from "./resources/fiveLetterWords";

const Keyboard = () => {
  const { word, wordLength, board, setBoard, currAttempt, setCurrAttempt } =
    useContext(WordleContext);

  const [prevAttempt, setPrevAttempt] = useState([]);

  /* const correctBtnColor = "bg-green-600 text-white border-green-600";
  const presentBtnColor = "bg-yellow-600 text-white border-yellow-600";
  const incorrectBtnColor = "bg-gray-500 text-white border-gray-500";

  const setBtnColor = () => {
    for()
    if(word.includes)
  } */

  const handleKeyClick = (key) => {
    if (key === "ENTER") {
      if (currAttempt.attempt < wordLength) {
        const currAttemptWord = board.board[currAttempt.attempt]
          .slice()
          .join("");
        console.log(currAttemptWord);
        if (currAttemptWord.length < wordLength) {
          console.log("Not enough letters!");
          return;
        }
        if (!fiveLetterWords.includes(currAttemptWord.toLowerCase())) {
          console.log("Not in word list!");
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
        setPrevAttempt(currAttemptWord.split(""));
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

  return (
    <div className="flex flex-col gap-1.5 items-center">
      {keys.map((row, rowIndex) => {
        return (
          <div className="flex flex-row gap-1.5 items-center" key={rowIndex}>
            {row.map((key, index) => {
              return (
                <button
                  className="flex items-center justify-center max-sm:min-w-7 sm:min-w-8 md:min-w-10 h-14 rounded bg-gray-200 dark:text-white dark:bg-gray-500 font-semibold"
                  key={index}
                  onClick={() => handleKeyClick(key)}
                >
                  {key === "ENTER" ? (
                    <span className="text-sm p-1 font-bold">{key}</span>
                  ) : key === "DELETE" ? (
                    <span className="text-lg">
                      {" "}
                      <FaDeleteLeft />{" "}
                    </span>
                  ) : (
                    <span className="text-lg">{key}</span>
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
