import { AutoComplete, Button, Col, Form, Row, Modal, Menu } from 'antd';

import {
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { InfoCircleTwoTone, AppstoreOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import SideBar, { MenuItem } from '../SideBar';

interface OnFinishData {
  location: string;
}

interface HeaderComponentProps {
  // todo add date here
  onFinish: (_: OnFinishData) => void;
  onSearch: (_: string) => Promise<string[]>;
  initialValue: string;
}
export default function HeaderComponent(props: HeaderComponentProps) {
  const [form] = Form.useForm();
  const [location, setLocation] = useState(props.initialValue);
  const [options, setOptions] = useState<string[]>([props.initialValue]);

  // modals
  // const [linkModalOpen, setLinkModalOpen] = useState(false);

  const [openModal, setOpenModal] = useState<'links' | 'info' | undefined>();

  const items: MenuItem[] = [
    {
      key: 'info',
      label: 'Info',
      icon: <AppstoreOutlined />,
      onClick: () => {
        if (openModal === 'info') {
          setOpenModal(undefined);
        } else {
          setOpenModal('info');
        }
      },
    },
    {
      key: 'links',
      label: 'Links',
      icon: <AppstoreOutlined />,
      onClick: () => {
        if (openModal === 'links') {
          setOpenModal(undefined);
        } else {
          setOpenModal('links');
        }
      },
    },
  ];

  useEffect(() => {
    if (location) {
      // using timeout to debounce
      const newOptionsTimeout = setTimeout(() => {
        props.onSearch(location).then((searchOptions: string[]) => {
          setOptions(searchOptions);
        });
      }, 200);

      return () => clearTimeout(newOptionsTimeout);
    }
    return undefined;
  }, [location]);

  useEffect(() => {
    form.setFieldsValue({ location: props.initialValue });
  }, [props.initialValue]);

  return (
    <Row
      justify='start'
      // align={'stretch'}
      style={{
        width: '100%',
        display: 'flex',
        flexWrap: 'nowrap',
        height: '100%',
        alignItems: 'center',
      }}
    >
      <SideBar items={items} />
      <Col
        flex='auto'
        order={1}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'right',
          flex: '1',
          minWidth: '0',
          whiteSpace: 'nowrap',
        }}
      >
        <Form
          form={form}
          style={{
            maxWidth: 'none',
            float: 'right',
          }}
          layout='inline'
          onFinish={(values) => {
            props.onFinish({
              location: values.location,
            });
          }}
        >
          <Form.Item
            rules={[{ required: true, message: 'Please input a location' }]}
            name='location'
          >
            <AutoComplete
              value={location}
              onChange={(e: string) => {
                setLocation(e);
              }}
              options={options.slice(0, 5).map((o) => ({ value: o }))}
              style={{ width: '30vh' }}
              onSelect={(data) => {
                setLocation(data);
              }}
              placeholder='Location'
            />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              style={{ marginLeft: '-10px' }}
            >
              Ok
            </Button>
          </Form.Item>
        </Form>
      </Col>

      {openModal === 'info' && (
        <Modal
          open
          footer={null}
          onOk={() => setOpenModal(undefined)}
          onCancel={() => setOpenModal(undefined)}
        >
          <p>
            This site helps you explore around an area for cool things to do.
          </p>
          <p>
            But in order to find cool things it needs to know the area to look
            around.
          </p>
          <p>Insert an address (or city) into the search bar to get started.</p>
        </Modal>
      )}

      {openModal === 'links' && (
        <Modal
          open
          footer={null}
          onOk={() => setOpenModal(undefined)}
          onCancel={() => setOpenModal(undefined)}
        >
          This would be Links modal!
        </Modal>
      )}
    </Row>
  );
}
