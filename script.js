'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, 40, 3000, -650, -130, 70, 1300, 240],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2023-12-27T09:15:04.904Z',
    '2024-01-01T10:17:24.185Z',
    '2024-02-10T14:11:59.604Z',
    '2024-02-20T17:01:17.194Z',
    '2024-03-12T23:36:17.929Z',
    '2024-04-03T10:51:36.790Z',
    '2024-04-07T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'it-IT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2023-10-18T21:31:17.178Z',
    '2023-11-23T07:42:02.383Z',
    '2023-12-27T09:15:04.904Z',
    '2024-01-01T10:17:24.185Z',
    '2024-01-15T14:11:59.604Z',
    '2024-02-20T17:01:17.194Z',
    '2024-03-12T23:36:17.929Z',
    '2024-04-06T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2023-09-18T21:31:17.178Z',
    '2023-09-23T07:42:02.383Z',
    '2023-10-27T09:15:04.904Z',
    '2023-12-01T10:17:24.185Z',
    '2024-01-19T14:11:59.604Z',
    '2024-02-17T17:01:17.194Z',
    '2024-03-12T23:36:17.929Z',
    '2024-04-01T10:51:36.790Z',
  ],
  currency: 'GBP',
  locale: 'en-GB',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2023-09-18T21:31:17.178Z',
    '2023-10-23T07:42:02.383Z',
    '2023-11-27T09:15:04.904Z',
    '2023-12-01T10:17:24.185Z',
    '2024-01-19T14:11:59.604Z',
    '2024-02-13T17:01:17.194Z',
    '2024-03-20T23:36:17.929Z',
    '2024-04-04T10:51:36.790Z',
  ],
  currency: 'CAD',
  locale: 'en-CA',
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
const infoContainer = document.querySelector('.info');

const formatDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  const startLogOut = function () {
    const tick = function () {
      const min = String(Math.trunc(time / 60)).padStart(2, 0);
      const sec = String(time % 60).padStart(2, 0);
      labelTimer.textContent = `${min}:${sec}`;

      if (time === 0) {
        clearInterval(timer);
        infoContainer.style.display = 'flex';
        labelWelcome.textContent = 'Log in to get started';
        containerApp.style.opacity = 0;
      }
      time--;
    };
    let time = 300;
    tick();
    const timer = setInterval(tick, 1000);
    return timer;
  };

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// creare l'oggetto username che prende solo le prime iniziali dei nomi degli utenti
const createUsers = function (account) {
  account.forEach(function (account) {
    account.username = account.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};

createUsers(accounts);
console.log(accounts);

const calcolBalance = function (acc) {
  acc.balance = acc.movements.reduce(
    (accumulator, curr) => accumulator + curr,
    0
  );
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};
// calcolo di IN - OUT - INTEREST
const calcDisplaySummary = function (accumulator) {
  const incomes = accumulator.movements
    .filter(mov => mov > 0)
    .reduce((accumulator, mov) => accumulator + mov, 0);
  labelSumIn.textContent = formatCur(
    incomes,
    accumulator.locale,
    accumulator.currency
  );

  const out = accumulator.movements
    .filter(mov => mov < 0)
    .reduce((accumulator, mov) => accumulator - mov, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(out),
    accumulator.locale,
    accumulator.currency
  );

  const interest = accumulator.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * accumulator.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((accumulator, int) => accumulator + int, 0);
  labelSumInterest.textContent = formatCur(
    interest,
    accumulator.locale,
    accumulator.currency
  );
};

const update = function (acc) {
  displayMovements(acc);
  calcolBalance(acc);
  calcDisplaySummary(acc);

  clearInterval(timer);
  timer = startLogOutTimer();
};

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      update(currentAccount);

      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

const startLogOutTimer = function () {
  const timer1 = function () {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time = time - 1;
  };
  let time = 190;
  timer1();
  const timer = setInterval(timer1, 1000);
  return timer;
};

let currentAccount, timer;

//per formattare la data in base al paese
// const now = new Date();
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric',
// };
// const locale = navigator.language;
// console.log(locale);
// labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

btnLogin.addEventListener('click', function (e) {
  //preventDefault -- impedise che la pagina si ricarchi quando si verifica il click sul pulsante
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    infoContainer.style.display = 'none';
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const locale = navigator.language;
    console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getMonth()}`.padStart(2, 0);
    // const min = `${now.getMonth()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  } else {
    alert('User and Pin are wrong. Try Again!');
  }
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
  update(currentAccount);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    inputTransferAmount.value = inputTransferTo.value = '';
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    update(currentAccount);
  } else {
    alert('The User Does not exist');
  }
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

//SLICE
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
//per copiare tutti gli elementi di un array:
// console.log(arr.slice());
// console.log([...arr]);

//SPLICE
// // console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 2);
// console.log(arr);

// REVERSE
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());

//CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// JOIN
// console.log(letters.join(' - '));

// AT -- ottenere l'ultimo valore
// const arrAt = [23, 11, 24, 43];
// console.log(arrAt[1]);
// console.log(arrAt.at(1));

// console.log(arrAt[arrAt.length - 1]);
// console.log(arrAt.slice(-1)[0]);
// console.log(arrAt.at(-1));

//FOR LOOP SU ARRAY
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You widthdrew ${Math.abs(movement)}`);
//   }
// }
// console.log('---- ForEach ----');
// // FOREACH si ottiene lo stesso risultato del for loop -- richiede una funzione callback
// movements.forEach(function (movement, i, arr) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You widthdrew ${Math.abs(movement)}`);
//   }
// });

