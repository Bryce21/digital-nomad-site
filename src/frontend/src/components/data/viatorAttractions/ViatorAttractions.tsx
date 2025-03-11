import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, IGetRowsParams, ITooltipParams } from 'ag-grid-community';
import { Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { ErrorBoundary } from '../../common/ErrorBoundary';
import ErrorComponent from '../../common/ErrorComponent';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { RootState } from '../../../store/store';
import { Attraction } from '../../../store/types';
import {
  fetchAttractionsPage,
  setLoading,
  setError,
} from '../../../store/reducers/attractionsReducer';

import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the Data Grid

export type ViatorAttractionsProps = {
  inputAddress: string;
};

export default function ViatorAttractions() {
  const dispatch = useAppDispatch();
  //   const [gridApi, setGridApi] = React.useState<GridApi | null>(null);
  const loading = useAppSelector(
    (state: RootState) => state.attractions.loading
  );

  const inputAddress = useAppSelector((state: RootState) => {
    // this component doesn't render unless the address exists
    // eslint-disable-next-line
    return state?.search?.inputAddress!;
  });

  const error: Error | undefined = useSelector(
    (state: RootState) => state.attractions.error
  );

  const destination = useSelector(
    (state: RootState) => state.attractions.destination
  );

  const datasource = useMemo(
    () => ({
      getRows: async (params: IGetRowsParams) => {
        try {
          const res = await dispatch(
            fetchAttractionsPage({
              inputAddress,
              pagination: {
                start: params.startRow,
                count: 30,
              },
              maxPrice: params?.filterModel?.price?.filter,
              minRating: params?.filterModel?.rating?.filter,
            })
          ).unwrap();
          params.successCallback(
            res.attractions.products,
            res.attractions.totalCount
          );
        } catch (err) {
          const typedE = err as Error;
          console.error(err);
          dispatch(setError(typedE));
          dispatch(setLoading(false));
        }
      },
    }),
    [inputAddress]
  );

  const linkCellRenderer = (params: { value: string }) => {
    const url = params.value;
    return url ? (
      <a href={url} target='_blank' rel='noopener noreferrer'>
        Link
      </a>
    ) : null;
  };

  const descriptionCellRenderer = (params: { value: string }) => {
    const { value } = params;
    return (
      <Tooltip
        title={value}
        placement='topLeft'
        autoAdjustOverflow
        style={{ width: '50vh' }}
      >
        {params.value}
      </Tooltip>
    );
  };

  const colDefs: ColDef[] = useMemo(
    () => [
      {
        colId: 'title',
        tooltipField: 'title',
        field: 'title',
        flex: 8,
        sortable: false,
      },
      {
        colId: 'description',
        field: 'description',
        flex: 10,
        cellRenderer: descriptionCellRenderer,
        sortable: false,
      },
      {
        flex: 3,
        colId: 'rating',
        headerName: 'Rating',
        sortable: false,
        tooltipValueGetter: (p: ITooltipParams) => {
          return p.data?.reviews?.combinedAverageRating ?? 'NA';
        },
        filterParams: {
          filterOptions: ['greaterThan'],
          maxNumConditions: 1,
        },
        filter: 'agNumberColumnFilter',
        valueGetter: (p: { data: Attraction }) => {
          return p.data?.reviews?.combinedAverageRating ?? 'NA';
        },
      },
      {
        flex: 3,
        colId: 'numberOfReviews',
        headerName: '# Reviews',
        tooltipValueGetter: (p: ITooltipParams) => {
          return p.data?.reviews?.totalReviews;
        },
        sortable: false,
        valueGetter: (p: { data: Attraction }) => {
          return p.data?.reviews?.totalReviews;
        },
      },
      {
        flex: 2,
        sortable: false,
        colId: 'price',
        headerName: 'Price',
        filterParams: {
          filterOptions: ['lessThan'],
          maxNumConditions: 1,
        },
        tooltipValueGetter: (p: ITooltipParams) => {
          return (
            p.data?.pricing?.summary?.fromPrice ||
            p.data?.pricing?.summary?.fromPriceBeforeDiscount
          );
        },
        filter: 'agNumberColumnFilter',
        valueGetter: (p: { data: Attraction }) => {
          return (
            p.data?.pricing?.summary?.fromPrice ||
            p.data?.pricing?.summary?.fromPriceBeforeDiscount
          );
        },
      },

      {
        flex: 2,
        colId: 'currency',
        sortable: false,
        headerName: 'Currency',
        valueGetter: (p: { data: Attraction }) => {
          return p.data?.pricing?.currency || 'NA';
        },
      },
      {
        colId: 'productUrl',
        sortable: false,
        field: 'productUrl',
        flex: 2,
        cellRenderer: linkCellRenderer,
      },
    ],
    []
  );

  const attemptRenderData = () => {
    return (
      <ErrorBoundary>
        Viator destination - {destination?.name}
        <div
          className='ag-theme-quartz-dark'
          style={{ height: '100%', width: '100%' }}
        >
          <AgGridReact
            // onGridReady={(params: any) => {
            //   const gridApi = params.api;
            //   setGridApi(gridApi);
            // }}
            pagination
            loading={loading}
            columnDefs={colDefs}
            tooltipShowDelay={300}
            tooltipInteraction
            paginationPageSizeSelector={[15, 30]}
            rowModelType='infinite'
            datasource={datasource}
            paginationPageSize={15}
            cacheBlockSize={30}
            blockLoadDebounceMillis={200}
          />
        </div>
      </ErrorBoundary>
    );
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {error ? <ErrorComponent error={error} /> : attemptRenderData()}
    </div>
  );
}
