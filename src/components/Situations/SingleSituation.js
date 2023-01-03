import React, { useState } from "react";
import moment from "moment";
import { roundPlaces } from "../../utils/commonFuncs";
import { LONG, SHORT, CUMULATIVE } from "../../utils/constants";
import GridTable from "../GridTable/GridTable";

const SingleSituation = ({
  situation,
  index,
  dcaGrid,
  changeTrigger,
  className,
  positionType,
  depositGrowType,
}) => {
  const [showTable, setShowTable] = useState(false);

  // const getGapClassName = () => {
  //   let className = "";
  //   if (situation.priceGap > 0) {
  //     className = positionType === LONG ? "app-h-color-success" : "app-h-color-danger";
  //   } else {
  //     className = positionType === SHORT ? "app-h-color-success" : "app-h-color-danger";
  //   }
  //   return className;
  // };

  const PnLClassName =
    roundPlaces(situation.sitTargetPrice - situation.sitAveragePrice, 4) > 0
      ? positionType === LONG
        ? "app-h-color-success"
        : "app-h-color-danger"
      : positionType === SHORT
      ? "app-h-color-success"
      : "app-h-color-danger";

  return (
    <div className={className}>
      <p onClick={() => setShowTable(!showTable)}>
        <span className="app-h-color-default">
          <i>{moment(situation.time).format("DD MMM YYYY, H:mm")}, </i>
        </span>
        <br />
        <span>
          <span className="app-h-fz-smaller">completed orders: </span>
          <span className="app-h-color-warning">
            {situation.completedOrders}/{dcaGrid.length}
          </span>
          ,
        </span>{" "}
        <span>
          <span className="app-h-fz-smaller">length: </span>
          <span className="app-h-color-success">{situation.sitBarLength}</span>,
        </span>{" "}
        {/* <span>
          <span className="app-h-fz-smaller">deviation: </span>
          <span className="app-h-color-warning">
            {roundPlaces(situation.totalDeviation * 100, 2)}
          </span>
          ,
        </span>{" "} */}
        {/* <span>
                    total low: <span className="app-h-color-success">{situation.extremum}</span>,
                  </span>{" "} */}
        <span>
          <span className="app-h-fz-smaller">target price: </span>
          <span>{roundPlaces(situation.sitTargetPrice, 4)}</span>,
        </span>{" "}
        <span>
          <span className="app-h-fz-smaller">total volume: </span>
          <span>{roundPlaces(situation.sitTotalVolume, 2)}</span>,
        </span>{" "}
        <span>
          <span className="app-h-fz-smaller">PnL, $: </span>
          <span className={PnLClassName}>{roundPlaces(situation.currencyPnL, 2)}</span>,
        </span>{" "}
        <span title="From total deposit">
          <span className="app-h-fz-smaller">PnL, %: </span>
          <span className={PnLClassName}>
            {roundPlaces(
              (situation.currencyPnL /
                (depositGrowType === CUMULATIVE
                  ? situation.depositSize
                  : situation.sitTotalVolume)) *
                100,
              2
            )}
          </span>
        </span>{" "}
        {/* <span>
          <span className="app-h-fz-smaller">price gap: </span>
          <span
            className={`${getGapClassName()}`}
            title="Green shows how far the price is from the last safety order. Red shows how far the price goes away from the last safety order."
          >
            {roundPlaces(situation.priceGap, 4)}
          </span>
        </span> */}
        <br />
        {situation.error && <span className="app-h-color-danger">Error: {situation.error}</span>}
      </p>
      {showTable && (
        <GridTable
          data={situation.dcaGrid}
          extremum={situation.extremum}
          index={index}
          changeTrigger={changeTrigger}
          positionType={positionType}
          className="app-h-w100"
        />
      )}
    </div>
  );
};

export default SingleSituation;
