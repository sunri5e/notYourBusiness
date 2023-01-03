import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import moment from "moment";
import Button from "./components/Button/Button";
import Modal from "./components/Modal/Modal";
import FormField from "./components/FormField/FormField";
import RadioInput from "./components/RadioInput/RadioInput";
import GridCalculator from "./components/GridCalculator/GridCalculator";
import SingleSituation from "./components/Situations/SingleSituation";
import StatBlock from "./components/Stats/StatBlock";
import { calculateDcaGrid, roundPlaces, calculateSituationsDCA } from "./utils/commonFuncs";
import { TAKE_PROFIT, LINE_CROSS, LONG, ITERATIVE } from "./utils/constants";
// CUMULATIVE;

function App() {
  const dcaParams = localStorage.getItem("dcaParams");
  const [settings, setSettings] = useState(
    dcaParams
      ? JSON.parse(dcaParams)
      : {
          positionType: LONG,
          entryPrice: "",
          takeProfitSize: "",
          baseOrderSize: "",
          baseOrderInPercent: false,
          safetyOrderSize: "",
          safetyOrderInPercent: false,
          maxSafetyOrdersCount: "",
          priceDeviationToOpenSafetyOrders: "",
          safetyOrderStepScale: "",
          safetyOrderVolumeScale: "",
          orderStartCrossLine: "",
          multiplyPriceTo: 1,
          orderCloseType: TAKE_PROFIT,
          orderCloseCrossLine: "",
          depositSize: "",
          depositGrowType: ITERATIVE,
        }
  );
  const [dcaGrid, setDcaGrid] = useState([]);
  // const [parsedData, setParsedData] = useState([]);
  const [isCombinationModalShown, setIsCombinationModalShown] = useState(false);
  const [channelLines, setChannelLines] = useState([]);
  const [analysisData, setAnalysisData] = useState([]);
  const [situations, setSituations] = useState([]);
  const [sortOrder, setSortOrder] = useState({
    time: true,
    sitBarLength: null,
    completedOrders: null,
    totalDeviation: null,
  });
  const [counts, setCounts] = useState({});
  const [finalDeposit, setFinalDeposit] = useState(0);

  const onParamChange = (e) => {
    const newData = { ...settings, [e.target.name]: e.target.value };
    setSettings(newData);
    localStorage.setItem("dcaParams", JSON.stringify(newData));
  };

  const getSituations = () => {
    const situations = calculateSituationsDCA({ settings, analysisData });
    setSituations(situations);
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

    setSortOrder({ ...sortOrder, [key]: order });
    setSituations(situationsCopy.sort((a, b) => compare(a, b, key, order)));
  };

  const calcProfit = () => {
    let profit = 0;
    if (settings.orderCloseType === TAKE_PROFIT) {
      profit = Object.keys(
        Object.keys(counts)
          .sort()
          .reduce((obj, key) => {
            obj[key] = counts[key];
            return obj;
          }, {})
      )
        .map((e, i) =>
          dcaGrid[i] ? counts[e] * dcaGrid[i].totalOrderCost * (settings.takeProfitSize / 100) : 0
        )
        .reduce((partialSum, a) => partialSum + a, 0);
    } else {
      profit = situations
        .map((e) =>
          settings.positionType === LONG
            ? e.sitTotalVolume * (e.sitTargetPrice / e.sitAveragePrice - 1)
            : e.sitTotalVolume * (1 - e.sitTargetPrice / e.sitAveragePrice)
        )
        .reduce((partialSum, a) => partialSum + a, 0);
    }

    return profit;
  };

  useEffect(() => {
    setDcaGrid(calculateDcaGrid("", settings));
  }, [settings]);

  useEffect(() => {
    const newCounts = {};
    const sampleArray = situations.map((e) => e.completedOrders);

    sampleArray.forEach((x) => {
      const key = x === 1 ? "BO" : `SO ${x - 1}`;
      newCounts[key] = (newCounts[key] || 0) + 1;
    });

    setCounts(newCounts);
    situations.length &&
      setFinalDeposit(situations[situations.length - 1].depositSize - settings.depositSize);
  }, [situations]);

  useEffect(() => {
    if (analysisData.length) {
      setChannelLines(
        Object.keys(analysisData[0])
          .map((e) => e)
          .filter((e) => !["time", "open", "high", "low", "close"].includes(e))
          .map((e) => ({ label: e, value: e }))
      );

      // setAnalysisData(
      //   parsedData.map((e) => ({
      //     time: e.time,
      //     low: e.low * settings.multiplyPriceTo,
      //     high: e.high * settings.multiplyPriceTo,
      //     [settings.orderStartCrossLine]:
      //       e[settings.orderStartCrossLine] * settings.multiplyPriceTo,
      //     [settings.orderCloseCrossLine]:
      //       e[settings.orderCloseCrossLine] * settings.multiplyPriceTo,
      //   }))
      // );
    }
  }, [analysisData]);

  // useEffect(() => {
  //   setAnalysisData(
  //     parsedData.map((e) => ({
  //       time: e.time,
  //       low: e.low * settings.multiplyPriceTo,
  //       high: e.high * settings.multiplyPriceTo,
  //       [settings.orderStartCrossLine]: e[settings.orderStartCrossLine] * settings.multiplyPriceTo,
  //       [settings.orderCloseCrossLine]: e[settings.orderCloseCrossLine] * settings.multiplyPriceTo,
  //     }))
  //   );
  // }, [settings.orderStartCrossLine, settings.orderCloseCrossLine, settings.multiplyPriceTo]);

  return (
    <>
      <div className="app-l-container">
        <div className="app-h-pv-6">
          <div className="app-l-grid">
            <div className="app-l-grid--span-2">
              <input
                className="app-form-control"
                type="file"
                id="myfile"
                name="myfile"
                onChange={(e) => {
                  Papa.parse(e.target.files[0], {
                    header: true,
                    complete: (result) => {
                      setAnalysisData(result.data);
                    },
                  });
                }}
              />
            </div>
            <div className="app-l-grid--span-2">
              <FormField
                type="number"
                value={settings.multiplyPriceTo}
                name="multiplyPriceTo"
                id="multiplyPriceTo"
                onChange={onParamChange}
                label="Round price to N places"
                onBlur={getSituations}
              />
            </div>
            <div className="app-l-grid--span-2">
              <FormField
                type="select"
                value={settings.orderStartCrossLine}
                name="orderStartCrossLine"
                id="orderStartCrossLine"
                onChange={onParamChange}
                label="Order start cross line"
                onBlur={getSituations}
                options={channelLines}
                placeholder="Select line"
              />
            </div>
            <div className="app-l-grid--span-2">
              <div className="app-form-group">
                <label className="app-form-label">Order close type</label>
                <div className="app-button--group app-h-ml-a app-l-flex-row">
                  <RadioInput
                    name="orderCloseType"
                    id={TAKE_PROFIT}
                    value={settings.orderCloseType === TAKE_PROFIT ? TAKE_PROFIT : ""}
                    label="Take Profit"
                    onChange={() =>
                      onParamChange({ target: { name: "orderCloseType", value: TAKE_PROFIT } })
                    }
                  />
                  <RadioInput
                    name="orderCloseType"
                    id={LINE_CROSS}
                    value={settings.orderCloseType === LINE_CROSS ? LINE_CROSS : ""}
                    label="Line Cross"
                    onChange={() =>
                      onParamChange({ target: { name: "orderCloseType", value: LINE_CROSS } })
                    }
                  />
                </div>
              </div>
            </div>
            {settings.orderCloseType === LINE_CROSS && (
              <div className="app-l-grid--span-2">
                <FormField
                  type="select"
                  value={settings.orderCloseCrossLine}
                  name="orderCloseCrossLine"
                  id="orderCloseCrossLine"
                  onChange={onParamChange}
                  label="Order close cross line"
                  onBlur={getSituations}
                  options={channelLines}
                  placeholder="Select line"
                />
              </div>
            )}
            <div className="app-l-grid--span-2">
              <Button
                onClick={() => setIsCombinationModalShown(true)}
                className="app-button__primary"
              >
                Open Combinator modal
              </Button>
            </div>
          </div>
        </div>

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
                  {Math.max(
                    ...Object.keys(counts).map((e) =>
                      !isNaN(Number(e.slice(-2))) ? Number(e.slice(-2)) : 0
                    )
                  ) + 1}
                  /{dcaGrid.length}
                </div>
                <div className="app-stats--label">Orders</div>
              </div>
              {!situations.filter((e) => e.error).length && (
                <>
                  <div className="app-stats--item app-stats--item__highlighted app-stats--item__inline">
                    <div className="app-stats--value app-h-color-success">
                      {roundPlaces(
                        settings.depositGrowType === ITERATIVE ? calcProfit() : finalDeposit,
                        2
                      )}
                    </div>
                    <div className="app-stats--label">Profit, $</div>
                  </div>
                  <div className="app-stats--item app-stats--item__highlighted app-stats--item__inline">
                    <div className="app-stats--value app-h-color-success">
                      {dcaGrid.length &&
                        roundPlaces(
                          settings.depositGrowType === ITERATIVE
                            ? (calcProfit() / dcaGrid[dcaGrid.length - 1].totalOrderCost) * 100
                            : (finalDeposit / settings.depositSize) * 100,
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
              <h4 className="app-form-section--title app-h-mb-0">
                Situations: {situations.length} <br />
                <span className="app-h-fz-normal">
                  among{" "}
                  {moment(analysisData[analysisData.length - 1]?.time).diff(
                    moment(analysisData[0]?.time),
                    "days"
                  )}{" "}
                  days
                </span>
              </h4>
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
                <Button
                  onClick={() => sortSituations("totalDeviation")}
                  className="app-button__primary"
                >
                  deviation
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
                positionType={settings.positionType}
                depositGrowType={settings.depositGrowType}
              />
            ))}
          </div>
          <GridCalculator
            dcaGrid={dcaGrid}
            settings={settings}
            calculateSituationsDCA={getSituations}
            onParamChange={onParamChange}
          />
        </div>
      </div>
      <Modal
        onClose={() => setIsCombinationModalShown(false)}
        isVisible={isCombinationModalShown}
        className="app-modal__size-l"
      />
    </>
  );
}

export default App;
