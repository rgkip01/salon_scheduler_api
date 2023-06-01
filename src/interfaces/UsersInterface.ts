interface ICreate {
  name: string;
  email: string;
  password: string;
}
interface IUpdate {
  name: string, 
  oldPassword: string,
  newPassword: string
  avatar_url?: FileUpload
}

interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer
  size: number
}

export { ICreate, IUpdate };