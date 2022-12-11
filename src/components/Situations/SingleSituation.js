import React, { useState } from "react";
import moment from "moment";
import { roundPlaces } from "../../utils/commonFuncs";
import GridTable from "../GridTable/GridTable";

const SingleSituation = ({ situation, index, dcaGrid, changeTrigger, className }) => {
  const [showTable, setShowTable] = useState(false);
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
        <span>
          <span className="app-h-fz-smaller">deviation: </span>
          <span className="app-h-color-danger">
            {roundPlaces(situation.totalDeviation * 100, 2)}
          </span>
          ,
        </span>{" "}
        {/* <span>
                    total low: <span className="app-h-color-success">{situation.totalLow}</span>,
                  </span>{" "} */}
        {/* <span>
                    target price:
                    <span className="app-h-color-success">
                      {roundPlaces(situation.sitTargetPrice, 4)}
                    </span>
                  </span>{" "} */}
        <span>
          <span className="app-h-fz-smaller">price gap: </span>
          <span
            className={`${situation.priceGap > 0 ? "app-h-color-success" : "app-h-color-danger"}`}
            title="Green shows how far the price is from the last safety order. Red shows how far the price goes away from the last safety order."
          >
            {roundPlaces(situation.priceGap, 4)}
          </span>
        </span>
        <br />
        {situation.error && <span className="app-h-color-danger">Error: {situation.error}</span>}
      </p>
      {showTable && (
        <GridTable
          data={situation.dcaGrid}
          totalLow={situation.totalLow}
          index={index}
          changeTrigger={changeTrigger}
        />
      )}
    </div>
  );
};

export default SingleSituation;
