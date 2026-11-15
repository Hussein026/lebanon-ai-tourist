import axios from 'axios'

export const API = 'http://127.0.0.1:8001/api/reviews/'
const cache = {}
const listeners = new Set()

export function loadSummary(type, force = false) {
  if (!cache[type] || force) {
    cache[type] = axios.get(API + 'summary/', { params: { type } })
      .then(res => res.data)
      .catch(() => ({}))
  }
  return cache[type]
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

export function refreshSummary(type) {
  loadSummary(type, true).then(() => listeners.forEach(fn => fn(type)))
}
