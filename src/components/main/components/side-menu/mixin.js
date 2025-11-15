import CommonIcon from '_c/common-icon'
import { showTitle } from '@/libs/util'
export default {
  components: {
    CommonIcon
  },
  methods: {
    showTitle (item) {
      return showTitle(item, this)
    },
    showChildren (item) {
      let isShow = true;
      if(!item.children){
        return false;
      }
      isShow = item.children && (item.children.length > 1 || (item.meta && item.meta.showAlways))
      if(item.children.length === 1){
        let items = item.children[0];
        return items.children && (items.children.length > 1 || (items.meta && items.meta.showAlways));
      }
      return isShow;
    },
    getNameOrHref (item, children0) {
      return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name)
    }
  }
}
