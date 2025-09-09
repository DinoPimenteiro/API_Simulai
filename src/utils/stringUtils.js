function Capitalize(str) {
  let a = str.split(" ");
  var words = a.map((word) => {
    var letter = word.slice(0, 1);
    return letter.toUpperCase() + word.slice(1, word.length).toLowerCase();
  });
  return words.join(" ");
}

export {Capitalize};