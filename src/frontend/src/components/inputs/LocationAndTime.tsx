import { AutoComplete, Button, Col, DatePicker, Form, Input, Row } from "antd";
import { useEffect, useState } from "react";
const { RangePicker } = DatePicker;

interface OnFinishData {
    location: string
}

interface LocationAndTimeProps {
    // todo add date here
    onFinish: (data: OnFinishData) => void
    onSearch: (searchTerm: string) => Promise<string[]>
}
export default function LocationAndTime(props: LocationAndTimeProps) {
    const [form] = Form.useForm();
    const [location, setLocation] = useState("")
    const [options, setOptions] = useState<string[]>([])


    useEffect(() => {
        if (location) {
            // using timeout to debounce
            const newOptionsTimeout = setTimeout(
                () => {
                    console.log('set timeout running', location)
                    props.onSearch(location).then((searchOptions: string[]) => {
                        setOptions(searchOptions)
                    })
                },
                200
            )

            return () => clearTimeout(newOptionsTimeout)
        }
    }, [location])

    return <>
        <Row style={{float: 'right', padding: '15px 0'}}>
            <Col>
                <Form
                    form={form}
                    style={{ maxWidth: 'none' }}
                    layout={'inline'}
                    onFinish={
                        (values) => {
                            console.log('values', values)
                            props.onFinish(
                                {
                                    location: values.location
                                }
                            )
                        }
                    }
                >
                    <Form.Item
                        rules={[{ required: true, message: 'Please input a location' }]}
                        name="location"
                    >
                        <AutoComplete
                            value={location}
                            onChange={(e: string) => {
                                console.log("onChange", e)
                                setLocation(e)
                            }
                            }
                            options={options.slice(0, 5).map(o => ({ value: o }))}
                            style={{ width: 200 }}
                            onSelect={(data) => { console.log('on select', data); setLocation(data) }}
                            placeholder="Location"
                        />

                    </Form.Item>
                    <Form.Item
                        name={"date"}
                    >
                        <RangePicker />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    </>
}
