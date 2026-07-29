import { sitesWithMapPosition } from '../utils/supplyMapCoords'

for (const site of sitesWithMapPosition()) {
  console.log(`${site.short.padEnd(14)} ${site.lat}, ${site.lon} -> ${site.x}%, ${site.y}%`)
}
