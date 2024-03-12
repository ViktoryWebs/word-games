import { useEffect, useState } from "react";
import Word from "./Word";

const length = 5;
const solutionsTemplate = Array(length + 1).fill(Array(length).fill(""));

const Wordle = () => {
  const [solutionsList, setSolutionsList] = useState(solutionsTemplate);
  const [currIndex, setCurrIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);

  /* let word = "great"; */ /* TODO: call API to fetch new words every game */

  useEffect(() => {
    if(letterIndex < length) {
      document.addEventListener("keydown", (e) => {
        if (e.key.length === 1 && e.key.match(/[a-z]/g)) {
          const updatedSolution = solutionsList[currIndex].slice();
          updatedSolution[letterIndex] = e.key;
  
          const updatedSolutions = solutionsList.slice();
          updatedSolutions[currIndex] = updatedSolution;
          setSolutionsList(updatedSolutions);
          setLetterIndex(letterIndex + 1);
          console.log(letterIndex < length);
        }
        /* if (e.key === "Backspace" && letterIndex > 0) {
          currSolution[--letterIndex] = "";
        } */
      });
  
      return () => {
        window.removeEventListener("keydown", () => {});
      };
    }
    
  }, [currIndex, letterIndex, solutionsList]);

  return (
    <div className="mt-5">
      <div className="flex flex-col gap-1 items-center">
        {solutionsList.map((solution, index) => {
          return <Word key={index} solution={solution} />;
        })}
        {letterIndex}
        {letterIndex < length ? "true" : "false"}
      </div>
    </div>
  );
};

export default Wordle;
