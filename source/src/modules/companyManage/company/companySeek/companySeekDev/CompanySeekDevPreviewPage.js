import { CaretRightOutlined, UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, DATE_FORMAT_DISPLAY, DEFAULT_FORMAT } from '@constants';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { Button, Card, Row } from 'antd';
import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';

const message = defineMessages({
    objectName: 'Tìm kiếm ứng viên',
    createSuccess: 'Lưu ứng viên thành công',
    detailDev: 'Chi tiết ứng viên',
    saveCandidate: 'Lưu ứng viên',
    description: 'Mô tả',
    position: 'Vị trí',
    teamSize: 'Số lượng nhóm',
    projectDone: 'Dự án đã thực hiện',
    team: 'nhóm',
    noProject: 'Chưa có dự án',
});
const CompanySeekDevPreviewPage = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const id = queryParameters.get('id');
    const roleId = queryParameters.get('roleId');
    const notification = useNotification();
    const { profile } = useAuth();
    const navigate = useNavigate();
    const { execute: executeGetDev, data: detailDevPreview } = useFetch(apiConfig.companySeek.getByIdDev, {
        immediate: false,
    });
    const translate = useTranslate();

    useEffect(() => {
        executeGetDev({
            pathParams: {
                id,
            },
            onError: () =>
                notification({
                    type: 'error',
                    title: 'Error',
                }),
        });
    }, [id]);
    const { execute: executeCreateCompanySeek } = useFetch(apiConfig.companySeek.create, {
        immediate: false,
    });
    const handleSubmit = () => {
        executeCreateCompanySeek({
            data: {
                companyId: profile?.id,
                developerId: detailDevPreview?.data.id,
                roleId: roleId,
            },
            onCompleted: () => {
                notification({
                    message: translate.formatMessage(message.createSuccess),
                });
                navigate(routes.companySeekDevListPage.path);
            },
            onError: (err) => {
                notification({
                    message: err.message,
                });
            },
        });
    };
    return (
        <PageWrapper
            routes={[
                {
                    breadcrumbName: translate.formatMessage(message.objectName),
                    path: routes.companySeekDevListPage.path,
                },
                { breadcrumbName: translate.formatMessage(message.detailDev) },
            ]}
        >
            <Card style={{ width: '50vw' }}>
                <Row style={{ alignItems: 'center' }}>
                    <AvatarField
                        size={64}
                        icon={<UserOutlined />}
                        src={
                            detailDevPreview?.data?.avatar
                                ? `${AppConstants.contentRootUrl}${detailDevPreview?.data?.avatar}`
                                : null
                        }
                    />
                    <div className={styles.title}>{detailDevPreview?.data?.name}</div>
                </Row>
                <div className={styles.titleProject}>{translate.formatMessage(message.projectDone)} :</div>
                {detailDevPreview?.data?.projectList ? (
                    detailDevPreview?.data?.projectList.map((project) => {
                        const startDateConvert = convertStringToDateTime(
                            project?.startDate,
                            DEFAULT_FORMAT,
                            DATE_FORMAT_DISPLAY,
                        );
                        const startDate = convertDateTimeToString(startDateConvert, DATE_FORMAT_DISPLAY);
                        const endDateConvert = convertStringToDateTime(
                            project?.endDate,
                            DEFAULT_FORMAT,
                            DATE_FORMAT_DISPLAY,
                        );
                        const endDate = convertDateTimeToString(endDateConvert, DATE_FORMAT_DISPLAY);
                        return (
                            <div key={project?.id}>
                                <Row>
                                    <CaretRightOutlined />
                                    <div className={styles.name}>
                                        {project?.name} ({startDate} - {endDate})
                                    </div>
                                </Row>
                                <div className={styles.detail}>
                                    • {translate.formatMessage(message.description)}:{' '}
                                    <span className={styles.item}>{project?.description}</span>
                                </div>
                                <div className={styles.detail}>
                                    • {translate.formatMessage(message.teamSize)}:{' '}
                                    <span className={styles.item}>
                                        {project?.teamSize} {translate.formatMessage(message.team)}
                                    </span>
                                </div>
                                <div className={styles.detail}>
                                    • {translate.formatMessage(message.position)}:{' '}
                                    <span className={styles.item}>{project?.projectRole?.projectRoleName}</span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ margin: '10px 10px' }}>{translate.formatMessage(message.noProject)}</div>
                )}
                <Button key="submit" type="primary" onClick={handleSubmit} style={{ float: 'right' }}>
                    {translate.formatMessage(message.saveCandidate)}
                </Button>
            </Card>
        </PageWrapper>
    );
};

export default CompanySeekDevPreviewPage;
