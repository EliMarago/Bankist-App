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

  const combinedMovsDate = acc.movements.map((mov, i) => ({
    mov,
    movDate: acc.movementsDates.at(i),
  }));

  if (sort) combinedMovsDate.sort((a, b) => a.mov - b.mov);

  // const movs = sort
  //   ? acc.movements.slice().sort((a, b) => a - b)
  //   : acc.movements;

  combinedMovsDate.forEach(function (obj, i) {
    const { mov, movDate } = obj;
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(movDate);
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
