import React, { useState, useEffect } from "react";
import Button from "./components/Button/Button";
import GridCalculator from "./components/GridCalculator/GridCalculator";
import SingleSituation from "./components/Situations/SingleSituation";
import StatBlock from "./components/Stats/StatBlock";
import { mock } from "./mocks/matic_mock";
// import { mock } from "./mocks/1inch_mock";
import { calculateDcaGrid, roundPlaces } from "./utils/commonFuncs";

function App() {
  const dcaParams = localStorage.getItem("dcaParams");
  const [settings, setSettings] = useState(
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
  // const [analysisData, setAnalysisData] = useState(
  //   mock.map((e) => ({
  //     time: e.time,
  //     low: e.low,
  //     high: e.high,
  //     low_band2_9: e.low_band2_9,
  //   }))
  // );
  const analysisData = mock.map((e) => ({
    time: e.time,
    low: e.low,
    high: e.high,
    low_band2_9: e.low_band2_9,
  }));
  const [situations, setSituations] = useState([]);
  // const [positionType, setPositionType] = useState("long");
  const positionType = "long";
  const [sortOrder, setSortOrder] = useState({
    time: true,
    sitBarLength: null,
    completedOrders: null,
  });
  const [counts, setCounts] = useState({});

  const onParamChange = (e) => {
    const newData = { ...settings, [e.target.name]: e.target.value };
    setSettings(newData);
    localStorage.setItem("dcaParams", JSON.stringify(newData));
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
        situationGrid = calculateDcaGrid(entryBar.low_band2_9, settings, positionType);
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
                priceGap: sitLow - situationGrid[situationGrid.length - 1].entryPrice,
                totalDeviation: sitLow / entryBar.low_band2_9 - 1,
                completedOrders: situationGrid.filter((e) => e.entryPrice >= sitLow).length,
              });
            } else {
              positionAccompany();
            }
          } else {
            complexData.push({
              ...entryBar,
              dcaGrid: [...situationGrid],
              totalLow: sitLow,
              sitTargetPrice,
              sitBarLength,
              priceGap: sitLow - situationGrid[situationGrid.length - 1].entryPrice,
              totalDeviation: sitLow / entryBar.low_band2_9 - 1,
              completedOrders: situationGrid.filter((e) => e.entryPrice >= sitLow).length,
              error: "Can't be closed. No more data",
            });
          }
          i++;
        };
        positionAccompany();
      }
    }

    setSituations(complexData);
  };

  const compare = (a, b, key, asc) => {
    if (a[key] < b[key]) {
      return asc ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return asc ? 1 : -1;
    }
    return 0;
  };

  const sortSituations = (key) => {
    const situationsCopy = [...situations];
    let order = sortOrder[key];
    order = order === null ? true : !order;

    console.log(!order);
    setSortOrder({ ...sortOrder, [key]: order });

    setSituations(situationsCopy.sort((a, b) => compare(a, b, key, order)));
  };

  useEffect(() => {
    setDcaGrid(calculateDcaGrid("", settings, positionType));
  }, [settings]);

  useEffect(() => {
    const newCounts = {};
    const sampleArray = situations.map((e) => e.completedOrders);

    sampleArray.forEach((x) => {
      const key = x === 1 ? "BO" : `SO ${x - 1}`;
      newCounts[key] = (newCounts[key] || 0) + 1;
    });

    setCounts(newCounts);
  }, [situations]);

  const calcProfit = () => {
    const profit = Object.keys(
      Object.keys(counts)
        .sort()
        .reduce((obj, key) => {
          obj[key] = counts[key];
          return obj;
        }, {})
    )
      .map((e, i) => {
        return dcaGrid[i] ? counts[e] * dcaGrid[i].totalOrderCost * (settings.takeProfit / 100) : 0;
      })
      .reduce((partialSum, a) => partialSum + a, 0);

    return profit;
  };

  return (
    <div className="app-l-container">
      <div className="app-l-flex-row">
        <div className="app-h-mh-a app-h-mt-12 app-h-mb-4">
          <StatBlock
            values={Object.keys(
              Object.keys(counts)
                .sort()
                .reduce((obj, key) => {
                  obj[key] = counts[key];
                  return obj;
                }, {})
            ).map((e) => [counts[e], e])}
            type="big_inline"
          />
        </div>
      </div>
      <div className="app-l-flex-row">
        <div className="app-h-mh-a app-h-mb-12">
          <div className="app-stats">
            <div className="app-stats--item app-stats--item__highlighted app-stats--item__inline">
              <div
                className={`app-stats--value ${
                  situations.filter((e) => e.error).length
                    ? "app-h-color-danger"
                    : "app-h-color-success"
                }`}
              >
                {situations.filter((e) => e.error).length}
              </div>
              <div className="app-stats--label">Errors</div>
            </div>
            <div className="app-stats--item app-stats--item__highlighted app-stats--item__inline">
              <div className="app-stats--value app-h-color-warning">
                {Object.keys(counts).length}/{dcaGrid.length}
              </div>
              <div className="app-stats--label">Orders</div>
            </div>
            {!situations.filter((e) => e.error).length && (
              <>
                <div className="app-stats--item app-stats--item__highlighted app-stats--item__inline">
                  <div className="app-stats--value app-h-color-success">
                    {roundPlaces(calcProfit(), 2)}
                  </div>
                  <div className="app-stats--label">Profit, $</div>
                </div>
                <div className="app-stats--item app-stats--item__highlighted app-stats--item__inline">
                  <div className="app-stats--value app-h-color-success">
                    {roundPlaces(
                      (calcProfit() / dcaGrid[dcaGrid.length - 1].totalOrderCost) * 100,
                      2
                    )}
                  </div>
                  <div className="app-stats--label">Profit, %</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="app-form-section app-l-grid app-l-grid__align-start">
        <div className="app-l-grid--span-6">
          <div className="app-l-flex-row app-l-flex-row__align-center app-h-mb-6">
            <h4 className="app-form-section--title app-h-mb-0">Situations: {situations.length}</h4>
            <div className="app-button--group app-h-ml-a">
              <span>Sort by: </span>
              <Button onClick={() => sortSituations("time")} className="app-button__primary">
                date
              </Button>
              <Button
                onClick={() => sortSituations("completedOrders")}
                className="app-button__primary"
              >
                orders
              </Button>
              <Button
                onClick={() => sortSituations("sitBarLength")}
                className="app-button__primary"
              >
                length
              </Button>
            </div>
          </div>
          {situations.map((sit, index) => (
            <SingleSituation
              key={index}
              index={index}
              situation={sit}
              dcaGrid={dcaGrid}
              changeTrigger={onParamChange}
              className={`${index < situations.length ? "app-h-bordered-bottom app-h-mb-3" : ""}`}
            />
          ))}
        </div>
        <GridCalculator
          dcaGrid={dcaGrid}
          settings={settings}
          calculateSituationsDCA={calculateSituationsDCA}
          onParamChange={onParamChange}
        />
      </div>
    </div>
  );
}

export default App;
