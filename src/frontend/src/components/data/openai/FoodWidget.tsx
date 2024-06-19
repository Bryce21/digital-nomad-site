import React, { useEffect, useState } from 'react';
import {
  List, Tooltip, Typography, Button,
} from 'antd';
import { ErrorBoundary } from '../../common/ErrorBoundary';
import {
  getFoodSuggestions,
  CleanedAiResponse,
  ExpectedAIResponseFormat,
} from '../../../services/aiService';

export interface FoodWidgetProps {
  location: string;
}

export function FoodWidget(props: FoodWidgetProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const [suggestions, setSuggestions] = useState<CleanedAiResponse>({
    data: [],
    isCached: false,
  });

  //   todo need memo
  useEffect(() => {
    const func = async () => {
      try {
        setLoading(true);
        const res: CleanedAiResponse = await getFoodSuggestions(props.location);
        console.log('res', res);
        setSuggestions(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    func();
  }, [props.location]);

  function renderSuggestionList() {
    const data = suggestions.data as ExpectedAIResponseFormat[];
    console.log('rendering list', data);

    return (
      <List
        header={<div />}
        footer={<div />}
        bordered
        loading={loading}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text color="blue">
              <a
                onClick={() => window.open(
                  `https://www.google.com/search?q=${props.location} + ${item.name}`,
                )}
              >
                {item.name}
              </a>
            </Typography.Text>

            <br />
            {item.description}
          </List.Item>
        )}
      />
    );
  }

  return (
    <div>
      <ErrorBoundary>{renderSuggestionList()}</ErrorBoundary>
    </div>
  );
}
