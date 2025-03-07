import React, { useEffect, useState } from 'react';
import { Pagination, Row, Col } from 'antd';
import { ErrorBoundary } from '../../../common/ErrorBoundary';
import ErrorComponent from '../../../common/ErrorComponent';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';

import './styles.css';

import { RootState } from '../../../../store/store';
import {
  fetchAttractionsPage,
  setError,
  setLoading,
  setPageSize,
  setPageStart,
} from '../../../../store/reducers/attractionsReducer';
import { Attraction } from '../../../../store/types';

import Filters from './Filters';

import LoadingComponent from './LoadingComponent';
import AttractionCard from './AttractionCard';

const getTargetWidth = () => {
  const containerWidth = window.innerWidth; // Get screen width
  let colSpan = 24; // Default (mobile)

  if (containerWidth >= 1200)
    colSpan = 8; // lg (3 per row)
  else if (containerWidth >= 768)
    colSpan = 8; // md (3 per row)
  else if (containerWidth >= 576) colSpan = 12; // sm (2 per row)

  return Math.floor((containerWidth * colSpan) / 24); // Compute card width
};

export default function ViatorGrid() {
  const dispatch = useAppDispatch();

  const [cardWidth, setCardWidth] = useState(getTargetWidth());

  const inputAddress = useAppSelector((state: RootState) => {
    // this component doesn't render unless the address exists
    // eslint-disable-next-line
    return state?.search?.inputAddress!;
  });

  const filters = useAppSelector(
    (state: RootState) => state.attractions.filters
  );

  const pageStart = useAppSelector(
    (state: RootState) => state.attractions.pageStart
  );

  const pageSize = useAppSelector(
    (state: RootState) => state.attractions.pageSize
  );

  const loading = useAppSelector(
    (state: RootState) => state.attractions.loading
  );

  const attractions: Attraction[] = useAppSelector(
    (state: RootState) => state.attractions.data
  );

  const totalCount = useAppSelector(
    (state: RootState) => state.attractions.totalCount
  );

  const error = useAppSelector((state: RootState) => state.attractions.error);

  const handlePageLookup = async () => {
    try {
      dispatch(setLoading(true));
      await dispatch(
        fetchAttractionsPage({
          inputAddress,
          pagination: {
            start: pageStart || 1,
            count: pageSize,
          },
          minPrice: filters?.minPrice,
          maxPrice: filters?.maxPrice,
          minRating: filters?.minRating,
          searchTerm: filters?.searchText,
        })
      );
    } catch (err) {
      console.error(err);
      dispatch(setError(err as Error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const handleResize = () => setCardWidth(getTargetWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    handlePageLookup();
  }, [inputAddress, filters, pageStart]);

  const handleOnChange = (page: number, pageSizeInput: number) => {
    const start = (page - 1) * pageSizeInput;
    dispatch(setPageSize(pageSizeInput));
    dispatch(setPageStart(start));
  };

  const render = () => {
    if (error) {
      return <ErrorComponent error={error} />;
    }

    return (
      <ErrorBoundary>
        <div className='filters-container'>
          <Filters />
        </div>
        <hr />
        {loading ? (
          <LoadingComponent />
        ) : (
          <Row gutter={[16, 16]}>
            {/* eslint-disable-next-line */}
            {attractions.map((attraction: Attraction, index: number) => {
              return (
                // eslint-disable-next-line
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <AttractionCard
                    attraction={attraction}
                    cardWidth={cardWidth}
                  />
                </Col>
              );
            })}
          </Row>
        )}

        <hr />
        <Row>
          <Pagination
            pageSize={pageSize}
            pageSizeOptions={[15, 25, 50]}
            // defaultCurrent={1}
            total={totalCount}
            onChange={handleOnChange}
          />
        </Row>
      </ErrorBoundary>
    );
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        overflow: 'scroll',
        // position: 'relative',
      }}
    >
      {render()}
    </div>
  );
}
