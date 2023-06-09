import { UsersRepository } from "../repositories/UsersRepository";
import { ICreate, IUpdate } from "../interfaces/UsersInterface";
import { compare, hash } from "bcrypt";
import { v4 as uuid } from 'uuid';
import { s3 } from "../config/aws";
import { sign, verify } from "jsonwebtoken";

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

  async update({name, oldPassword, newPassword, avatar_url, user_id }: IUpdate){
    let pwd;
    const findUserById = await this.usersRepository.findUserById(user_id);

    if(!findUserById) {
      throw new Error("User not found");
    }

    if(oldPassword && newPassword) {
      const passwordMatch = compare(oldPassword, findUserById.password);
      
      if(!passwordMatch) {
        throw new Error("Password invalid");
      }
      pwd = await hash(newPassword, 10);
      await this.usersRepository.updateWithNewPassword(pwd, user_id);
    }

    if(avatar_url){
      const uploadImage = avatar_url?.buffer;
    
      const uploadS3 = await s3.upload({
        Bucket: 'scheduler-ts-api',
        Key: `${uuid()}-${ avatar_url?.originalname}`, 
        ACL: 'public-read',
        Body: uploadImage
      }).promise()

      await this.usersRepository.update(name, uploadS3.Location, user_id);
    }
    return {
      message: 'User updated successfully'
    };
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
      expiresIn: '30m',
    });

    const refreshToken = sign({email}, secretKey, {
      subject: findUser.id,
      expiresIn: '7d',
    });

    return {
      token,
      refresh_token: refreshToken, 
      user: {
        name: findUser.name,
        email: findUser.email
      },
    }
  }

  async refresh(refresh_token: string){
    if(!refresh_token){
      throw new Error("Refresh token missing");
    } 

    let secretKey:string | undefined = process.env.API_SECRET_KEY
    if(!secretKey){
      throw new Error("There is not refresh token key");
    }

    const checkRefreshToken = verify(refresh_token, secretKey)
    const { sub } = checkRefreshToken

    const newToken =  sign({ sub }, secretKey, {
      expiresIn: '30min'
    });

    return { token: newToken }
  }
}

export { UsersServices };