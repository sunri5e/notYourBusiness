import React, { useState } from 'react';
import FormField from '../FormField/FormField';

function DCAGridCalculator() {

  const [compData, setCompData] = useState({
    takeProfit: '',
    baseOrderSize: '',
    safetyOrderSize: '',
    maxSafetyOrdersCount: '',
    priceDeviationToOpenSafetyOrders: '',
    safetyOrderStepScale: '',
    safetyOrderVolumeScale: '',
  });

  const onChange = (e) => {
    const newData = { ...compData, [e.target.name]: e.target.value };
    setCompData(newData);
  };

  return (
    <div className="app-h-pt-28">
      <div className='app-l-container'>
        <div className="app-form-section app-l-grid">
          <h4 className="app-form-section--title">Calculate DCA orders grid</h4>
          <FormField type="number" value={compData.takeProfit} name="takeProfit" id="takeProfit" onChange={onChange} label="Target profit (%)" />
          <FormField type="number" value={compData.baseOrderSize} name="baseOrderSize" id="baseOrderSize" onChange={onChange} label="Base order size" />
          <FormField type="number" value={compData.safetyOrderSize} name="safetyOrderSize" id="safetyOrderSize" onChange={onChange} label="Safety order size" />
          <FormField type="number" value={compData.maxSafetyOrdersCount} name="maxSafetyOrdersCount" id="maxSafetyOrdersCount" onChange={onChange} label="Max safety orders count" />
          <FormField type="number" value={compData.priceDeviationToOpenSafetyOrders} name="priceDeviationToOpenSafetyOrders" id="priceDeviationToOpenSafetyOrders" onChange={onChange} label="Price deviation to open safety orders (% from initial order)" />
          <FormField type="number" value={compData.safetyOrderStepScale} name="safetyOrderStepScale" id="safetyOrderStepScale" onChange={onChange} label="Safety order step scale" />
          <FormField type="number" value={compData.safetyOrderVolumeScale} name="safetyOrderVolumeScale" id="safetyOrderVolumeScale" onChange={onChange} label="Safety order volume scale" />
        </div>
      </div>
    </div>
  );
}

export default DCAGridCalculator;
