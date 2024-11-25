import React, { useEffect, useState, useMemo } from "react";
import { ErrorBoundary } from "../../common/ErrorBoundary";
import { AgGridReact } from "ag-grid-react";
import { GridApi } from "ag-grid-community";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/store";
import { ColDef, IGetRowsParams } from "ag-grid-community";
import { Attraction } from "../../../store/types";
import { getAttractions } from "../../../services/viatorService";
import { setRows } from "../../../store/reducers/attractionsReducer";
import { Tooltip } from "antd";
import { ViatorDestination } from "../../../services/types";
import { fetchAttractionsPage } from "../../../store/reducers/attractionsReducer";

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { useSelector } from "react-redux";

// React Grid Logic
// import "@ag-grid-community/styles/ag-grid.css";
// // Core CSS
// import "@ag-grid-community/styles/ag-theme-quartz.css";

export type ViatorAttractionsProps = {
  inputAddress: string;
};

export default function ViatorAttractions(props: ViatorAttractionsProps) {
  const dispatch = useAppDispatch();

  const [gridApi, setGridApi] = React.useState<GridApi | null>(null);

  //   const rows = useSelector((state: RootState) => state.attractions.data);
  const loading = useSelector((state: RootState) => state.attractions.loading);

  const destination = useSelector(
    (state: RootState) => state.attractions.destination
  );

  //   const [loading, setLoading] = useState(true);

  const datasource = useMemo(
    () => ({
      getRows: async (params: IGetRowsParams) => {
        console.log("get rows called!!", params);
        // setLoading(true);

        const res = await dispatch(
          fetchAttractionsPage({
            inputAddress: props.inputAddress,
            pagination: {
              start: params.startRow,
              count: 30,
            },
          })
        ).unwrap();

        // setDestination(res.destination);
        params.successCallback(
          res.attractions.products,
          res.attractions.totalCount
        );
      },
    }),
    []
  );

  const linkCellRenderer = (params: any) => {
    const url = params.value;
    return url ? (
      <a href={url} target="_blank" rel="noopener noreferrer">
        Link
      </a>
    ) : null;
  };

  const descriptionCellRenderer = (params: any) => {
    const value = params.value;
    return (
      <Tooltip
        title={value}
        placement="topLeft"
        autoAdjustOverflow
        style={{ width: "50vh" }}
      >
        {params.value}
      </Tooltip>
    );
  };

  const colDefs: ColDef[] = useMemo(
    () => [
      {
        colId: "title",

        field: "title",
        flex: 8,
        sortable: false,
        // filter: "agTextColumnFilter",
        // filterParams: {
        //   filterOptions: ["contains"],
        //   maxNumConditions: 1,
        // },
      },
      {
        colId: "description",
        field: "description",
        flex: 10,
        cellRenderer: descriptionCellRenderer,
        sortable: false,
        // filter: "agTextColumnFilter",
        // filterParams: {
        //   filterOptions: ["contains"],
        //   maxNumConditions: 1,
        // },
      },
      {
        flex: 3,
        colId: "Review",
        headerName: "Rating",
        sortable: false,
        filterParams: {
          filterOptions: ["greaterThan", "lessThan"],
          maxNumConditions: 1,
        },
        filter: "agNumberColumnFilter",
        // todo this doesn't handle zero
        valueGetter: (p: { data: Attraction }) => {
          return p.data?.reviews?.combinedAverageRating !== undefined
            ? p.data.reviews.combinedAverageRating
            : "NA";
        },
      },
      {
        flex: 3,
        colId: "numberOfReviews",
        headerName: "# Reviews",
        sortable: false,
        // filterParams: {
        //   filterOptions: ["greaterThan", "lessThan"],
        //   maxNumConditions: 1,
        // },
        // filter: "agNumberColumnFilter",
        // todo this doesn't handle zero
        valueGetter: (p: { data: Attraction }) => {
          return p.data?.reviews?.totalReviews;
        },
      },
      {
        flex: 2,
        sortable: false,
        colId: "price",
        headerName: "Price",
        filterParams: {
          filterOptions: ["greaterThan", "lessThan"],
          maxNumConditions: 1,
        },
        filter: "agNumberColumnFilter",
        // todo this doesn't handle zero
        valueGetter: (p: { data: Attraction }) => {
          return (
            p.data?.pricing?.summary?.fromPrice ||
            p.data?.pricing?.summary?.fromPriceBeforeDiscount
          );
        },
      },

      {
        flex: 2,
        colId: "currency",
        sortable: false,
        headerName: "Currency",
        // todo this doesn't handle zero
        valueGetter: (p: { data: Attraction }) => {
          return p.data?.pricing?.currency || "NA";
        },
      },
      {
        colId: "productUrl",
        sortable: false,
        field: "productUrl",
        cellRenderer: linkCellRenderer,
      },
    ],
    []
  );

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ErrorBoundary>
        Viator destination - {destination?.name}
        <div
          className="ag-theme-quartz-dark"
          style={{ height: "100%", width: "100%" }}
        >
          <AgGridReact
            //   onGridReady={(params) => setGridApi(params.api)}
            // todo add a max page size
            onGridReady={(params: any) => {
              const gridApi = params.api;
              setGridApi(gridApi);

              // todo Enforce a maximum page size
              // setTimeout(() => {
              //   const currentPageSize = gridApi.paginationGetPageSize();
              //   const maxPageSize = 100; // Define your maximum page size
              //   if (currentPageSize > maxPageSize) {
              //     gridApi.pag;
              //   }
              // }, 0);
            }}
            pagination={true}
            loading={loading}
            //   rowData={rowData}
            columnDefs={colDefs}
            tooltipShowDelay={300}
            tooltipInteraction={true}
            //   paginationAutoPageSize={true}
            paginationPageSizeSelector={[15, 30]}
            rowModelType={"infinite"}
            datasource={datasource}
            paginationPageSize={15}
            cacheBlockSize={30}
            blockLoadDebounceMillis={200}
            //   cacheBlockSize={10}
          />
        </div>
      </ErrorBoundary>
    </div>
  );
}