// FOREACH su maps

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// FOREACH su set -- il risultato sarà diverso perché i SET non hanno chiavi solo valori
// const currenciesSet = new Set(['USD', 'EUR', 'EUR', 'USD', 'GBP']);
// console.log(currenciesSet);
// currenciesSet.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });
/* ----- ------------ ------- -------- -------- ------- ------ */

/* ----  ESERCIZIO ---- 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. 
A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets


TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
*/

// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrect = [...dogsJulia];
//   dogsJuliaCorrect.splice(0, 1);
//   dogsJuliaCorrect.splice(-2);
//   // console.log(`originale [${dogsJulia}]`);
//   // console.log(dogsJuliaCorrect);

//   const correctData = dogsJuliaCorrect.concat(dogsKate);
//   console.log('correct Data ' + '[' + correctData + ']');

//   correctData.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`Dog number ${i + 1} is an adult and is ${dog} years old 🐶`);
//     } else {
//       console.log(
//         `Dog number ${i + 1} is still a puppy and is ${dog} years old 🐾`
//       );
//     }
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

/* strumenti per transformare i dati in un array
MAP / FILTER / REDUCE

MAP --
è un metodo che possiamo usare per eseguire un forloop 
è simile al metodo forEach() la differenza è che il metodo
map crea una nuova array basata su quella originale eseguendo cosi un loop
per esempio: moltiplica x2 ogni singolo elemento dell'array originale 
e inserisce i risultati in una nuova array.
Quindi restituisce una nuova array con i risultati di un operazione basandosi
sui dati dell'array originale

FILTER -- 
viene usato per filtrare gli elementi dell'array originale che 
soddisfano una certa condizione, per sempio tutti gli elementi maggiori di 2
tutti gli elementi che superano la condizione verranno inseriti in una nuova array
 
REDUCE -- 
viene usato per ridurre tutti gli elemento dell'array originale in un unico valore
per esempio sommare tutti i numeri contenuti dentro un array attraverso 
un'operazione specifica in questo caso non restituisce una nuova array ma 
solo il valore ridotto

const arr2 = [2, 3, 4, 5, 6];

const prova = arr2.reduce(
  (accumulator, currentValue) => accumulator + currentValue
);
console.log(prova);
*/

/* -----  MAP METODO ESEMPIO ---- */
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });
// console.log(movements);
// console.log(movementsUSD);
/* ----- ------------ ------- -------- -------- ------- ------ */
// const movementDescription = movements.map((mov, i, arr) => {
//   if (mov > 0) {
//     return `Movement ${i + 1}: You deposited ${mov}`;
//   } else {
//     return `Movement ${i + 1}: You widthdrew ${Math.abs(mov)}`;
//   }
// });
//---- SCRITTO IN MODO DIVERSO: -----
// const movementDescription = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'widthdrew'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementDescription);
/* ----- ------------ ------- -------- -------- ------- ------ */

// stessa funzione ma creata con il metodo freccia
// const movementsUSD = movements.map(mov => mov * eurToUsd);

// //Esempio con forloop

// const movementUSDfor = [];
// for (const mov of movements) movementUSDfor.push(mov * eurToUsd);
// console.log(movementUSDfor);

/* -----  FILTER METODO ESEMPIO ---- */

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);

// stesso sempio eseguito con un FORLOOPS
// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdrawals = movements.filter(function (neg) {
//   return neg < 0;
// });

// console.log(withdrawals);

/* -----  REDUCE METODO ESEMPIO ---- */

// const globalTotal = movements.reduce(function (accumulator, curr, i, arr) {
//   return accumulator + curr;
// });
// console.log(globalTotal);
// //Stessa metodo ma con la funzione freccia
// const balance = movements.reduce((accumulator, curr) => accumulator + curr, 0);

