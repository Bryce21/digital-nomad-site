import {Col, Collapse, Row} from "antd";
import React from "react";
import {FoodWidget} from "./FoodWidget";
import {ThingsToDoWidget} from "./ThingsToDoWidget";
import {Setting} from "../../common/Setting";


export function OpenAiWidget(){
    return <>
        <div>
            <Row>
                <Col span={12}>
                    <Collapse
                        size="large"
                        items={
                            [
                                {
                                    key: '1',
                                    label: 'Food',
                                    children: <FoodWidget/>,
                                    extra: <Setting onClick={() => {}}/>,
                                }
                            ]
                        }
                    />
                </Col>
                <Col span={12}>
                    <Collapse
                        size="large"
                        items={
                            [
                                {
                                    key: '1',
                                    label: 'Things to do',
                                    children: <ThingsToDoWidget/>,
                                    extra: <Setting onClick={() => {}}/>,
                                }
                            ]
                        }
                    />
                </Col>
            </Row>
        </div>
    </>
}
