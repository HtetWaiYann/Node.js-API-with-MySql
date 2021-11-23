import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config';
import argon2 from 'argon2';
import { IUser, IUserInputDTO } from '../interfaces/IUser';

@Service()
export default class AuthService {
  constructor(
    @Inject('userModel') private userModel: any,
    @Inject('logger') private logger : any,
  ) {
  }

  public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser }> {
    try {

      const hashedPassword = await argon2.hash(userInputDTO.password);
      const userData = {
        _id : "custom_id1",
        ...userInputDTO,
        password: hashedPassword,
      }

      var userRecord : any;
      await this.userModel.services.create(userData).then(
        (data:any) => {
          userRecord = data
        }
      )
      if (!userRecord) {
        throw new Error('User cannot be created');
      }
      this.logger.info(JSON.stringify(userRecord))
      const user = userRecord;
      Reflect.deleteProperty(user, 'password');
      return { user };
    } catch (e) {
      throw e;
    }
  }

  public async SignIn(email: string, password: string): Promise<{ user:IUser, token: string }> {
    var userRecord : any;
    await this.userModel.services.findAll({ where : {email : email} }).then((data:any) => {
      if(data.length > 0){
        userRecord = data[0]
      }
    })
    if (!userRecord) {
      throw new Error('User not registered');
    }

    const validPassword = await argon2.verify(userRecord.password, password);
    if (validPassword) {
      const token = this.generateToken(userRecord);
      const user = userRecord;
      Reflect.deleteProperty(user, 'password');
      return { user, token };
    } else {
      throw new Error('Invalid Password');
    }
  }

  private generateToken(user: any) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    // this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        _id: user._id, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        name: user.name,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret!
    );
  }
}
