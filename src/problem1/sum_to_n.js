var sum_to_n_a = function (n) {
  // traditional way: loop from the beginning
  let total = 0;

  for (let i = 0; i <= n; i++) {
    total += i;
  }

  return total;
};

var sum_to_n_b = function (n) {
  // special formula: (n + 1) * (n / 2)
  // for example, if n = 5, we have 5 / 2 = 2.5 pairs
  // each pair has a sum of the last element (5) + the first element (1) = 6
  // (another pair is 4 + 2 = 6)
  // 3 is considered as a half of that sum (6 / 2 = 3), so it is a 0.5 pair
  return (n + 1) * (n / 2);
};

// pre-calculated sums of n from 0 to 9
const sums = [0, 1, 3, 6, 10, 15, 21, 28, 36, 45];
var sum_to_n_c = function (n) {
  // I pay attention that if we sum all the elements until n
  // actually, we are summing a repeating numbers of a sum from 1 to 9 (called S)
  // plus a repeating number of 10 * (n % 10)
  // for example, if n = 28 ->
  // sum =  S     +   (S  + 10 * (10)) + (S + 20 * 9) + (sum from 1 to 9)
  //        1 -> 9    11 -> 9            21 -> 28
  //     =  S * 2 +   (10 * 10) * (1 + 2) - (20 * (9 - 8)) + (sum from 1 to 9)
  //                  10 -> 19 & 20 -> 29        29

  if (n < 10) {
    return sums[n];
  }

  const repeating = Math.floor(n / 10);
  const odd = n % 10;

  return (
    sums[9] * repeating +
    100 * sum_to_n_c(repeating) -
    10 * repeating * (9 - odd) +
    sums[odd]
  );
};

// 0
// 1
// 3
// 6
// 10
// 15
// 21
// 28
// 36
// 45
// 55
// 4950
// 5050
// 5151
// 49995000
// 50015001
// 49999995000000
const inputs = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 99, 100, 101, 9999, 10001, 99999999999,
];
// console.log(sum_to_n_c(100));
inputs.forEach((input) => {
  console.log(sum_to_n_a(input)); // 155.729 seconds
  console.log(sum_to_n_b(input)); // 0.137 seconds
  console.log(sum_to_n_c(input)); // 0.093 seconds
  console.log("\n");
});
