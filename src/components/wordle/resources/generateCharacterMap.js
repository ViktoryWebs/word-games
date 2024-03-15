const generateCharacterMap = (word) => {
  const characterMap = {};
  for (let i = 0; i < word.length; i++) {
    let c = word[i];
    if (characterMap[c]) {
      characterMap[c] = {
        freq: characterMap[c].freq + 1,
        pos: [...characterMap[c].pos, i],
      };
    } else {
      characterMap[c] = {
        freq: 1,
        pos: [i],
      };
    }
  }
  return characterMap;
};

export default generateCharacterMap;