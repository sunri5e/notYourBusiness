# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

Сервіс котрий дає можливість:

- завантажити історичні дані ціни та канальних індикаторів:
  вивантажити з TradingView дані в форматі CSV. Завантажити їх на сервіс та перетворити в JSON. Відібрати потрібні колонки та сформувати з них нові дані. Для відбору колонок може використовуватись інтерфейс з селектами де потрібно вибрати назви необхідних колонок

- відібрати точки перетину ціни та границь каналу,
  потрбіно вибрати напрям стратегії (Long/Short). Залежно від напряму відібрати нижню граицю каналу і мінімальну ціну, або верхню границю каналу і максимальну ціну. Не залежно від напряму відібрати значення каналу на момент коли ціна була нижче чи вище нього і дату

DONE - ввести налаштування параметрів для DCA бота
основними параметрами є: - величина першого ордеру (якшо пусто то 100 уо.), - величина страховочного ордеру (якшо пусто то така сама як перший ордер), - кількість страховочних ордерів (СО), - відступ страховочних ордерів (ШСО), - динамічний відступ страховочних ордерів (ДШСО) (якшо пусто то 1), - множник обєму СО/мартінгейл (МАР) (якшо пусто то 1), - величина тейкпрофіту (ТП).
результатом є такі розрахунки представлені в таблиці: - % відхилення від початкової точки входу для кожного кроку - ціна - сума витрачених коштів на кожному кроці -

DONE - вирахувати екстремуми ціни після перетину та після відкату/корекції,
DONE - відобразити вибірку з точок перетину і екстремумів

- перевірити чи покривають налаштування бота ситуації з вибірки
  DONE - вирахувати і відобразити кількість виконаних страховочних ордерів (СО) для кожної ситуації
- зберегти вибірку з точок перетину і екстремумів
- відобразити дати ситуацій на часовому графіку
- доповнити вибірку
- зберегти і порівняти на часовому графіку вибірку по іншому інструменту/монеті
- обробити ситуацію коли виконались всі СО
