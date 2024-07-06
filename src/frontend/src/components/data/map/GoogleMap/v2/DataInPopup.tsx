import React from "react";
import { Descriptions } from "antd";
import { Place } from "../../../../../types/types";

export interface DataInPopupProps {
  data: Place;
}

export function DataInPopup(props: DataInPopupProps) {
  const { data } = props;
  return (
    <span>
      <Descriptions
        size="small"
        layout="horizontal"
        bordered
        column={{
          xs: 24,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24,
          xxl: 24,
        }}
        items={[
          {
            key: "1",
            label: "Name",
            children: data.name,
            span: 24,
          },
          {
            key: "2",
            label: "Type",
            children: data.fromType.toLocaleUpperCase(),
            span: 24,
          },
          {
            key: "3",
            label: "Rating",
            children: data.rating,
            span: 24,
          },
          {
            key: "4",
            label: "Total rating",
            children: data.totalRatings,
            span: 24,
          },
        ]}
      />
    </span>
  );
}
