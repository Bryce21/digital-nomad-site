import React, { useState } from 'react';
import './styles.css';
import axios from 'axios';
import { Collapse, Flex, Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { MapWidget } from './components/data/map/GoogleMap/v2/MapWidget';
import LocationAndTime from './components/inputs/LocationAndTime';
import { OpenAiWidget } from './components/data/openai/OpenAiWidget';

function App() {
  const [location, setLocation] = useState<string | undefined>();

  // todo move this to service
  const getAddressAutoComplete = async (value: string) => {
    const res = await axios.get(
      'http://localhost:4000/places/address/autoComplete',
      {
        params: {
          autoCompleteInput: value,
        },
      },
    );
    // eslint-disable-next-line
    return res.data.map((data: any) => data.description);
  };

  return (
    <div className="app">
      <meta
        name="keywords"
        content="travel, digital nomad, traveler, things to do, things to eat"
      />
      <meta
        name="description"
        content="Site to help with travel - lists things to do and eat around an area"
      />

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
                  // extra: <Setting onClick={() => {}} />,
                },
              ]}
            />
            <OpenAiWidget location={location} />
          </Content>
        </Layout>
      </Flex>
    </div>
  );
}

export default App;
