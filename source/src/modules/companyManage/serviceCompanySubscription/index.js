import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants/index';
import { formatMoney } from '@utils/index';
import { FieldTypes } from '@constants/formConfig';
import { settingKeyName, statusOptions } from '@constants/masterData';
import { commonMessage } from '@locales/intl';
import { useSelector } from 'react-redux';
import { settingSystemSelector } from '@selectors/app';
import useMoneyUnit from '@hooks/useMoneyUnit';

const message = defineMessages({
    objectName: 'gói dịch vụ',
    name: 'Tên dịch vụ',
    valueable: 'Số ngày sử dụng',
});

const ServiceCompanySubListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: apiConfig.serviceCompanySubscription,
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
        },
    });
    const moneyUnit = useMoneyUnit();

    const columns = [
        {
            title: <FormattedMessage defaultMessage="Tên dịch vụ" />,
            dataIndex: 'name',
        },
        {
            title: <FormattedMessage defaultMessage="Giá" />,
            dataIndex: 'price',
            width: 150,
            align: 'right',
            render: (price) => {
                const formattedValue = formatMoney(price, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: moneyUnit,
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Giảm giá" />,
            align: 'center',
            dataIndex: 'saleOff',
            width: 130,
            render: (saleOff) => {
                if (saleOff > 0) {
                    return <div>{saleOff} %</div>;
                } else return <div>{saleOff}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Tiền thanh toán" />,
            dataIndex: 'totalAmount',
            width: 150,
            align: 'right',
            render: (text, record) => {
                const totalPrice = record.price;
                const saleOff = record.saleOff;
                if (saleOff) {
                    var totalAmount = totalPrice - totalPrice * (saleOff / 100);
                } else totalAmount = totalPrice;
                const formattedValue = formatMoney(totalAmount, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: moneyUnit,
                    currentDecimal: '0',
                });

                return <div>{formattedValue}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Số ngày sử dụng" />,
            dataIndex: 'valueable',
            width: 150,
            align: 'center',
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ task: true, edit: true, delete: true }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.ServiceCompanySubscriptionName),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];
    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(commonMessage.serviceCompanySubscription) },
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
export default ServiceCompanySubListPage;
