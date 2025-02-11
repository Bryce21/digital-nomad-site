import React from 'react';
import { Modal } from 'antd';

export type InfoModalProps = {
  onOk: () => void;
  onCancel: () => void;
};

export default function InfoModal(props: InfoModalProps) {
  return (
    <Modal
      open
      footer={null}
      onOk={() => props.onOk()}
      onCancel={() => props.onCancel()}
    >
      <p>This site helps you explore around an area for cool things to do.</p>
      <p>
        But in order to find cool things it needs to know the area to look
        around.
      </p>
      <p>Insert an address (or city) into the search bar to get started.</p>
    </Modal>
  );
}
