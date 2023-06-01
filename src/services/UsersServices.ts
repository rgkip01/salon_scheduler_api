import { UsersRepository } from "../repositories/UsersRepository";
import { ICreate, IUpdate } from "../interfaces/UsersInterface";
import { compare, hash } from "bcrypt";
import { v4 as uuid } from 'uuid';
import { s3 } from "../config/aws";
import { sign } from "jsonwebtoken";

class UsersServices {
  private usersRepository: UsersRepository

  constructor(){
    this.usersRepository = new UsersRepository;
  }
  async create({name, email, password}: ICreate){
    const findByUser = await this.usersRepository.findUserByEmail(email)
    
    if(findByUser) {
      throw new Error('user already exists')
    }
    
    const hashPassword = await hash(password, 10)

    return this.usersRepository.create({
      name, 
      email,
      password: hashPassword
    })
  }

  async update({name, oldPassword, newPassword, avatar_url }: IUpdate){
    const uploadImage = avatar_url?.buffer;
    
    const uploadS3 = await s3.upload({
      Bucket: 'scheduler-ts-api',
      Key: `${uuid()}-${ avatar_url?.originalname}`, 
      ACL: 'public-read',
      Body: uploadImage
    }).promise()

    console.log('URL_IMAGE', uploadS3.Location);
  }
  
  async auth(email: string, password: string) {
    const findUser = await this.usersRepository.findUserByEmail(email);
    
    if(!findUser) {
      throw new Error("User or Password invalid");
    }

    const passwordMatch = compare(password, findUser.password);

    if(!passwordMatch) {
      throw new Error("User or Password invalid");
    }

    let secretKey:string | undefined = process.env.API_SECRET_KEY
    if(!secretKey){
      throw new Error("There is not tokenKey");
    }

    const token = sign({email}, secretKey, {
      subject: findUser.id,
      expiresIn: 60 * 30,
    })

    return {
      token, 
      user: {
        name: findUser.name,
        email: findUser.email
      },
    }
  }
}

export { UsersServices };