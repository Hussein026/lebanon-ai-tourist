export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

export function isRetired() {
  const u = getUser()
  return !!u && u.segment === 'retired'
}

export function isAccessible(item) {
  return item.accessibility === 'accessible' || item.accessibility === 'partial'
}
