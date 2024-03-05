import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { DEFAULT_TABLE_ITEM_SIZE, AppConstants } from '@constants/index';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { DATE_DISPLAY_FORMAT, DATE_FORMAT_DISPLAY } from '@constants';
import { formatMoney } from '@utils/index';
import { settingKeyName, statusOptions } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import { useState } from 'react';
import { useEffect } from 'react';
import useFetch from '@hooks/useFetch';
import { render } from '@testing-library/react';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import { useSelector } from 'react-redux';
import { settingSystemSelector } from '@selectors/app';
import useMoneyUnit from '@hooks/useMoneyUnit';

const message = defineMessages({
    objectName: 'đăng ký gói',
});

const CompanySubscriptionListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const companyId = queryParameters.get('companyId');
    const moneyUnit = useMoneyUnit();
    const [companyOptions, setCompanyOptions] = useState([]);
    // const companyOptions =[];
    // const companyValues = translate.formatKeys(companyOptions, ['label']);

    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: apiConfig.companySubscription,
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
                if (companyId !== null) {
                    return `${pagePath}/create?companyId=${companyId}`;
                }
                return `${pagePath}/create`;
            };
        },

    });
    const columns = [
        {
            title: '#',
            dataIndex: ['company', 'logo'],
            align: 'center',
            width: 80,
            render: (logo) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={logo ? `${AppConstants.contentRootUrl}${logo}` : null}
                />
            ),
        },
        {
            title: <FormattedMessage defaultMessage="Tên công ty" />,
            dataIndex: ['company', 'companyName'],
        },
        {
            title: <FormattedMessage defaultMessage="Gói dịch vụ" />,
            dataIndex: ['subscription', 'name'],
        },
        {
            title: <FormattedMessage defaultMessage="Giá dịch vụ" />,
            dataIndex: 'money',
            width: 150,
            align: 'right',
            render: (money) => {
                const formattedValue = formatMoney(money, {
                    currentcy: moneyUnit,
                    currentDecimal: '0',
                    groupSeparator: ',',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Giảm giá" />,
            dataIndex: 'saleOff',
            width: '100px',
            render: (saleOff) => {
                const formattedValue = formatMoney(saleOff, {
                    currentcy: '%',
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
            align: 'center',
        },
        {
            title: <FormattedMessage defaultMessage="Tiền thanh toán" />,
            dataIndex: 'totalAmount',
            width: 150,
            align: 'right',
            render: (text, record) => {
                const priceTotal = record.money;
                const sale = record.saleOff;
                if ( sale ) { var totalAmount = priceTotal - (priceTotal * sale / 100); }
                else  
                    totalAmount = priceTotal;
                const formattedValue = formatMoney(totalAmount, {
                    currentcy: moneyUnit,
                    currentDecimal: '0',
                    groupSeparator: ',',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            width: 140,
            render: (startDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(startDate, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                    </div>
                );
            },
            align: 'center',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            width: 140,
            render: (endDate) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(endDate, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                    </div>
                );
            },
            align: 'center',
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'companyId',
            placeholder: translate.formatMessage(commonMessage.companyName),
            type: FieldTypes.SELECT,
            options: companyOptions,

        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];
    const {
        data: companys,
        // loading: getcompanyLoading,
        execute: executescompanys,
    } = useFetch(apiConfig.company.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({
            value: item.id,
            label: item.companyName,
        })),
    });
    useEffect(() => {
        // Kiểm tra xem có dữ liệu trong companys không và không phải là trạng thái loading
        if (companys) {
            setCompanyOptions(companys);
        }
    }, [companys]);

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(commonMessage.companySubscription) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFiter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            ></ListPage>
        </PageWrapper>
    );
};
export default CompanySubscriptionListPage;
