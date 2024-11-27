import React from 'react';
import { Select } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { TagRender } from './TagRender';

interface SelectProps {
  options: { label: string; value: string }[];
  maxCount?: number;
  onChange: (values: string[]) => void;
  colors: { [index: string]: string };
}

function renderTagRender(
  y: CustomTagProps,
  colors: { [index: string]: string }
) {
  return (
    <TagRender
      defaultProps={y}
      getColor={(x: string) => colors[x] || 'default'}
    />
  );
}

export function SelectComponent(props: SelectProps) {
  return (
    <Select
      mode='tags'
      maxCount={props.maxCount || 5}
      allowClear
      tagRender={(x) => renderTagRender(x, props.colors)}
      style={{ width: '100%' }}
      placeholder='Please select'
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
