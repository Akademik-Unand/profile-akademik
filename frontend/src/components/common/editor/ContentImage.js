import Image from '@tiptap/extension-image';
import { imageClass } from '../../../helpers/contentImage';

export const ContentImage = Image.extend({
  inline: false,
  group: 'block',
  addAttributes() {
    return {
      ...this.parent?.(),
      alt: { default: null },
      class: {
        default: imageClass(),
        parseHTML: (element) => element.getAttribute('class'),
        renderHTML: (attributes) => (attributes.class ? { class: attributes.class } : {}),
      },
    };
  },
});
