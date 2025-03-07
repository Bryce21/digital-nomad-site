import React from 'react';
import { Card, Button, Typography, Rate } from 'antd';
import { Attraction, ImageVariant } from '../../../../store/types';

const { Meta } = Card;
const { Title, Text } = Typography;

export type AttractionCardProps = {
  attraction: Attraction;
  cardWidth: number;
};

function pickBestImage(
  variants: ImageVariant[],
  targetWidth: number,
  targetHeight: number
) {
  return variants
    .map((variant) => ({
      ...variant,
      sizeDifference:
        Math.abs(variant.width - targetWidth) +
        Math.abs(variant.height - targetHeight),
      scaleFactor:
        variant.width >= targetWidth && variant.height >= targetHeight ? 1 : 2, // Penalize too small images
    }))
    .sort(
      (a, b) =>
        a.sizeDifference * a.scaleFactor - b.sizeDifference * b.scaleFactor
    )[0];
}

const getImageFromAttraction = (
  attraction: Attraction,
  cardWidth: number
): string => {
  return pickBestImage(
    //  todo some type safety
    attraction.images[0].variants,
    cardWidth,
    cardWidth * 0.67
  ).url; // todo do a default image
};

export default function AttractionCard({
  attraction,
  cardWidth,
}: AttractionCardProps) {
  return (
    <div
      style={{
        // height: '450px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Card
        size='small'
        cover={<img src={getImageFromAttraction(attraction, cardWidth)} />}
        actions={[
          <Button
            type='primary'
            onClick={() => window.open(attraction.productUrl)}
          >
            Book Now
          </Button>,
        ]}
      >
        <Title
          style={{
            maxHeight: '60px',
            minHeight: '60px',
            overflowY: 'auto',
            paddingBottom: '10px',
            maskImage:
              'linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0))',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0))',
          }}
          level={4}
        >
          {attraction.title}
        </Title>

        <hr />
        <div
          style={{
            maxHeight: '100px',
            minHeight: '100px',
            overflowY: 'auto',
            paddingBottom: '10px',
            maskImage:
              'linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0))',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0))',
          }}
        >
          {attraction.description}
        </div>
        <Rate
          allowHalf
          disabled
          value={attraction?.reviews?.combinedAverageRating}
        />
        <div>
          <Text strong>from ${attraction.pricing.summary.fromPrice}</Text>
        </div>
      </Card>
    </div>
  );
}
