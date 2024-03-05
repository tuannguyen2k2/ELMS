import { BaseTooltip } from '@components/common/form/BaseTooltip';
import BaseTable from '@components/common/table/BaseTable';
import { Button, Divider } from 'antd';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';

const messages = defineMessages({
    objectName: 'Yêu cầu',
});
const ListDetailsTable = ({ data, loading, handleEditList, handleDeleteList }) => {
    const translate = useTranslate();
    const columns = [
        { dataIndex: ['projectRoleId', 'label'], title: <FormattedMessage defaultMessage="Vai trò" /> },
        { dataIndex: 'amount', title: <FormattedMessage defaultMessage="Số lượng" />, width: '100px', align: 'center' },
        {
            title: <FormattedMessage defaultMessage="Hành động" />,
            align: 'center',
            width: '150px',
            render: (item) => {
                return (
                    <>
                        <BaseTooltip type="edit" objectName={translate.formatMessage(messages.objectName)}>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditList(item);
                                }}
                                type="link"
                                style={{ padding: 0 }}
                            >
                                <EditOutlined />
                            </Button>
                        </BaseTooltip>
                        <Divider type="vertical" />
                        <BaseTooltip type="delete" objectName={translate.formatMessage(messages.objectName)}>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteList(item.index);
                                }}
                                type="link"
                                style={{ padding: 0 }}
                            >
                                <DeleteOutlined style={{ color: 'red' }} />
                            </Button>
                        </BaseTooltip>
                    </>
                );
            },
        },
    ];
    return <BaseTable rowKey={(record) => record.index} columns={columns} dataSource={data} loading={loading} />;
};

export default ListDetailsTable;
