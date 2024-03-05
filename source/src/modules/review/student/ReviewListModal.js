import { Col, Spin, Modal, Row, Button, Rate, Progress } from 'antd';
import React, { useState,useEffect } from 'react';
import useNotification from '@hooks/useNotification';
import { defineMessages } from 'react-intl';
import { useIntl } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import AvatarField from '@components/common/form/AvatarField';
import useDisclosure from '@hooks/useDisclosure';
import { convertUtcToLocalTime } from '@utils/index';
import { StarFilled, UserOutlined,ArrowDownOutlined } from '@ant-design/icons';
import { AppConstants, DEFAULT_FORMAT,DATE_FORMAT_VALUE } from '@constants';
import ReviewModal from './ReviewModal';
import useAuth from '@hooks/useAuth';
import styles from './ReviewModal.module.scss';
const messages = defineMessages({
    objectName: 'Đánh giá',
    update: 'Cập nhật',
    updateSuccess: 'Cập nhật {objectName} thành công',
});
const ReviewListModal = ({ loading,star,checkReivew,courseId,open, onCancel, data,courseState,regisState, ...props }) => {
    const translate = useTranslate();
    const { profile } = useAuth();

    const [openCreateModal, handlersCreateModal] = useDisclosure(false);
    const handleReviewModal=() => {
        handlersCreateModal.open();
    };

    let totalStars = 0;
    let totalRatings = 0;
    const ratingCount = Array(5).fill(0);

    star?.forEach(item => {
        totalStars += item.star * item.amount;
        totalRatings += item.amount;

        if (item.star >= 1 && item.star <= 5) {
            ratingCount[item.star - 1] += item.amount;
        }
    });
    const averageRating = totalRatings > 0 ? totalStars / totalRatings : 0;
    const ratingPercentages = ratingCount.map(count => (totalRatings > 0 ? Math.floor((count / totalRatings) * 100) : 0));
    const [visibleItems, setVisibleItems] = useState(10);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const dataToShow = data.length>0 ? data.slice(0, visibleItems):data;

    const handleShowMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleItems(visibleItems + 10);
            setIsLoadingMore(false);
        }, 150);
    };
    useEffect(() => {
        if (!open) {
            setVisibleItems(10);
        }
    }, [open]);
    return (
        <Modal 
            title={translate.formatMessage(messages.objectName)} {...props}
            centered 
            open={open} 
            maskClosable={false} 
            onCancel={onCancel} 
            footer={null} 
        >
            
            <Spin spinning={loading || isLoadingMore} >
                <div className={styles.modalReview}>
                    <div style={{ marginBottom:'10px',borderBottom:'1px solid #ddd',paddingBottom:'20px' }}>
                        <Row gutter={16} >
                            <Col span={12}>
                                <Row >
                                    <Col span={24} align="center" >
                                        <h3 style={{ marginBottom:'10px',fontSize:'30px', color:'#1890FF' }}>{averageRating}</h3>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} align="center">
                                        <Rate disabled allowHalf value={averageRating}/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <>
                                    <Row>
                                        <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '8px' }}>5</span>
                                            <StarFilled style={{ color: '#FFD700', marginRight: '8px' }} />
                                            <Progress
                                                strokeColor={'#FFD700'}
                                                percent={ratingPercentages[4]}
                                                style={{ flex: 1 }}
                                            />
                                        </Col>
                                        <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '8px' }}>4</span>
                                            <StarFilled style={{ color: '#FFD700', marginRight: '8px' }} />
                                            <Progress
                                                strokeColor={'#FFD700'}
                                                percent={ratingPercentages[3]}
                                                style={{ flex: 1 }}
                                            />
                                        </Col>
                                        <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '8px' }}>3</span>
                                            <StarFilled style={{ color: '#FFD700', marginRight: '8px' }} />
                                            <Progress
                                                strokeColor={'#FFD700'}
                                                percent={ratingPercentages[2]}
                                                style={{ flex: 1 }}
                                            />
                                        </Col>
                                        <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '8px' }}>2</span>
                                            <StarFilled style={{ color: '#FFD700', marginRight: '8px' }} />
                                            <Progress
                                                strokeColor={'#FFD700'}
                                                percent={ratingPercentages[1]}
                                                style={{ flex: 1 }}
                                            />
                                        </Col>
                                        <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '8px' }}>1</span>
                                            <StarFilled style={{ color: '#FFD700', marginRight: '8px' }} />
                                            <Progress
                                                strokeColor={'#FFD700'}
                                                percent={ratingPercentages[0]}
                                                style={{ flex: 1 }}
                                            />
                                        </Col>
                                    </Row>

                                </>
                            </Col>
                        </Row>
                        {!checkReivew && courseState === 3 && regisState === 3 && (
                            
                            <Row style={{ marginTop:'20px' }}>
                                <Col span={12} align="center">
                                    <Button onClick={handleReviewModal} type="primary">Viết đánh giá</Button>
                                </Col>
                            </Row>
                        )}
                    </div>
                    <>
                        <Row>
                            <span style={{ color: '#1890FF', fontSize:'16px',marginLeft:'8px',marginBottom:'10px' }}>Danh sách đánh giá ({totalRatings} Review)</span>
                        </Row>
                        <div>
                            {dataToShow.length>0 ? dataToShow?.map((item, index) => (
                                <Row gutter={16} key={index} style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '6px', margin:'0px 8px 14px 8px' }}>
                                    <Col span={2} align='center' justify="center">
                                        <AvatarField
                                            size="large"
                                            icon={<UserOutlined />}
                                            src={item?.studentInfo?.avatar ? `${AppConstants.contentRootUrl}${item.studentInfo.avatar}` : null}
                                        />
                                    </Col>
                                    <Col span={17}>
                                        <div style={{ fontWeight: '500', fontSize: '16px' }}>{item?.studentInfo?.fullName}</div>
                                        <Row><span>{item.message}</span></Row>
                                        <Row><span>{convertUtcToLocalTime(item.createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT)}</span></Row>
                                    </Col>
                                    <Col span={5} style={{ textAlign:'right' }}>
                                        <Rate disabled defaultValue={item?.star} style={{ fontSize: '14px' }} />
                                    </Col>
                                </Row>
                            )):''}
                            {visibleItems < data.length && (
                                <Col align='center'>
                                    <Button className={styles.btnAdd} type="text" onClick={handleShowMore}>
                                        <ArrowDownOutlined />
                                        Xem thêm
                                    </Button>
                                </Col>
                            )}
                        </div>
                        
                    </>

                    <ReviewModal
                        open={openCreateModal}
                        onCancel={() => handlersCreateModal.close()}
                        courseId = {courseId}
                        profile={profile}
                        width={800}
                    />
                </div>
            </Spin>
        </Modal>
    );
};

export default ReviewListModal;
