import { Tag } from 'antd';
import React from 'react';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

export function TagRender(props: {
  defaultProps: CustomTagProps;
  getColor: (x: string) => string;
}) {
  const { defaultProps, getColor } = props;
  const {
    label, closable, value, onClose,
  } = defaultProps;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      // todo get color working
      color={getColor(value)}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
}

export default TagRender;
