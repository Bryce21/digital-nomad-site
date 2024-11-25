import React from "react";
import { CustomTooltipProps } from "ag-grid-react";
// import "./styles.css";
import { Tooltip } from "antd";

const DescriptionTooltip = (props: CustomTooltipProps) => {
  const { value } = props;
  if (!value) return null;

  console.log("here!!");
  return (
    <Tooltip placement="top">{value}</Tooltip>
    // <div className="description-tooltip">
    //   <p>{value}</p>
    // </div>
  );
};

export default DescriptionTooltip;
