import React from 'react';
import { Select } from 'antd';
import { tagRender } from './TagRender';

interface SelectProps {
  options: { label: string; value: string }[];
  maxCount?: number;
  onChange: (values: string[]) => void;
}

export function SelectComponent(props: SelectProps) {
  return (
    <Select
      mode="tags"
      maxCount={props.maxCount || 4}
      allowClear
      tagRender={tagRender}
      style={{ width: '100%' }}
      placeholder="Please select"
      defaultValue={[]}
      onChange={(v) => {
        console.log('v', v);
        props.onChange(v);
      }}
      options={props.options}
    />
  );
}

export default SelectComponent;
