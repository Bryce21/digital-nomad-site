import React from "react";
import { Select } from "antd";
import { TagRender } from "./TagRender";

interface SelectProps {
  options: { label: string; value: string }[];
  maxCount?: number;
  onChange: (values: string[]) => void;
  colors: { [index: string]: string };
}

export function SelectComponent(props: SelectProps) {
  console.log("select props", { props });
  return (
    <Select
      mode="tags"
      maxCount={props.maxCount || 5}
      allowClear
      tagRender={(x) => (
        <TagRender
          defaultProps={x}
          getColor={(x: string) => {
            return props.colors[x] || "default";
          }}
        />
      )}
      style={{ width: "100%" }}
      placeholder="Please select"
      defaultValue={[]}
      onChange={(v) => {
        console.log("v", v);
        props.onChange(v);
      }}
      options={props.options}
    />
  );
}

export default SelectComponent;
