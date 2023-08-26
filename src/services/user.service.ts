import { User } from '../entity/User';
import { AppDataSource } from '../data-source';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(
    fullName: string,
    email: string,
    role: string,
    password: string
  ): Promise<User> {
    const newUser = this.userRepository.create({
      fullName,
      email,
      role,
      password,
    });
    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }
}
