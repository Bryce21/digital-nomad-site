import React from 'react';
import { Modal, List, Typography } from 'antd';

const { Title, Link } = Typography;

export type LinkModalProps = {
  onOk: () => void;
  onCancel: () => void;
};

const travelLinks = [
  {
    category: 'Flights',
    links: [
      { name: 'Google Flights', url: 'https://www.google.com/flights' },
      { name: 'Skyscanner', url: 'https://www.skyscanner.com/' },
      { name: 'Kayak', url: 'https://www.kayak.com/' },
    ],
  },
  {
    category: 'Accommodation',
    links: [
      { name: 'Booking.com', url: 'https://www.booking.com/' },
      { name: 'Airbnb', url: 'https://www.airbnb.com/' },
      { name: 'Hostelworld', url: 'https://www.hostelworld.com/' },
      { name: 'Vrbo', url: 'https://www.vrbo.com/' },
      { name: 'Coliving', url: 'https://coliving.com/' },
    ],
  },
  {
    category: 'Things to do',
    links: [
      { name: 'Tripadvisor', url: 'https://www.tripadvisor.com/' },
      {
        name: 'Airbnb experiences',
        url: 'https://www.airbnb.com/s/experiences',
      },
    ],
  },
  {
    category: 'Travel Planning',
    links: [
      { name: 'Rome2Rio', url: 'https://www.rome2rio.com/' },
      { name: 'Nomad List', url: 'https://nomadlist.com/' },
      { name: 'The Man in Seat 61', url: 'https://www.seat61.com/' },
    ],
  },
];

export default function LinkModal(props: LinkModalProps) {
  return (
    <Modal
      title='Useful Travel Links'
      open
      footer={null}
      onOk={() => props.onOk()}
      onCancel={() => props.onCancel()}
      //   width={500}
    >
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {travelLinks.map((category) => (
          <div key={category.category} style={{ marginBottom: '16px' }}>
            <Title level={4}>{category.category}</Title>
            <List
              size='small'
              bordered
              dataSource={category.links}
              renderItem={(item) => (
                <List.Item>
                  <Link
                    href={item.url}
                    target='_blank'
                    rel='noopener,noreferrer'
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(item.url, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    {item.name}
                  </Link>
                </List.Item>
              )}
            />
          </div>
        ))}
      </div>
    </Modal>
  );
}
