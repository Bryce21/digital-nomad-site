import React from 'react';
import './styles.css';
import axios from 'axios';
import { Collapse, Flex, Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { MapWidget } from './components/data/map/GoogleMap/v2/MapWidget';
import HeaderComponent from './components/inputs/HeaderComponent';
import { OpenAiWidget } from './components/data/openai/OpenAiWidget';
import { AppDispatch, RootState } from './store/store';
import { setSearchAddress } from './store/reducers/searchReducer';
import { useAppDispatch, useAppSelector } from './store/hooks';
import ViatorGrid from './components/data/viatorAttractions/GridV2/ViatorGrid';

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
      `${process.env.REACT_APP_HTTP_METHOD}://${process.env.REACT_APP_BACKEND_HOST}/places/address/autoComplete`,
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
      <Flex>
        <Layout>
          <Header
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              // height: "100%",
              zIndex: 10000,
              padding: 0,
            }}
          >
            <HeaderComponent
              onSearch={(value) => getAddressAutoComplete(value)}
              onFinish={(data) => {
                setLocation(data.location);
              }}
              initialValue={location!}
            />
          </Header>

          <Content style={{ marginTop: '60px' }}>
            <Collapse
              size='large'
              collapsible={!location ? 'disabled' : undefined}
              defaultActiveKey={['1']}
              items={[
                {
                  key: '1',
                  label: 'View Locations',
                  children: location ? (
                    <div style={{ height: '100vh' }}>
                      <MapWidget location={location} />
                    </div>
                  ) : undefined,
                  // extra: <Setting onClick={() => {}} />,
                },
              ]}
            />
            <Collapse
              size='large'
              collapsible={!location ? 'disabled' : undefined}
              defaultActiveKey={['1']}
              items={[
                {
                  key: '1',
                  label: 'Popular Attractions',
                  children: location ? (
                    <div
                      style={{
                        height: '100vh',
                        // position: 'relative',
                        // overflowY: 'auto',
                      }}
                    >
                      <ViatorGrid />
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
