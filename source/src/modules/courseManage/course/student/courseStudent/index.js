import { BookOutlined, UserOutlined, CommentOutlined, EyeOutlined } from '@ant-design/icons';
import { TeamOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DATE_DISPLAY_FORMAT, DATE_FORMAT_DISPLAY, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { lectureState, statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { formatMoney } from '@utils';
import { Button, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { commonMessage } from '@locales/intl';
import ReviewListModal from '@modules/review/student/ReviewListModal';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useAuth from '@hooks/useAuth';
import PreviewModal from './PreviewModal';
import useMoneyUnit from '@hooks/useMoneyUnit';

const message = defineMessages({
    objectName: 'Khóa học',
});

const CourseStudentListPage = () => {
    const translate = useTranslate();
    const { profile } = useAuth();

    const stateValues = translate.formatKeys(lectureState, ['label']);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const [openReviewModal, handlersReviewModal] = useDisclosure(false);
    const [openPreviewModal, handlersPreviewModal] = useDisclosure(false);

    const [detail, setDetail] = useState();
    const [courseId, setCourseId] = useState();
    const [courseState, setCourseState] = useState();
    const [checkReivew, setCheckReview] = useState(false);
    const moneyUnit = useMoneyUnit();

    const navigate = useNavigate();
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: {
                getList: apiConfig.course.getListStudentCourse,
                getById: apiConfig.course.getById,
                create: apiConfig.course.create,
                update: apiConfig.course.update,
                delete: apiConfig.course.delete,
            },
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            override: (funcs) => {
                funcs.changeFilter = (filter) => {
                    const leaderId = queryParams.get('leaderId');
                    const leaderName = queryParams.get('leaderName');
                    if (leaderId) {
                        mixinFuncs.setQueryParams(
                            serializeParams({ leaderId: leaderId, leaderName: leaderName, ...filter }),
                        );
                    } else {
                        mixinFuncs.setQueryParams(serializeParams(filter));
                    }
                };
                funcs.additionalActionColumnButtons = () => ({
                    registration: ({ id, name, state, status }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.registration)}>
                            <Button
                                type="link"
                                disabled={state === 1}
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    state !== 1 &&
                                        navigate(
                                            routes.registrationStudentListPage.path +
                                                `?courseId=${id}&courseName=${name}&courseState=${state}&courseStatus=${status}`,
                                        );
                                }}
                            >
                                <TeamOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                    task: ({ id, name, subject, state, status }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.task)}>
                            <Button
                                disabled={state === 1 || state === 5}
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const path =
                                        routes.courseStudentListPage.path +
                                        `/task/${id}?courseId=${id}&courseName=${name}&state=${state}&subjectId=${subject.id}`;
                                    navigate(path);
                                }}
                            >
                                <BookOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                    review: ({ id, name, subject, state, status, item }) => (
                        <BaseTooltip title={translate.formatMessage(commonMessage.review)}>
                            <Button
                                type="link"
                                disabled={state !== 3}
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    setCourseId(id);
                                    getListReview(id);
                                    getMyListReview(id);
                                    setCourseState(state);
                                    getListRegis(id);
                                    getStarReview(id);
                                    e.stopPropagation();
                                    handlersReviewModal.open();
                                }}
                            >
                                <CommentOutlined />
                            </Button>
                        </BaseTooltip>
                    ),
                });
            },
        });

    const { execute: executeGet } = useFetch(apiConfig.course.getById, {
        immediate: false,
    });
    const handleFetchDetail = (id) => {
        executeGet({
            pathParams: { id: id },
            onCompleted: (response) => {
                setDetail(response.data);
            },
        });
    };
    const breadRoutes = [{ breadcrumbName: translate.formatMessage(commonMessage.course) }];
    const columns = [
        {
            title: '#',
            dataIndex: 'avatar',
            align: 'center',
            width: 80,
            render: (avatar) => (
                <AvatarField size="large" icon={<UserOutlined />} src={`${AppConstants.contentRootUrl}${avatar}`} />
            ),
        },
        {
            title: translate.formatMessage(commonMessage.courseName),
            dataIndex: 'name',
        },
        {
            title: translate.formatMessage(commonMessage.leader),
            dataIndex: ['leader', 'leaderName'],
        },
        {
            title: <FormattedMessage defaultMessage="Học phí" />,
            dataIndex: 'fee',
            width: 150,
            align: 'right',
            render: (fee) => {
                const formattedValue = formatMoney(fee, {
                    currentcy: moneyUnit,
                    currentDecimal: '0',
                    groupSeparator: ',',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Phí hoàn trả" />,
            dataIndex: 'returnFee',
            width: 150,
            align: 'right',
            render: (returnFee) => {
                const formattedValue = formatMoney(returnFee, {
                    currentcy: moneyUnit,
                    currentDecimal: '0',
                    groupSeparator: ',',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.startDate),
            dataIndex: 'dateRegister',
            render: (dateRegister) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(dateRegister, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                    </div>
                );
            },
            width: 130,
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.endDate),
            dataIndex: 'dateEnd',
            render: (dateEnd) => {
                return (
                    <div style={{ padding: '0 4px', fontSize: 14 }}>
                        {dayjs(dateEnd, DATE_DISPLAY_FORMAT).format(DATE_FORMAT_DISPLAY)}
                    </div>
                );
            },
            width: 130,
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.state),
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
                review: true,
                registration: true,
                task: true,
                edit: true,
                delete: true,
            },
            { width: '160px' },
        ),
    ].filter(Boolean);
    const {
        data: dataListReview,
        execute: listReview,
        loading: dataListLoading,
    } = useFetch(apiConfig.review.listReviews, { immediate: false, mappingData: ({ data }) => data.content });

    const getListReview = (id) => {
        listReview({
            pathParams: {
                courseId: id,
            },
        });
    };

    const {
        data: starData,
        execute: starReview,
        loading: starDataLoading,
    } = useFetch(apiConfig.review.star, { immediate: false, mappingData: ({ data }) => data.content });

    const getStarReview = (id) => {
        starReview({
            pathParams: {
                courseId: id,
            },
        });
    };

    const { data: regisData, execute: regisExecute } = useFetch(apiConfig.registration.getList, {
        immediate: false,
        mappingData: ({ data }) => data.content,
    });

    const getListRegis = (id) => {
        regisExecute({
            params: {
                courseId: id,
            },
        });
    };
    const newData = regisData?.map((item) => ({
        stateRegis: item.state,
        studentId: item.studentInfo.id,
    }));

    let stateRegistration = 0;
    newData?.forEach((item) => {
        if (item.studentId === profile.id) {
            stateRegistration = item.stateRegis;
        }
    });

    const { loading: loadingData, execute: myListReview } = useFetch(apiConfig.review.myReview, { immediate: false });

    const getMyListReview = (id) => {
        myListReview({
            pathParams: {
                courseId: id,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    setCheckReview(true);
                } else {
                    setCheckReview(false);
                }
            },
            onError: (err) => {
                setCheckReview(false);
            },
        });
    };

    return (
        <PageWrapper routes={breadRoutes}>
            <ListPage
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onRow={(record, rowIndex) => ({
                            onClick: (e) => {
                                e.stopPropagation();
                                handleFetchDetail(record.id);

                                handlersPreviewModal.open();
                            },
                        })}
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                    />
                }
            />
            <ReviewListModal
                open={openReviewModal}
                onCancel={() => handlersReviewModal.close()}
                data={dataListReview || {}}
                courseId={courseId}
                checkReivew={checkReivew}
                star={starData}
                width={800}
                courseState={courseState}
                regisState={stateRegistration}
                loading={dataListLoading || starDataLoading || loadingData}
            />
            {/* <PreviewModal
                open={openPreviewModal}
                onCancel={() => handlersPreviewModal.close()}
                detail={detail || {}}
                loading={loading}
            /> */}
        </PageWrapper>
    );
};

export default CourseStudentListPage;
