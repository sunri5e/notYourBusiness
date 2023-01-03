import { TAKE_PROFIT, LONG, ITERATIVE, CUMULATIVE, LINE_CROSS } from "./constants";

export const roundPlaces = (num, places) => +`${Math.round(`${num}e+${places}`)}e-${places}`;

export const calculateDcaGrid = (price, data) => {
  let arr = [];
  const {
    positionType = LONG,
    entryPrice = 0,
    takeProfitSize = 0,
    baseOrderSize = 0,
    baseOrderInPercent = false,
    safetyOrderSize = 0,
    safetyOrderInPercent = false,
    maxSafetyOrdersCount = 0,
    priceDeviationToOpenSafetyOrders = 0,
    safetyOrderStepScale = 0,
    safetyOrderVolumeScale = 0,
    orderCloseType = TAKE_PROFIT,
    depositSize,
    depositGrowType = ITERATIVE,
  } = data;
  const priceToUse = price || entryPrice;

  // const roundPlaces = priceToUse.split(".")[1].length;

  arr = [...Array(Number(maxSafetyOrdersCount) + 1).keys()].map((e) => ({
    orderNumber: e === 0 ? "BO" : e,
  }));

  // Calculate deviation
  const deviationDirection = positionType === LONG ? -1 : 1;
  for (let i = 0; i < arr.length; i++) {
    if (i === 0) {
      arr[i].deviation = 0;
    } else if (i === 1) {
      arr[i].deviation = Number(priceDeviationToOpenSafetyOrders) * deviationDirection;
    } else {
      arr[i].deviation =
        Number(priceDeviationToOpenSafetyOrders) * deviationDirection +
        arr[i - 1].deviation * Number(safetyOrderStepScale);
    }
  }

  arr = arr
    // Calculate order price
    .map((e, i) => ({
      ...e,
      entryPrice: i === 0 ? Number(priceToUse) : Number(priceToUse) * (1 + arr[i].deviation / 100),
    }))
    // Calculate order volume
    .map((e, i) => {
      const BO =
        baseOrderInPercent && depositGrowType === CUMULATIVE
          ? (Number(baseOrderSize) / 100) * Number(depositSize)
          : Number(baseOrderSize);
      const SO =
        safetyOrderInPercent && depositGrowType === CUMULATIVE
          ? (Number(safetyOrderSize) / 100) *
            Number(depositSize) *
            Number(safetyOrderVolumeScale) ** (i - 1)
          : Number(safetyOrderSize) * Number(safetyOrderVolumeScale) ** (i - 1);
      return {
        ...e,
        orderVolume: i === 0 ? BO : SO,
      };
    })
    // Calculate order size
    .map((e) => ({
      ...e,
      orderSize: e.orderVolume / e.entryPrice,
    }))
    // Calculate total order size
    .map((e, i, arr) => ({
      ...e,
      totalOrderSize: arr.slice(0, i + 1).reduce((a, b) => a + Number(b.orderSize), 0),
    }))
    // Calculate total order cost
    .map((e, i, arr) => ({
      ...e,
      totalOrderCost: arr.slice(0, i + 1).reduce((a, b) => a + Number(b.orderVolume), 0),
    }))
    // Calculate average order price
    .map((e) => ({
      ...e,
      averageOrderPrice: e.totalOrderCost / e.totalOrderSize,
    }))
    // Calculate required price to reach take profit for total volume
    .map((e) => {
      const TP =
        positionType === LONG ? 1 + Number(takeProfitSize) / 100 : 1 - Number(takeProfitSize) / 100;
      return {
        ...e,
        requiredPrice: orderCloseType === TAKE_PROFIT ? Number(e.averageOrderPrice * TP) : null,
      };
    });

  return arr;
};

export const grabPriceFromGrid = (props) => {
  const { grid, extremum, type, settings } = props;
  let req;
  for (let j = 0; j < grid.length; j++) {
    const gridItem = grid[j];
    const condition =
      settings.positionType === LONG
        ? gridItem.entryPrice >= extremum
        : gridItem.entryPrice <= extremum;

    // extremum for long === low, for short === high
    if (condition) {
      if (type === "targetPrice") {
        req = gridItem.requiredPrice;
      } else if (type === "avgPrice") {
        req = gridItem.averageOrderPrice;
      } else if (type === "totalVolume") {
        req = gridItem.totalOrderCost;
      }
    }
  }
  return req;
};

