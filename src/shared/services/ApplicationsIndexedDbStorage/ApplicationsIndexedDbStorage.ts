import { PublisherSubscriber } from '@/shared/utils/PublisherSubscriber';
import type {
  IApplicationsStorage,
  IGeneratedApplication,
} from '@/shared/types';

export type TApplicationsIndexedDbChange = {
  application: IGeneratedApplication;
  type: 'add' | 'delete' | 'update';
};

interface IApplicationsIndexedDbStorageOptions {
  databaseName?: string;
  databaseVersion?: number;
  eventsPublisher?: PublisherSubscriber<TApplicationsIndexedDbChange>;
  indexedDb?: IDBFactory;
  objectStoreName?: string;
}

const DEFAULT_DATABASE_NAME = 'alt-shift-applications';
const DEFAULT_DATABASE_VERSION = 1;
const DEFAULT_OBJECT_STORE_NAME = 'generated-applications';

export const applicationsIndexedDbPublisherSubscriber =
  new PublisherSubscriber<TApplicationsIndexedDbChange>();

const requestToPromise = <TResult,>(
  request: IDBRequest,
): Promise<TResult> =>
  new Promise((resolve, reject) => {
    request.onerror = () => {
      reject(request.error ?? new Error('IndexedDB request failed.'));
    };

    request.onsuccess = () => {
      resolve(request.result as TResult);
    };
  });

export class ApplicationsIndexedDbStorage implements IApplicationsStorage {
  private databasePromise?: Promise<IDBDatabase>;

  private readonly databaseName: string;

  private readonly databaseVersion: number;

  private readonly eventsPublisher: PublisherSubscriber<TApplicationsIndexedDbChange>;

  private readonly indexedDb: IDBFactory;

  private readonly objectStoreName: string;

  constructor ({
    databaseName = DEFAULT_DATABASE_NAME,
    databaseVersion = DEFAULT_DATABASE_VERSION,
    eventsPublisher = applicationsIndexedDbPublisherSubscriber,
    indexedDb = window.indexedDB,
    objectStoreName = DEFAULT_OBJECT_STORE_NAME,
  }: IApplicationsIndexedDbStorageOptions = {}) {
    this.databaseName = databaseName;
    this.databaseVersion = databaseVersion;
    this.eventsPublisher = eventsPublisher;
    this.indexedDb = indexedDb;
    this.objectStoreName = objectStoreName;
  }

  add (application: IGeneratedApplication): Promise<IGeneratedApplication> {
    return this.withStore('readwrite', store =>
      requestToPromise<IGeneratedApplication>(store.add(application)),
    ).then(() => {
      this.eventsPublisher.notify({
        application,
        type: 'add',
      });

      return application;
    });
  }

  count (): Promise<number> {
    return this.withStore('readonly', store =>
      requestToPromise<number>(store.count()),
    );
  }

  getAll (): Promise<IGeneratedApplication[]> {
    return this.withStore('readonly', store =>
      requestToPromise<IGeneratedApplication[]>(store.getAll()),
    );
  }

  getById (id: string): Promise<IGeneratedApplication | undefined> {
    return this.withStore('readonly', store =>
      requestToPromise<IGeneratedApplication | undefined>(store.get(id)),
    );
  }

  async deleteById (id: string): Promise<void> {
    const currentApplication = await this.getById(id);

    if (!currentApplication) {
      throw new Error(`Generated application with id "${id}" was not found.`);
    }

    await this.withStore('readwrite', store =>
      requestToPromise(store.delete(id)),
    );

    this.eventsPublisher.notify({
      application: currentApplication,
      type: 'delete',
    });
  }

  async updateById (
    id: string,
    patch: Parameters<IApplicationsStorage['updateById']>[1],
  ): Promise<IGeneratedApplication> {
    const currentApplication = await this.getById(id);

    if (!currentApplication) {
      throw new Error(`Generated application with id "${id}" was not found.`);
    }

    const updatedApplication: IGeneratedApplication = {
      ...currentApplication,
      ...patch,
      id,
    };

    await this.withStore('readwrite', store =>
      requestToPromise(store.put(updatedApplication)),
    );

    this.eventsPublisher.notify({
      application: updatedApplication,
      type: 'update',
    });

    return updatedApplication;
  }

  private getDatabase (): Promise<IDBDatabase> {
    if (!this.databasePromise) {
      this.databasePromise = new Promise((resolve, reject) => {
        const request = this.indexedDb.open(
          this.databaseName,
          this.databaseVersion,
        );

        request.onerror = () => {
          reject(request.error ?? new Error('Failed to open IndexedDB.'));
        };

        request.onupgradeneeded = () => {
          const database = request.result;

          if (!database.objectStoreNames.contains(this.objectStoreName)) {
            database.createObjectStore(this.objectStoreName, {
              keyPath: 'id',
            });
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };
      });
    }

    return this.databasePromise;
  }

  private async withStore<TResult> (
    mode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => Promise<TResult>,
  ): Promise<TResult> {
    const database = await this.getDatabase();
    const transaction = database.transaction(this.objectStoreName, mode);
    const store = transaction.objectStore(this.objectStoreName);

    return callback(store);
  }

}

export const applicationsIndexedDbStorage =
  new ApplicationsIndexedDbStorage();
