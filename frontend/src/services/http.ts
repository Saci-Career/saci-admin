import { ErrorMessage } from './messages'

enum HttpServerError {
  HTTP_SERVER_ERROR = 500,
  HTTP_STATUS_CODE_CONFLICT = 409,
  HTTP_STATUS_BAD_REQUEST = 400
}

const fetchWrapper = async (url: string, init: RequestInit): Promise<Response> => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  })

  // TODO: create an env file to store the URL
  return await fetch(`http://localhost:8080/api${url}`, {
    ...init,
    mode: 'cors',
    headers
  })
}

const doRequest = async <T>(url: string, method: string, body?: object | string): Promise<T> => {
  if (typeof body !== 'string') {
    body = JSON.stringify(body)
  }
  const response = await fetchWrapper(url, {
    method,
    body
  })

  if (!response.ok) {
    if (response.status === HttpServerError.HTTP_SERVER_ERROR) {
      ErrorMessage('Technical error')
    }
    throw response
  }

  let result

  if (response?.headers?.get('Content-Type')?.includes('application/json')) {
    result = await response.json()
  } else {
    result = await response.text()
  }

  return Promise.resolve(result)
}

const patch = async <T>(url: string, body: object): Promise<T> => {
  return doRequest<T>(url, 'PATCH', body)
}

const get = async <T>(url: string): Promise<T> => {
  return doRequest(url, 'GET')
}

const deleteRequest = async <T>(url: string): Promise<T> => {
  return doRequest<T>(url, 'DELETE')
}

const post = async <T>(url: string, body: object): Promise<T> => {
  return doRequest(url, 'POST', body)
}
const put = async <T>(url: string, body: object): Promise<T> => {
  return doRequest<T>(url, 'PUT', body)
}
export { fetchWrapper, get, patch, doRequest, deleteRequest, post, put, HttpServerError }