// // stesso risultato con FORLOOPS esempio
// let globalTotal2 = 0;
// for (const mov of movements) globalTotal2 += mov;
// console.log(globalTotal2);

// // trovare il numero massimo
// const max = movements.reduce(function (accumulator, curr) {
//   if (accumulator > curr) return accumulator;
//   else return curr;
// }, movements[0]);
// console.log(max);

/* ----- ------------ ------- -------- -------- ------- ------ */

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

*/

/*MIA SOLUZIONE */
const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map(function (dogAge) {
    if (dogAge <= 2) {
      return 2 * dogAge;
    } else if (dogAge > 2) {
      return 16 + dogAge * 4;
    }
  });
  const adults = humanAge.filter(function (ages) {
    return ages >= 18;
  });
  const average = adults.reduce(function (accumulator, age) {
    return accumulator + age / adults.length;
  }, 0);

  console.log(`Età del cane in età umana [${humanAge}]`);
  console.log(`I cani che hanno più di 18 anni [${adults}]`);
  console.log(`Età media è ${average}`);
};
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
/* ----- ------ ----- ------ ----- ------ ---- */
//Altro modo per risolverlo

const calcAverage = function (ages) {
  const humanAges = ages.map(ages => (ages <= 2 ? 2 * ages : 16 + ages * 4));
  const adultDog = humanAges.filter(ages => ages >= 18);
  console.log(humanAges);
  console.log(adultDog);

  const average = adultDog.reduce(
    (accumulator, age, i, arr) => accumulator + age / arr.length,
    0
  );
  return average;
};
const av1 = calcAverage([16, 6, 10, 5, 6, 1, 4]);
const av2 = calcAverage([5, 2, 4, 1, 15, 8, 3]);
console.log(av1, av2);
/*-------- -------- -------- ----------- ---------- */
//concatenare i 3 metodi insieme -MAP - FILTER - REDUCE
const totalDeposits = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    return mov * eurToUsd;
  })
  .reduce((accumulator, mov) => accumulator + mov, 0);
console.log(totalDeposits);

/*-------- -------- -------- ----------- ---------- */
//stesso codice ma senza le arrow function:
// const totalDeposits = movements
//   .filter(function (mov) {
//     return mov > 0;
//   })
//   .map(function (mov, i, arr) {
//     return mov * eurToUsd;
//   })
//   .reduce(function (accumulator, curr) {
//     return accumulator + curr;
//   }, 0);
/*------- -------- ---------- -------- -----/*
/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!
TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]
*/

// const calcAverageArrow = ages =>
//   ages
//     .map(ages => (ages <= 2 ? 2 * ages : 16 + ages * 4))
//     .filter(ages => ages >= 18)
//     .reduce((accumulator, age, i, arr) => accumulator + age / arr.length, 0);

// const arrow1 = calcAverageArrow([5, 2, 4, 1, 15, 8, 3]);
// const arrow2 = calcAverageArrow([16, 6, 10, 5, 6, 1, 4]);
// console.log(arrow1, arrow2);

/* metodo FIND 
si usa per recuperare un elemento nell'array in base ad una condizione
vengono accettate anche le callback function per eseguire un loops sull'array.
NON restituisce una nuova array ma solo il primo elemento dell'array che soddisfa
la condizione
*/
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

//estrarre un elemento da un oggetto con il metodo find

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(accounts);
console.log(account);

// ForLoops metodo
let accountArray;
for (const acc of accounts) {
  if (acc.owner === 'Jessica Davis') accountArray = acc;
}
console.log(accountArray);

/*metodo findIndex
restituisce l'indice dell'elemento trovato, non l'elemento stesso
*/
/* ----- ------- ------- ------ ------ ----- ----- */
//altrimenti metodi con gli array
//INCLUDES
/* verifica che una valore sia vero o falso dentro un'array*/
// console.log(movements);
// console.log(movements.includes(-130));

//SOME
/* verifica che una condizione sia vera o falsa*/
// console.log(movements.some(mov => mov === -130));

// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

//EVERY
/* se ogni elemento dell'array supera il test allora verrà restituito true*/
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

//Callback function si possono scrivere così
/* const deposit = mov => mov > 0;
console.log(movements.some(deposit))
console.log(movements.every(deposit))
console.log(movements.filter(deposit))*/

/* per mettere tutti i risultati in un'unica array si usa FLAT */
/* convertire un array in un nuovo array concatenando tutti i sotto elementi
di un array in un singolo array. 
Prende un valore di profondità come parametro(questo è opzionale) viene definito con
.flat(1) a seconda della prondità dell'array che vuoi concatenare*/
// const arr = [1, 2, 3, [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [
//   [[1, 2], 3, [4, [5, 6]]],
//   [7, 8],
// ];
// console.log(arrDeep.flat(3));

