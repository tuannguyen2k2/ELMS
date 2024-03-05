import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE, TIME_FORMAT_DISPLAY } from '@constants';
import apiConfig from '@constants/apiConfig';
import { levelOptionSelect, statusOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { convertUtcToLocalTime } from '@utils';
import { Avatar, Button, Tag } from 'antd';
import { ProjectOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import FolderIcon from '@assets/icons';
import { FieldTypes } from '@constants/formConfig';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import ScheduleFile from '@components/common/elements/ScheduleFile';

const message = defineMessages({
    objectName: 'Lập trình viên',
});

const DeveloperListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const [projectRole, setProjectROle] = useState([]);

    const { data, mixinFuncs, loading, pagination, queryFiter, serializeParams } = useListBase({
        apiConfig: apiConfig.developer,
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
            funcs.changeFilter = (filter) => {
                mixinFuncs.setQueryParams(serializeParams(filter));
            };
            funcs.additionalActionColumnButtons = () => ({
                project: ({ id, studentInfo }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.project)}>
                        <Button
                            type="link"
                            style={{ padding: 0, display: 'table-cell', verticalAlign: 'middle' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                    routes.developerProjectListPage.path +
                                        `?developerId=${id}&developerName=${studentInfo?.fullName}`,
                                );
                            }}
                        >
                            <FolderIcon />
                        </Button>
                    </BaseTooltip>
                ),
            });
        },
    });
    const columns = [
        {
            title: '#',
            dataIndex: ['studentInfo', 'avatar'],
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
            title: 'Họ và tên',
            dataIndex: ['studentInfo', 'fullName'],
        },
        {
            title: 'Vai trò',
            dataIndex: ['roleInfo', 'projectRoleName'],
            width: 170,
        },
        {
            title: 'Trình độ',
            dataIndex: 'level',
            width: 100,
            render: (level) => {
                const levelLabel = levelOptionSelect.map((item) => {
                    if (level === item.value) {
                        return item.label;
                    }
                });
                return <div>{levelLabel}</div>;
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            width: 170,
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        {
            title: 'Lịch trình',
            dataIndex: 'schedule',
            align: 'center',
            render: (schedule) => {
                return <ScheduleFile schedule={schedule} />;
            },
            width: 180,
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn({ project: true, edit: true, delete: true }, { width: 160 }),
    ];




    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.name),
        },
        {
            key: 'roleId',
            placeholder: translate.formatMessage(commonMessage.role),
            type: FieldTypes.SELECT,
            options: projectRole,
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];
    const {
        data: projectroles,
        execute: executesprojectroles,
    } = useFetch(apiConfig.projectRole.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data.content.map((item) => ({
            value: item.id,
            label: item.projectRoleName,
        })),
    });
    useEffect(() => {
        if (projectroles) {
            setProjectROle(projectroles);
        }
    }, [projectroles]);

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(commonMessage.developer) },
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

export default DeveloperListPage;
