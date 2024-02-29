import { wikiNikeAlova } from '..'

const subject = ['Biology', 'Chemistry', 'Computer science', 'Economics', 'Engineering disciplines', 'History', 'Environmental science', 'Political science', 'Mathematics', 'Medicine,Philosophy', 'Physics', 'Sociology', 'Psychology', 'Materials science', 'Geology', 'Geography']

// MAG学科距离
export function getMAGSubjectDistance(strA: string) {
  return wikiNikeAlova.Post(
    '/wiki/getMasDistance_v2',
    {
      bf: -1,
      from: 1955,
      method: 'linksin',
      qs: -1,
      strA,
      strB: subject.filter((item) => {
        if (item === strA)
          return false

        return true
      }).join(','),
      to: 2020,
      version: 'delete_noref_v3_node',
    },
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json, text/plain, */*',
      },
    },
  )
}

// wikipedia 学科距离
export function getWikipediaSubjectDistance(strA: string) {
  return wikiNikeAlova.Post(
    '/wiki/getDistanceCore',
    {
      btype: 'v5_xueshu_node_newDB',
      level: -1,
      levelType: 3,
      method: 'linksin',
      strA,
      strB: ['Biology', 'Computer science', 'Economics', 'Engineering disciplines', 'Environmental science', 'Geography', 'Geology', 'Linguistics', 'Materials science', 'Mathematics', 'Medicine', 'Philosophy', 'Physics', 'Political science', 'Psychology', 'Sociology'].filter((item) => {
        if (item === strA)
          return false

        return true
      }).join(','),
    },
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json, text/plain, */*',
      },
    },
  )
}
