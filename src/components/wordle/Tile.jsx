import PropTypes from "prop-types";
import { useContext, useEffect } from "react";
import { WordleContext } from "./Wordle";
import { animate, motion, spring, stagger } from "framer-motion";

const correctTileColor = "bg-green-600 border-green-600 text-white";
const presentTileColor = "bg-yellow-600 text-white border-yellow-600";
const incorrectTileColor =
  "bg-gray-500 text-white border-gray-500 dark:bg-gray-700 dark:border-gray-700";
const defaultTileColor = "border-gray-400 dark:border-gray-500";

const Tile = ({ attemptNum, letterPos }) => {
  const { board } = useContext(WordleContext);
  const letter = board.board[attemptNum][letterPos];

  const tileColor = board.tileColors[attemptNum][letterPos];

  useEffect(() => {
    const elem = document.getElementById(`[${attemptNum},${letterPos}]`);
    if (letter !== "") {
      animate(
        elem, 
        { scale: [1, 1.1, 1] }, 
        { type: spring, duration: 0.1 }
      );
    }
    if (tileColor !== "") {
      animate(
        elem,
        { scaleY: [1, 0, 1] },
        { duration: 1.5, delay: stagger(0.1, { startDelay: (0.6*letterPos) }) }
      );
    }
  }, [attemptNum, letter, letterPos, tileColor]);

  return (
    <motion.span
      id={`[${attemptNum},${letterPos}]`}
      className={`w-14 h-14 flex items-center justify-center dark:text-white text-3xl font-bold border-2 
        ${
          tileColor === "correct"
            ? correctTileColor
            : tileColor === "present"
            ? presentTileColor
            : tileColor === "incorrect"
            ? incorrectTileColor
            : defaultTileColor
        }
      `}
    >
      {letter}
    </motion.span>
  );
};

Tile.propTypes = {
  attemptNum: PropTypes.number,
  letterPos: PropTypes.number,
};

export default Tile;
