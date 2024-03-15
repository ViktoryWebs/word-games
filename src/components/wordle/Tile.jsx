import PropTypes from "prop-types";
import { useContext } from "react";
import { WordleContext } from "./Wordle";

const correctTileColor = "bg-green-600 text-white border-green-600";
const presentTileColor = "bg-yellow-600 text-white border-yellow-600";
const incorrectTileColor = "bg-gray-500 text-white border-gray-500";

const Tile = ({ attemptNum, letterPos }) => {
  const { board } = useContext(WordleContext);
  const letter = board.board[attemptNum][letterPos];

  const tileColor = board.tileColors[attemptNum][letterPos];
  return (
    <span
      className={`w-12 h-12 flex items-center justify-center dark:text-white text-3xl font-bold border-2 border-gray-500 
      ${
        tileColor === "correct"
          ? correctTileColor
          : tileColor === "present"
          ? presentTileColor
          : tileColor === "incorrect"
          ? incorrectTileColor
          : ""
      }
      `}
    >
      {letter}
    </span>
  );
};

Tile.propTypes = {
  attemptNum: PropTypes.number,
  letterPos: PropTypes.number,
};

export default Tile;
