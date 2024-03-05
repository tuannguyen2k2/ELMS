import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import {
    DATE_FORMAT_DISPLAY,
    DATE_FORMAT_END_OF_DAY_TIME,
    DATE_FORMAT_ZERO_TIME,
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { TaskLogKindOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Tag } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { commonMessage } from '@locales/intl';
import { FieldTypes } from '@constants/formConfig';
import useFetch from '@hooks/useFetch';
import styles from './activityCourseStudent.module.scss';
import useAuth from '@hooks/useAuth';
import { IconAlarm, IconAlarmOff } from '@tabler/icons-react';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import dayjs from 'dayjs';
import { convertUtcToLocalTime, formatDateString } from '@utils';
const message = defineMessages({
    selectCourse: 'Chọn khoá học',
    objectName: 'Nhật ký',
    reminderMessage: 'Vui lòng chọn khoá học !',
});

function MyActivityCourseListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const KindTaskLog = translate.formatKeys(TaskLogKindOptions, ['label']);
    const { profile } = useAuth();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.taskLog,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                try {
                    if (response.result === true) {
                        return {
                            data: response.data.content,
                            total: response.data.totalElements,
                        };
                    }
                } catch (error) {
                    return [];
                }
            };
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({ ...params, studentId: profile.id });
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?courseId=${courseId}&taskId=${dataRow?.task?.id}&taskName=${dataRow?.task?.lecture?.lectureName}`;
            };
            const handleFilterSearchChange = funcs.handleFilterSearchChange;
            funcs.handleFilterSearchChange = (values) => {
                if (values.toDate == null && values.fromDate == null) {
                    delete values.toDate;
                    delete values.fromDate;
                    handleFilterSearchChange({
                        ...values,
                    });
                } else if (values.toDate == null) {
                    const fromDate = values.fromDate && formatDateToZeroTime(values.fromDate);
                    delete values.toDate;
                    handleFilterSearchChange({
                        ...values,
                        fromDate: fromDate,
                    });
                } else if (values.fromDate == null) {
                    const toDate = values.toDate && formatDateToEndOfDayTime(values.toDate);
                    delete values.fromDate;
                    handleFilterSearchChange({
                        ...values,
                        toDate: toDate,
                    });
                } else {
                    const fromDate = values.fromDate && formatDateToZeroTime(values.fromDate);
                    const toDate = values.toDate && formatDateToEndOfDayTime(values.toDate);
                    handleFilterSearchChange({
                        ...values,
                        fromDate: fromDate,
                        toDate: toDate,
                    });
                }
            };
        },
    });

    const columns = [
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            render: (createdDate) => {
                const modifiedDate = convertStringToDateTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT).add(
                    7,
                    'hour',
                );
                const modifiedDateTimeString = convertDateTimeToString(modifiedDate, DEFAULT_FORMAT);
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedDateTimeString}</div>;
            },
            width: 180,
        },
        {
            title: translate.formatMessage(commonMessage.message),
            dataIndex: 'message',
        },
        {
            title: translate.formatMessage(commonMessage.totalTime),
            dataIndex: 'totalTime',
            align: 'center',
            width: 150,
            render(totalTime) {
                return <div>{Math.ceil((totalTime / 60) * 10) / 10} h</div>;
            },
        },
        {
            title: 'Loại',
            dataIndex: 'kind',
            align: 'center',
            width: 120,
            render(dataRow) {
                const kindLog = KindTaskLog.find((item) => item.value == dataRow);
                return (
                    <Tag color={kindLog.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{kindLog.label}</div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ].filter(Boolean);
    const { data: myCourse } = useFetch(apiConfig.course.getListStudentCourse, {
        immediate: true,
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item.id,
                label: item.name,
            })),
    });
    const searchFields = [
        {
            key: 'courseId',
            placeholder: translate.formatMessage(message.selectCourse),
            type: FieldTypes.SELECT,
            options: myCourse,
        },
        {
            key: 'fromDate',
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            placeholder: translate.formatMessage(commonMessage.fromDate),
            colSpan: 3,
        },
        {
            key: 'toDate',
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            placeholder: translate.formatMessage(commonMessage.toDate),
            colSpan: 3,
        },
    ];

    const initialFilterValues = useMemo(() => {
        const initialFilterValues = {
            ...queryFilter,
            fromDate: queryFilter.fromDate && dayjs(formatDateToLocal(queryFilter.fromDate), DEFAULT_FORMAT),
            toDate:
                queryFilter.toDate && dayjs(formatDateToLocal(queryFilter.toDate), DEFAULT_FORMAT).subtract(7, 'hour'),
        };

        return initialFilterValues;
    }, [queryFilter?.fromDate, queryFilter?.toDate]);

    const { data: timeSum, execute: executeTimeSum } = useFetch(apiConfig.taskLog.getSum, {
        immediate: false,
        params: { courseId: queryFilter?.courseId, studentId: profile.id },
        mappingData: ({ data }) => data.content,
    });
    useEffect(() => {
        if (courseId)
            executeTimeSum({
                params: { courseId, studentId: profile.id },
            });
    }, [courseId]);
    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.myActivity) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: initialFilterValues })}
                baseTable={
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'end' }}>
                            <span>
                                <span style={{ marginLeft: '5px' }}>
                                    <IconAlarm style={{ marginBottom: '-5px' }} />:{' '}
                                    <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                                        {timeSum && timeSum[0]?.timeWorking
                                            ? Math.ceil((timeSum[0]?.timeWorking / 60) * 10) / 10
                                            : 0}
                                        h{' '}
                                        <span style={{ fontWeight: 'bold', fontSize: '17px', marginLeft: '15px' }}>
                                            |{' '}
                                        </span>
                                    </span>
                                </span>
                                <span style={{ marginLeft: '10px' }}>
                                    <IconAlarmOff style={{ marginBottom: '-5px', color: 'red' }} />:{' '}
                                    <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                                        {timeSum && timeSum[0]?.timeOff
                                            ? Math.ceil((timeSum[0]?.timeOff / 60) * 10) / 10
                                            : 0}
                                        h
                                    </span>
                                </span>
                            </span>
                        </div>
                        <BaseTable
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={data}
                            columns={columns}
                        />
                    </div>
                }
            />
        </PageWrapper>
    );
}
const formatDateToZeroTime = (date) => {
    const dateString = formatDateString(date, DEFAULT_FORMAT);
    return dayjs(dateString, DEFAULT_FORMAT).format(DATE_FORMAT_ZERO_TIME);
};
const formatDateToEndOfDayTime = (date) => {
    const dateString = formatDateString(date, DEFAULT_FORMAT);
    return dayjs(dateString, DEFAULT_FORMAT).format(DATE_FORMAT_END_OF_DAY_TIME);
};

const formatDateToLocal = (date) => {
    return convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
};

export default MyActivityCourseListPage;
