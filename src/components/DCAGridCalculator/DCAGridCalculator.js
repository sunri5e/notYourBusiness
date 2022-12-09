import React, { useState, useEffect } from "react";
import moment from "moment";
import FormField from "../FormField/FormField";
import { inch_mock } from "../../mocks/1inch_mock.js";

function DCAGridCalculator() {
  const dcaParams = localStorage.getItem("dcaParams");
  const [compData, setCompData] = useState(
    dcaParams
      ? JSON.parse(dcaParams)
      : {
          entryPrice: "",
          takeProfit: "",
          baseOrderSize: "",
          safetyOrderSize: "",
          maxSafetyOrdersCount: "",
          priceDeviationToOpenSafetyOrders: "",
          safetyOrderStepScale: "",
          safetyOrderVolumeScale: "",
        }
  );
  const [dcaGrid, setDcaGrid] = useState([]);
  const [analysisData, setAnalysisData] = useState(
    inch_mock
      // .filter((e) => e.low < e.low_band2_9 && e.high > e.low_band2_9)
      .map((e) => ({
        time: e.time,
        low: e.low,
        high: e.high,
        low_band2_9: e.low_band2_9,
      }))
  );
  const [situations, setSituations] = useState([]);
  const [positionType, setPositionType] = useState("long");

  const onParamChange = (e) => {
    console.log(e);
    const newData = { ...compData, [e.target.name]: e.target.value };
    setCompData(newData);
    localStorage.setItem("dcaParams", JSON.stringify(newData));
  };

  const calculateDcaGrid = (price) => {
    let arr = [];
    const {
      entryPrice,
      takeProfit,
      baseOrderSize,
      safetyOrderSize,
      maxSafetyOrdersCount,
      priceDeviationToOpenSafetyOrders,
      safetyOrderStepScale,
      safetyOrderVolumeScale,
    } = compData;
    const priceToUse = price || entryPrice;

    // const roundPlaces = priceToUse.split(".")[1].length;

    arr = [...Array(Number(maxSafetyOrdersCount) + 1).keys()].map((e) => ({
      orderNumber: e === 0 ? "BO" : e,
    }));

    // Calculate deviation
    for (let i = 0; i < arr.length; i++) {
      if (i === 0) {
        arr[i].deviation = 0;
      } else if (i === 1) {
        arr[i].deviation = Number(priceDeviationToOpenSafetyOrders);
      } else {
        arr[i].deviation =
          Number(priceDeviationToOpenSafetyOrders) +
          arr[i - 1].deviation * Number(safetyOrderStepScale);
      }
    }

    arr = arr
      // Calculate order price
      .map((e, i) => ({
        ...e,
        entryPrice:
          i === 0
            ? Number(priceToUse)
            : positionType === "long"
            ? Number(priceToUse) * (1 - arr[i].deviation / 100)
            : Number(priceToUse) * (1 + arr[i].deviation / 100),
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
      .map((e, i) => ({
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
      .map((e, i, arr) => ({
        ...e,
        requiredPrice: Number(e.averageOrderPrice * (1 + Number(takeProfit) / 100)),
      }));

    return arr;
  };

  const getTargetPrice = (grid, low) => {
    let req;
    for (let j = 0; j < grid.length; j++) {
      const gridItem = grid[j];

      if (gridItem.entryPrice >= low) {
        req = gridItem.requiredPrice;
      }
    }
    return req;
  };

  const calculateSituationsDCA = () => {
    let complexData = [];

    for (let i = 0; i < analysisData.length; i++) {
      const entryBar = analysisData[i];
      let situationGrid = [];
      let sitTargetPrice;
      let sitBarLength = 0;
      let sitLow = entryBar.low;

      // opening position
      if (sitLow < entryBar.low_band2_9 && entryBar.high > entryBar.low_band2_9) {
        situationGrid = calculateDcaGrid(entryBar.low_band2_9);
        sitTargetPrice = getTargetPrice(situationGrid, sitLow);

        // go to next bar
        const positionAccompany = () => {
          sitBarLength++;

          if (analysisData[i + sitBarLength]) {
            if (analysisData[i + sitBarLength].low < sitLow) {
              sitLow = analysisData[i + sitBarLength].low;
              sitTargetPrice = getTargetPrice(situationGrid, sitLow);
            }

            if (analysisData[i + sitBarLength].high >= sitTargetPrice) {
              complexData.push({
                ...entryBar,
                dcaGrid: [...situationGrid],
                totalLow: sitLow,
                sitTargetPrice,
                sitBarLength,
              });
            } else {
              positionAccompany();
            }
          }
          i++;
        };
        positionAccompany();
        console.log("---------");
      }
    }

    setSituations(complexData);
  };

  const updateData = () => {
    setDcaGrid(calculateDcaGrid());
    calculateSituationsDCA();
  };

  useEffect(() => {
    updateData();
  }, []);

  useEffect(() => {
    setDcaGrid(calculateDcaGrid());
  }, [compData]);

  const roundPlaces = (num, places) => {
    return +(Math.round(num + "e+" + places) + "e-" + places);
  };

  return (
    <div className="app-h-pt-28">
      <div className="app-l-container">
        <div className="app-form-section app-l-grid">
          <div className="app-l-grid--span-6">
            <h4 className="app-form-section--title">Situations</h4>
            {situations.map((sit, index) => (
              <>
                <p>
                  {moment(sit.time).format("DD MMM YYYY, H:mm")}, length:{" "}
                  <span className="app-h-color-success">{sit.sitBarLength}</span>, total low:{" "}
                  <span className="app-h-color-success">{sit.totalLow}</span>, target price:{" "}
                  <span className="app-h-color-success">{roundPlaces(sit.sitTargetPrice, 4)}</span>
                </p>
                <table key={index} className="app-table">
                  <thead>
                    <tr>
                      <th rowSpan="2">
                        <span className="app-h-fz-smallest">Order №</span>
                      </th>
                      <th rowSpan="2">
                        <span className="app-h-fz-smallest">Deviation,&nbsp;%</span>
                      </th>
                      <th colSpan="2">
                        <span className="app-h-fz-smallest">Order</span>
                      </th>
                      <th rowSpan="2">
                        <span className="app-h-fz-smallest">Price</span>
                      </th>
                      <th rowSpan="2">
                        <span className="app-h-fz-smallest">Average price</span>
                      </th>
                      <th rowSpan="2">
                        <span className="app-h-fz-smallest">Required price</span>
                      </th>
                      {/* <th rowSpan="2">
                      <span className="app-h-fz-smallest">Required change,&nbsp;%</span>
                    </th> */}
                      <th colSpan="2">
                        <span className="app-h-fz-smallest">Total</span>
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <span className="app-h-fz-smallest">Size</span>
                      </th>
                      <th>
                        <span className="app-h-fz-smallest">Volume</span>
                      </th>
                      <th>
                        <span className="app-h-fz-smallest">Size</span>
                      </th>
                      <th>
                        <span className="app-h-fz-smallest">Volume</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sit.dcaGrid?.map(
                      (item, i) =>
                        item.entryPrice >= sit.totalLow && (
                          <tr key={i}>
                            <td>
                              <span>{item.orderNumber}</span>
                            </td>
                            <td>
                              <span>{roundPlaces(item.deviation, 2)}</span>
                            </td>
                            <td>{roundPlaces(item.orderSize, 2)}</td>
                            <td>{roundPlaces(item.orderVolume, 2)}</td>
                            <td>
                              <span
                                className={`${
                                  i === 0 ? "app-h-color-primary app-h-cursor-pointer" : ""
                                }`}
                                onClick={
                                  i === 0
                                    ? (e) => {
                                        onParamChange({
                                          target: { name: "entryPrice", value: e.target.innerText },
                                        });
                                      }
                                    : () => {}
                                }
                              >
                                {roundPlaces(item.entryPrice, 4)}
                              </span>
                            </td>
                            <td>
                              <span>{roundPlaces(item.averageOrderPrice, 4)}</span>
                            </td>
                            <td>
                              <span>{roundPlaces(item.requiredPrice, 4)}</span>
                            </td>
                            {/* <td>
                      <span>{item.requiredChange}</span>
                    </td> */}
                            <td>{roundPlaces(item.totalOrderSize, 2)}</td>
                            <td>{roundPlaces(item.totalOrderCost, 2)}</td>
                          </tr>
                        )
                    )}
                  </tbody>
                </table>
              </>
            ))}
          </div>
          <div className="app-l-grid--span-6">
            <h4 className="app-form-section--title">Calculate DCA orders grid</h4>
            <div className="app-l-grid">
              <div className="app-l-grid--span-6">
                <FormField
                  type="number"
                  value={compData.entryPrice}
                  name="entryPrice"
                  id="entryPrice"
                  onChange={onParamChange}
                  onBlur={updateData}
                  label="Entry price"
                />
              </div>
              <div className="app-l-grid--span-6">
                <FormField
                  type="number"
                  value={compData.takeProfit}
                  name="takeProfit"
                  id="takeProfit"
                  onChange={onParamChange}
                  onBlur={updateData}
                  label="Target profit (%)"
                />
              </div>
              <div className="app-l-grid--span-6">
                <FormField
                  type="number"
                  value={compData.baseOrderSize}
                  name="baseOrderSize"
                  id="baseOrderSize"
                  onChange={onParamChange}
                  onBlur={updateData}
                  label="Base order size"
                />
              </div>
              <div className="app-l-grid--span-6">
                <FormField
                  type="number"
                  value={compData.safetyOrderSize}
                  name="safetyOrderSize"
                  id="safetyOrderSize"
                  onChange={onParamChange}
                  onBlur={updateData}
                  label="Safety order size"
                />
              </div>
              <div className="app-l-grid--span-6">
                <FormField
                  type="number"
                  value={compData.maxSafetyOrdersCount}
                  name="maxSafetyOrdersCount"
                  id="maxSafetyOrdersCount"
                  onChange={onParamChange}
                  onBlur={updateData}
                  label="Max safety orders count"
                />
              </div>
              <div className="app-l-grid--span-6">
                <FormField
                  type="number"
                  value={compData.priceDeviationToOpenSafetyOrders}
                  name="priceDeviationToOpenSafetyOrders"
                  id="priceDeviationToOpenSafetyOrders"
                  onChange={onParamChange}
                  onBlur={updateData}
                  label="Price deviation to open safety orders (% from initial order)"
                />
              </div>
              <div className="app-l-grid--span-6">
                <FormField
                  type="number"
                  value={compData.safetyOrderStepScale}
                  name="safetyOrderStepScale"
                  id="safetyOrderStepScale"
                  onChange={onParamChange}
                  onBlur={updateData}
                  label="Safety order step scale"
                />
              </div>
              <div className="app-l-grid--span-6">
                <FormField
                  type="number"
                  value={compData.safetyOrderVolumeScale}
                  name="safetyOrderVolumeScale"
                  id="safetyOrderVolumeScale"
                  onChange={onParamChange}
                  onBlur={updateData}
                  label="Safety order volume scale"
                />
              </div>
            </div>
            <table className="app-table app-h-mt-6">
              <thead>
                <tr>
                  <th rowSpan="2">
                    <span className="app-h-fz-smallest">Order №</span>
                  </th>
                  <th rowSpan="2">
                    <span className="app-h-fz-smallest">Deviation,&nbsp;%</span>
                  </th>
                  <th colSpan="2">
                    <span className="app-h-fz-smallest">Order</span>
                  </th>
                  <th rowSpan="2">
                    <span className="app-h-fz-smallest">Price</span>
                  </th>
                  <th rowSpan="2">
                    <span className="app-h-fz-smallest">Average price</span>
                  </th>
                  <th rowSpan="2">
                    <span className="app-h-fz-smallest">Required price</span>
                  </th>
                  {/* <th rowSpan="2">
                    <span className="app-h-fz-smallest">Required change,&nbsp;%</span>
                  </th> */}
                  <th colSpan="2">
                    <span className="app-h-fz-smallest">Total</span>
                  </th>
                </tr>
                <tr>
                  <th>
                    <span className="app-h-fz-smallest">Size</span>
                  </th>
                  <th>
                    <span className="app-h-fz-smallest">Volume</span>
                  </th>
                  <th>
                    <span className="app-h-fz-smallest">Size</span>
                  </th>
                  <th>
                    <span className="app-h-fz-smallest">Volume</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {dcaGrid.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <span>{item.orderNumber}</span>
                    </td>
                    <td>
                      <span>{roundPlaces(item.deviation, 2)}</span>
                    </td>
                    <td>{roundPlaces(item.orderSize, 2)}</td>
                    <td>{roundPlaces(item.orderVolume, 2)}</td>
                    <td>
                      <span>{roundPlaces(item.entryPrice, 4)}</span>
                    </td>
                    <td>
                      <span>{roundPlaces(item.averageOrderPrice, 4)}</span>
                    </td>
                    <td>
                      <span>{roundPlaces(item.requiredPrice, 4)}</span>
                    </td>
                    {/* <td>
                  <span>{item.requiredChange}</span>
                </td> */}
                    <td>{roundPlaces(item.totalOrderSize, 2)}</td>
                    <td>{roundPlaces(item.totalOrderCost, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DCAGridCalculator;
