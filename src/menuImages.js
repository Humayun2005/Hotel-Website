// Photo per image key (see menuData.js). Sources: the client's menu PDF and Pexels (free licence).
const files = import.meta.glob('./assets/menu/*.jpg', { eager: true, import: 'default' })

export const menuImages = Object.fromEntries(Object.entries(files).map(([file, url]) => [file.split('/').pop().replace('.jpg', ''), url]))
