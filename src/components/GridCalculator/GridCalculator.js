import React from "react";
import FormField from "../FormField/FormField";
import RadioInput from "../RadioInput/RadioInput";
import Checkbox from "../Checkbox/Checkbox";
import Button from "../Button/Button";
import GridTable from "../GridTable/GridTable";
import { LINE_CROSS, LONG, SHORT, CUMULATIVE, ITERATIVE } from "../../utils/constants";

const GridCalculator = ({ calculateSituationsDCA, settings, dcaGrid, onParamChange }) => {
  return (
    <div className="app-l-grid--span-6 app-h-position-sticky">
      <div className="app-l-flex-row app-l-flex-row__align-center app-h-mb-6">
        <h4 className="app-form-section--title app-h-mb-0">Calculate DCA orders grid</h4>
        <div className="app-button--group app-h-ml-a app-l-flex-row">
          <RadioInput
            name="positionType"
            id={LONG}
            value={settings.positionType === LONG ? LONG : ""}
            label="Long"
            onChange={() => onParamChange({ target: { name: "positionType", value: LONG } })}
          />
          <RadioInput
            name="positionType"
            id={SHORT}
            value={settings.positionType === SHORT ? SHORT : ""}
            label="Short"
            onChange={() => onParamChange({ target: { name: "positionType", value: SHORT } })}
          />
          <Button onClick={calculateSituationsDCA} className="app-button__primary">
            Get situations
          </Button>
        </div>
      </div>
      <div className="app-l-grid">
        <div className="app-l-grid--span-6">
          <FormField
            type="number"
            value={settings.entryPrice}
            name="entryPrice"
            id="entryPrice"
            onChange={onParamChange}
            label="Entry price"
            onBlur={calculateSituationsDCA}
          />
        </div>
        <div className="app-l-grid--span-6">
          <FormField
            type="number"
            value={settings.takeProfitSize}
            name="takeProfitSize"
            id="takeProfitSize"
            onChange={onParamChange}
            label="Target profit (%)"
            onBlur={calculateSituationsDCA}
            disabled={settings.orderCloseType === LINE_CROSS}
            step={0.01}
          />
        </div>
        <div className="app-l-grid--span-6">
          <div className="app-form-group">
            <label className="app-form-label">Deposit grow type</label>
            <div className="app-button--group app-h-ml-a app-l-flex-row">
              <RadioInput
                name="depositGrowType"
                id={ITERATIVE}
                value={settings.depositGrowType === ITERATIVE ? ITERATIVE : ""}
                label="Iterative"
                onChange={() =>
                  onParamChange({ target: { name: "depositGrowType", value: ITERATIVE } })
                }
              />
              <RadioInput
                name="depositGrowType"
                id={CUMULATIVE}
                value={settings.depositGrowType === CUMULATIVE ? CUMULATIVE : ""}
                label="Cumulative"
                onChange={() =>
                  onParamChange({ target: { name: "depositGrowType", value: CUMULATIVE } })
                }
              />
            </div>
          </div>
        </div>
        <div className="app-l-grid--span-6">
          {settings.depositGrowType === CUMULATIVE && (
            <FormField
              type="number"
              value={settings.depositSize}
              name="depositSize"
              id="depositSize"
              onChange={onParamChange}
              label="Deposit size"
              onBlur={calculateSituationsDCA}
            />
          )}
        </div>
        <div className="app-l-grid--span-6 app-l-flex-row app-l-flex-row__align-center">
          <FormField
            type="number"
            value={settings.baseOrderSize}
            name="baseOrderSize"
            id="baseOrderSize"
            onChange={onParamChange}
            label="Base order size"
            onBlur={calculateSituationsDCA}
            className="app-l-flex-1"
          />
          {settings.depositGrowType === CUMULATIVE && (
            <Checkbox
              name="baseOrderInPercent"
              label="in %"
              value={settings.baseOrderInPercent}
              className="app-h-ml-2 app-h-mt-4"
              onChange={() =>
                onParamChange({
                  target: { name: "baseOrderInPercent", value: !settings.baseOrderInPercent },
                })
              }
            />
          )}
        </div>
        <div className="app-l-grid--span-6 app-l-flex-row app-l-flex-row__align-center">
          <FormField
            type="number"
            value={settings.safetyOrderSize}
            name="safetyOrderSize"
            id="safetyOrderSize"
            onChange={onParamChange}
            label="Safety order size"
            onBlur={calculateSituationsDCA}
            className="app-l-flex-1"
          />
          {settings.depositGrowType === CUMULATIVE && (
            <Checkbox
              name="safetyOrderInPercent"
              label="in %"
              value={settings.safetyOrderInPercent}
              className="app-h-ml-2 app-h-mt-4"
              onChange={() =>
                onParamChange({
                  target: { name: "safetyOrderInPercent", value: !settings.safetyOrderInPercent },
                })
              }
            />
          )}
        </div>
        <div className="app-l-grid--span-6">
          <FormField
            type="number"
            value={settings.maxSafetyOrdersCount}
            name="maxSafetyOrdersCount"
            id="maxSafetyOrdersCount"
            onChange={onParamChange}
            label="Max safety orders count"
            onBlur={calculateSituationsDCA}
          />
        </div>
        <div className="app-l-grid--span-6">
          <FormField
            type="number"
            value={settings.priceDeviationToOpenSafetyOrders}
            name="priceDeviationToOpenSafetyOrders"
            id="priceDeviationToOpenSafetyOrders"
            onChange={onParamChange}
            label="Price deviation to open safety orders (% from initial order)"
            onBlur={calculateSituationsDCA}
            step={0.01}
          />
        </div>
        <div className="app-l-grid--span-6">
          <FormField
            type="number"
            value={settings.safetyOrderStepScale}
            name="safetyOrderStepScale"
            id="safetyOrderStepScale"
            onChange={onParamChange}
            label="Safety order step scale"
            onBlur={calculateSituationsDCA}
            step={0.01}
          />
        </div>
        <div className="app-l-grid--span-6">
          <FormField
            type="number"
            value={settings.safetyOrderVolumeScale}
            name="safetyOrderVolumeScale"
            id="safetyOrderVolumeScale"
            onChange={onParamChange}
            label="Safety order volume scale"
            onBlur={calculateSituationsDCA}
            step={0.01}
          />
        </div>
      </div>
      <GridTable data={dcaGrid} className="app-h-mt-6 app-h-w100" coreGrid />
    </div>
  );
};

export default GridCalculator;
