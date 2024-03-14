import { useContext } from "react";
import { WordleContext } from "./Wordle";
import { keys } from "./resources/keys";
import { FaDeleteLeft } from "react-icons/fa6";

const Keyboard = () => {
  const { wordLength, board, setBoard, currAttempt, setCurrAttempt } =
    useContext(WordleContext);

  const handleKeyClick = (key) => {
    if (key === "ENTER") {
      if (currAttempt.attempt < wordLength) {
        const currAttemptWord = board.board[currAttempt.attempt].slice().join("");
        console.log(currAttemptWord);
        if (currAttemptWord.length === wordLength) {
          setBoard({
            type: "enter",
            attempt: currAttempt.attempt + 1,
            letterPos: 0,
          });
          setCurrAttempt({
            attempt: currAttempt.attempt + 1,
            letterPos: 0,
          });
        } else {
          console.log("Not enough letters!");
        }
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
