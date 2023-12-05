import {onBeforeUnmount, onMounted} from 'vue'

export default function useDetectOutsideClick(component: { value: any }, callback: () => void) {
  if (!component) return
  const listener = (event: { target: any; composedPath: () => string | any[] }) => {
    if (event.target !== component.value && event.composedPath().includes(component.value)) {
      return
    }
    if (typeof callback === 'function') {
      callback()
    }
  }
  onMounted(() => {
    window.addEventListener('click', listener)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('click', listener)
  })

  return {listener}
}
