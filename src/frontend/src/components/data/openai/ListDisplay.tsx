import React, { useEffect, useState } from 'react';
import { List, Typography } from 'antd';
import { ErrorBoundary } from '../../common/ErrorBoundary';
import {
  CleanedAiResponse,
  ExpectedAIResponseFormat,
} from '../../../services/aiService';

export interface FoodWidgetProps {
  location: string;
  getData: (location: string) => Promise<CleanedAiResponse>;
}

export function ListDisplay(props: FoodWidgetProps) {
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
        const res: CleanedAiResponse = await props.getData(props.location);
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
              {/* eslint-disable-next-line */}
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
