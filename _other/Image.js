class Images {
  // 没写完，不能用
  constructor(imgUrl) {
    this.imgUrl = imgUrl;
    (async () => {
      this.imgFile = await this.getFile()
    })()
  }

  getFile() {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.readAsDataURL(this.imgUrl)
      reader.addEventListener('load', () => resolve(reader))
    })
  }

  getImg() {
    return new Promise(resolve => {
      const img = new Image()
      img.src = this.imgUrl
      img.onload = () => resolve(img)
    })
  }

  gatBase64() {
    return this.imgFile.result
  }

  getSize() {
    return this.imgFile.size
  }

  getType() {
    return this.imgFile.type
  }

  isImage() {
    return this.imgFile.type.includes('image/')
  }

  isSize(size) {
    return this.imgFile.size < size
  }
}
