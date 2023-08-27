import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { History } from '../entity/History';

export class HistoryService {
  private historyRepository = AppDataSource.getRepository(History);

  async createHistory(
    user: User,
    fileName: string,
    action: 'CREATE' | 'DOWNLOAD' | 'DELETE'
  ): Promise<History> {
    const newHistory = this.historyRepository.create({
      user,
      fileName,
      action,
    });
    return this.historyRepository.save(newHistory);
  }

  async fetchHistory(): Promise<History[]> {
    const allHistory = this.historyRepository.find({
      order: { timestamp: 'DESC' },
    });

    return allHistory;
  }
}
