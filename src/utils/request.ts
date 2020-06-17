/**
 * Created by lzb on 2020/6/4.
 */
import { notification } from 'antd';
import { getAccessToken } from '@/utils/accessToken';
import { RequestConfig, history } from 'umi';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const httpError = (response: Response) => {
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status } = response;
    const { url } = response;

    notification.error({
      message: `请求错误 ${status}: ${errorText}`,
      description: url,
    });

    return {
      success: false,
      errorCode: status,
      errorMessage: errorText,
      showType: 0,
    };
  }

  return {
    success: false,
  };
};

/**
 * 配置request请求时的默认参数
 */
export default {
  headers: {
    'X-Access-Token': getAccessToken(),
  },
  errorConfig: {
    adaptor: (resData, { res }) => {
      if (Object.prototype.toString.call(res) === '[object Response]') {
        return httpError(res);
      }
      // 响应数据Code码对应规则
      const codeRules = {
        '^(200|1000|999)$': () => ({
          data: resData.data,
          success: true,
        }),
        '^(401|5005|5009)$': () => {
          history.push('/user/login');
          return {
            success: false,
            data: resData.data,
            errorCode: resData.code,
            errorMessage: resData.message,
            showType: 2,
          };
        },
        '^\\d+$': () => ({
          success: false,
          errorMessage: resData.message,
          showType: 2,
        }),
      };

      // 对不同的code 开启不同的处理
      for (let i = 0; i < Object.entries(codeRules).length; i += 1) {
        const [reg, result] = Object.entries(codeRules)[i];
        if (new RegExp(reg).test(resData.code?.toString())) {
          return result();
        }
      }
      return {
        data: resData.data,
        success: true,
        errorCode: '999999',
        errorMessage: '接口返回格式有误!',
        showType: 2,
      };
    },
    errorPage: '/welcome',
  },
} as RequestConfig;
