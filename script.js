'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">2 deposit</div>
        <div class="movements__date">${i + 1} ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

const createUserName = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => {
        //     // return name.slice(0, 1);
        return name[0];
      })
      .join('');
  });
};

// console.log(acc.username);
createUserName(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Update UI
    updateUI(currentAccount);
  }
});

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, cur) => {
    return acc + cur;
  }, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
  // console.log(balance);
};
// calcDisplayBalance(account1.movements);

// Calculate summary
const calcDisplaySummary = acc => {
  console.log(acc, 'mov');
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes}€`;
  const expenses = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(expenses)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${interest}€`;
};
// calcDisplaySummary(account1.movements);

// UserName Details
let currentAccount;

// Event Handlers
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome ${currentAccount?.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    console.log(currentAccount, 'currentAccount');

    // Update UI
    updateUI(currentAccount);
  }
});

// Maximum value of the movement array
const MaxNum = movements.reduce((acc, cur, i, arr) => {
  // console.log(`${acc} : ${cur} ::: ${cur > acc}`);
  // console.log(arr);
  // const max = acc + cur;
  // const res = cur > acc ? (acc = cur) : acc;
  // return res;
  if (cur > acc) {
    return (acc = cur);
  } else {
    return acc;
  }

  // if (cur > acc) {
  //   const res = acc + cur;
  //   return res;
  // }
  // return acc + cur;
  // return acc;
}, 0);

// console.log(MaxNum);

const eurToUsd = 1.1;
// PIPELINE
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, cur) => acc + cur, 0);

console.log(totalDepositsUSD);

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// console.log(calcPrintBalance(movements));
// labelBalance.textContent = calcPrint Balance(movements);
// console.log(accounts);

// console.log(
// clggggcreateUserName('Steven Thomas Williams'));

// const user = 'Steven Thomas Williams'; // stw
// console.log(username.join(''));

// console.log(username);

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movements
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  let username = inputCloseUsername.value;
  let pin = Number(inputClosePin.value);

  if (currentAccount?.username === username && currentAccount?.pin === pin) {
    console.log('correct');
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // Delete Account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = '0';
  }
  username = pin = '';
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//  The Filter Method
// const deposits = movements.filter(mov => mov > 0);
// console.log(deposits);

// For Of Loop
// const deposit = [];
// for (const mov of movements) {
//   if (mov > 0) {
//     // console.log(mov);
//     deposit.push(mov);
//   }
// }
// console.log(deposit);

// Challenge
// const withdrawal = movements.filter(mov => mov < 0);
// console.log(withdrawal);

// The Reduce Method
// console.log(movements);
// const balance = movements.reduce((acc, cur, i, arr) => {
//   console.log(`Iteration ${i} and ${acc}`);
//   return acc + cur;
// }, 0);
// console.log(balance);
/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

// // Slice
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-3));
// console.log(arr.slice(1, -2));
// console.log(arr.slice());
// console.log([...arr]);

// // Splice
// // console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);

// // Reverse
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// // Concat
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// // Join
// console.log(letters.join(' - '));

// // new at Method
// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// // getting last array element in traditional way
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);

// console.log(arr.at(-1));

// // at method on string
// console.log('jonas'.at(0));
// console.log('jonas'.at(-1));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movements] of movements.entries()) {
// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(`You deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// }

// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(`You deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// }

// movements.forEach(function (movement, index,array){
//   if (movement > 0) {
//     console.log(`You deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// });

// Map
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// // Set
// const currenciesUnique = new Set(['USD', 'GB', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${value}: ${value}`);
// });

// const eurToUsd = 1.1;

<<<<<<< HEAD
// Set
const currenciesUnique = new Set(['USD', 'GB', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  // console.log(`${value}: ${value}`);
  console.log(`${value}: ${value}`);
=======
// const movement = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const movementsUSD = movement.map(function (mov) {
//   return mov * eurToUsd;
//   // return mov;
//   // return [234, 324, 2134];
// });

// const movementsUSD = movement.map(
//   mov => mov * eurToUsd
//   // return mov;
//   // return [234, 324, 2134];
// );

// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];

// for (const mov of movement) {
//   movementsUSDfor.push(mov * eurToUsd);
//   // console.log(mov * eurToUsd);
// }

// console.log(movementsUSDfor);

// The Find Method
const firstWithDrawal = movements.find(mov => mov < 0);
console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');

console.log(account);

// Separate Callback
const deposit = mov => mov > 0;

// Flat Method
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[([1, 2], 3)], [4, [5, 6], 7, 8]];

console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements, 'accountMovements');
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const addAllMovements = allMovements.reduce((acc, item) => acc + item, 0);
// console.log(addAllMovements);

// const overAllbalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, item) => acc + item, 0);
// console.log(overAllbalance);

// Strings
const owner = ['jonas', 'zach', 'Adam', 'martha'];
console.log(owner.sort());
console.log(owner);

// Numbers
console.log(movements);
console.log(movements.sort());

// return < 0, A, B (Keep order)
// return > 0, B, A (Switcher order)
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });
// console.log(movements);

movements.sort((a, b) => a - b);
console.log(movements);

const arr2 = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7);
console.log(x);

// x.fill(4);
x.fill(1, 2, 5);
console.log(x);

arr2.fill(23, 4, 6);
console.log(arr2);

// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);
const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const randomNumber = Array.from({ length: 100 }, () =>
  Math.ceil(Math.random() * 6)
);
console.log(randomNumber);

// console.log(movementUI);

labelBalance.addEventListener('click', function () {
  const movementUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => el.textContent.replace('€', '')
  );
  console.log(movementUI);
  // console.log(movementUI.map(el => el.textContent.replace('€', '')));
>>>>>>> 3511fdc9bef8e1df9e896a36ad7780c8b98cd662
});

///////////////////////////////
// Array Method Practice`

// 1.
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(deposit => deposit > 0)
  .reduce((acc, cur) => acc + cur, 0);
console.log(bankDepositSum);

// 2.0
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(sum => sum >= 1000).length;
console.log(numDeposits1000);

// 2.1
const numDeposits1000WithReduce = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

console.log(numDeposits1000WithReduce);

// create an object the sum of an deposits and of withdraws
// 3.
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      // Alternate way
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

//////////////////////////////

// Title case means all words in a sentence are capitalized
// 4.
// this is a title -> This Is a Title

const convertTitleCase = function (title) {
  const split = title.split(' ').map(item => {
    return item.length > 1
      ? item.slice(0, 1).toUpperCase() + item.slice(1)
      : item;
  });
  return split;
};

console.log(convertTitleCase('this is a title'));
