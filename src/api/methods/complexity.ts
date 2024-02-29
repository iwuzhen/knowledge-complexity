import { complexityAlova } from '..'

// 获取国家逐年论文数
export function get_number_of_papers_per_year_by_country_dx(flow: string) {
  return complexityAlova.Get<CountryRemoteDataType>(
    '/number_of_papers_per_year_by_country_dx',
    {
      params: {
        flow,
      },
    },
  )
}

// 获取国家逐年论文数
export function paper_ingredient(mode: string, flow: string, countries: string[], years: Number[]) {
  return complexityAlova.Post<TreeMapData[]>(
    '/paper_ingredient',
    {
      mode, flow, countries, years,
    },
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  )
}

// 从专利获取国家的信息，不同国家对几个专利的贡献度
export function paper_subject_ingredient(mode: string, flow: string, subjects: string[], years: Number[]) {
  return complexityAlova.Post<TreeMapData[]>(
    '/subject_ingredient',
    {
      mode, flow, subjects, years,
    },
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  )
}

// 获取国家逐年专利数
export function patent_ingredient(mode: string, flow: string, countries: string[], year: Number) {
  return complexityAlova.Post<TreeMapData[]>(
    '/patent_ingredient',
    {
      mode, flow, countries, year,
    },
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  )
}

// 获取国家的 eci, 全量
export function get_country_eci() {
  return complexityAlova.Get<CountryRemoteDataType>(
    '/country_eci',
  )
}

// 获取学科的 pci， 每年 top50
export function get_subject_pci() {
  return complexityAlova.Get<CountryRemoteDataType>(
    '/subject_pci',
  )
}

// 获取国家的 github eci, 全量
export function get_github_country_eci(filter_cat: Number) {
  return complexityAlova.Get<CountryRemoteDataType>(
    '/github_country_eci',
    {
      params: {
        filter_cat,
      },
    },
  )
}
// 获取学科的 pci， 每年 top50
export function get_github_tag_pci(filter_cat: Number) {
  return complexityAlova.Get<CountryRemoteDataType>(
    '/github_tag_pci',
    {
      params: {
        filter_cat,
      },
    },
  )
}

// 论文趋势，堆叠折线图
export function paper_ingredient_trend(mode: string, flow: string, countries: string[]) {
  return complexityAlova.Post<ChartOption>(
    '/paper_ingredient_trend',
    {
      mode, flow, countries,
    },
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  )
}

// 论文趋势，堆叠折线图
export function subject_ingredient_trend(mode: string, flow: string, subjects: string[]) {
  return complexityAlova.Post<ChartOption>(
    '/subject_ingredient_trend',
    {
      mode, flow, subjects,
    },
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  )
}

// 专利趋势，堆叠折线图
export function patent_ingredient_trend(mode: string, flow: string, countries: string[]) {
  return complexityAlova.Post<ChartOption>(
    '/patent_ingredient_trend',
    {
      mode, flow, countries,
    },
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  )
}
