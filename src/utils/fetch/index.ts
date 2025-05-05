import { Cloudinary } from '@/server/libs/cloudinary';

interface UrlConfig {
  [key: string]: string;
}

interface RequestOptions {
  headers?: Record<string, string>;
}

const fetchUrl = (urlType: string) => {
  const urlConfig: UrlConfig = {
    apiV1: '/api',
  };
  const urlPath = urlConfig[urlType];
  return urlPath;
};

const createQueryString = (obj: { [key: string]: any }): string => {
  if (!obj) {
    return '';
  }
  const esc = encodeURIComponent;
  return Object.keys(obj)
    .map((k) => `${esc(k)}=${esc(obj[k])}`)
    .join('&');
};

const fetchHandler = async (res: any) => res.json();

const checkSuccess = (res: any) => res;

const fetchErrorHandler = (res: any) => Promise.reject(res);

const createHeaders = () => {
  const headers = new Headers();
  headers.set('Pragma', 'no-cache');
  headers.set('Cache-Control', 'no-cache');
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');
  return new Headers(headers);
};

const createOptions = (_url: string, options: any = {}): RequestOptions => {
  options.headers = createHeaders();
  return options;
};

const get = (
  url: string,
  queryParams = null,
  options = {},
  urlPath = 'apiV1'
) => {
  let qs;
  let newUrl;
  if (queryParams) {
    qs = createQueryString(queryParams);
    newUrl = `${fetchUrl(urlPath)}/${url}?${qs}`;
  } else {
    newUrl = `${fetchUrl(urlPath)}/${url}`;
  }
  const getOptions = { method: 'GET' };
  options = { ...options, ...getOptions };
  const optionsWithHeaders = createOptions(url, options);
  return fetch(newUrl, optionsWithHeaders)
    .then(fetchHandler)
    .then(checkSuccess)
    .catch((e) => fetchErrorHandler(e));
};

const post = (url: string, body: object, options = {}, urlPath = 'apiV1') => {
  const postOptions = { method: 'POST', body: JSON.stringify(body) };
  options = { ...options, ...postOptions };
  const optionsWithHeaders = createOptions(url, options);
  return fetch(`${fetchUrl(urlPath)}/${url}`, optionsWithHeaders)
    .then(fetchHandler)
    .then(checkSuccess)
    .catch((e) => fetchErrorHandler(e));
};

const put = (url: string, body: object, options = {}, urlPath = 'apiV1') => {
  const putOptions = { method: 'PUT', body: JSON.stringify(body) };
  options = { ...options, ...putOptions };
  const optionsWithHeaders = createOptions(url, options);
  return fetch(`${fetchUrl(urlPath)}/${url}`, optionsWithHeaders)
    .then(fetchHandler)
    .then(checkSuccess)
    .catch((e) => fetchErrorHandler(e));
};

const del = (url: string, body: object, options = {}, urlPath = 'apiV1') => {
  let qs;
  let newUrl;
  if (body) {
    qs = createQueryString(body);
    newUrl = `${fetchUrl(urlPath)}/${url}?${qs}`;
  } else {
    newUrl = `${fetchUrl(urlPath)}/${url}`;
  }
  const deleteOptions = { method: 'DELETE', body: JSON.stringify(options) };
  options = { ...options, ...deleteOptions };
  const optionsWithHeaders = createOptions(url, options);
  return fetch(newUrl, optionsWithHeaders)
    .then(fetchHandler)
    .then(checkSuccess)
    .catch((e) => fetchErrorHandler(e));
};

const upload = ({ file }: any) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''
  );
  return fetch(
    `https://api.cloudinary.com/v1_1/${
      // @ts-ignore
      Cloudinary.getConfig().cloud.cloudName
    }/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )
    .then(fetchHandler)
    .then(checkSuccess)
    .catch((e) => fetchErrorHandler(e));
};

const audioUpload = ({ file }: { file: File }) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''
  );

  return fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`, // Changed to /video/upload
    {
      method: 'POST',
      body: formData,
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error uploading file:', error);
      throw error;
    });
};

export { get, post, put, del, upload, audioUpload };
