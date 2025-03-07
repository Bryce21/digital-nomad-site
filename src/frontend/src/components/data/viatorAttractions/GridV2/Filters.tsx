import React, { useState } from 'react';
import { Input, InputNumber, Form, Row, Col, Button, Slider } from 'antd';
import { useAppDispatch } from '../../../../store/hooks';
import { AttractionFilters } from '../../../../store/types';
import { setFilters } from '../../../../store/reducers/attractionsReducer';
import './styles.css';

export default function Filters() {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [filters, setFiltersState] = useState<AttractionFilters>({
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    maxRating: undefined,
    searchText: '',
  });
  const [hasErrors, setHasErrors] = useState(false);
  const [formHasChanged, setFormHasChanged] = useState(false);

  const handleChange = (
    key: string,
    value: string | number | undefined | null
  ) => {
    form.validateFields();
    const updatedFilters = { ...filters, [key]: value };
    setFiltersState(updatedFilters);
    setFormHasChanged(true);
  };

  return (
    <Form
      layout='inline'
      form={form}
      onValuesChange={() => {
        setHasErrors(
          form.getFieldsError().some(({ errors }) => errors.length > 0)
        );
      }}
    >
      <Row
        className='filters-row'
        // style={{ width: '100%', border: 'solid red' }}
        gutter={8}
      >
        <Col xs={24} sm={12} lg={6}>
          <Form.Item label='Search'>
            <Input
              placeholder='Search activities...'
              value={filters.searchText}
              onChange={(e) => handleChange('searchText', e.target.value)}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Form.Item
            label='Min Price'
            name='minPrice'
            // todo this doesn't quite work right with middle sizes - ipads
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const maxPrice = getFieldValue('maxPrice');
                  if (
                    value !== undefined &&
                    maxPrice !== undefined &&
                    value > maxPrice
                  ) {
                    return Promise.reject(
                      new Error('Min price cannot be greater than max price')
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber
              min={0}
              placeholder='Min'
              value={filters.minPrice}
              onChange={(value) => handleChange('minPrice', value)}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Form.Item
            label='Max Price'
            name='maxPrice'
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
          >
            <InputNumber
              min={0}
              placeholder='Max'
              value={filters.maxPrice}
              onChange={(value) => handleChange('maxPrice', value)}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>

        <Col xs={12} sm={6} lg={4}>
          <Form.Item label='Min Rating'>
            <Slider
              min={0}
              max={5}
              step={0.5}
              value={filters.minRating}
              onChange={(value) => handleChange('minRating', value)}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={6} lg={4}>
          <Button
            // type='primary'
            color='cyan'
            // variant='solid'
            // variant='solid'
            onClick={() => {
              dispatch(setFilters(filters));
              setFormHasChanged(false);
            }}
            disabled={hasErrors || !formHasChanged}
            // style={{ marginTop: 30 }}
          >
            Apply Filters
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
