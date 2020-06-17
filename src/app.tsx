import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';

import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { queryCurrent } from './services/user';

import defaultSettings from '../config/defaultSettings';

import logo from '@/assets/logo_1.svg';
import requestConfig from '@/utils/request';

export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  settings?: LayoutSettings;
}> {
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login') {
    const { data } = await queryCurrent();
    console.log('____1111___');

    return {
      currentUser: data,
      settings: defaultSettings,
    };
  }
  return {
    settings: defaultSettings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings };
}): BasicLayoutProps => {
  console.log('____222___');

  return {
    logo,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};

export const request = requestConfig;
