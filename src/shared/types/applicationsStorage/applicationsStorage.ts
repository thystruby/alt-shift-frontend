import type { IGeneratedApplication } from '../generatedApplication';

type TApplicationsStorageUpdatePatch = Partial<Omit<IGeneratedApplication, 'id'>>;

export interface IApplicationsStorage {
  add(application: IGeneratedApplication): Promise<IGeneratedApplication>;
  count(): Promise<number>;
  deleteById(id: string): Promise<void>;
  getAll(): Promise<IGeneratedApplication[]>;
  getById(id: string): Promise<IGeneratedApplication | undefined>;
  updateById(
    id: string,
    patch: TApplicationsStorageUpdatePatch,
  ): Promise<IGeneratedApplication>;
}
