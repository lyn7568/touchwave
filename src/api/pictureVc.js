import { comUrl } from '@/utils/index'

export function getPictureVC(flag) {
  return comUrl + '/ajax/PictureVC?' + new Date().getTime() + '&flag=' + flag
}
