import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { animatedUno } from 'animated-unocss'
import { presetForms } from '@julr/unocss-preset-forms'
export default defineConfig({
  shortcuts: [
    ['btn', 'cursor-pointer flex gap-2 items-center p-2.5 px-4 leading-4 box-border duration-200 border border-transparent'],
    ['menu-item', 'p-2 flex gap-2 items-center cursor-pointer hover:bg-gray-50 duration-200 rounded']
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      collections: {
        'con': FileSystemIconLoader(
          './assets/icons',
          svg => svg,
        ),
      },
    }),
    presetForms(),
    animatedUno(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    fontSize: {
      '2xs': '.5rem',
    },
    dropShadow: {
      't': '-1px -3px 3px 0px rgba(0,0,0,0.75)',
    }
  },
  safelist: [
    'i-con-facebook',
    'i-con-twitter',
    'i-con-pinterest',
    'i-con-telegram',
    'i-con-discord',
    'i-con-template',
    'i-con-picture',
    'i-con-shared',
    'i-con-color',
    'i-con-hash',
    'animate-pulse'
  ],
})
