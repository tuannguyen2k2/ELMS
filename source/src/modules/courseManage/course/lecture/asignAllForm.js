import { Card, Col, Row,Button,Form } from 'antd';
import React from 'react';
import useTranslate from '@hooks/useTranslate';
import TextField from '@components/common/form/TextField';
import { defineMessages } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import { DATE_FORMAT_VALUE,DEFAULT_FORMAT } from '@constants/index';
import { formatDateString } from '@utils/index';
import dayjs from 'dayjs';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { useNavigate } from 'react-router-dom';
import useNotification from '@hooks/useNotification';
import { useIntl } from 'react-intl';
import { commonMessage } from '@locales/intl';
import styles from './AsignAll.module.scss';

const messages = defineMessages({
    objectName: 'Bài giảng',
    asignAllSuccess:'Áp dụng {objectName} thành công',
    cancel: 'Huỷ',
    save: 'Tạo',
});

const AsignAllForm = ({ onCancel,courseId, lectureId,setHasError }) => {
    const translate = useTranslate();

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const notification = useNotification();
    const intl = useIntl();

    const { execute: executeAsign } = useFetch(apiConfig.task.asignALl,{ immediate: false });
 
    const asignALl = (values) => {
        executeAsign({
            data:{
                courseId: courseId,
                dueDate : formatDateString(values.dueDate, DEFAULT_FORMAT),
                lectureId: lectureId,
                note : values.note,
                startDate : values.startDate ? (formatDateString(values.startDate, DEFAULT_FORMAT)) : formatDateString(new Date(), DEFAULT_FORMAT),
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    notification({
                        message: 
                        intl.formatMessage(messages.asignAllSuccess, {
                            objectName: translate.formatMessage(messages.objectName),
                        }),
                    });
                    return navigate(-1);
                }

            },
            onError: (err) => {
                if( err.response.data.message == 'ERROR-COURSE-ERROR-0003'){
                    setHasError(true); 
                }
            },
        });
    };

    const initialValues = {
        startDate: dayjs(formatDateString(new Date(), DEFAULT_FORMAT),DEFAULT_FORMAT),
    };


    const validateStartDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT),DATE_FORMAT_VALUE);
        if (date && value && value.isBefore(date)) {
            return Promise.reject('Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại');
        }
        return Promise.resolve();
    };
    const validateDueDate = (_, value) => {
        const { startDate } = form.getFieldValue();
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };
    return (
        <BaseForm 
            form={form}
            onFinish={asignALl} 
            size = "100%"
            initialValues={initialValues}
        >
            <div className={styles.modalAsign}>
                <Row gutter={16}>
                    <Col span={12}>
                        <DatePickerField
                            showTime = {true}
                            name="startDate"
                            label={translate.formatMessage(commonMessage.startDate)}                            
                            placeholder="Ngày bắt đầu"
                            format={DEFAULT_FORMAT}
                            style={{ width: '100%' }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày bắt đầu',
                                },
                                // {
                                //     validator: validateStartDate,
                                // },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            showTime = {true}
                            name={"dueDate"}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày kết thúc',
                                },
                                {
                                    validator: validateDueDate,
                                },
                            ]}
                            label={translate.formatMessage(commonMessage.endDate)}
                            placeholder="Ngày kết thúc"
                            format={DEFAULT_FORMAT}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <TextField
                            name="note"
                            label="Chú thích"
                            type="textarea"
                        />
                    </Col>
                </Row>
                <div style={{ float: 'right' }}>
                    <Button className={styles.btnModal} onClick={onCancel} >
                        {translate.formatMessage(messages.cancel)}
                    </Button>
                    <Button key="submit" type="primary" htmlType="submit" className={styles.btnModal} >
                        {translate.formatMessage(messages.save)}
                    </Button>
                </div>
                
            </div>
        </BaseForm>
    );
};

export default AsignAllForm;
