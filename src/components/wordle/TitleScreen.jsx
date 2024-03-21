import PropTypes from "prop-types";
import wordList from "./resources/wordList";
import { useContext } from "react";
import { WordleContext } from "./Wordle";

const wordLength = 5;
const defaultBoard = Array(wordLength + 1).fill(Array(wordLength).fill(""));
const defaultTileColors = Array(wordLength + 1).fill(
  Array(wordLength).fill("")
);

const TitleScreen = ({ setWord }) => {
  const { setBoard, setCurrAttempt, showToast } = useContext(WordleContext);

  const handleNewGame = () => {
    const wordIndex = Math.round(Math.random() * (wordList.length - 1));
    const newWord = wordList[wordIndex].toUpperCase().split("");
    setWord(newWord);
    localStorage.setItem("word", JSON.stringify(newWord));
    localStorage.setItem(
      "board",
      JSON.stringify({
        board: defaultBoard,
        tileColors: defaultTileColors,
      })
    );
    localStorage.setItem("currAttempt", JSON.stringify({attempt: 0, letterPos: 0}));
  };

  const handleContinue = () => {
    const loadWord = localStorage.getItem("word");
    if (loadWord === null) {
      showToast("There are no past games!", "warning");
      return;
    }
    const loadCurrAttempt = localStorage.getItem("currAttempt");
    setWord(loadWord);
    setBoard({type: "loadBoard"});
    setCurrAttempt(JSON.parse(loadCurrAttempt));
  };

  return (
    <div className="flex flex-col gap-3 justify-center items-center mt-32">
      <button
        className="bg-green-600 border-b-4 border-b-green-700 active:bg-green-700 transition-all text-white p-4 rounded-full font-bold text-xl w-60"
        onClick={handleNewGame}
      >
        NEW GAME
      </button>
      <button
        className="bg-yellow-600 border-b-4 border-b-yellow-700 active:bg-yellow-700 transition-all text-white p-4 rounded-full font-bold text-xl w-60"
        onClick={handleContinue}
      >
        CONTINUE...
      </button>
      <button className="bg-gray-500 border-b-4 border-b-gray-700 active:bg-gray-700 transition-all text-white p-4 rounded-full font-bold text-xl w-60">
        HOW TO PLAY?
      </button>
      <br />
      <div className="text-xl font-semibold flex flex-col items-center">
        <p>Get 6 chances to guess</p>
        <p>a 5 letter word.</p>
      </div>
    </div>
  );
};

TitleScreen.propTypes = {
  setWord: PropTypes.func,
};

export default TitleScreen;
