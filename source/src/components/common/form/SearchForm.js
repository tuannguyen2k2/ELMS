import { FieldTypes } from '@constants/formConfig';
import { Button, Col, Form, Row } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';
import SelectField from './SelectField';
import DatePickerField from './DatePickerField';
import DateRangePickerField from './DateRangePickerField';
import InputTextField from './InputTextField';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { defineMessages, useIntl } from 'react-intl';

import styles from './SearchForm.module.scss';
import { convertLocalTimeToUtc, convertUtcToLocalTime, formatDateString } from '@utils';
import { DATE_FORMAT_DISPLAY } from '@constants';
import dayjs from 'dayjs';
import { DEFAULT_FORMAT } from '@constants';
import AutoCompleteField from './AutoCompleteField';

const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
};

const searchFields = {
    [FieldTypes.SELECT]: SelectField,
    [FieldTypes.DATE]: DatePickerField,
    [FieldTypes.DATE_RANGE]: (props) => <DateRangePickerField disabledDate={disabledDate} {...props} />,
    [FieldTypes.AUTOCOMPLETE]: AutoCompleteField,
    default: InputTextField,
};

const message = defineMessages({
    search: 'Search',
    clear: 'Clear',
});

function SearchForm({
    fields = [],
    hiddenAction,
    onSearch,
    className,
    onReset,
    initialValues,
    width = 1100,
    alignSearchField,
    getFormInstance,
    activeTab,
}) {
    const [form] = Form.useForm();
    const intl = useIntl();
    const dateRangeKey = useRef({});

    const handleSearchSubmit = useCallback(
        (values) => {
            // const dateRangeValues = Object.keys(dateRangeKey.current).reduce((acc, key) => {
            //     if (!values[key]) return acc;

            //     acc[dateRangeKey.current[key][1]] = formatDateToUtc(values[key][0]) + ' 00:00:00';
            //     acc[dateRangeKey.current[key][2]] = formatDateToUtc(values[key][1]) + ' 23:59:59';

            //     delete values[key];

            //     console.log('acc', acc);

            //     return acc;
            // }, {});
            // onSearch?.({ ...values, ...dateRangeValues });
            onSearch?.(values);
        },
        [form, onSearch],
    );

    const handleClearSearch = () => {
        form.resetFields();
        onReset?.();
    };
    useEffect(() => {
        if (activeTab) {
            form.resetFields();
        }
    }, [activeTab]);
    const renderField = useCallback(
        ({ type, submitOnChanged, onChange, key, renderItem, style, component, ...props }) => {
            if (renderItem) {
                return (
                    <Form.Item {...props} name={key} style={{ marginBottom: '0px' }}>
                        {renderItem()}
                    </Form.Item>
                );
            }

            const Field = component || searchFields[type] || searchFields.default;
            return (
                <Field
                    {...props}
                    name={key}
                    fieldProps={{
                        style: { ...style, width: '100%', height: 32 },
                    }}
                    style={{ ...style, width: '100%', height: 32 }}
                    onChange={(e) => {
                        if (submitOnChanged) {
                            form.submit();
                        } else {
                            onChange?.(e);
                        }
                    }}
                />
            );
        },
        [handleSearchSubmit],
    );

    useEffect(() => {
        getFormInstance?.(form);
    }, [form]);

    useEffect(() => {
        // fields.forEach((field) => {
        //     if (field.type === FieldTypes.DATE_RANGE) {
        //         dateRangeKey.current[field.key[0]] = field.key;
        //     }
        // });

        // const dateRangeValues = Object.keys(dateRangeKey.current).reduce((acc, key) => {
        //     if (!initialValues[dateRangeKey.current[key][1]] || !initialValues[dateRangeKey.current[key][2]]) return acc;

        //     acc[key] = [
        //         dayjs(formatDateToLocal(initialValues[dateRangeKey.current[key][1]]), DATE_FORMAT_DISPLAY),
        //         dayjs(formatDateToLocal(initialValues[dateRangeKey.current[key][2]]), DATE_FORMAT_DISPLAY),
        //     ];

        //     return acc;
        // }, {});

        // form.setFieldsValue({
        //     ...initialValues,
        //     ...dateRangeValues,
        // });
        // const normalizeValues = { ...initialValues };
        // Object.keys(normalizeValues).forEach((key) => {
        //     if (!isNaN(normalizeValues[key])) {
        //         normalizeValues[key] = Number(normalizeValues[key]);
        //     }
        // });
        form.setFieldsValue(initialValues);
    }, [initialValues]);
    return (
        <Form form={form} layout="horizontal" className={className || styles.searchForm} onFinish={handleSearchSubmit}>
            <Row align={alignSearchField} gutter={10} style={{ maxWidth: width }}>
                {fields.map((field) => {
                    const { key, colSpan, className, ...props } = field;
                    return (
                        <Col key={key} span={colSpan || 4} className={className}>
                            {renderField({ ...props, key })}
                        </Col>
                    );
                })}
                {!hiddenAction && fields.length > 0 && (
                    <Col>
                        <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
                            {intl.formatMessage(message.search)}
                        </Button>
                        <Button style={{ marginLeft: 8 }} icon={<ClearOutlined />} onClick={handleClearSearch}>
                            {intl.formatMessage(message.clear)}
                        </Button>
                    </Col>
                )}
            </Row>
        </Form>
    );
}

const formatDateToUtc = (date) => {
    return convertLocalTimeToUtc(formatDateString(date, DATE_FORMAT_DISPLAY), DATE_FORMAT_DISPLAY, DATE_FORMAT_DISPLAY);
};

const formatDateToLocal = (date) => {
    return convertUtcToLocalTime(date, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY);
};

export default SearchForm;
