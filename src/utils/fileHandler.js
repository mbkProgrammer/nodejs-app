// eslint-disable-next-line import/no-extraneous-dependencies
const Papa = require('papaparse')
const fs = require('fs')

const readSourcesName = (fileNames) => {
  const catalogNames = fileNames.filter((fileName) =>
    fileName.startsWith('catalog')
  )
  const sources = catalogNames.map((catalogName) =>
    catalogName.replace(/catalog|.csv/g, '')
  )

  return sources
}

const readDirectory = (folderPath) => fs.readdirSync(folderPath)

const readCSV = (filesPath) =>
  new Promise((resolve) => {
    const csvFile = fs.readFileSync(filesPath).toString()
    Papa.parse(csvFile, {
      header: true,
      complete(result) {
        // executed after all files are complete
        resolve(result.data)
      },
      // rest of config ...
    })
  })

const generateCSV = async (data) => {
  const csv = Papa.unparse({
    fields: ['SKU', 'Description'],
    data: data.map((product) => ({
      SKU: product.SKU,
      Description: product.Description,
    })),
  })
  await fs.writeFileSync('./output/result.csv', csv)
}

module.exports = {
  readCSV,
  readDirectory,
  readSourcesName,
  generateCSV
}
