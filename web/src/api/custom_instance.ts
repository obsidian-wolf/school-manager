import { BASE_URL } from '~/config';
import Axios, { AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({
    baseURL: BASE_URL,
    headers: {
        accept: 'application/json',
    },
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
    // Add your request interceptors
    // add jwt token
    config.headers.Authorization = `Basic U2Nob29sOiRjaG9vIQ==`;
    return config;
});

/**
 * Custom serializer to convert array params to return:
 * key=a&key=b instead of key=[]a&key=[]b
 */
function paramsSerializer(params: Record<string, unknown>): string {
    if (!params) return '';
    return Object.entries(params)
        .reduce<string[]>((res, [key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => {
                    res.push(`${key}=${v}`);
                });
            } else {
                res.push(`${key}=${value}`);
            }
            return res;
        }, [])
        .join('&');
}

/**
 * https://orval.dev/guides/custom-axios
 */
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
    const source = Axios.CancelToken.source();

    const promise = AXIOS_INSTANCE({
        ...config,
        paramsSerializer,
        cancelToken: source.token,
    })
        .then((response) => response?.data)
        .catch((error) => Promise.reject(error));

    // @ts-expect-error Valid property
    promise.cancel = () => {
        source.cancel('Query was cancelled by React Query');
    };

    return promise;
};

export default customInstance;
