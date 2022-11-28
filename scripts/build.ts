import { chProjectDir, copyPackageFiles, rmDist, tsc } from 'lionconfig'

chProjectDir(import.meta.url)
rmDist()
tsc()
await copyPackageFiles()
