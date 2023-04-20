import { rollup } from 'rollup'
import path from 'path'
import multi from '@rollup/plugin-multi-entry'
const { resolve } = path
const batchFiles = async (batchList, output, dir) => {
 
  const file = resolve(dir, output)
  console.log('batchList', file)
  // console.log('batchList, file', file, dir)
  let bundle
  let buildFailed = false
  try {
    bundle = await rollup({
      input: batchList.map(item => resolve(dir, item)),
      plugins: [multi()]
    })
    await bundle.write({
      name: 'main',
      file,
      format: 'es'
    })
  } catch (error) {
    buildFailed = true
    console.error(error)
  }
  if (bundle) {
    await bundle.close()
  }
  process.exit(buildFailed ? 1 : 0)
}

export { batchFiles }
