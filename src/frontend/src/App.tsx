import React from 'react';
import './styles.css';
import axios from 'axios';
import { Collapse, Flex, Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { MapWidget } from './components/data/map/GoogleMap/v2/MapWidget';
import LocationAndTime from './components/inputs/LocationAndTime';
import { OpenAiWidget } from './components/data/openai/OpenAiWidget';
import { AppDispatch, RootState } from './store/store';
import { setSearchAddress } from './store/reducers/searchReducer';
import { useAppDispatch, useAppSelector } from './store/hooks';
import ViatorAttractions from './components/data/viatorAttractions/ViatorAttractions';

function App() {
  const dispatch: AppDispatch = useAppDispatch();

  const setLocation = (inputAddress: string | undefined) => {
    dispatch(setSearchAddress(inputAddress));
  };

  const location = useAppSelector((state: RootState) => {
    return state?.search?.inputAddress;
  });

  // todo move this to service
  const getAddressAutoComplete = async (value: string) => {
    const res = await axios.get(
      `http://${process.env.REACT_APP_BACKEND_HOST}/places/address/autoComplete`,
      {
        params: {
          autoCompleteInput: value,
        },
      }
    );
    // eslint-disable-next-line
    return res.data.map((data: any) => data.description);
  };

  return (
    <div className='app'>
      <meta
        name='keywords'
        content='travel, digital nomad, traveler, things to do, things to eat'
      />
      <meta
        name='description'
        content='Site to help with travel - lists things to do and eat around an area'
      />

      <Flex>
        <Layout>
          <Header
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              // height: "100%",
              zIndex: 1000,
              padding: 0,
            }}
          >
            <LocationAndTime
              onSearch={(value) => getAddressAutoComplete(value)}
              onFinish={(data) => {
                setLocation(data.location);
              }}
            />
          </Header>

          <Content style={{ marginTop: '60px' }}>
            <Collapse
              size='large'
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
            <div>Ad here</div>
            <Collapse
              size='large'
              collapsible={!location ? 'disabled' : undefined}
              items={[
                {
                  key: '1',
                  label: 'Attractions',
                  children: location ? (
                    <div style={{ height: '100vh' }}>
                      <ViatorAttractions />
                    </div>
                  ) : undefined,
                  // extra: <Setting onClick={() => {}} />,
                },
              ]}
            />
            <div>Ad here</div>
            <OpenAiWidget location={location} />

            <div>Ad here</div>
          </Content>
        </Layout>
      </Flex>
    </div>
  );
}

export default App;
