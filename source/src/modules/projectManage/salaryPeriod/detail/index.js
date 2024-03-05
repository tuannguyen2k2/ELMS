import { UserOutlined } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { salaryPeriodState } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { Button, Tag } from 'antd';
import AvatarField from '@components/common/form/AvatarField';
import { FieldTypes } from '@constants/formConfig';
const message = defineMessages({
    objectName: 'Chi tiết kỳ lương',
});
const SalaryPeriodDetailListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const salaryPeriodId = queryParameters.get('salaryPeriodId');
    const stateValues = translate.formatKeys(salaryPeriodState, ['label']);
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.salaryPeriodDetail,
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
                    return `${routes.salaryPeriodDetailListPage.path}/create?salaryPeriodId=${salaryPeriodId}`;
                };
                funcs.changeFilter = (filter) => {
                    const salaryPeriodId = queryParams.get('salaryPeriodId');
                    mixinFuncs.setQueryParams(serializeParams({ salaryPeriodId, ...filter }));
                };
            },
        });

    const convertDate = (date) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
        return convertDateTimeToString(dateConvert, DEFAULT_FORMAT);
    };

    const searchFields = [
        {
            key: 'developerId',
            placeholder: <FormattedMessage defaultMessage={'Tên lập trình viên'} />,
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.developer.autocomplete,
            mappingOptions: (item) => ({
                value: item.id,
                label: item.studentInfo.fullName,
            }),
            searchParams: (text) => ({ name: text }),
        },
        {
            key: 'projectId',
            placeholder: <FormattedMessage defaultMessage={'Tên dự án'} />,
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.project.autocomplete,
            mappingOptions: (item) => ({
                value: item.id,
                label: item.name,
            }),
            searchParams: (text) => ({ name: text }),
        },
    ].filter(Boolean);
    const columns = [
        {
            title: '#',
            dataIndex: ['developer', 'studentInfo', 'avatar'],
            align: 'center',
            width: 80,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: translate.formatMessage(commonMessage.developer),
            dataIndex: ['developer', 'studentInfo', 'fullName'],
        },
        {
            title: translate.formatMessage(commonMessage.project),
            dataIndex: ['project', 'name'],
            width: 320,
        },
        {
            title: translate.formatMessage(commonMessage.salary),
            dataIndex: 'salary',
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.totalTimeWorking),
            dataIndex: 'totalTimeWorking',
            align: 'center',
            width: 200,
            render(totalTimeWorking) {
                if (totalTimeWorking) return <div>{Math.ceil((totalTimeWorking / 60) * 10) / 10} h</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.totalTimeOff),
            dataIndex: 'totalTimeOff',
            align: 'center',
            width: 180,
            render(totalTimeOff) {
                if (totalTimeOff) return <div>{Math.ceil((totalTimeOff / 60) * 10) / 10} h</div>;
            },
        },

        mixinFuncs.renderActionColumn(
            {
                delete: true,
            },
            { width: '120px' },
        ),
    ].filter(Boolean);

    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.salaryPeriod),
            path: routes.salaryPeriodListPage.path,
        },
        {
            breadcrumbName: translate.formatMessage(message.objectName),
        },
    ];
    return (
        <PageWrapper routes={breadcrumbs}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
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

export default SalaryPeriodDetailListPage;
