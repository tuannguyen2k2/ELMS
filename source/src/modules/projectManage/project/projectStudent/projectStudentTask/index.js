import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import {
    DATE_FORMAT_DISPLAY,
    DATE_FORMAT_END_OF_DAY_TIME,
    DATE_FORMAT_ZERO_TIME,
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { projectTaskState } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Tag } from 'antd';
import React, { useMemo } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { commonMessage } from '@locales/intl';
import { Button } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import styles from '@modules/projectManage/project/project.module.scss';

import useFetch from '@hooks/useFetch';
import { FieldTypes } from '@constants/formConfig';
import DetailMyTaskProjectModal from '../myTask/DetailMyTaskProjectModal';
import useDisclosure from '@hooks/useDisclosure';
import { useState } from 'react';
import feature from '../../../../../assets/images/feature.png';
import bug from '../../../../../assets/images/bug.jpg';
import useNotification from '@hooks/useNotification';
import { IconBellRinging } from '@tabler/icons-react';
import { convertLocalTimeToUtc, convertUtcToLocalTime, formatDateString } from '@utils';
import dayjs from 'dayjs';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
const message = defineMessages({
    objectName: 'Task',
    developer: 'Lập trình viên',
    home: 'Trang chủ',
    state: 'Tình trạng',
    projectTask: 'Task',
    project: 'Dự án',
    leader: 'Leader',
    name: 'Tên task',
    status: 'Trạng thái',
});

