const { readCSV, readDirectory, readSourcesName } = require('./src/utils/fileHandler')
const asyncForEach = require('./src/utils/asyncForeach')
const CatalogModel = require('./src/models/CatalogModel')

// read file func
const readFileStep = async() => {
  const fileNames = await readDirectory('./input')
  const sources = await readSourcesName(fileNames)
  const data = []
  await asyncForEach(sources, async (sourceName) => {
    data[sourceName] = []
    data[sourceName].catalog = await readCSV(`./input/catalog${sourceName}.csv`)
    data[sourceName].barcodes = await readCSV(`./input/barcodes${sourceName}.csv`)
    data[sourceName].suppliers = await readCSV(`./input/suppliers${sourceName}.csv`)
  })
  return data
}

const processMergeStep = async (data) =>{
  const catalogObj = new CatalogModel()

  await asyncForEach(Object.keys(data), async (catalogSourceNane) => {
    await catalogObj.addProducts(data[catalogSourceNane])
  })

  return catalogObj
}

const runApp = async () => {
  // 1. Read CSV files
  const data = await readFileStep()

  // 2. Process files and merge Products
  const mergedResult = await processMergeStep(data)
  console.log('mergedResult', mergedResult)

  // 3. Genrate output file

}

runApp()
