import PageWrapper from '@components/common/layout/PageWrapper';
import useTranslate from '@hooks/useTranslate';
import { Card, Tabs } from 'antd';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import GeneralSettingPage from './GeneralSetting';
import { settingGroups } from '@constants/masterData';
import routes from '@routes';

const message = defineMessages({
    generalSetting: 'Cài đặt chung',
    pageSetting: 'Cài đặt trang',
    generalRevenue: 'Lợi nhuận chia sẻ',
});

const SettingPage = () => {
    const translate = useTranslate();
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem(routes.settingsPage.keyActiveTab)
            ? localStorage.getItem(routes.settingsPage.keyActiveTab)
            : settingGroups.PAGE,
    );
    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(message.generalSetting) }]}>
            <Card className="card-form" bordered={false}>
                <Tabs
                    type="card"
                    onTabClick={(key) => {
                        setActiveTab(key);
                        localStorage.setItem(routes.settingsPage.keyActiveTab, key);
                    }}
                    activeKey={activeTab}
                    items={[
                        {
                            key: settingGroups.GENERAL,
                            label: translate.formatMessage(message.generalSetting),
                            children: activeTab == settingGroups.GENERAL && <GeneralSettingPage groupName={settingGroups.GENERAL} />,
                        },
                        {
                            key: settingGroups.PAGE,
                            label: translate.formatMessage(message.pageSetting),
                            children: activeTab == settingGroups.PAGE && <GeneralSettingPage groupName={settingGroups.PAGE} />,
                        },
                        {
                            key: settingGroups.REVENUE,
                            label: translate.formatMessage(message.generalRevenue),
                            children: activeTab == settingGroups.REVENUE &&  <GeneralSettingPage groupName={settingGroups.REVENUE} />,
                        },
                    ]}
                />
            </Card>
        </PageWrapper>
    );
};

export default SettingPage;
