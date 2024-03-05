import { UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import {
    AppConstants,
    DATE_DISPLAY_FORMAT,
    DATE_FORMAT_DISPLAY,
    DEFAULT_TABLE_ITEM_SIZE,
    DEFAULT_FORMAT,
    DATE_FORMAT_ZERO_TIME,
    DATE_FORMAT_END_OF_DAY_TIME,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { taskState } from '@constants/masterData';
import useDrapDropTableItem from '@hooks/useDrapDropTableItem';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Avatar, Button, Tag } from 'antd';
import React, { useMemo } from 'react';
import { Link, generatePath, useLocation, useNavigate } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { defineMessages } from 'react-intl';
import { date } from 'yup/lib/locale';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { commonMessage } from '@locales/intl';
import { CalendarOutlined } from '@ant-design/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { convertLocalTimeToUtc, convertUtcToLocalTime, formatDateString } from '@utils';
import styles from './task.module.scss';
const message = defineMessages({
    objectName: 'Task',
});

function TaskListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const leaderName = queryParameters.get('leaderName');
    const courseId = queryParameters.get('courseId');
    const courseName = queryParameters.get('courseName');
    const courseStatus = queryParameters.get('courseStatus');
    const subjectId = queryParameters.get('subjectId');
    const state = queryParameters.get('state');
    const location = useLocation();
    const navigate = useNavigate();

    const statusValues = translate.formatKeys(taskState, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.task,
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
                funcs.getCreateLink = () => {
                    return `${pagePath}/lecture?courseId=${courseId}&courseName=${courseName}&subjectId=${subjectId}&state=${state}&courseStatus=${courseStatus}`;
                };
                funcs.getItemDetailLink = (dataRow) => {
                    return `${pagePath}/${dataRow.id}?courseId=${courseId}&courseName=${courseName}&subjectId=${subjectId}&state=${state}&courseStatus=${courseStatus}`;
                };
                funcs.additionalActionColumnButtons = () => ({
                    taskLog: ({ id, lecture, state, status, name }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.taskLog)}>
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        routes.taskListPage.path +
                                            `/task-log?courseId=${courseId}&courseName=${courseName}&taskId=${id}&taskName=${lecture.lectureName}&subjectId=${subjectId}&state=${state}&courseStatus=${courseStatus}`,
                                        {
                                            state: { action: 'taskLog', prevPath: location.pathname },
                                        },
                                    );
                                }}
                            >
                                <CalendarOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                });
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
                funcs.changeFilter = (filter) => {
                    const courseId = queryParams.get('courseId');
                    const subjectId = queryParams.get('subjectId');
                    const courseName = queryParams.get('courseName');
                    const state = queryParams.get('state');
                    const courseStatus = queryParams.get('courseStatus');
                    mixinFuncs.setQueryParams(
                        serializeParams({
                            courseId,
                            courseName,
                            subjectId,
                            state,
                            courseStatus,
                            ...filter,
                        }),
                    );
                };
            },
        });

    const columns = [
        {
            title: translate.formatMessage(commonMessage.task),
            dataIndex: ['lecture', 'lectureName'],
        },
        {
            title: translate.formatMessage(commonMessage.studentName),
            dataIndex: ['student', 'fullName'],
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            width: 180,
            render: (startDate) => {
                const modifiedstartDate = convertStringToDateTime(startDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                const modifiedstartDateTimeString = convertDateTimeToString(modifiedstartDate, DEFAULT_FORMAT);
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedstartDateTimeString}</div>;
            },
            align: 'center',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'dueDate',
            width: 180,
            render: (dueDate) => {
                const modifieddueDate = convertStringToDateTime(dueDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                const modifieddueDateTimeString = convertDateTimeToString(modifieddueDate, DEFAULT_FORMAT);
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifieddueDateTimeString}</div>;
            },
            align: 'center',
        },
        {
            title: 'Ngày hoàn thành',
            dataIndex: 'dateComplete',
            width: 180,
            render: (dateComplete) => {
                const modifiedDateComplete = convertStringToDateTime(dateComplete, DEFAULT_FORMAT, DEFAULT_FORMAT)?.add(
                    7,
                    'hour',
                );
                const modifiedDateCompleteTimeString = convertDateTimeToString(modifiedDateComplete, DEFAULT_FORMAT);
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedDateCompleteTimeString}</div>;
            },
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.state),
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = statusValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        !leaderName &&
            courseStatus == 1 &&
            mixinFuncs.renderActionColumn({ taskLog: true, edit: true, delete: true }, { width: '120px' }),
    ].filter(Boolean);

    const setBreadRoutes = () => {
        const breadRoutes = [];
        if (leaderName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.leader),
                path: routes.leaderListPage.path,
            });
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.course),
                path: generatePath(routes.leaderCourseListPage.path + location?.state?.pathPrev),
            });
        } else {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.course),
                path: generatePath(routes.courseListPage.path),
            });
        }
        breadRoutes.push({ breadcrumbName: translate.formatMessage(commonMessage.task) });

        return breadRoutes;
    };

    const searchFields = [
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

    return (
        <PageWrapper routes={setBreadRoutes()}>
            <div>
                <ListPage
                    title={<span style={{ fontWeight: 'normal' }}>{courseName}</span>}
                    searchForm={mixinFuncs.renderSearchForm({
                        fields: searchFields,
                        className: styles.search,
                        initialValues: initialFilterValues,
                    })}
                    actionBar={state == 2 && courseStatus == 1 && !leaderName ? mixinFuncs.renderActionBar() : ''}
                    baseTable={
                        <BaseTable
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={data}
                            columns={columns}
                        />
                    }
                />
            </div>
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
export default TaskListPage;