/*------ -------- --------- ------- */

// const overalBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// FLAT MAP
/* accetta una funzione callback che prende come paramentro l'elemento dell'array
originale , concatena gli elementi di un array in un unico livello  */
// const overalBalanceFlatMap = accounts
//   .flatMap(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// string e metodo SORT
/* riordina i valori (stringa) di un array in ordine alfabetico*/
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());

// per i numeri si esegue un callback function

// crescente
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
// console.log(movements);

// decrescente
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
// console.log(movements);

// metodo FILL -- crea un array con quel valore
const x = new Array(7);
x.fill(1);
console.log(x);
// si può usare il metodo fill per inserire un elemento in un array specificando anche la posizione
const arr = [1, 2, 3, 4, 5, 6, 7];
arr.fill(10, 1, 3);
console.log(arr);

// array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);
// con una callback function per creare un array:
const z = Array.from({ length: 6 }, (cur, i) => i + 1);
console.log(z);
/* ----- ----- ----- ------*/
const movementsUI = Array.from(document.querySelectorAll('.movements__value'));
console.log(movementsUI);

// struttura di un array per creare un array che contenga degli elementi
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => el.textContent.replace('€', '')
  );
  console.log(movementsUI);
});

/* Metodi che mutano l'array originale: 

Aggiungono qualcosa all'array principale
.push(fine)
.unshift(inizio)

Rimuovono qualcosa dall'array originale
.pop(fine)
.shift(inizio)
.splice(tutti)

Altri
.reverse
.sort (riordinare)
.fill

Metodi per creare una NUOVA array:

Per calcolare gli elementi dell'array principale
.map(esegue un forloop)

Creare una condizione o prendendo una porzione dell'array originale
.filter

Concatenare due array e crearne una nuova
.concat

Prendere una porzione dell'array originale e ne crea una copia in una nuova array
.slice

Usato per unire due o più array e restituisce un nuovo array
.concat

convertire un array in un nuovo array concatenando tutti i sotto elementi
.flat

appiattisce tutti gli elementi dell'array e crea un nuovo array,
concatena gli elementi di un array in un unico livello
.flatMap (usato con le callback function)

Per gli indici degli array si usano
.indexOf(basato sui valori)
.findIndex(basato su una condizione)

Per trovare un elemento nell'array
.find(basato su una condizione)

Per sapere se un array include un elemento (vero o falso)
.includes(basato su dei valori)
.some(basato su una condizione)
.every(basato su una condizione)

Trasformare un'array in una stringa
.join(separati da virgole o da altro separatore)

Ridurre l'intero array ad un solo valore
.reduce(con il metodo accumulator)

eseguire un loop su un array senza produrre un nuovo valore
non crea un nuovo valore o una nuova array
.forEach(callback function)
*/

//Esercizi con i metodi degli array
//1
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSum);
//  stessa soluzione con il metodo map
// const bankDepositSum = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .filter(mov => mov > 0)
//   .reduce((sum, cur) => sum + cur, 0);
// console.log(bankDepositSum);

// 2
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 1000).length;
console.log(numDeposits1000);
// con reduce
const numDeposits1000Reduce = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur > 1000 ? ++count : count), 0);
console.log(numDeposits1000Reduce);

// 3
// const { deposit, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sum, cur) => {
//       // cur > 0 ? (sum.deposit += cur) : (sum.withdrawals += cur);
//       sum[cur > 0 ? 'deposit' : 'withdrawals'] += cur;
//       return sum;
//     },

//     { deposit: 0, withdrawals: 0 }
//   );
// console.log(deposit, withdrawals);

// const { deposit, withdrawals } = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce(
//     (sum, cur) => {
//       sum[cur > 0 ? 'deposit' : 'withdrawals'] += cur;
//       return sum;
//     },
//     { deposit: 0, withdrawals: 0 }
//   );
// console.log(deposit, withdrawals);

// const convertTitleCase = function (title) {
//   const capitzalize = str => str[0].toUpperCase() + str.slice(1);

//   const exepctions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exepctions.includes(word) ? word : capitzalize(word)))
//     .join(' ');
//   return capitzalize(titleCase);
// };

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));

/* ----- ------- --------- -------- --------- -------- */

/*Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. 
Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. 
HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

*/
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
// 1 metodo forEach
// dogs.forEach(
//   dog => (dog.recommendedFood = Math.floor(dog.weight ** 0.75 * 28))
// );
// const input = dogs.map(dog => dog.recommendedFood);
// console.log(input);

