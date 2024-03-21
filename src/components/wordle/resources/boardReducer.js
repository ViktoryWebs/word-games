import generateCharacterMap from "./generateCharacterMap";
const wordLength = 5;
const defaultBoard = Array(wordLength + 1).fill(Array(wordLength).fill(""));
const defaultTileColors = Array(wordLength + 1).fill(
  Array(wordLength).fill("")
);

export const boardReducer = (board, action) => {
  const updatedBoard = board?.board?.slice();
  let updatedAttempt = null;
  if (action.attempt < 6) updatedAttempt = updatedBoard[action.attempt].slice();
  const updatedTileColors = board?.tileColors?.slice();

  let word = null;
  let characterMap = {};

  let prevAttempt = [];
  let updatedAttemptTileColors = [];
  let prevAttemptCharacterMap = {};

  switch (action.type) {
    case "letter":
      updatedAttempt[action.letterPos] = action.key;
      updatedBoard[action.attempt] = updatedAttempt;
      return { board: [...updatedBoard], tileColors: [...board.tileColors] };

    case "enter":
      word = JSON.parse(localStorage.getItem("word"));
      characterMap = generateCharacterMap(word);
      prevAttempt = board.board[action.attempt - 1].slice();
      prevAttemptCharacterMap = generateCharacterMap(prevAttempt);
      updatedAttemptTileColors = updatedTileColors[action.attempt - 1].slice();

      Object.keys(prevAttemptCharacterMap).forEach((key) => {
        if (!characterMap[key]) {
          for (let pos of prevAttemptCharacterMap[key].pos) {
            updatedAttemptTileColors[pos] = "incorrect";
          }
        } else {
          const originalPosArr = characterMap[key].pos.toSorted();
          const attemptPosArr = prevAttemptCharacterMap[key].pos.toSorted();

          if (prevAttemptCharacterMap[key].freq === characterMap[key].freq) {
            for (let i = 0; i < prevAttemptCharacterMap[key].freq; i++) {
              if (originalPosArr.includes(attemptPosArr[i])) {
                updatedAttemptTileColors[attemptPosArr[i]] = "correct";
              } else {
                updatedAttemptTileColors[attemptPosArr[i]] = "present";
              }
            }
          } else {
            let matches = 0;
            for (let i = 0; i < prevAttemptCharacterMap[key].freq; i++) {
              if (originalPosArr.includes(attemptPosArr[i])) {
                updatedAttemptTileColors[attemptPosArr[i]] = "correct";
                matches++;
              } else {
                updatedAttemptTileColors[attemptPosArr[i]] = "incorrect";
              }
            }
            if (matches < characterMap[key].freq) {
              for (let i = matches; i < characterMap[key].freq; i++) {
                updatedAttemptTileColors[attemptPosArr[i]] = "present";
              }
            }
          }
        }
      });

      updatedTileColors[action.attempt - 1] = updatedAttemptTileColors;
      localStorage.setItem(
        "board",
        JSON.stringify({
          board: [...board.board],
          tileColors: [...updatedTileColors],
        })
      );
      return { board: [...board.board], tileColors: [...updatedTileColors] };

    case "delete":
      updatedAttempt[action.letterPos] = "";
      updatedBoard[action.attempt] = updatedAttempt;
      return { board: [...updatedBoard], tileColors: [...board.tileColors] };

    case "initialize":
      return { board: defaultBoard, tileColors: defaultTileColors };

    case "loadBoard": 
      return JSON.parse(localStorage.getItem("board"));

    default:
      throw Error("Unknown action: " + action.type);
  }
};

export default boardReducer;
