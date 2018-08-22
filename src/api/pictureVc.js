import { comUrl } from '@/utils/index'

export function getPictureVC(flag) {
  return comUrl + '/ajax/PictureVC?t=' + new Date().getTime() + '&flag=' + flag + '&__timeout=' + 3 * 1000 * 60
}
