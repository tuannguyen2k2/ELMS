import ListPage from '@components/common/layout/ListPage';
import React, { useEffect, useState } from 'react';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_FORMAT, DATE_FORMAT_DISPLAY, DEFAULT_TABLE_ITEM_SIZE, AppConstants } from '@constants';
import { IconCategory } from '@tabler/icons-react';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import dayjs from 'dayjs';
import { UserOutlined } from '@ant-design/icons';
import { Button, Avatar, Tag, Modal } from 'antd';
import { IconBrandTeams } from '@tabler/icons-react';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import routes from '@routes';
import route from '@modules/projectManage/project/projectTask/routes';
import { DollarOutlined, TeamOutlined, WomanOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { statusOptions, projectTaskState } from '@constants/masterData';
import { FieldTypes } from '@constants/formConfig';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import styles from './project.module.scss';

// import icon_team_1 from '@assets/images/team-Members-Icon.png';

import useFetch from '@hooks/useFetch';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import useNotification from '@hooks/useNotification';
const message = defineMessages({
    objectName: 'Dự án',
});

const ProjectListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const leaderId = queryParameters.get('leaderId');
    const developerId = queryParameters.get('developerId');
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const leaderName = queryParameters.get('leaderName');
    const developerName = queryParameters.get('developerName');
    const [dataApply, setDataApply] = useState([]);
    localStorage.setItem('pathPrev', location.search);
    const [parentData, setParentData] = useState({});
    const notification = useNotification();
    const [hasError, setHasError] = useState(false);
    const [visible, setVisible] = useState(true);
    const [openModalSalaryPeriod, setOpenModalSalaryPeriod] = useState(false);
    const { data: salaryPeriodAutoComplete, execute: executeGetSalaryPeriod } = useFetch(
        apiConfig.salaryPeriod.autocomplete,
        { mappingData: (data) => data.data.content },
    );
    const { execute: executeCalculateProjectSalary } = useFetch(apiConfig.income.calculateProjectSalary);
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.project,
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
                    salaryPeriod: ({ id }) => {
                        return (
                            <BaseTooltip title={translate.formatMessage(commonMessage.salaryPeriod)}>
                                <Button
                                    type="link"
                                    style={{ padding: 0 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        executeGetSalaryPeriod();
                                        setOpenModalSalaryPeriod(true);
                                    }}
                                >
                                    <DollarOutlined />
                                </Button>
                                <Modal
                                    open={openModalSalaryPeriod}
                                    footer={null}
                                    onCancel={() => {
                                        setOpenModalSalaryPeriod(false);
                                    }}
                                >
                                    <div style={{ marginTop: '30px' }}>
                                        <BaseTable
                                            columns={[
                                                {
                                                    title: translate.formatMessage(commonMessage.salaryPeriod),
                                                    dataIndex: 'name',
                                                    align: 'left',
                                                },
                                            ]}
                                            rowClassName={styles.clickRowTable}
                                            onRow={(record) => ({
                                                onClick: (e) => {
                                                    e.stopPropagation();
                                                    executeCalculateProjectSalary({
                                                        data: {
                                                            projectId: id,
                                                            salaryPeriodId: record?.id,
                                                        },
                                                        onCompleted: () => {
                                                            notification({
                                                                type: 'success',
                                                                message: translate.formatMessage(
                                                                    commonMessage.selectPeriodSalarySuccess,
                                                                ),
                                                            });
                                                            setOpenModalSalaryPeriod(false);
                                                        },
                                                        onError: (error) => {
                                                            console.log(error);
                                                            notification({
                                                                type: 'error',
                                                                message: error?.response?.data?.message,
                                                            });
                                                            setOpenModalSalaryPeriod(false);
                                                        },
                                                    });
                                                },
                                            })}
                                            dataSource={salaryPeriodAutoComplete?.filter((item) => item.state == 2)}
                                        />
                                    </div>
                                </Modal>
                            </BaseTooltip>
                        );
                    },
                    member: ({ id, name, status }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.member)}>
                            <Button
                                type="link"
                                style={{ padding: '0' }}
                                // disabled={status === -1}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (status == 1) {
                                        navigate(
                                            routes.projectMemberListPage.path +
                                                `?projectId=${id}&projectName=${name}&active=${true}`,
                                        );
                                    } else {
                                        navigate(
                                            routes.projectMemberListPage.path + `?projectId=${id}&projectName=${name}`,
                                        );
                                    }
                                }}
                            >
                                <UserOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                    team: ({ id, name, status, leaderInfo }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.team)}>
                            <Button
                                type="link"
                                style={{ padding: '0' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const pathDefault = `?projectId=${id}&projectName=${name}`;
                                    let path;
                                    if (leaderName) {
                                        path =
                                            routes.learderProjectTeamListPage.path +
                                            pathDefault +
                                            `&leaderId=${leaderInfo.id}&leaderName=${leaderName}`;
                                    } else if (developerName) {
                                        path =
                                            routes.developerProjectTeamListPage.path +
                                            pathDefault +
                                            `&developerId=${developerId}&developerName=${developerName}`;
                                    } else {
                                        if (status == 1) {
                                            path = routes.teamListPage.path + pathDefault + `&active=${true}`;
                                        } else path = routes.teamListPage.path + pathDefault;
                                    }
                                    navigate(path);
                                }}
                            >
                                <IconBrandTeams color="#2e85ff" size={17} style={{ marginBottom: '-2px' }} />
                            </Button>
                        </BaseTooltip>
                    ),
                    projectCategory: ({ id, name }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.projectCategory)}>
                            <Button
                                type="link"
                                style={{ padding: '0' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const pathDefault = `?projectId=${id}&projectName=${name}`;

                                    navigate(routes.projectCategoryListPage.path + pathDefault);
                                }}
                            >
                                <IconCategory size={16} />
                            </Button>
                        </BaseTooltip>
                    ),
                });

                funcs.changeFilter = (filter) => {
                    const leaderId = queryParams.get('leaderId');
                    const leaderName = queryParams.get('leaderName');
                    const developerId = queryParams.get('developerId');
                    const developerName = queryParams.get('developerName');
                    if (leaderId) {
                        mixinFuncs.setQueryParams(
                            serializeParams({ leaderId: leaderId, leaderName: leaderName, ...filter }),
                        );
                    } else if (developerId) {
                        mixinFuncs.setQueryParams(
                            serializeParams({ developerId: developerId, developerName: developerName, ...filter }),
                        );
                    } else {
                        mixinFuncs.setQueryParams(serializeParams(filter));
                    }
                };
            },
        });

    const checkMember = (projectId, path) => {
        executeUpdateLeader({
            params: {
                projectId: projectId,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    if (response.data.totalElements == 0) {
                        setHasError(true);
                        setVisible(true);
                    } else {
                        navigate(path);
                    }
                }
            },
            onError: () =>
                notification({
                    type: 'error',
                    title: 'Error',
                }),
        });
    };

    const { execute: executeUpdateLeader } = useFetch(apiConfig.memberProject.autocomplete, { immediate: true });
    const { execute: executeLoading } = useFetch(apiConfig.project.getList, { immediate: false });

    const { data: dataDeveloperProject, execute: executeGetList } = useFetch(apiConfig.developer.getProject, {
        immediate: true,
        params: { developerId: developerId },
    });

    useEffect(() => {
        if (!developerId) {
            setDataApply(data);
        } else {
            setDataApply(dataDeveloperProject?.data?.content);
        }
    }, [data, dataDeveloperProject]);

    const setBreadRoutes = () => {
        const breadRoutes = [];
        if (leaderName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.leader),
                path: routes.leaderListPage.path,
            });
        } else if (developerName) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.developer),
                path: routes.developerListPage.path,
            });
        }
        breadRoutes.push({ breadcrumbName: translate.formatMessage(commonMessage.project) });

        return breadRoutes;
    };
    const convertDate = (date) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY);
        return convertDateTimeToString(dateConvert, DATE_FORMAT_DISPLAY);
    };

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.projectName),
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ].filter(Boolean);
    const handleOnClick = (event, record) => {
        event.preventDefault();
        localStorage.setItem(routes.projectTabPage.keyActiveTab, translate.formatMessage(commonMessage.task));
        navigate(
            routes.projectTabPage.path +
                `?projectId=${record.id}&projectName=${record.name}&active=${!!record.status == 1}`,
        );
    };
    const columns = [
        {
            title: '#',
            dataIndex: 'avatar',
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
            title: translate.formatMessage(commonMessage.projectName),
            dataIndex: 'name',
            render: (name, record) => (
                <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
                    {name}
                </div>
            ),
        },
        {
            title: translate.formatMessage(commonMessage.leader),
            dataIndex: ['leaderInfo', 'leaderName'],
            width: 150,
        },
        {
            title: translate.formatMessage(commonMessage.startDate),
            dataIndex: 'startDate',
            render: (startDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(startDate)}</div>;
            },
            width: 140,
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.endDate),
            dataIndex: 'endDate',
            render: (endDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(endDate)}</div>;
            },
            width: 140,
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
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn(
            {
                salaryPeriod: true,
                edit: true,
                delete: true,
            },
            { width: '220px' },
        ),
    ].filter(Boolean);
    return (
        <PageWrapper routes={setBreadRoutes()}>
            <ListPage
                title={<span style={{ fontWeight: 'normal' }}>{leaderName || developerName}</span>}
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: queryFilter,
                    className: styles.search,
                })}
                actionBar={!leaderName && !developerName && mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={dataApply}
                        columns={columns}
                    />
                }
            />
            {hasError && (
                <Modal
                    title={
                        <span>
                            <ExclamationCircleOutlined style={{ color: 'red' }} /> Lỗi
                        </span>
                    }
                    open={visible}
                    onOk={() => setVisible(false)}
                    onCancel={() => setVisible(false)}
                >
                    <p>Chưa có sinh viên nào trong dự án, vui lòng kiểm tra lại</p>
                </Modal>
            )}
        </PageWrapper>
    );
};

export default ProjectListPage;
