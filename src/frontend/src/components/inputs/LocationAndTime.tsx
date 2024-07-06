import { AutoComplete, Button, Col, Form, Row, Modal } from "antd";

import {
  InfoCircleOutlined,
  InfoCircleFilled,
  InfoCircleTwoTone,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";

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
  const [location, setLocation] = useState("");
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
    <Row style={{ float: "right", padding: "5px 0" }}>
      <InfoCircleTwoTone
        style={{ fontSize: "150%", marginRight: "5px" }}
        onClick={() => setModalOpen(true)}
      />
      <Col>
        <Form
          form={form}
          style={{ maxWidth: "none" }}
          layout="inline"
          onFinish={(values) => {
            console.log("values", values);
            props.onFinish({
              location: values.location,
            });
          }}
        >
          <Form.Item
            rules={[{ required: true, message: "Please input a location" }]}
            name="location"
          >
            <AutoComplete
              value={location}
              onChange={(e: string) => {
                setLocation(e);
              }}
              options={options.slice(0, 5).map((o) => ({ value: o }))}
              style={{ width: 300 }}
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
              style={{ marginLeft: "-10px" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>

      {modalOpen && (
        <Modal
          open={true}
          footer={null}
          onOk={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
        >
          <p>
            This site helps you explore around an area for cool things to do.
          </p>
          <p>
            But in order to find cool things it needs to know the address to
            look around.
          </p>
          <p>Insert an address (or city) into the search bar to get started.</p>
        </Modal>
      )}
    </Row>
  );
}
