import { rollup } from 'rollup'
import path from 'path'
import multi from '@rollup/plugin-multi-entry'
import terser from '@rollup/plugin-terser'
// import ignore from 'rollup-plugin-ignore'
import nodeResolve from '@rollup/plugin-node-resolve'

console.log('builtinModules'.builtinModules)
const { resolve } = path

function resolvePath(file, origin) {
  // Your way to resolve local include path
  console.log(file, origin)
}

function pathResolve(options) {
  return {
      resolveId: function(file, origin) {
        console.log('file', file, origin)
          // Your local include path must either starts with `./` or `../`
          if (file.startsWith('./') || file.startsWith('../')) {
              // Return an absolute include path
              return resolvePath(file, origin);
          }
          return null; // Continue to the next plugins!
      }
  };
}

const batchFiles = async (
  batchList,
  output,
  dir,
  minify
) => {

  const file = resolve(dir, output)
  let bundle
  let buildFailed = false
  const input = batchList.map(item => resolve(dir, item))
  try {
    // Input options
    bundle = await rollup({
      makeAbsoluteExternalsRelative: false,
      onwarn: function (message) {
        if (/external dependency/.test(message)) return
        console.error(message)
      },
      external: (a,b,c) => {
        // console.log(b,c)
        return !input.includes(a)
      },
      input,
      plugins: [
        multi(),
        minify && terser(),
        // ignore(['*']),
        // nodeResolve({
        //   modulesOnly: true
        // }),
        pathResolve()
      ]
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
