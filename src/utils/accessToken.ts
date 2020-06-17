import Cookies from 'js-cookie';
import { currentDomain } from '@/utils/utils';
import request from './request';

export function getAccessToken(str?: string): string {
  const token =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('x-access-token') : str;

  return token || '';
}

export function setAccessToken(token: string): void {
  request.extendOptions({
    headers: { 'X-Access-Token': token },
  });
  Cookies.set('token', token, { path: '/', currentDomain });
  localStorage.setItem('x-access-token', token || '');
}
