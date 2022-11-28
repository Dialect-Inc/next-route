import { execaCommandSync } from 'execa'
import { chProjectDir, copyPackageFiles, rmDist } from 'lionconfig'

chProjectDir(import.meta.url)
rmDist()
execaCommandSync('tsc')
execaCommandSync('tsc-alias')
await copyPackageFiles({ commonjs: true })
