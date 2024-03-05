import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import {
    DATE_FORMAT_DISPLAY,
    DATE_FORMAT_END_OF_DAY_TIME,
    DATE_FORMAT_ZERO_TIME,
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
    UserTypes,
    storageKeys,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { TaskLogKindOptions, archivedOption } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { Button, Modal, Tag } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';
import style from '../member.module.scss';
import { IconAlarm, IconAlarmOff, IconBug } from '@tabler/icons-react';
import { ReloadOutlined } from '@ant-design/icons';
import { showSucsessMessage } from '@services/notifyService';
import { FormattedMessage } from 'react-intl';
import { FieldTypes } from '@constants/formConfig';
import styles from '@modules/projectManage/project/project.module.scss';
import { useDispatch } from 'react-redux';
import { hideAppLoading, showAppLoading } from '@store/actions/app';
import useDisclosure from '@hooks/useDisclosure';
import DetailMyTaskProjectModal from '../../projectStudent/myTask/DetailMyTaskProjectModal';
import { getData } from '@utils/localStorage';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import feature from '@assets/images/feature.png';
import bug from '@assets/images/bug.jpg';
import reset from '@assets/images/reset.svg';
import noReset from '@assets/images/not_reset.svg';
import { convertUtcToLocalTime, formatDateString } from '@utils';
import dayjs from 'dayjs';
const message = defineMessages({
    objectName: 'Hoạt động của tôi',
    reminderMessage: 'Vui lòng chọn dự án !',
    gitCommitUrl: 'Đường dẫn commit git',
    title: 'Bạn có xác nhận đặt lại thời gian?',
    ok: 'Đồng ý',
    cancel: 'Huỷ',
    resetSuccess: 'Đặt lại thời gian thành công!',
    reset: 'Đặt lại thời gian thành công',
});

function MemberActivityProjectListPage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const studentId = queryParameters.get('studentId');
    const studentName = queryParameters.get('studentName');
    const archived = queryParameters.get('archived');
    const dispatch = useDispatch();
    const notification = useNotification();
    const KindTaskLog = translate.formatKeys(TaskLogKindOptions, ['label']);
    const archivedOptions = translate.formatKeys(archivedOption, ['label']);

    const pathPrev = localStorage.getItem('pathPrev');
    const [detail, setDetail] = useState({});
    const [openedModal, handlersModal] = useDisclosure(false);
    const { execute } = useFetch(apiConfig.projectTaskLog.archiveAll);
    const { execute: executeGet, loading: loadingDetail } = useFetch(apiConfig.projectTask.getById, {
        immediate: false,
    });
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.projectTaskLog,
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
                    mixinFuncs.handleFetchList({ ...params, studentId, projectId, studentName: null });
                };
                funcs.changeFilter = (filter) => {
                    const projectId = queryParams.get('projectId');
                    const studentId = queryParams.get('studentId');
                    const studentName = queryParams.get('studentName');
                    mixinFuncs.setQueryParams(serializeParams({ projectId, studentId, studentName, ...filter }));
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
    const handleOnClickReview = (url) => {
        const pattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
        if (pattern.test(url)) {
            window.open(url, '_blank');
        } else {
            notification({
                type: 'warning',
                message: translate.formatMessage(commonMessage.warningUrl),
            });
        }
    };
    const handleFetchDetail = (id) => {
        dispatch(showAppLoading());
        executeGet({
            pathParams: { id: id },
            onCompleted: (response) => {
                setDetail(response.data);
                dispatch(hideAppLoading());
                handlersModal.open();
            },
            onError: mixinFuncs.handleGetDetailError,
        });
    };

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
            title: translate.formatMessage(commonMessage.kind),
            dataIndex: ['projectTaskInfo', 'kind'],
            align: 'center',
            width: 80,
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
            dataIndex: ['projectTaskInfo', 'taskName'],
            render: (task, dataRow) => {
                return (
                    <div
                        onClick={() => handleFetchDetail(dataRow?.projectTaskInfo?.id)}
                        style={{ cursor: 'pointer', color: 'rgb(24, 144, 255)' }}
                    >
                        {task}
                    </div>
                );
            },
        },
        {
            title: translate.formatMessage(message.gitCommitUrl),
            dataIndex: 'gitCommitUrl',
            align: 'center',
            width: 200,
            render: (gitUrl) => {
                return (
                    <div className={style.customDiv} onClick={() => handleOnClickReview(gitUrl)}>
                        <BaseTooltip title={gitUrl}>Review</BaseTooltip>
                    </div>
                );
            },
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
            width: 150,
            render(dataRow) {
                const kindLog = KindTaskLog.find((item) => item.value == dataRow);
                return (
                    <Tag color={kindLog.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{kindLog.label}</div>
                    </Tag>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.reset),
            dataIndex: ['archived'],
            align: 'center',
            width: 80,
            render(dataRow) {
                if (dataRow === 1)
                    return (
                        <div>
                            <img src={reset} height="30px" width="30px" />
                        </div>
                    );
                if (dataRow === 0)
                    return (
                        <div>
                            <img src={noReset} height="30px" width="30px" />
                        </div>
                    );
            },
        },
    ].filter(Boolean);
    const { data: timeSum, execute: executeGetTime } = useFetch(apiConfig.projectTaskLog.getSum, {
        immediate: false,
        params: { projectId, studentId },
        mappingData: ({ data }) => data.content,
    });

    useEffect(() => {
        executeGetTime({ params: { archived: archived, projectId, studentId } });
    }, [archived]);

    const searchFields = [
        {
            key: 'archived',
            placeholder: <FormattedMessage defaultMessage={'Archived'} />,
            type: FieldTypes.SELECT,
            options: archivedOptions,
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
    ].filter(Boolean);
    const initialFilterValues = useMemo(() => {
        const initialFilterValues = {
            ...queryFilter,
            fromDate: queryFilter.fromDate && dayjs(formatDateToLocal(queryFilter.fromDate), DEFAULT_FORMAT),
            toDate:
                queryFilter.toDate && dayjs(formatDateToLocal(queryFilter.toDate), DEFAULT_FORMAT).subtract(7, 'hour'),
        };

        return initialFilterValues;
    }, [queryFilter?.fromDate, queryFilter?.toDate]);

    const handleAchiveAll = () => {
        Modal.confirm({
            title: translate.formatMessage(message.title),
            content: '',
            okText: translate.formatMessage(message.ok),
            cancelText: translate.formatMessage(message.cancel),
            onOk: () => {
                execute({
                    data: { projectId, devId: studentId },
                    onCompleted: () => {
                        showSucsessMessage(translate.formatMessage(message.reset));
                        executeGetTime();
                        mixinFuncs.getList();
                    },
                });
            },
        });
    };
    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.project),
                    path:
                        getData(storageKeys.USER_KIND) === UserTypes.MANAGER
                            ? routes.projectListPage.path
                            : routes.projectLeaderListPage.path,
                },
                {
                    breadcrumbName:
                        getData(storageKeys.USER_KIND) === UserTypes.MANAGER
                            ? translate.formatMessage(commonMessage.generalManage)
                            : translate.formatMessage(commonMessage.member),
                    path:
                        getData(storageKeys.USER_KIND) === UserTypes.MANAGER
                            ? routes.projectTabPage.path + pathPrev
                            : routes.projectLeaderMemberListPage.path + pathPrev,
                },
                { breadcrumbName: translate.formatMessage(commonMessage.memberActivity) },
            ]}
        >
            <ListPage
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                        <span style={{ fontWeight: 'normal' }}>{studentName}</span>
                        <span>
                            {mixinFuncs.hasPermission(apiConfig.projectTaskLog.archiveAll.baseURL) && (
                                <Button onClick={handleAchiveAll} style={{ marginRight: '1rem' }}>
                                    <BaseTooltip title={translate.formatMessage(message.reset)}>
                                        <ReloadOutlined />
                                    </BaseTooltip>
                                </Button>
                            )}

                            <span style={{ marginLeft: '5px' }}>
                                <IconAlarm style={{ marginBottom: '-5px' }} /> :{' '}
                                <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                                    {timeSum ? Math.ceil((timeSum[0]?.totalTimeWorking / 60) * 10) / 10 : 0}h
                                    <span style={{ fontWeight: 'bold', fontSize: '17px', marginLeft: '15px' }}>| </span>
                                </span>
                            </span>
                            <span style={{ marginLeft: '10px' }}>
                                <IconAlarmOff style={{ marginBottom: '-5px', color: 'red' }} /> :{' '}
                                <span style={{ fontWeight: 'bold', fontSize: '17px' }}>
                                    {timeSum ? Math.ceil((timeSum[0]?.totalTimeOff / 60) * 10) / 10 : 0}h
                                </span>
                                <span style={{ fontWeight: 'bold', fontSize: '17px', marginLeft: '15px' }}>| </span>
                            </span>
                            <span style={{ marginLeft: '10px' }}>
                                <IconBug style={{ marginBottom: '-5px', color: 'red' }} /> :{' '}
                                <span style={{ fontWeight: 'bold', fontSize: '17px', color: 'red' }}>
                                    {timeSum ? Math.ceil((timeSum[0]?.totalTimeBug / 60) * 10) / 10 : 0}h
                                </span>
                            </span>
                        </span>
                    </div>
                }
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    className: styles.search,
                    initialValues: initialFilterValues,
                })}
                baseTable={
                    <div>
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
            <DetailMyTaskProjectModal open={openedModal} onCancel={() => handlersModal.close()} DetailData={detail} />
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

export default MemberActivityProjectListPage;
