import { SettingOutlined } from '@ant-design/icons';
import React from 'react';

interface SettingProps {
    onClick: (MouseEvent) => void
}

export function Setting(props: SettingProps) {
  return (
    <SettingOutlined
      onClick={(event) => {
        console.log('clicked!!');
        props.onClick(event);
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
      }}
    />
  );
}
