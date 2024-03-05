import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants/index';
import { formatMoney } from '@utils/index';
import { FieldTypes } from '@constants/formConfig';
import { settingKeyName, statusOptions } from '@constants/masterData';
import { commonMessage } from '@locales/intl';
import { generatePath } from 'react-router-dom';
import routes from '@routes';
import useAuth from '@hooks/useAuth';
import { DollarOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import useDisclosure from '@hooks/useDisclosure';
import BuyServiceModal from './BuyServiceModal';
import useFetch from '@hooks/useFetch';
import { useSelector } from 'react-redux';
import { settingSystemSelector } from '@selectors/app';
import useMoneyUnit from '@hooks/useMoneyUnit';

const message = defineMessages({
    objectName: 'gói dịch vụ',
    name: 'Tên dịch vụ',
    valueable: 'Số ngày sử dụng',
});

const BuyServiceListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { profile } = useAuth();
    const companyId = profile.id;
    const [openedModal, handlerModal] = useDisclosure(false);
    const [introduceData, setIntroduceData] = useState({});
    const [detail, setDetail] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [parentData, setParentData] = useState({});
    const moneyUnit = useMoneyUnit();
    const { data, mixinFuncs, loading, pagination, queryFiter } = useListBase({
        apiConfig: {
            getList: apiConfig.serviceCompanySubscription.getListServiceActive,
            create: apiConfig.serviceCompanySubscription.create,
            update: apiConfig.serviceCompanySubscription.update,
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
            funcs.additionalActionColumnButtons = () => ({
                buyService: (item) => (
                    <BaseTooltip title={<FormattedMessage defaultMessage="Mua dịch vụ" />}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setDetail(item);
                                setIsEditing(true);
                                handlerModal.open();

                            }}
                        >
                            <DollarOutlined />
                        </Button>
                    </BaseTooltip>
                ),
            });

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
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ buyService: true }, { width: '120px' }),
    ];

    const {
        data: listSetting,
        loading: dataLoading,
        execute: executeLoading,
    } = useFetch(apiConfig.serviceCompanySubscription.getMyService, {
        immediate: false,
        mappingData: (response) => {
            if (response.result === true) {
                return {
                    data: response.data.content.filter((item) => {
                        return true;
                    }),
                };
            }
        },
    });

    const { execute: executeUpdate } = useFetch(apiConfig.companySubscription.buyService, { immediate: true });


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
        <div>
            <PageWrapper
                routes={[
                    {
                        breadcrumbName: translate.formatMessage(commonMessage.serviceCompanySubscription),
                        path: generatePath(routes.myCompanySubscriptionListPage.path, { companyId }),
                    },
                    { breadcrumbName: <FormattedMessage defaultMessage="Mua dịch vụ" /> },
                ]}
            >
                <ListPage
                    searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFiter })}
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
            <BuyServiceModal
                open={openedModal}
                onCancel={() => handlerModal.close()}
                data={detail || {}}
                executeUpdate={executeUpdate}
                executeLoading={executeLoading}
                width={800}
                isEditing={isEditing}
            />
        </div>
    );
};
export default BuyServiceListPage;
