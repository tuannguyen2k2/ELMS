import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { FileSearchOutlined } from '@ant-design/icons';
import { DATE_FORMAT_DISPLAY, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { salaryPeriodState, statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styles from './salaryPeriod.module.scss';
import { BsWrenchAdjustableCircle } from 'react-icons/bs';
import { TbReportMoney } from 'react-icons/tb';
import { GrMoney } from 'react-icons/gr';
import useNotification from '@hooks/useNotification';
import { Button, Tag } from 'antd';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import useFetch from '@hooks/useFetch';
const message = defineMessages({
    objectName: 'Kỳ lương',
});
const SalaryPeriodListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const stateValues = translate.formatKeys(salaryPeriodState, ['label']);
    const { execute: executeFixSalary } = useFetch(apiConfig.income.fixSalary);
    const { execute: executeProjectSalary } = useFetch(apiConfig.income.projectSalary);
    const { execute: executeGeneratePeriodDetail } = useFetch(apiConfig.income.generatePeriodDetail);
    const notification = useNotification();
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.salaryPeriod,
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
                funcs.additionalActionColumnButtons = () => ({
                    fixSalary: ({ id, process }) => {
                        const processJson = process && JSON.parse(process);
                        return (
                            <BaseTooltip title={translate.formatMessage(commonMessage.fixSalary)}>
                                <Button
                                    disabled={processJson?.fixSalaryState}
                                    type="link"
                                    style={{ padding: 0, display: 'table-cell', verticalAlign: 'middle' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        executeFixSalary({
                                            data: {
                                                salaryPeriodId: id,
                                            },
                                            onCompleted: () => {
                                                notification({
                                                    type: 'success',
                                                    message: translate.formatMessage(commonMessage.fixSalarySuccess),
                                                });
                                                mixinFuncs.getList();
                                            },
                                            onError: (error) => {
                                                notification({ type: 'error', message: error?.message });
                                            },
                                        });
                                    }}
                                >
                                    <BsWrenchAdjustableCircle size={17} />
                                </Button>
                            </BaseTooltip>
                        );
                    },
                    projectSalary: ({ id, process }) => {
                        const processJson = process && JSON.parse(process);
                        return (
                            <BaseTooltip title={translate.formatMessage(commonMessage.projectSalary)}>
                                <Button
                                    disabled={processJson?.projectSalaryState}
                                    type="link"
                                    style={{ padding: 0, display: 'table-cell', verticalAlign: 'middle' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        executeProjectSalary({
                                            data: {
                                                salaryPeriodId: id,
                                            },
                                            onCompleted: () => {
                                                notification({
                                                    type: 'success',
                                                    message: translate.formatMessage(
                                                        commonMessage.projectSalarySuccess,
                                                    ),
                                                });
                                                mixinFuncs.getList();
                                            },
                                            onError: (error) => {
                                                notification({ type: 'error', message: error?.message });
                                            },
                                        });
                                    }}
                                >
                                    <TbReportMoney size={19} />
                                </Button>
                            </BaseTooltip>
                        );
                    },
                    generatePeriodDetail: ({ id, process }) => {
                        const processJson = process && JSON.parse(process);
                        return (
                            <BaseTooltip title={translate.formatMessage(commonMessage.generatePeriodDetail)}>
                                <Button
                                    disabled={processJson?.generatePeriodDetail}
                                    type="link"
                                    style={{ padding: 0, display: 'table-cell', verticalAlign: 'middle' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        executeGeneratePeriodDetail({
                                            data: {
                                                salaryPeriodId: id,
                                            },
                                            onCompleted: () => {
                                                notification({
                                                    type: 'success',
                                                    message: translate.formatMessage(
                                                        commonMessage.generatePeriodDetailSuccess,
                                                    ),
                                                });
                                                mixinFuncs.getList();
                                            },
                                            onError: (error) => {
                                                notification({ type: 'error', message: error?.message });
                                            },
                                        });
                                    }}
                                >
                                    <GrMoney size={17} />
                                </Button>
                            </BaseTooltip>
                        );
                    },
                });
            },
        });

    const convertDate = (date, format = DEFAULT_FORMAT, addHour = 0) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT).add(addHour, 'hour');
        return convertDateTimeToString(dateConvert, format);
    };

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.salaryPeriodName),
        },
    ].filter(Boolean);
    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(routes.salaryPeriodDetailListPage.path + `?salaryPeriodId=${record.id}`);
    };

    const columns = [
        {
            title: translate.formatMessage(commonMessage.salaryPeriodName),
            dataIndex: 'name',
            width: 300,
            render: (name, record) => {
                const processJson = JSON.parse(record?.process);
                let active = false;
                if (processJson.fixSalaryState && processJson.projectSalaryState && processJson.generatePeriodDetail) {
                    active = true;
                }
                return (
                    <div
                        onClick={(event) => active && handleOnClick(event, record)}
                        className={active && styles.customDiv}
                    >
                        {name}
                    </div>
                );
            },
        },
        {
            title: translate.formatMessage(commonMessage.startDate),
            dataIndex: 'start',
            render: (startDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(startDate, DATE_FORMAT_DISPLAY)}</div>
                );
            },
            width: 180,
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.endDate),
            dataIndex: 'end',
            render: (endDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(endDate, DATE_FORMAT_DISPLAY)}</div>
                );
            },
            width: 180,
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            render: (createdDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(createdDate, DEFAULT_FORMAT, 7)}</div>
                );
            },
            width: 180,
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
            {
                fixSalary: true,
                projectSalary: true,
                generatePeriodDetail: true,
            },
            { width: '150px', title: translate.formatMessage(commonMessage.calculateSalaryPeriod) },
        ),
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: '90px' },
        ),
    ].filter(Boolean);

    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(message.objectName),
        },
    ];
    return (
        <PageWrapper routes={breadcrumbs}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: queryFilter,
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
        </PageWrapper>
    );
};

export default SalaryPeriodListPage;
