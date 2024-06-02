import { APIProvider } from "@vis.gl/react-google-maps";
import React from "react";
import { MapWithData } from "./MapWithData";
import { Divider } from "antd";
import { ErrorBoundary } from "../../../../common/ErrorBoundary";

interface MapWidgetProps {
  location: string;
}

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "NEED_HERE";

export function MapWidget(props: MapWidgetProps) {
  return (
    <>
      <ErrorBoundary>
        <div style={{ height: "90vh" }}>
          <APIProvider apiKey={API_KEY}>
            <div style={{ height: "90vh" }}>
              <MapWithData location={props.location} />
            </div>
          </APIProvider>
        </div>
      </ErrorBoundary>
      <Divider />
    </>
  );
}
