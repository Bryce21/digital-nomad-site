import React, { useState } from 'react';
import './styles.css';
import { SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import {
  Col, Collapse, Divider, Flex, Layout, Row, Spin,
} from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { MapWidget } from './components/data/map/GoogleMap/v2/MapWidget';
import LocationAndTime from './components/inputs/LocationAndTime';
import { OpenAiWidget } from './components/data/openai/OpenAiWidget';
import { Setting } from './components/common/Setting';

function App() {
  const [location, setLocation] = useState<string | undefined>();

  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const getAddressAutoComplete = async (value: string) => {
    const res = await axios.get(
      'http://localhost:4000/places/address/autoComplete',
      {
        params: {
          autoCompleteInput: value,
        },
      },
    );
    return res.data.map((data: any) => data.description);
  };

  return (
    <div className="app">
      <Flex>
        <Layout>
          <Header
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              zIndex: 1000,
            }}
          >
            <div className="inputDiv">
              <LocationAndTime
                onSearch={(value) => getAddressAutoComplete(value)}
                onFinish={(data) => {
                  setLocation(data.location);
                }}
              />
            </div>
          </Header>
          <Content style={{ marginTop: '60px' }}>
            <Collapse
              size="large"
              collapsible={!location ? 'disabled' : undefined}
              items={[
                {
                  key: '1',
                  label: 'Map',
                  children: location ? (
                    <div style={{ height: '100vh' }}>
                      <MapWidget location={location} />
                    </div>
                  ) : undefined,
                  extra: <Setting onClick={() => {}} />,
                },
              ]}
            />
            <div>Ad goes here</div>
            <OpenAiWidget location={location} />
            <div>Ad goes here</div>
            <Row>
              <Col span={24}>
                <Collapse
                  size="large"
                  collapsible={!location ? 'disabled' : undefined}
                  items={[
                    {
                      key: '1',
                      label: 'Map',
                      children: location ? (
                        <div style={{ height: '100vh' }}>
                          <MapWidget location={location} />
                        </div>
                      ) : undefined,
                      extra: <Setting onClick={() => {}} />,
                    },
                  ]}
                />
              </Col>
            </Row>
          </Content>
        </Layout>
      </Flex>
    </div>
  );
}

export default App;
