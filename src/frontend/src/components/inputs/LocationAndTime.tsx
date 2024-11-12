import {
  AutoComplete, Button, Col, Form, Row, Modal,
} from 'antd';

import { InfoCircleTwoTone } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

interface OnFinishData {
  location: string;
}

interface LocationAndTimeProps {
  // todo add date here
  onFinish: (_: OnFinishData) => void;
  onSearch: (_: string) => Promise<string[]>;
}
export default function LocationAndTime(props: LocationAndTimeProps) {
  const [form] = Form.useForm();
  const [location, setLocation] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

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

  return (
    <Row
      justify="end"
      style={{
        width: '100%',
        flex: 1,
        height: '100%',
        float: 'right',
      }}
      align="middle"
      gutter={[8, 0]}
    >
      <Col
        span={24}
        style={{ width: '100%', float: 'right' }}
        // span={23}
        flex="auto"
      >
        <Form
          form={form}
          style={{ maxWidth: 'none', float: 'right' }}
          layout="inline"
          onFinish={(values) => {
            props.onFinish({
              location: values.location,
            });
          }}
        >
          <InfoCircleTwoTone
            style={{ fontSize: '150%', marginRight: '2px', float: 'right' }}
            onClick={() => setModalOpen(true)}
          />
          <Form.Item
            rules={[{ required: true, message: 'Please input a location' }]}
            name="location"
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
              placeholder="Location"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginLeft: '-10px' }}
            >
              Ok
            </Button>
          </Form.Item>
        </Form>
      </Col>

      {modalOpen && (
        <Modal
          open
          footer={null}
          onOk={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
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
    </Row>
  );
}
