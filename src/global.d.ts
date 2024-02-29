interface CountryRemoteDataType {
  data: (number|null)[][]
  rank: (number|null)[][]
  legend: string[]
  year: number[]
}
  

type RowData_1 = [string, number][]

interface TreeMapData {
  name: string
  value: number
  children? :  TreeMapData[]
}

interface ChartOption {
  data: number[][]
  legend: string[]
}