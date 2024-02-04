import React, {useState} from "react";
import {tagRender} from "./TagRender";
import {Select} from "antd";

interface SelectProps {
    options: {label: string, value: string}[]
    maxCount ?: number
    onChange: (values: string[]) => void
}

export function SelectComponent(props: SelectProps) {
    return <>
        <Select
            mode="tags"
            maxCount={props.maxCount || 4}
            allowClear
            tagRender={tagRender}
            style={{ width: '100%' }}
            placeholder="Please select"
            defaultValue={[]}
            onChange={(v) => {
                console.log('v', v)
                props.onChange(v)
            }}
            options={props.options}
        />
    </>
}
