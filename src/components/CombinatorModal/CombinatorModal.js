import React, { useState, useEffect } from "react";
import Modal from "../general/Modal/Modal";
import Button from "../general/Button/Button";
import {
  calculateSituationsDCA,
  calcProfit,
  roundPlaces,
  calculateDcaGrid,
} from "../../utils/commonFuncs";
import { ITERATIVE } from "../../utils/constants";

const combinationMap = [
  { SO: 5, SOSS: 3.28 },
  { SO: 6, SOSS: 2.51 },
  { SO: 7, SOSS: 2.1 },
  { SO: 8, SOSS: 1.86 },
  { SO: 9, SOSS: 1.69 },
  { SO: 10, SOSS: 1.58 },
  { SO: 11, SOSS: 1.49 },
  { SO: 12, SOSS: 1.42 },
  { SO: 13, SOSS: 1.37 },
  { SO: 14, SOSS: 1.33 },
  { SO: 15, SOSS: 1.29 },
  { SO: 16, SOSS: 1.27 },
  { SO: 17, SOSS: 1.24 },
  { SO: 18, SOSS: 1.22 },
  { SO: 19, SOSS: 1.2 },
  { SO: 20, SOSS: 1.19 },
  { SO: 21, SOSS: 1.17 },
];

const CombinatorModal = ({
  isVisible,
  onClose,
  title,
  children,
  className,
  settings,
  analysisData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allVariants, setAllVariants] = useState([]);

  useEffect(() => {
    setIsModalOpen(isVisible);
  }, [isVisible]);

  const handleClose = () => {
    setIsModalOpen(false);
    onClose();
  };

  const getResults = () => {
    let allVars = [];
    for (let i = 0; i < combinationMap.length; i++) {
      const item = combinationMap[i];
      const so = item.SO;
      const maxSoss = item.SOSS;

      for (let soss = 1; soss <= maxSoss; soss += 0.01) {
        const set1 = {
          ...settings,
          maxSafetyOrdersCount: so,
          safetyOrderStepScale: roundPlaces(soss, 2),
        };
        const dcaGrid = calculateDcaGrid("", set1);
        const situations = calculateSituationsDCA({ settings: set1, analysisData });
        const counts = {};

        situations
          .map((e) => e.completedOrders)
          .forEach((x) => {
            const key = x === 1 ? "BO" : `SO ${x - 1}`;
            counts[key] = (counts[key] || 0) + 1;
          });

        const profit = calcProfit({ settings: set1, situations, dcaGrid, counts });
        const finalDeposit = situations[situations.length - 1].depositSize - set1.depositSize;

        const res = {
          sitCount: situations.length,
          // profit: roundPlaces(set1.depositGrowType === ITERATIVE ? profit : finalDeposit, 2),
          "Profit, %": roundPlaces(
            set1.depositGrowType === ITERATIVE
              ? (profit / dcaGrid[dcaGrid.length - 1].totalOrderCost) * 100
              : (finalDeposit / set1.depositSize) * 100,
            2
          ),
          SO: set1.maxSafetyOrdersCount,
          SOSS: set1.safetyOrderStepScale,
          "working SO": Math.max(
            ...Object.keys(counts).map((e) =>
              !isNaN(Number(e.slice(-2))) ? Number(e.slice(-2)) : 0
            )
          ),
        };

        allVars.push(res);
        // console.table(res);
      }
    }
    setAllVariants(allVars);

    console.log(allVars.map((e) => e["Profit, %"]).sort((a, b) => b - a));
  };

  return (
    <Modal isVisible={isModalOpen} onClose={handleClose} title={title} className={className}>
      {children}
      <Button className="app-button__primary" onClick={() => getResults()}>
        Generate result
      </Button>
      {allVariants.length > 0 && (
        <h4>{allVariants.map((e) => e["Profit, %"]).sort((a, b) => b - a)[0]}</h4>
      )}
      {allVariants.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>SO</th>
              <th>SOSS</th>
              <th>working SO</th>
              <th>Profit, %</th>
            </tr>
          </thead>
          <tbody>
            {allVariants.map((e, i) => (
              <tr key={i}>
                <td>{e.SO}</td>
                <td>{e.SOSS}</td>
                <td>{e["working SO"]}</td>
                <td>{e["Profit, %"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Modal>
  );
};

export default CombinatorModal;
