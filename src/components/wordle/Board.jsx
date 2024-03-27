import { useContext } from "react";
import Tile from "./Tile";
import { WordleContext } from "./Wordle";
import { motion } from "framer-motion";

const Board = () => {
  const { board } = useContext(WordleContext);

  return (
    <div className="flex flex-col gap-1 items-center">
      {board.board.map((row, attemptNum) => {
        return (
          <motion.div key={attemptNum} className="flex gap-1">
            {row.map((_, letterPos) => {
              return (
                <Tile
                  key={letterPos}
                  attemptNum={attemptNum}
                  letterPos={letterPos}
                />
              );
            })}
          </motion.div>
        );
      })}
    </div>
  );
};

export default Board;
