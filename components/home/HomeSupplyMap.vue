<template>
  <div class="supply-map" aria-label="География поставок КЭМЗ">
    <div v-show="!failed" ref="mapRoot" class="supply-map__leaflet" />
    <div v-if="failed" class="supply-map__fallback">
      <img
        src="/media/map-eurasia-supply.png"
        alt="Карта поставок: Россия, СНГ, Индия"
        class="supply-map__fallback-img"
        width="1536"
        height="1024"
      />
      <ul class="supply-map__pins">
        <li
          v-for="site in fallbackSites"
          :key="site.name"
          class="pin"
          :class="{ 'pin--export': site.export }"
          :style="{ left: site.x + '%', top: site.y + '%' }"
          :title="site.name"
        >
          <span class="pin__dot" />
          <span class="pin__label">{{ site.short }}</span>
        </li>
      </ul>
    </div>
    <ul v-if="!failed" class="supply-map__legend">
      <li><span class="legend-dot" /> Площадки в России</li>
      <li><span class="legend-dot legend-dot--export" /> Экспорт</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { SUPPLY_SITES, sitesWithMapPosition } from '~/utils/supplyMapCoords'
import type { Map as LeafletMap } from 'leaflet'

const mapRoot = ref<HTMLElement | null>(null)
const failed = ref(false)
const fallbackSites = sitesWithMapPosition().map((site) =>
  site.short === 'СДС-Уголь' ? { ...site, x: site.x + 1.2, y: site.y + 1.8 } : site,
)

let map: LeafletMap | null = null

onMounted(async () => {
  await nextTick()
  if (!mapRoot.value || import.meta.server) return

  try {
    const leaflet = await import('leaflet')
    const L = leaflet.default

    map = L.map(mapRoot.value, {
      center: [52, 68],
      zoom: 3,
      minZoom: 2,
      maxZoom: 6,
      scrollWheelZoom: false,
      attributionControl: true,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    map.fitBounds(
      [
        [12, -5],
        [72, 95],
      ],
      { padding: [18, 18] },
    )

    for (const site of SUPPLY_SITES) {
      const isExport = site.export
      const lon = site.short === 'СДС-Уголь' ? site.lon + 0.14 : site.lon

      const icon = L.divIcon({
        className: 'supply-pin',
        html: `<span class="supply-pin__dot${isExport ? ' supply-pin__dot--export' : ''}"></span>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })

      L.marker([site.lat, lon], { icon })
        .addTo(map)
        .bindTooltip(site.short, {
          permanent: true,
          direction: 'right',
          offset: [8, 0],
          className: `supply-pin__label${isExport ? ' supply-pin__label--export' : ''}`,
        })
        .bindPopup(
          `<strong>${site.name}</strong><br>${site.lat.toFixed(2)}°N, ${site.lon.toFixed(2)}°E`,
        )
    }

    requestAnimationFrame(() => {
      map?.invalidateSize()
    })
  } catch (error) {
    console.error('[HomeSupplyMap] Leaflet init failed', error)
    failed.value = true
  }
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>

<style scoped>
.supply-map {
  position: relative;
  overflow: hidden;
  border: 1px solid #e8ecf1;
  background: #f5f7fa;
  min-height: 420px;
  height: min(52vw, 520px);
}

.supply-map__leaflet {
  width: 100%;
  height: 100%;
  min-height: 420px;
}

.supply-map__fallback {
  position: absolute;
  inset: 0;
}

.supply-map__fallback-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #fff;
}

.supply-map__pins {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pin {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 6px;
}

.pin__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2f78cd;
  border: 2px solid #fff;
  box-shadow: 0 0 0 4px rgba(47, 120, 205, 0.14);
  flex-shrink: 0;
}

.pin--export .pin__dot {
  background: #1e4f8c;
}

.pin__label {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid #e8ecf1;
  color: #4b5563;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.supply-map__legend {
  position: absolute;
  left: 16px;
  bottom: 14px;
  z-index: 500;
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 10px 12px;
  list-style: none;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid #e8ecf1;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6b7280;
  pointer-events: none;
}

.legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 8px;
  border-radius: 50%;
  background: #2f78cd;
  vertical-align: middle;
}

.legend-dot--export {
  background: #1e4f8c;
}

:deep(.leaflet-container) {
  width: 100%;
  height: 100%;
  font-family: 'IBM Plex Mono', monospace;
  background: #f5f7fa;
}

:deep(.leaflet-control-attribution) {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.92) !important;
}

:deep(.supply-pin) {
  background: transparent;
  border: 0;
}

:deep(.supply-pin__dot) {
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #2f78cd;
  border: 2px solid #fff;
  box-shadow: 0 0 0 4px rgba(47, 120, 205, 0.16);
}

:deep(.supply-pin__dot--export) {
  background: #1e4f8c;
  box-shadow: 0 0 0 4px rgba(30, 79, 140, 0.16);
}

:deep(.supply-pin__label) {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid #e8ecf1;
  color: #4b5563;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  white-space: nowrap;
  box-shadow: none;
}

:deep(.supply-pin__label--export) {
  color: #1e4f8c;
}

:deep(.leaflet-tooltip-left::before),
:deep(.leaflet-tooltip-right::before) {
  display: none;
}

@media (max-width: 640px) {
  .supply-map,
  .supply-map__leaflet {
    min-height: 280px;
    height: 280px;
  }

  :deep(.supply-pin__label),
  .pin__label {
    display: none;
  }
}
</style>
