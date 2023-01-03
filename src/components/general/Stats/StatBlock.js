import React from "react";
// import Icon from '../Icon/Icon';

// const getIcon = (bool) => {
//   if (bool) return <Icon icon="arrow-up" className="app-h-color-success" />;
//   if (bool === false) return <Icon icon="arrow-down" className="app-h-color-danger" />;
//   return null;
// };

const buildSmallStats = (values) =>
  values.map((item) => (
    <div className="app-stats--item" key={`${item[1]}-${item[0]}`}>
      <div className="app-stats--value">{item[0]}</div>
      <div className="app-stats--label">{item[1]}</div>
    </div>
  ));

const buildBigStats = (values) =>
  values.map((item) => (
    <div className="app-stats--item app-stats--item__highlighted" key={`${item[1]}-${item[0]}`}>
      <div className="app-stats--value">{item[0]}</div>
      <div className="app-stats--label">{item[1]}</div>
    </div>
  ));

const buildBigInlineStats = (values) =>
  values.map((item) => (
    <div
      className="app-stats--item app-stats--item__highlighted app-stats--item__inline"
      key={`${item[1]}-${item[0]}`}
    >
      <div className="app-stats--value">{item[0]}</div>
      <div className="app-stats--label">{item[1]}</div>
    </div>
  ));

const buildCardStats = (values, cardWidth) =>
  values.map((item) => (
    <div
      className={`app-card app-card__constant app-l-grid--span-${cardWidth}`}
      key={`${item[1]}-${item[0]}`}
    >
      <div className="app-card--label">{item[1]}</div>
      <div
        className="app-card--value app-l-flex-row app-l-flex-row__align-bottom app-l-flex-row__space-between"
        title={item[0]}
      >
        <span>{item[0]}</span>
        {/* {getIcon(item[2])} */}
      </div>
    </div>
  ));

const StatBlock = ({ values, type, cardWidth, onClick }) => {
  const buildStatsFunctionMap = {
    card: buildCardStats,
    big: buildBigStats,
    small: buildSmallStats,
    big_inline: buildBigInlineStats,
  };

  const stats = buildStatsFunctionMap[type](values, cardWidth);
  return (
    <div
      className={type === "card" ? "app-l-grid app-l-grid__align-start" : "app-stats"}
      onClick={onClick}
    >
      {stats}
    </div>
  );
};

export default StatBlock;
