
import multer from 'multer'

export interface File {
  name: string;
  size: number;
  type: string;
  extension: string;
  content: ArrayBuffer;
}
export const uploadFiles = multer({
  limits: {
    // 限制上傳檔案的大小為 1MB
    fileSize: 10000000
  },
  fileFilter (req, file, cb) {
    // 只接受三種圖片格式
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
      cb(null, false)
    }
    cb(null, true)
  }
})
