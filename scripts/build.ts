import { execaCommand, execaCommandSync } from 'execa'
import { chProjectDir, copyPackageFiles, rmDist } from 'lionconfig'

chProjectDir(import.meta.url)
rmDist()
await Promise.all([
	execaCommand('tsc'),
	execaCommand('tsc --emitDeclarationOnly --declarationDir dist'),
])
execaCommandSync('tsc-alias')
await copyPackageFiles({ commonjs: true })
