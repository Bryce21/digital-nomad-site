import { Col, Collapse, Row } from 'antd';
import React from 'react';
import { Setting } from '../../common/Setting';
import { ListDisplay } from './ListDisplay';
import {
  getFoodSuggestions,
  getThingsToDoSuggestions,
} from '../../../services/aiService';

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
                children: (
                  <ListDisplay
                    location={location as string}
                    getData={(x: string) => getFoodSuggestions(x)}
                  />
                ),
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
                children: (
                  <ListDisplay
                    location={location as string}
                    getData={(x: string) => getThingsToDoSuggestions(x)}
                  />
                ),
                extra: <Setting onClick={() => {}} />,
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
}