export const calculateSituationsDCA = (props) => {
  const { settings, analysisData } = props;
  const complexData = [];
  let deposit = settings.depositSize;

  for (let i = 0; i < analysisData.length; i++) {
    const entryBar = analysisData[i];
    let situationGrid = [];
    let sitTargetPrice;
    let sitAveragePrice;
    let currencyPnL;
    let sitTotalVolume;
    let sitBarLength = 0;
    let sitExtremum = settings.positionType === LONG ? entryBar.low : entryBar.high;
    const entryTriggerPrice = entryBar[settings.orderStartCrossLine];
    const entryCondition =
      settings.positionType === LONG
        ? sitExtremum < entryTriggerPrice && entryBar.high > entryTriggerPrice
        : sitExtremum > entryTriggerPrice && entryBar.low < entryTriggerPrice;

    // opening position
    if (entryCondition) {
      situationGrid = calculateDcaGrid(entryTriggerPrice, settings);
      sitTargetPrice =
        settings.orderCloseType === TAKE_PROFIT
          ? grabPriceFromGrid({
              grid: situationGrid,
              extremum: sitExtremum,
              type: "targetPrice",
              settings,
            })
          : entryBar[settings.orderCloseCrossLine];
      let closingCondition;
      let error = null;

      // go to next bar
      const positionAccompany = () => {
        let currentBar = analysisData[i + 1];

        if (currentBar) {
          let currentBarExtremum =
            settings.positionType === LONG ? currentBar.low : currentBar.high;
          let interimCondition =
            settings.positionType === LONG
              ? currentBarExtremum < sitExtremum
              : currentBarExtremum > sitExtremum;

          if (interimCondition) {
            sitExtremum = currentBarExtremum;
            sitTargetPrice = grabPriceFromGrid({
              grid: situationGrid,
              extremum: sitExtremum,
              type: "targetPrice",
              settings,
            });
          }

          if (settings.orderCloseType === LINE_CROSS) {
            sitTargetPrice = currentBar[settings.orderCloseCrossLine];
          }

          closingCondition =
            settings.positionType === LONG
              ? currentBar.high >= sitTargetPrice
              : currentBar.low <= sitTargetPrice;

          while (!closingCondition) {
            currentBar = analysisData[i + 1];

            if (currentBar) {
              currentBarExtremum =
                settings.positionType === LONG ? currentBar.low : currentBar.high;
              interimCondition =
                settings.positionType === LONG
                  ? currentBarExtremum < sitExtremum
                  : currentBarExtremum > sitExtremum;

              if (interimCondition) {
                sitExtremum = currentBarExtremum;
                sitTargetPrice = grabPriceFromGrid({
                  grid: situationGrid,
                  extremum: sitExtremum,
                  type: "targetPrice",
                  settings,
                });
              }

              if (settings.orderCloseType === LINE_CROSS) {
                sitTargetPrice = currentBar[settings.orderCloseCrossLine];
              }

              closingCondition =
                settings.positionType === LONG
                  ? currentBar.high >= sitTargetPrice
                  : currentBar.low <= sitTargetPrice;
            } else {
              error = "Can't be closed. No more data";
              return;
            }

            i++;
            sitBarLength++;
          }
        }
      };
      positionAccompany();

      sitAveragePrice = grabPriceFromGrid({
        grid: situationGrid,
        extremum: sitExtremum,
        type: "avgPrice",
        settings,
      });
      sitTotalVolume = grabPriceFromGrid({
        grid: situationGrid,
        extremum: sitExtremum,
        type: "totalVolume",
        settings,
      });
      currencyPnL =
        ((settings.positionType === LONG
          ? sitTargetPrice / sitAveragePrice - 1
          : 1 - sitTargetPrice / sitAveragePrice) *
          100 *
          sitTotalVolume) /
        100;

      complexData.push({
        ...entryBar,
        dcaGrid: [...situationGrid],
        extremum: sitExtremum,
        sitTargetPrice,
        sitAveragePrice,
        currencyPnL,
        sitTotalVolume,
        sitBarLength,
        priceGap: sitExtremum - situationGrid[situationGrid.length - 1].entryPrice,
        totalDeviation:
          settings.positionType === LONG
            ? sitExtremum / entryTriggerPrice - 1
            : entryTriggerPrice / sitExtremum - 1,
        completedOrders: situationGrid.filter((e) =>
          settings.positionType === LONG ? e.entryPrice >= sitExtremum : e.entryPrice <= sitExtremum
        ).length,
        depositSize: deposit,
        error: error,
      });

      if (settings.depositGrowType === CUMULATIVE) deposit = Number(deposit) + currencyPnL;
    }
  }

  // setSituations(complexData);
  console.log(complexData);
  return complexData;
};
