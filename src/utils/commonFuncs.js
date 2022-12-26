import { TAKE_PROFIT, LONG } from "./constants";

export const roundPlaces = (num, places) => +`${Math.round(`${num}e+${places}`)}e-${places}`;

export const calculateDcaGrid = (price, data) => {
  let arr = [];
  const {
    positionType = LONG,
    entryPrice = 0,
    takeProfitSize = 0,
    baseOrderSize = 0,
    safetyOrderSize = 0,
    maxSafetyOrdersCount = 0,
    priceDeviationToOpenSafetyOrders = 0,
    safetyOrderStepScale = 0,
    safetyOrderVolumeScale = 0,
    orderCloseType = TAKE_PROFIT,
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
    .map((e, i) => ({
      ...e,
      orderVolume:
        i === 0
          ? Number(baseOrderSize)
          : Number(safetyOrderSize) * Number(safetyOrderVolumeScale) ** (i - 1),
    }))
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
