import request from '../api/request'

/**
 * 查询列表
 * @param {*} params
 * @returns
 * @author ike
 */
export function getList(params) {
    return request({
        url: '/v1/liangwei/statistics/district',
        method: 'get',
        params
    })
}

/**
 * 查询类别列表
 * @returns
 */
export function getStatisticsModule() {
    return request({
        url: '/v1/liangwei/statistics',
        method: 'get'
    })
}


export function getStatisticsChange(params) {
  return request({
      url: '/v1/liangwei/statistics' + params.url,
      method: 'get',
      params:params.data
  })
}
