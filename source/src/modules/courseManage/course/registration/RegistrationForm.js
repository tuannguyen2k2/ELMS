import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import CheckboxField from '@components/common/form/CheckboxField';
import SelectField from '@components/common/form/SelectField';
import TimePickerField from '@components/common/form/TimePickerField';
import { AppConstants, DATE_FORMAT_VALUE, DEFAULT_FORMAT, TIME_FORMAT_DISPLAY } from '@constants';
import apiConfig from '@constants/apiConfig';
import {
    daysOfWeekSchedule as daysOfWeekScheduleOptions,
    stateResgistrationOptions,
    statusOptions,
} from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { Button, Card, Col, Form, Row, Space, message } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styles from './Registration.module.scss';
import ScheduleTable from '@components/common/table/ScheduleTable';
import { commonMessage } from '@locales/intl';
import { useLocation } from 'react-router-dom';
import TextField from '@components/common/form/TextField';
import DatePickerField from '@components/common/form/DatePickerField';
import { copyToClipboard, formatDateString, generatePassword, generateRandomPassword } from '@utils';
import CropImageField from '@components/common/form/CropImageField';
import PasswordGeneratorField from '@components/common/form/PasswordGeneratorField';
import { KeyOutlined, CopyOutlined } from '@ant-design/icons';
import useNotification from '@hooks/useNotification';
import NumericField from '@components/common/form/NumericField';

const messages = defineMessages({
    student: 'Tên sinh viên',
    isIntern: 'Đăng kí thực tập',
    schedule: 'Thời khoá biểu',
    copyPasswordSuccess: 'Sao chép mật khẩu thành công',
    copyPasswordWarning: 'Không có mật khẩu để sao chép',
});

