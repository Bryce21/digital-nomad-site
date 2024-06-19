import { Col, Collapse, Row } from 'antd';
import React from 'react';
import { FoodWidget } from './FoodWidget';
import { ThingsToDoWidget } from './ThingsToDoWidget';
import { Setting } from '../../common/Setting';

export interface OpenAiWidgetProps {
  location?: string;
}

export function OpenAiWidget(props: OpenAiWidgetProps) {
  const { location } = props;
  return (
    <div>
      <Row>
        <Col span={12}>
          <Collapse
            size="large"
            collapsible={!location ? 'disabled' : undefined}
            items={[
              {
                key: '1',
                label: 'Food',
                children: <FoodWidget location={location as string} />,
                extra: <Setting onClick={() => {}} />,
              },
            ]}
          />
        </Col>
        <Col span={12}>
          <Collapse
            size="large"
            collapsible={!location ? 'disabled' : undefined}
            items={[
              {
                key: '1',
                label: 'Things to do',
                children: <ThingsToDoWidget />,
                extra: <Setting onClick={() => {}} />,
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
}
