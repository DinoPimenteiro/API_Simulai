var onj = {
  d: 5,
  c: 90,
  b: 4,
  a: 9,
};

var values = Object.values(onj);

function verify(array){
  array.forEach(item => {
    if (item/1 !== item){
      console.log("errado")
    } else {
      return false
    }
  })
}

verify(values)

// var a = values.map((rate) => {
//   if (typeof rate === "number") {
//     var media = values.reduce((a, b) => {
//       var result = a + b;
//       return result;
//     });
//     return media;
//   } else {
//     console.log("fuswu")
//   }
// });

// console.log(a);