function RegistrationForm({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing }) {
    const location = useLocation();
    const { data: dataLocation } = location.state;
    const translate = useTranslate();
    const [imageUrl, setImageUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const daysOfWeekSchedule = translate.formatKeys(daysOfWeekScheduleOptions, ['label']);
    const [password, setPassword] = useState();
    const registrationStateOption = translate.formatKeys(stateResgistrationOptions, ['label']);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const [registrationStateFilter, setRegistrationStateFilter] = useState([registrationStateOption[0]]);
    const notification = useNotification();
    const { form, mixinFuncs, onValuesChange, setFieldValue, getFieldValue } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const { data: dataStudentByPhone } = useFetch(apiConfig.student.getDetailByPhone, {
        immediate: true,
        params: { phone: dataLocation?.phone },
    });
    const [isChecked, setIsChecked] = useState(false);

    const handleOnChangeCheckBox = () => {
        setIsChecked(!isChecked);
    };

    // const {
    //     data: students,
    //     loading: getstudentsLoading,
    //     execute: executestudents,
    // } = useFetch(apiConfig.student.autocomplete, {
    //     immediate: true,
    //     mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.fullName })),
    // });
    // useEffect(() => {
    //     executestudents({
    //         params: {},
    //     });
    // }, []);
    function formatTimeRange(timeArray) {
        return timeArray
            .map((time) => {
                if (time.from === '00H00' && time.to === '00H00') {
                    return '';
                } else {
                    return `${time.from}-${time.to}`;
                }
            })
            .filter((time) => time !== '')
            .join('|');
    }
    const handleSubmit = (values) => {
        if (dataLocation) {
            values.status = values.status || 1;
            values.student.avatar = imageUrl;
            values.student.birthday = formatDateString(values?.student.birthday, DATE_FORMAT_VALUE) + ' 00:00:00';
            values.student.studyClass = values.student.studyClass.id;
            values.student.universityId = values?.student?.university.id;
            values.student.id = null;
            delete values?.student?.university;
            if (dataStudentByPhone) {
                values.student.id = dataStudentByPhone?.data?.id;
                values.student.password = null;
            }
        }
        values.isIntern = isChecked ? 1 : 0;
        for (const day in values.schedule) {
            for (const timeRange of values.schedule[day]) {
                timeRange.from = timeRange.from.set({ hour: 0, minute: 0 }).format('HH[H]mm');
                timeRange.to = timeRange.to.set({ hour: 0, minute: 0 }).format('HH[H]mm');
            }
        }
        const newSchedule = {
            t2: formatTimeRange(values.schedule.monday),
            t3: formatTimeRange(values.schedule.tuesday),
            t4: formatTimeRange(values.schedule.wednesday),
            t5: formatTimeRange(values.schedule.thursday),
            t6: formatTimeRange(values.schedule.friday),
            t7: formatTimeRange(values.schedule.saturday),
            cn: formatTimeRange(values.schedule.sunday),
        };
        const filterNewSchedule = Object.entries(newSchedule)
            .filter(([key, value]) => value !== '')
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
        values.schedule = values.schedule && JSON.stringify(filterNewSchedule);
        if (!values?.state) {
            values.state = 1;
            // values.state = stateResgistration[0].value;
        }
        return mixinFuncs.handleSubmit({ ...values });
    };
    function addFrameTime(data) {
        const result = {};
        const keys = ['t2', 't3', 't4', 't5', 't6', 't7', 'cn'];

        keys.forEach((key) => {
            if (Object.hasOwnProperty.call(data, key)) {
                result[key] = data[key];
            } else {
                result[key] = '00H00-00H00|00H00-00H00|00H00-00H00';
            }
        });

        // Split time and update missing fields
        Object.keys(result).forEach((key) => {
            const timeArray = result[key].split('|');
            if (timeArray.length < 3) {
                while (timeArray.length < 3) {
                    timeArray.push('00H00-00H00');
                }
                result[key] = timeArray.join('|');
            }
        });

        return result;
    }

    const splitTime = (data) => {
        const result = {};
        const dataNew = {
            monday: data.t2,
            tuesday: data.t3,
            wednesday: data.t4,
            thursday: data.t5,
            friday: data.t6,
            saturday: data.t7,
            sunday: data.cn,
        };
        for (const key in dataNew) {
            if (Object.hasOwn(dataNew, key)) {
                const value = dataNew[key];
                if (value && value.length > 0) {
                    const timeRanges = value.split('|');
                    const fromTo = timeRanges.map((timeRange) => {
                        const [from, to] = timeRange.split('-');
                        return {
                            from,
                            to,
                        };
                    });
                    result[key] = fromTo;
                }
            }
        }
        return result;
    };

    useEffect(() => {
        dataDetail?.isIntern && setIsChecked(dataDetail?.isIntern == 1 && true);
        let data = dataDetail?.schedule && JSON.parse(dataDetail?.schedule);
        if (data) {
            const dataFullFrame = addFrameTime(data);
            data = splitTime(dataFullFrame);
        }
        let dataDefault = {};
        daysOfWeekSchedule.map((day) => {
            dataDefault = {
                [day.value]: [
                    {
                        from: '00H00',
                        to: '00H00',
                    },
                    {
                        from: '00H00',
                        to: '00H00',
                    },
                    {
                        from: '00H00',
                        to: '00H00',
                    },
                ],
                ...dataDefault,
            };
        });
        for (const day in data) {
            for (const timeRange of data[day]) {
                timeRange.from = dayjs(timeRange.from, 'HH:mm');
                timeRange.to = dayjs(timeRange.to, 'HH:mm');
            }
        }
        for (const day in dataDefault) {
            for (const timeRange of dataDefault[day]) {
                timeRange.from = dayjs(timeRange.from, 'HH:mm');
                timeRange.to = dayjs(timeRange.to, 'HH:mm');
            }
        }

        dataDetail.schedule = data || dataDefault;
        form.setFieldsValue({
            ...dataDetail,
            studentId: dataDetail?.studentInfo?.fullName,
        });
    }, [dataDetail]);

    const onSelectScheduleTabletRandom = (fieldName, value) => {
        try {
            const schedule = getFieldValue('schedule');
            const [dayKey, dayIndexKey, frameKey] = fieldName;
            if (frameKey === 'from') {
                const to = schedule[dayKey][dayIndexKey].to;
                if (to && to.format(TIME_FORMAT_DISPLAY) < value.format(TIME_FORMAT_DISPLAY)) {
                    // schedule[dayKey][dayIndexKey].to = value;
                }
            } else if (frameKey === 'to') {
                const from = schedule[dayKey][dayIndexKey].from;
                if (from && value.format(TIME_FORMAT_DISPLAY) < from.format(TIME_FORMAT_DISPLAY)) {
                    value = from;
                }
            }
            schedule[dayKey][dayIndexKey][frameKey] = value;
            setFieldValue('schedule', schedule);
            onValuesChange();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        registrationStateOption.map((state, index) => {
            if (dataDetail?.state == state.value) {
                const length = registrationStateOption.length;
                let arrayStateFilter = [];
                if (index < length - 3) {
                    arrayStateFilter = [state, registrationStateOption[index + 1], registrationStateOption[length - 1]];
                } else if (index === length - 3) {
                    arrayStateFilter = [state, registrationStateOption[length - 1]];
                } else {
                    arrayStateFilter = [state];
                }
                setRegistrationStateFilter(arrayStateFilter);
            }
        });
    }, [dataDetail]);
    useEffect(() => {
        if (dataStudentByPhone) {
            const dataStudentFilter = dataStudentByPhone?.data;
            dataStudentFilter.birthday =
                dataStudentFilter?.birthday && dayjs(dataStudentFilter?.birthday, DATE_FORMAT_VALUE);
            form.setFieldsValue({
                student: { ...dataStudentFilter },
            });
            setImageUrl(dataStudentFilter.avatar);
        } else if (dataLocation) {
            dataLocation.password = password;
            form.setFieldsValue({
                student: { ...dataLocation },
            });
        }
    }, [dataStudentByPhone, password]);
    const validateDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isAfter(date)) {
            return Promise.reject('Ngày sinh phải nhỏ hơn ngày hiện tại');
        }
        return Promise.resolve();
    };
    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };
    const copyToClipboardAlert = () => {
        if (password != undefined) {
            notification({ type: 'success', message: translate.formatMessage(messages.copyPasswordSuccess) });
        } else {
            notification({ type: 'warning', message: translate.formatMessage(messages.copyPasswordWarning) });
        }
    };

    const handleApplyAll = (e) => {
        e.preventDefault();
        const schedule = getFieldValue('schedule');
        const { monday = [] } = schedule;

        for (let { value } of daysOfWeekSchedule) {
            schedule[value] = monday.map((frame) => ({
                from: dayjs(frame.from, TIME_FORMAT_DISPLAY),
                to: dayjs(frame.to, TIME_FORMAT_DISPLAY),
            }));
        }
        // form.resetFields();
        setFieldValue('schedule', schedule);
        onValuesChange();
    };

    const onFieldsChange = () => {
        onValuesChange();
    };
    const handleOk = () => {
        document.activeElement.blur();
    };
    const handleTimeChange = (fieldName, value) => {
        if (!value) {
            try {
                const schedule = getFieldValue('schedule');
                const [dayKey, dayIndexKey, frameKey] = fieldName;
                if (frameKey === 'from') {
                    schedule[dayKey][dayIndexKey].from = dayjs('00:00', 'HH:mm');
                } else if (frameKey === 'to') {
                    schedule[dayKey][dayIndexKey].to = dayjs('00:00', 'HH:mm');
                    // schedule[dayKey][dayIndexKey].to = schedule[dayKey][dayIndexKey].from;
                }
                setFieldValue('schedule', schedule);
                onValuesChange();
            } catch (error) {
                console.log(error);
            }
        }
    };
    const handleReset = (day) => {
        const schedule = getFieldValue('schedule');
        for (let dayIndexKey = 0; dayIndexKey < 3; dayIndexKey++) {
            schedule[day][dayIndexKey].from = dayjs('00:00', 'HH:mm');
            schedule[day][dayIndexKey].to = dayjs('00:00', 'HH:mm');
        }
        setFieldValue('schedule', schedule);
        onValuesChange();
    };
    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onFieldsChange={onFieldsChange} size="1100px">
            {dataLocation && (
                <div style={{ marginBottom: '20px' }}>
                    <Card className="card-form" bordered={false}>
                        <div style={{ margin: '10px 0', fontWeight: 600 }}>THÔNG TIN SINH VIÊN</div>
                        <Col span={12}>
                            <CropImageField
                                label={<FormattedMessage defaultMessage="Avatar" />}
                                name="avatar"
                                imageUrl={imageUrl && `${AppConstants.contentRootUrl}${imageUrl}`}
                                aspect={1 / 1}
                                uploadFile={uploadFile}
                            />
                        </Col>
                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                    label={translate.formatMessage(commonMessage.name)}
                                    required
                                    disabled={dataStudentByPhone}
                                    name={['student', 'fullName']}
                                />
                            </Col>
                            <Col span={12}>
                                <DatePickerField
                                    disabled={dataStudentByPhone}
                                    name={['student', 'birthday']}
                                    label="Ngày sinh"
                                    placeholder="Ngày sinh"
                                    format={DATE_FORMAT_VALUE}
                                    style={{ width: '100%' }}
                                    required
                                    rules={[
                                        {
                                            validator: validateDate,
                                        },
                                    ]}
                                />
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <TextField
                                    disabled={dataStudentByPhone}
                                    label={translate.formatMessage(commonMessage.mssv)}
                                    required
                                    name={['student', 'mssv']}
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                    disabled={dataStudentByPhone}
                                    label={translate.formatMessage(commonMessage.phone)}
                                    type="number"
                                    name={['student', 'phone']}
                                    required
                                />
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <PasswordGeneratorField
                                    disabled
                                    label={translate.formatMessage(commonMessage.password)}
                                    minLength={6}
                                    fieldName={['student', 'password']}
                                    value={form.getFieldValue('password')}
                                    type="password"
                                    suffix={
                                        !dataStudentByPhone && (
                                            <>
                                                <Button
                                                    onClick={() => {
                                                        const curPass = generatePassword({
                                                            length: 8,
                                                            numbers: true,
                                                            uppercase: true,
                                                            lowercase: true,
                                                        });
                                                        setPassword(curPass);
                                                        form.setFieldValue('password', curPass);
                                                    }}
                                                >
                                                    <KeyOutlined style={{ alignSelf: 'center' }} />
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        copyToClipboard(password);
                                                        copyToClipboardAlert();
                                                    }}
                                                >
                                                    <CopyOutlined style={{ alignSelf: 'center' }} />
                                                </Button>
                                            </>
                                        )
                                    }
                                />
                            </Col>
                            <Col span={12}>
                                <TextField
                                    label={translate.formatMessage(commonMessage.email)}
                                    type="email"
                                    name={['student', 'email']}
                                    required
                                    disabled={dataStudentByPhone}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <AutoCompleteField
                                    label={<FormattedMessage defaultMessage="Trường" />}
                                    name={['student', 'university', 'id']}
                                    disabled={dataStudentByPhone}
                                    apiConfig={apiConfig.category.autocomplete}
                                    mappingOptions={(item) => ({ value: item.id, label: item.categoryName })}
                                    // initialSearchParams={{
                                    //     kind: kindOfEdu,
                                    // }}
                                    searchParams={(text) => ({ name: text })}
                                    // onFocus={handleFocus}
                                    required
                                />
                            </Col>
                            <Col span={12}>
                                <AutoCompleteField
                                    label={<FormattedMessage defaultMessage="Hệ" />}
                                    name={['student', 'studyClass', 'id']}
                                    disabled={dataStudentByPhone}
                                    apiConfig={apiConfig.category.autocomplete}
                                    mappingOptions={(item) => ({ value: item.id, label: item.categoryName })}
                                    // initialSearchParams={{
                                    //     kind: kindOfGen,
                                    // }}
                                    searchParams={(text) => ({ name: text })}
                                    required
                                />
                            </Col>
                            <Col span={12}>
                                <SelectField
                                    required
                                    defaultValue={statusValues[1]}
                                    label={<FormattedMessage defaultMessage="Trạng thái" />}
                                    name={['student', 'status']}
                                    options={statusValues}
                                    disabled={dataStudentByPhone}
                                />
                            </Col>
                        </Row>
                    </Card>
                </div>
            )}
            <Card className="card-form" bordered={false}>
                <div style={{ margin: '10px 0', fontWeight: 600 }}>ĐĂNG KÝ KHOÁ HỌC</div>
                <div style={{ width: '980px' }}>
                    <Row gutter={16}>
                        {!dataLocation && (
                            <Col span={12}>
                                <AutoCompleteField
                                    disabled={isEditing}
                                    required
                                    label={translate.formatMessage(commonMessage.studentName)}
                                    name={['studentInfo', 'fullName']}
                                    apiConfig={apiConfig.student.autocomplete}
                                    mappingOptions={(item) => {
                                        return { value: item.id, label: item.fullName };
                                    }}
                                    initialSearchParams={{ pageNumber: 0 }}
                                    searchParams={(text) => ({ fullName: text })}
                                />
                            </Col>
                        )}
                        <Col span={dataLocation ? 13 : 12} style={dataLocation && { paddingRight: '14px' }}>
                            <SelectField
                                disabled={dataDetail?.state === 3 || (dataDetail?.state === 4 && true)}
                                defaultValue={registrationStateFilter[0]}
                                label={<FormattedMessage defaultMessage="Tình trạng" />}
                                name="state"
                                options={registrationStateFilter}
                            />
                        </Col>
                        <Col span={12}>
                            <CheckboxField
                                className={styles.customCheckbox}
                                required
                                label={translate.formatMessage(commonMessage.isIntern)}
                                name="isIntern"
                                checked={isChecked}
                                onChange={handleOnChangeCheckBox}
                            />
                        </Col>
                    </Row>
                </div>
                <ScheduleTable
                    handleOk={handleOk}
                    label={translate.formatMessage(commonMessage.schedule)}
                    onSelectScheduleTabletRandom={onSelectScheduleTabletRandom}
                    translate={translate}
                    handleApplyAll={handleApplyAll}
                    daysOfWeekSchedule={daysOfWeekSchedule}
                    handleTimeChange={handleTimeChange}
                    handleReset={handleReset}
                />
                <div className="footer-card-form" style={{ marginTop: '20px', marginRight: '69px' }}>
                    {actions}
                </div>
            </Card>
        </BaseForm>
    );
}

export default RegistrationForm;
