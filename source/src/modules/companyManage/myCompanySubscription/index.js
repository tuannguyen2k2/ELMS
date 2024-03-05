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
import { Avatar, Button, Flex, Tag } from 'antd';
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
import useAuth from '@hooks/useAuth';
import routes from '@routes';
import { PlusOutlined } from '@ant-design/icons';
import Title from 'antd/es/skeleton/Title';
import { useSelector } from 'react-redux';
import { settingSystemSelector } from '@selectors/app';
import useMoneyUnit from '@hooks/useMoneyUnit';

const message = defineMessages({
    objectName: 'Gói dịch vụ',
});

const CompanySubscriptionListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const [companyOptions, setCompanyOptions] = useState([]);
    const navigate = useNavigate();
    const { profile } = useAuth();
    const companyId = profile.id;
    const moneyUnit = useMoneyUnit();

    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: {
            getList: apiConfig.serviceCompanySubscription.getMyService,
            create: apiConfig.serviceCompanySubscription.create,
            update: apiConfig.serviceCompanySubscription.update,
            delete: apiConfig.serviceCompanySubscription.delete,
        },
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
            // funcs.prepareGetListParams = () => {
            //     return navigate(routes.myCompanySubscriptionListPage.path + `?companyId=${profile.id}`);
            // };
            funcs.getCreateLink = () => {
                if (profile?.id !== null) {
                    return `${pagePath}/create?companyId=${profile.id}`;
                }
                return `${pagePath}/create`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}?companyId=${profile.id}`;
            };
        },
    });

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
    ];

    const searchFields = [
        {
            key: 'serviceName',
            placeholder: translate.formatMessage(commonMessage.ServiceCompanySubscriptionName),
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
        mappingData: ({ data }) =>
            data.content.map((item) => ({
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
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.serviceCompanySubscription) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFiter })}
                actionBar={<Flex align="center" justify="space-between" style={{ marginBottom: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Button
                            type="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(routes.buyServiceListPage.path);
                            }}
                            style={{ width: '150px', marginLeft: 'auto' }}
                        >
                            <PlusOutlined /> <FormattedMessage defaultMessage="Mua dịch vụ" />
                        </Button>
                    </div>
                </Flex>}
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
