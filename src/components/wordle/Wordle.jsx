import { useEffect, useState } from "react";
import Word from "./Word";

const Wordle = () => {
  const length = 5;
  const [solutionList, setSolutionList] = useState(
    Array(length + 1).fill(Array(length).fill(""))
  );
  let solutionIndex = 0;
  let currSolution = solutionList[solutionIndex];
  let letterIndex = 0;

  /* let word = "great"; */ /* TODO: call API to fetch new words every game */

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if(letterIndex < length) {
        if(e.key.length === 1 && e.key.match(/[a-z]/)) {
          currSolution[letterIndex++] = e.key;
          console.log(letterIndex);
          console.log(currSolution);
        }
        if(e.key === "Backspace") {
          currSolution[letterIndex-1] = '';
          letterIndex-1 > 0 && letterIndex--;
          console.log(letterIndex);
          console.log(currSolution);
        }
      }
    })
    return () => {
      window.removeEventListener("keydown", () => {});
    };
  }, [currSolution, letterIndex]);

  return (
    <div className="mt-5">
      <div className="flex flex-col gap-1 items-center">
        {solutionList.map((solution, index) => {
          return <Word key={index} solution={solution} />;
        })}
      </div>
    </div>
  );
};

export default Wordle;
