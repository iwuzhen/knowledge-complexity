import { infoAlova } from '..'

// suggestion
export function put_info_store(key: string, data: any,) {
  return infoAlova.Post(
    '/put_info_store',
    {
      key,
      data,
    },
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  )
}

// get_last_token
export function rm_info_store(key: string, data: any,) {
  return infoAlova.Post(
    '/rm_info_store',
    {
      key,
      data,
    },
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  )
}

// get_two_token
export function all_info_store(key: string) {
  return infoAlova.Get(
    '/all_info_store',
    {
      params: {
        key,
      },
    },
  )
}
