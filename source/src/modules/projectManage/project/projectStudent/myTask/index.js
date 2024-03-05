import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { projectTaskState } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { Tag } from 'antd';
import React from 'react';
import useFetch from '@hooks/useFetch';
import { FieldTypes } from '@constants/formConfig';
import { commonMessage } from '@locales/intl';
import useAuth from '@hooks/useAuth';
import { EyeOutlined } from '@ant-design/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { Button } from 'antd';
import { FormattedMessage, defineMessages } from 'react-intl';
import useDisclosure from '@hooks/useDisclosure';
import { useState } from 'react';
import DetailMyTaskProjectModal from './DetailMyTaskProjectModal';
import { CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import routes from '@routes';
import feature from '../../../../../assets/images/feature.png';
import bug from '../../../../../assets/images/bug.jpg';
import { IconBellRinging } from '@tabler/icons-react';
import useNotification from '@hooks/useNotification';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
const message = defineMessages({
    objectName: 'Task',
    myTask: 'Task của tôi',
    createTaskLog: 'Tạo task log',
});

function ProjectStudentMyTaskListPage() {
    const translate = useTranslate();
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const [openedModal, handlersModal] = useDisclosure(false);
    const [detail, setDetail] = useState({});
    const [listNotified, setListNotified] = useState([]);
    const { profile } = useAuth();
    const navigate = useNavigate();
    const notification = useNotification();
    const { data: projects } = useFetch(apiConfig.project.getListStudent, {
        immediate: true,
        mappingData: ({ data }) => {
            return data.content
                .map((item) => {
                    if (item.state !== 1) {
                        return {
                            value: item.id,
                            label: item.name,
                        };
                    } else {
                        return null;
                    }
                })
                .filter((item) => item !== null);
        },
    });
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
                funcs.getList = () => {
                    const params = mixinFuncs.prepareGetListParams(queryFilter);
                    if (profile) {
                        mixinFuncs.handleFetchList({ ...params, developerId: profile?.id });
                    }
                };
                funcs.additionalActionColumnButtons = () => ({
                    taskLog: ({ id, taskName, project }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.taskLog)}>
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        routes.myProjectStudentTaskLogPage.path +
                                            `?projectId=${project.id}&projectName=${project.name}&projectTaskId=${id}&task=${taskName}`,
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
            title: translate.formatMessage(commonMessage.task),
            dataIndex: 'taskName',
        },
        {
            title: translate.formatMessage(commonMessage.projectName),
            dataIndex: ['project', 'name'],
            width: 150,
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
            { notifyDone: true, taskLog: true, edit: false, delete: true },
            { width: '150px' },
        ),
    ].filter(Boolean);

    const searchFields = [
        {
            key: 'projectId',
            placeholder: translate.formatMessage(commonMessage.projectName),
            type: FieldTypes.SELECT,
            options: projects,
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
        },
    ];
    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(message.myTask) }]}>
            <div>
                <ListPage
                    searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                    baseTable={
                        <BaseTable
                            onRow={(record, rowIndex) => ({
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
export default ProjectStudentMyTaskListPage;
