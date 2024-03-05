import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import {
    DEFAULT_TABLE_ITEM_SIZE,
    DEFAULT_FORMAT,
    DATE_FORMAT_DISPLAY,
    DATE_FORMAT_ZERO_TIME,
    DATE_FORMAT_END_OF_DAY_TIME,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { taskState } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Tag } from 'antd';
import React, { useMemo } from 'react';
import { useLocation, useParams, useNavigate, generatePath } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { commonMessage } from '@locales/intl';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { Button } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import DetailMyTaskModal from '../myTask/DetailMyTaskModal';
import useDisclosure from '@hooks/useDisclosure';
import { useState } from 'react';
import useFetch from '@hooks/useFetch';
import { IconBellRinging } from '@tabler/icons-react';
import useNotification from '@hooks/useNotification';
import { convertLocalTimeToUtc, convertUtcToLocalTime, formatDateString } from '@utils';
import { FieldTypes } from '@constants/formConfig';
import dayjs from 'dayjs';
import styles from '../../course.module.scss';
const message = defineMessages({
    objectName: 'Task',
});

function TaskStudentListPage() {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const navigate = useNavigate();
    const notification = useNotification();
    const queryParameters = new URLSearchParams(window.location.search);
    const courseName = queryParameters.get('courseName');
    const subjectId = queryParameters.get('subjectId');
    const state = queryParameters.get('state');
    const paramid = useParams();
    const courseId = queryParameters.get('courseId');
    const [listNotified, setListNotified] = useState([]);
    const statusValues = translate.formatKeys(taskState, ['label']);
    const [openedModal, handlersModal] = useDisclosure(false);
    const [detail, setDetail] = useState({});
    const { execute: executeNotifyDone } = useFetch(apiConfig.task.notifyDone, { immediate: false });
    const { execute: executeGet, loading: loadingDetail } = useFetch(apiConfig.task.getById, {
        immediate: false,
    });
    const handleFetchDetail = (id) => {
        executeGet({
            pathParams: { id: id },
            onCompleted: (response) => {
                setDetail(response.data);
            },
            onError: mixinFuncs.handleGetDetailError,
        });
        handlersModal.open();
    };
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: {
                getList: apiConfig.task.studentTask,
                delete: apiConfig.task.delete,
                update: apiConfig.task.update,
                getById: apiConfig.task.getById,
            },
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                funcs.getList = () => {
                    const params = mixinFuncs.prepareGetListParams(queryFilter);
                    mixinFuncs.handleFetchList({ ...params });
                };
                funcs.getCreateLink = () => {
                    return (
                        routes.courseStudentListPage.path +
                        `/task/${courseId}/lecture?courseId=${courseId}&courseName=${courseName}&subjectId=${subjectId}`
                    );
                };
                funcs.getItemDetailLink = (dataRow) => {
                    return `${pagePath}/${dataRow.id}?courseId=${courseId}&courseName=${courseName}&subjectId=${subjectId}`;
                };
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
                funcs.additionalActionColumnButtons = () => ({
                    taskLog: ({ id, lecture, state, status, name }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.taskLog)}>
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        generatePath(routes.taskStudentListPage.path, { courseId }) +
                                            `/task-log?courseId=${courseId}&courseName=${courseName}&taskId=${id}&taskName=${lecture.lectureName}&subjectId=${subjectId}`,
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
                    notifyDone: ({ id, course, state }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.notifyDone)}>
                            <Button
                                disabled={state != 1 || listNotified.includes(id)}
                                type="link"
                                style={{ padding: 0, position: 'relative', width: '15px', height: '32px' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    executeNotifyDone({
                                        data: {
                                            courseId: course?.id,
                                            taskId: id,
                                        },
                                    });
                                    setListNotified([...listNotified, id]);
                                    notification({
                                        type: 'success',
                                        message: translate.formatMessage(commonMessage.notificationDone),
                                    });
                                }}
                            >
                                <IconBellRinging size={15} style={{ position: 'absolute', top: '3px', left: 0 }} />
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
                    mixinFuncs.setQueryParams(
                        serializeParams({
                            courseId,
                            courseName,
                            subjectId,
                            state,
                            ...filter,
                        }),
                    );
                };
            },
        });

    const setColumns = () => {
        const columns = [
            {
                title: translate.formatMessage(commonMessage.task),
                dataIndex: ['lecture', 'lectureName'],
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
                    const modifiedDateComplete = convertStringToDateTime(
                        dateComplete,
                        DEFAULT_FORMAT,
                        DEFAULT_FORMAT,
                    )?.add(7, 'hour');
                    const modifiedDateCompleteTimeString = convertDateTimeToString(
                        modifiedDateComplete,
                        DEFAULT_FORMAT,
                    );
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
        ];
        columns.push(
            mixinFuncs.renderActionColumn(
                { notifyDone: true, taskLog: true, edit: true, delete: true },
                { width: '160px' },
            ),
        );
        return columns;
    };

    const initialFilterValues = useMemo(() => {
        const initialFilterValues = {
            ...queryFilter,
            fromDate: queryFilter.fromDate && dayjs(formatDateToLocal(queryFilter.fromDate), DEFAULT_FORMAT),
            toDate:
                queryFilter.toDate && dayjs(formatDateToLocal(queryFilter.toDate), DEFAULT_FORMAT).subtract(7, 'hour'),
        };

        return initialFilterValues;
    }, [queryFilter?.fromDate, queryFilter?.toDate]);
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
    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.course),
                    path: routes.courseStudentListPage.path,
                },
                { breadcrumbName: translate.formatMessage(commonMessage.task) },
            ]}
        >
            <div>
                <ListPage
                    actionBar={state != 3 ? mixinFuncs.renderActionBar() : ''}
                    title={<span style={{ fontWeight: 'normal' }}>{courseName}</span>}
                    searchForm={mixinFuncs.renderSearchForm({
                        fields: searchFields,
                        className: styles.search,
                        initialValues: initialFilterValues,
                    })}
                    baseTable={
                        <BaseTable
                            onRow={(record, rowIndex) => ({
                                onClick: (e) => {
                                    e.stopPropagation();
                                    handleFetchDetail(record.id);
                                },
                            })}
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={data}
                            columns={setColumns()}
                        />
                    }
                />
            </div>
            <DetailMyTaskModal
                open={openedModal}
                onCancel={() => handlersModal.close()}
                width={600}
                DetailData={detail}
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
export default TaskStudentListPage;
