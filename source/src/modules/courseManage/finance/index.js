import { UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { formatMoney } from '@utils';
import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styles from './finance.module.scss';
import useMoneyUnit from '@hooks/useMoneyUnit';
const message = defineMessages({
    objectName: 'Tài chính',
});

const FinanceListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValue = translate.formatKeys(statusOptions, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const courseId = queryParameters.get('courseId');
    const studentId = queryParameters.get('studentId');
    const moneyUnit = useMoneyUnit();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: { getList: apiConfig.registrationMoney.listSum },
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
        },
    });
    const breadRoutes = [{ breadcrumbName: translate.formatMessage(commonMessage.finance) }];
    const searchFields = [
        {
            key: 'studentId',
            placeholder: translate.formatMessage(commonMessage.studentName),
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.student.autocomplete,
            mappingOptions: (item) => ({
                value: item.id,
                label: item.fullName,
            }),
            searchParams: (text) => ({ name: text }),
            colSpan: 5,
        },
        {
            key: 'courseId',
            placeholder: translate.formatMessage(commonMessage.courseName),
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.course.autocomplete,
            mappingOptions: (item) => ({
                value: item.id,
                label: item.name,
            }),
            searchParams: (text) => ({ name: text }),
            colSpan: 5,
        },
    ];

    const formatMoneyValue = (value) => {
        return formatMoney(value, {
            groupSeparator: ',',
            decimalSeparator: '.',
            currentcy: moneyUnit,
            currentDecimal: '0',
        });
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'studentAvatar',
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
            title: translate.formatMessage(commonMessage.studentName),
            dataIndex: 'studentName',
        },
        {
            title: translate.formatMessage(commonMessage.moneyReceived),
            dataIndex: 'totalMoneyInput',
            render: (totalMoneyInput) => {
                return <div>{formatMoneyValue(totalMoneyInput)}</div>;
            },
            align: 'right',
        },
        {
            title: translate.formatMessage(commonMessage.moneyReturn),
            dataIndex: 'totalMoneyReturn',
            render: (totalMoneyReturn) => {
                return <div>{formatMoneyValue(totalMoneyReturn)}</div>;
            },
            align: 'right',
        },
    ];
    const { data: moneySum, execute: executeGetSum } = useFetch(apiConfig.registrationMoney.getSum, {
        immediate: false,
        params: { courseId, studentId },
        mappingData: ({ data }) => data.content,
    });

    useEffect(() => {
        executeGetSum({ params: { courseId, studentId } });
    }, [courseId, studentId]);

    return (
        <PageWrapper routes={breadRoutes}>
            <ListPage
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div></div>
                        <div>
                            <span style={{ marginLeft: '5px' }}>
                                Tổng nhận: {moneySum && formatMoneyValue(moneySum[0]?.totalMoneyInput || 0)}
                            </span>
                            <span style={{ fontWeight: 'bold', fontSize: '17px', marginLeft: '15px' }}>| </span>
                            <span style={{ marginLeft: '5px' }}>
                                Tổng trả: {moneySum && formatMoneyValue(moneySum[0]?.totalMoneyReturn || 0)}
                            </span>
                            <span style={{ fontWeight: 'bold', fontSize: '17px', marginLeft: '15px' }}>| </span>
                            <span style={{ marginLeft: '5px', color: 'red' }}>
                                Tổng nợ:{' '}
                                {moneySum &&
                                    formatMoneyValue(
                                        Math.abs(
                                            parseInt(moneySum[0]?.totalMoneyInput) -
                                                parseInt(moneySum[0]?.totalMoneyReturn),
                                        ) || 0,
                                    )}
                            </span>
                        </div>
                    </div>
                }
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, className: styles.search })}
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

export default FinanceListPage;
