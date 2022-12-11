import React from "react";
import FormField from "../FormField/FormField";
import Button from "../Button/Button";
import GridTable from "../GridTable/GridTable";

const GridCalculator = ({ calculateSituationsDCA, settings, dcaGrid, onParamChange }) => {
  return (
    <div className="app-l-grid--span-6 app-h-position-sticky">
      <div className="app-l-flex-row app-l-flex-row__align-center app-h-mb-6">
        <h4 className="app-form-section--title app-h-mb-0">Calculate DCA orders grid</h4>
        <div className="app-button--group app-h-ml-a">
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
            value={settings.takeProfit}
            name="takeProfit"
            id="takeProfit"
            onChange={onParamChange}
            label="Target profit (%)"
            onBlur={calculateSituationsDCA}
          />
        </div>
        <div className="app-l-grid--span-6">
          <FormField
            type="number"
            value={settings.baseOrderSize}
            name="baseOrderSize"
            id="baseOrderSize"
            onChange={onParamChange}
            label="Base order size"
            onBlur={calculateSituationsDCA}
          />
        </div>
        <div className="app-l-grid--span-6">
          <FormField
            type="number"
            value={settings.safetyOrderSize}
            name="safetyOrderSize"
            id="safetyOrderSize"
            onChange={onParamChange}
            label="Safety order size"
            onBlur={calculateSituationsDCA}
          />
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
          />
        </div>
      </div>
      <GridTable data={dcaGrid} className="app-h-mt-6" />
    </div>
  );
};

export default GridCalculator;