//2 metodo find
// const sarahDog = dogs.find(dog => dog.owners[0] === 'Sarah');
// console.log(sarahDog);
// console.log(
//   `Sarah's dog is eating ${
//     sarahDog.curFood > sarahDog.recommendedFood ? 'much' : 'little'
//   }`
// );

//3 metodo  filter / flatMap / flat
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recommendedFood)
//   .flatMap(dog => dog.owners)
//   .flat();
// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recommendedFood)
//   .flatMap(dog => dog.owners)
//   .flat();
// console.log(ownersEatTooLittle);

// 4 metodo join
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);

// 5
// console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

//6
// const okayAmountFood = dog =>
//   dog.curFood > dog.recommendedFood * 0.9 &&
//   dog.curFood < dog.recommendedFood * 1.1;
// console.log(dogs.some(okayAmountFood));

// //7
// console.log(dogs.filter(okayAmountFood));
// const result = new Array(dogs.find(dog => okayAmountFood(dog)));
// const arrFood = result.flatMap(dog => okayAmountFood(dog));
// console.log(arrFood);

// 8
// const copyArr = dogs
//   .slice()
//   .sort((a, b) => a.recommendedFood - b.recommendedFood);
// console.log(copyArr);

//Dato un array di stringhe, utilizza reduce per concatenarle in un'unica stringa.
// const strings = ['Hello', ' ', 'World', '!'];
// const string2 = strings.reduce((acc, i) => acc + i);
// console.log(string2);

// const elements = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
// const countOccurrences = elements.reduce((acc, current) => {
//   acc[current] = (acc[current] || 0) + 1;
//   return acc;
// }, {});
// console.log(countOccurrences);

// const numbers = [1, 2, 3, 4, 5];
// const duplicate = numbers.flatMap(num => [num, num]);
// console.log(duplicate);

// const nestedArray = [
//   [1, 2],
//   [3, 4],
//   [5, 6],
// ];
// const unicoArr = nestedArray.flatMap(arr => arr);
// console.log(unicoArr);

// const array = [1, 2, 3, 4, 5, 6];

// const somm = array.reduce((acc, i) => acc + i);
// console.log(somm);

/* -------- ------- NUMERI ----- ------ ------ */
// convertire stringhe in numeri
console.log(Number('23'));
console.log(+'23');

//Parsing -- funziona solo se all'inizio c'è un numero seguito da qualche lettera, non il contrario
console.log(Number.parseInt('30px', 10));
console.log(Number.parseInt('e23', 10));
console.log(Number.parseInt('2.5rem'));
console.log(Number.parseFloat('2.5rem'));

// controlla se un valore è Nan
console.log(Number.isNaN(20));
// controlla se un valore è un numerp
console.log(Number.isFinite(20));

console.log(Number.isInteger(20));

//radice quadrata di un numero
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));
// trovare il numero massimo
console.log(Math.max(20, 19, 3, 10, 25, 50));
// trovare il numero minimo
console.log(Math.min(20, 19, 3, 10, 25, 50));

//calcolare il raggio
console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.floor(Math.random() * 6) + 1);
const random = (max, min) => Math.floor(Math.random() * (max - min) + 1) + min;
console.log(random(10, 3));

//parti deciamali
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.734).toFixed(2));

//operatore di resto %
console.log(5 % 2); // 5 = 2 * 2 + 1

// numeri pari vengono divisi per due e il risultato sarà 0
console.log(8 % 2);

// labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = 'grey';
//   });
// });

//Date e orario
// const now1 = new Date();
// console.log(now1);

// console.log(new Date('February 19,1998'));

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getMinutes());
// console.log(future.getHours());
// console.log(future.getSeconds());
// console.log(future.toISOString());

// console.log(+future);

// const calDaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// const days1 = calDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 24));
// console.log(days1);

//Formattazione dei numeri
const num = 3884764.23;
console.log('US:', new Intl.NumberFormat('en-US').format(num));

//setTimeout funzioni
const ingredients = ['olive', 'prosciutto'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
  3000,
  ...ingredients
);
console.log('Waiting...');
// if (ingredients.includes('prosciutto')) clearTimeout(pizzaTimer);

//setInterval
// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 1000);

// setInterval(function () {
//   console.log(
//     new Intl.DateTimeFormat('it-IT', {
//       hour: 'numeric',
//       minute: 'numeric',
//       second: 'numeric',
//       day: 'numeric',
//       weekday: 'long',
//       year: 'numeric',
//       month: 'numeric',
//     }).format(new Date())
//   );
// }, 1000);
