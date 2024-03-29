import PropTypes from "prop-types";
import { useContext, useEffect } from "react";
import { WordleContext } from "./Wordle";
import { animate, motion, spring, stagger } from "framer-motion";

/* const correctTileColor = "bg-green-600 border-green-600 text-white";
const presentTileColor = "bg-yellow-600 text-white border-yellow-600";
const incorrectTileColor =
  "bg-gray-500 text-white border-gray-500 dark:bg-gray-700 dark:border-gray-700";
const defaultTileColor = "border-gray-400 dark:border-gray-500"; */

const Tile = ({ attemptNum, letterPos }) => {
  const { board, tileAnimProps } = useContext(WordleContext);
  const letter = board.board[attemptNum][letterPos];

  const tileColor = board.tileColors[attemptNum][letterPos];

  useEffect(() => {
    const elem = document.getElementById(`[${attemptNum},${letterPos}]`);

    let tileBgColor = null,
      tileBorderColor = "#888",
      tileFontColor = null;
    // let animDuration = 0;
    // let startDelay = 0;

    if (letter !== "") {
      animate(elem, { scale: [1, 1.1, 1] }, { type: spring, duration: 0.1 });
    }

    if (tileColor !== "") {
      switch (tileColor) {
        case "correct":
          tileBgColor = "#008000";
          tileBorderColor = "#008000";
          tileFontColor = "#fff";
          break;

        case "incorrect":
          tileBgColor = "#444";
          tileBorderColor = "#444";
          tileFontColor = "#fff";
          break;

        case "present":
          tileBgColor = "#DAA520";
          tileBorderColor = "#DAA520";
          tileFontColor = "#fff";
          break;
      }
      animate(
        elem,
        {
          scaleY: [1, 0, 1],
          backgroundColor: [null, tileBgColor],
          borderColor: ["#888", tileBorderColor],
          color: [null, tileFontColor],
        },
        {
          duration: tileAnimProps.current.animDuration,
          delay: stagger(0, { startDelay: tileAnimProps.current.animDelay * letterPos}),
        }
      );
    }
  }, [attemptNum, letter, letterPos, tileAnimProps, tileColor]);

  return (
    <motion.span
      id={`[${attemptNum},${letterPos}]`}
      className={`w-14 h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 flex items-center justify-center border-2 `}
      style={{borderColor: "#888"}}
    >
      <span className="dark:text-white text-3xl lg:text-4xl xl:text-5xl font-bold">
        {letter}
      </span>
    </motion.span>
  );
};

Tile.propTypes = {
  attemptNum: PropTypes.number,
  letterPos: PropTypes.number,
};

export default Tile;
