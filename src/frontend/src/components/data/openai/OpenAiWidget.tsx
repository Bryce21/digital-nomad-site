import { Col, Collapse, Row } from 'antd';
import React from 'react';
import { ListDisplay } from './ListDisplay';
import {
  getFoodSuggestions,
  getThingsToDoSuggestions,
} from '../../../services/aiService';
import './styles.css';

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
            className='collapse-panel'
            size='large'
            collapsible={!location ? 'disabled' : undefined}
            style={{ maxHeight: '60vh' }}
            defaultActiveKey={['1']}
            items={[
              {
                key: '1',
                label: 'Most popular foods',
                children: (
                  <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <ListDisplay
                      location={location as string}
                      getData={(x: string) => getFoodSuggestions(x)}
                    />
                  </div>
                ),
              },
            ]}
          />
        </Col>
        <Col span={12}>
          <Collapse
            className='collapse-panel'
            size='large'
            defaultActiveKey={['1']}
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
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
}
