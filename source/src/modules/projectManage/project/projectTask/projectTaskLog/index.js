import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import {
    DEFAULT_TABLE_ITEM_SIZE,
    DEFAULT_FORMAT,
    DATE_FORMAT_DISPLAY,
    DATE_FORMAT_ZERO_TIME,
    DATE_FORMAT_END_OF_DAY_TIME,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { Tag } from 'antd';
import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { commonMessage } from '@locales/intl';
import { TaskLogKindOptions } from '@constants/masterData';
import styles from './projectTaskLog.module.scss';
import useNotification from '@hooks/useNotification';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { RightOutlined } from '@ant-design/icons';
import {
    convertLocalTimeToUtc,
    convertUtcToLocalTime,
    deleteSearchFilterInLocationSearch,
    formatDateString,
} from '@utils';
import { FieldTypes } from '@constants/formConfig';
import dayjs from 'dayjs';
const message = defineMessages({
    objectName: 'Nhật ký',
    gitCommitUrl: 'Đường dẫn commit git',
    warningUrl: `Đường dẫn không hợp lệ !`,
});

function ProjectTaskLogListPage({ setBreadCrumbName, renderAction, createPermission }) {
    const translate = useTranslate();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const taskName = queryParameters.get('task');
    const projectName = queryParameters.get('projectName');

    const KindTaskLog = translate.formatKeys(TaskLogKindOptions, ['label']);
    const state = location?.state?.prevPath;
    const search = useMemo(() => {
        return location.search;
    }, []);
    const notification = useNotification();
    const navigate = useNavigate();
    const paramHead = routes.projectListPage.path;
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
                funcs.getCreateLink = () => {
                    return `${pagePath}/create${search}`;
                };
                funcs.getItemDetailLink = (dataRow) => {
                    return `${pagePath}/${dataRow.id}${search}`;
                };
                funcs.getList = () => {
                    const params = mixinFuncs.prepareGetListParams(queryFilter);
                    mixinFuncs.handleFetchList({
                        ...params,
                        projectName: null,
                        taskName: null,
                        active: null,
                        task: null,
                    });
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
                funcs.changeFilter = (filter) => {
                    const projectId = queryParams.get('projectId');
                    const projectName = queryParams.get('projectName');
                    const projectTaskId = queryParams.get('projectTaskId');
                    const task = queryParams.get('task');
                    const active = queryParams.get('active');
                    mixinFuncs.setQueryParams(
                        serializeParams({ projectId, projectName, projectTaskId, task, active, ...filter }),
                    );
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
    const columns = [
        {
            title: translate.formatMessage(commonMessage.createdDate),
            width: 180,
            dataIndex: 'createdDate',
            align: 'center',
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.message),
            dataIndex: 'message',
        },
        {
            title: translate.formatMessage(message.gitCommitUrl),
            dataIndex: 'gitCommitUrl',
            width: 180,
            render: (gitUrl) => {
                return (
                    gitUrl && (
                        <div className={styles.customDiv} onClick={() => handleOnClickReview(gitUrl)}>
                            <BaseTooltip title={gitUrl}>Review</BaseTooltip>
                        </div>
                    )
                );
            },
        },

        {
            title: translate.formatMessage(commonMessage.modifiedDate),
            width: 180,
            dataIndex: 'modifiedDate',
            render: (modifiedDate) => {
                const modifiedDateLocal = convertUtcToLocalTime(modifiedDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{modifiedDateLocal}</div>;
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
        renderAction === false ? '' : mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ].filter(Boolean);

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
        <PageWrapper
            routes={
                setBreadCrumbName
                    ? setBreadCrumbName(['fromDate', 'toDate'])
                    : routes.ProjectTaskLogListPage.breadcrumbs(
                        commonMessage,
                        paramHead,
                        routes.projectTabPage.path,
                        deleteSearchFilterInLocationSearch(search, ['fromDate', 'toDate']),
                        true,
                    )
            }
        >
            <div>
                <ListPage
                    title={
                        <span
                            style={{
                                fontWeight: 'normal',
                                fontSize: '16px',
                            }}
                        >
                            {projectName} <RightOutlined /> {taskName}
                        </span>
                    }
                    searchForm={mixinFuncs.renderSearchForm({
                        fields: searchFields,
                        className: styles.search,
                        initialValues: initialFilterValues,
                    })}
                    actionBar={mixinFuncs.renderActionBar()}
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
export default ProjectTaskLogListPage;
