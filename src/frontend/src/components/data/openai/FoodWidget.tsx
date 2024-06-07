import React, { useEffect, useState } from "react";
import { List, Typography } from "antd";
import { ErrorBoundary } from "../../common/ErrorBoundary";
import {
  getFoodSuggestions,
  CleanedAiResponse,
  ExpectedAIResponseFormat,
} from "../../../services/aiService";

const data = [
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
];

export interface FoodWidgetProps {
  location: string;
}

export function FoodWidget(props: FoodWidgetProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const [suggestions, setSuggestions] = useState<CleanedAiResponse>({
    data: [],
  });

  //   todo need memo
  useEffect(() => {
    const func = async () => {
      try {
        const res: CleanedAiResponse = await getFoodSuggestions(props.location);
        console.log("res", res);
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
    console.log("rendering list", data);

    return (
      <>
        <List
          header={<div />}
          footer={<div />}
          bordered
          loading={loading}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text mark>{item.name}</Typography.Text>{" "}
              {item.description}
            </List.Item>
          )}
        />
      </>
    );
  }

  return (
    <>
      <div>
        <ErrorBoundary>{renderSuggestionList()}</ErrorBoundary>
      </div>
    </>
  );
}