function ProjectStudentTaskListPage() {
    const translate = useTranslate();
    const navigate = useNavigate();

    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);

    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const stateProject = queryParameters.get('stateProject');

    const leaderName = queryParameters.get('leaderName');
    const developerName = queryParameters.get('developerName');
    const active = queryParameters.get('active');

    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const [openedModal, handlersModal] = useDisclosure(false);
    const [detail, setDetail] = useState({});
    const [listNotified, setListNotified] = useState([]);
    const notification = useNotification();

    const { execute: executeGet, loading: loadingDetail } = useFetch(apiConfig.projectTask.getById, {
        immediate: false,
    });
    const { execute: executeNotifyDone } = useFetch(apiConfig.projectTask.notifyDone, { immediate: false });
    const handleFetchDetail = (id) => {
        executeGet({
            pathParams: { id: id },
            onCompleted: (response) => {
                setDetail(response.data);
            },
            onError: mixinFuncs.handleGetDetailError,
        });
    };
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.projectTask,
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                funcs.mappingData = (response) => {
                    if (response.result === true) {
                        return {
                            data: response.data.content,
                            total: response.data.totalElements,
                        };
                    }
                };
                funcs.getCreateLink = () => {
                    return `${pagePath}/create?projectId=${projectId}&projectName=${projectName}&active=${active}`;
                };
                funcs.getItemDetailLink = (dataRow) => {
                    return `${pagePath}/${dataRow.id}?projectId=${projectId}&projectName=${projectName}&active=${active}`;
                };
                funcs.changeFilter = (filter) => {
                    const projectId = queryParams.get('projectId');
                    const projectName = queryParams.get('projectName');
                    const developerName = queryParams.get('developerName');
                    const leaderName = queryParams.get('leaderName');
                    const stateProject = queryParams.get('stateProject');
                    let filterAdd;
                    if (developerName) {
                        filterAdd = { developerName };
                    } else if (leaderName) {
                        filterAdd = { leaderName };
                    }
                    if (filterAdd) {
                        mixinFuncs.setQueryParams(
                            serializeParams({
                                projectId: projectId,
                                projectName: projectName,
                                stateProject,
                                ...filterAdd,
                                ...filter,
                            }),
                        );
                    } else {
                        mixinFuncs.setQueryParams(
                            serializeParams({
                                projectId: projectId,
                                projectName: projectName,
                                stateProject,
                                ...filter,
                            }),
                        );
                    }
                };
                funcs.getList = () => {
                    const params = mixinFuncs.prepareGetListParams(queryFilter);
                    mixinFuncs.handleFetchList({ ...params, projectName: null });
                };
                funcs.additionalActionColumnButtons = () => ({
                    taskLog: ({ id, taskName }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.taskLog)}>
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        routes.projectStudentTaskListPage.path +
                                            `/task-log?projectId=${projectId}&projectName=${projectName}&projectTaskId=${id}&task=${taskName}&active=${active}`,
                                        {
                                            state: { action: 'projectTaskLog', prevPath: location.pathname },
                                        },
                                    );
                                }}
                            >
                                <CalendarOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                    notifyDone: ({ id, state, project }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.notifyDone)}>
                            <Button
                                disabled={state != 2 || listNotified.includes(id)}
                                type="link"
                                style={{ padding: 0, position: 'relative', width: '15px', height: '32px' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    executeNotifyDone({
                                        data: {
                                            projectId: project?.id,
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
            },
        });

    const columns = [
        {
            dataIndex: 'kind',
            width: 15,
            render(dataRow) {
                if (dataRow === 1)
                    return (
                        <div>
                            <img src={feature} height="30px" width="30px" />
                        </div>
                    );
                if (dataRow === 2)
                    return (
                        <div>
                            <img src={bug} height="30px" width="30px" />
                        </div>
                    );
            },
        },
        {
            title: translate.formatMessage(message.projectTask),
            dataIndex: 'taskName',
            width: 400,
        },
        {
            title: translate.formatMessage(message.developer),
            dataIndex: ['developer', 'studentInfo', 'fullName'],
            width: 200,
            render: (_, record) => record?.developer?.studentInfo?.fullName || record?.leader?.leaderName,
        },
        {
            title: translate.formatMessage(commonMessage.projectCategory),
            dataIndex: ['projectCategoryInfo', 'projectCategoryName'],
            width: 150,
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            width: 200,
            align: 'center',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'dueDate',
            width: 200,
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
            title: 'Tình trạng',
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderActionColumn(
            { notifyDone: true, taskLog: true, edit: true, delete: true },
            { width: '150px' },
        ),
    ].filter(Boolean);

    const { data: memberProject } = useFetch(apiConfig.memberProject.autocomplete, {
        immediate: true,
        params: { projectId: projectId },
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item?.developer?.id,
                label: item?.developer?.studentInfo?.fullName,
            })),
    });

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
            key: 'projectCategoryId',
            placeholder: <FormattedMessage defaultMessage={'Danh mục'} />,
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.projectCategory.autocomplete,
            mappingOptions: (item) => ({
                value: item.id,
                label: item.projectCategoryName,
            }),
            optionsParams: { projectId: projectId },
            initialSearchParams: { projectId: projectId },
            searchParams: (text) => ({ name: text }),
        },
        {
            key: 'developerId',
            placeholder: <FormattedMessage defaultMessage={'Lập trình viên'} />,
            type: FieldTypes.SELECT,
            options: memberProject,
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
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
        // !leaderName &&
        //     !developerName && {
        //     key: 'status',
        //     placeholder: translate.formatMessage(commonMessage.status),
        //     type: FieldTypes.SELECT,
        //     options: statusValues,
        // },
    ].filter(Boolean);

    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(message.project),
                    path: generatePath(routes.projectStudentListPage.path),
                },
                { breadcrumbName: translate.formatMessage(message.projectTask) },
            ]}
        >
            <div>
                <ListPage
                    title={<span style={{ fontWeight: 'normal' }}>{projectName}</span>}
                    searchForm={mixinFuncs.renderSearchForm({
                        fields: searchFields,
                        className: styles.search,
                        initialValues: initialFilterValues,
                    })}
                    actionBar={stateProject != 3 && mixinFuncs.renderActionBar()}
                    baseTable={
                        <BaseTable
                            onRow={(record) => ({
                                onClick: (e) => {
                                    e.stopPropagation();
                                    handleFetchDetail(record.id);

                                    handlersModal.open();
                                },
                            })}
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            dataSource={data}
                            columns={columns}
                        />
                    }
                />
                <DetailMyTaskProjectModal
                    open={openedModal}
                    onCancel={() => handlersModal.close()}
                    DetailData={detail}
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
export default ProjectStudentTaskListPage;
