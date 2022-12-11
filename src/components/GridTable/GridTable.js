import React from "react";
import { roundPlaces } from "../../utils/commonFuncs";

const GridTable = ({ data = [], totalLow = 0, index, changeTrigger, className }) => {
  return (
    <table key={index} className={`app-table ${className}`}>
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
      <tbody className="app-h-fz-smaller">
        {data.map(
          (item, i) =>
            item.entryPrice >= totalLow && (
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
                      changeTrigger && i === 0 ? "app-h-color-primary app-h-cursor-pointer" : ""
                    }`}
                    onClick={
                      changeTrigger && i === 0
                        ? (e) => {
                            changeTrigger({
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
  );
};

export default GridTable;
