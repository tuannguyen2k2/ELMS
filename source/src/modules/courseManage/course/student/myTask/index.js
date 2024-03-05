import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { taskState } from '@constants/masterData';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { Tag } from 'antd';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import DetailMyTaskModal from './DetailMyTaskModal';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import routes from '@routes';
import { CalendarOutlined } from '@ant-design/icons';
import { IconBellRinging } from '@tabler/icons-react';
import useNotification from '@hooks/useNotification';
const message = defineMessages({
    objectName: 'My Task',
    myTask: 'Task của tôi',
});

function MyTaskStudentListPage() {
    const translate = useTranslate();
    const stateValues = translate.formatKeys(taskState, ['label']);
    const [openedModal, handlersModal] = useDisclosure(false);
    const [detail, setDetail] = useState({});
    const navigate = useNavigate();
    const notification = useNotification();
    const [listNotified, setListNotified] = useState([]);
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
    };
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
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
                taskLog: ({ id, course, lecture }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.taskLog)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                    routes.MyTaskLogStudentListPage.path +
                                        `?courseId=${course.id}&courseName=${course.name}&taskId=${id}&taskName=${lecture.lectureName}`,
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
        },
    });

    const setColumns = () => {
        const columns = [
            {
                title: translate.formatMessage(commonMessage.task),
                dataIndex: ['lecture', 'lectureName'],
            },
            {
                title: translate.formatMessage(commonMessage.courseName),
                dataIndex: ['course', 'name'],
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
                    const state = stateValues.find((item) => item.value == dataRow);
                    return (
                        <Tag color={state.color}>
                            <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                        </Tag>
                    );
                },
            },
            mixinFuncs.renderActionColumn({ notifyDone: true, taskLog: true }, { width: '150px' }),
        ];
        return columns;
    };

    const { data: courses, execute: executescourses } = useFetch(apiConfig.course.getListStudentCourse, {
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
            placeholder: translate.formatMessage(commonMessage.courseName),
            type: FieldTypes.SELECT,
            options: courses,
        },
        {
            key: 'taskState',
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
                            columns={setColumns()}
                        />
                    }
                />
                <DetailMyTaskModal
                    open={openedModal}
                    onCancel={() => handlersModal.close()}
                    width={600}
                    DetailData={detail}
                />
            </div>
        </PageWrapper>
    );
}

export default MyTaskStudentListPage;
