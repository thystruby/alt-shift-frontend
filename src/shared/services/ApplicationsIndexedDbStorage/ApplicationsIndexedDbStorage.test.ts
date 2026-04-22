import { describe, expect, it, vi } from 'vitest';

import { PublisherSubscriber } from '@/shared/utils/PublisherSubscriber';
import {
  ApplicationsIndexedDbStorage,
} from './ApplicationsIndexedDbStorage';
import type { IGeneratedApplication } from '@/shared/types';
import type { TApplicationsIndexedDbChange } from './ApplicationsIndexedDbStorage';

interface IMockRequest<TResult> {
  error: DOMException | null;
  result: TResult;
  onerror: ((event: Event) => void) | null;
  onsuccess: ((event: Event) => void) | null;
}

interface IMockOpenRequest extends IMockRequest<IDBDatabase> {
  onupgradeneeded: ((event: IDBVersionChangeEvent) => void) | null;
}

const createSuccessfulRequest = <TResult,>(
  result: TResult,
): IDBRequest<TResult> => {
  const request: IMockRequest<TResult> = {
    error: null,
    result,
    onerror: null,
    onsuccess: null,
  };

  setTimeout(() => {
    request.onsuccess?.(new Event('success'));
  }, 0);

  return request as unknown as IDBRequest<TResult>;
};

const createDatabaseMock = (objectStore: IDBObjectStore): IDBDatabase =>
  ({
    createObjectStore: () => objectStore,
    objectStoreNames: {
      contains: () => false,
    },
    transaction: () =>
      ({
        objectStore: () => objectStore,
      }) as unknown as IDBTransaction,
  }) as unknown as IDBDatabase;

const createObjectStoreMock = (
  records: Map<string, IGeneratedApplication>,
): IDBObjectStore =>
  ({
    add: (application: IGeneratedApplication) => {
      records.set(application.id, application);

      return createSuccessfulRequest(application.id);
    },
    count: () => createSuccessfulRequest(records.size),
    delete: (id: string) => {
      records.delete(id);

      return createSuccessfulRequest(undefined);
    },
    get: (id: string) => createSuccessfulRequest(records.get(id)),
    getAll: () => createSuccessfulRequest(Array.from(records.values())),
    put: (application: IGeneratedApplication) => {
      records.set(application.id, application);

      return createSuccessfulRequest(application.id);
    },
  }) as unknown as IDBObjectStore;

const createIndexedDbMock = (): IDBFactory => {
  const records = new Map<string, IGeneratedApplication>();
  const objectStore = createObjectStoreMock(records);
  const database = createDatabaseMock(objectStore);

  return {
    open: () => {
      const request: IMockOpenRequest = {
        error: null,
        result: database,
        onerror: null,
        onsuccess: null,
        onupgradeneeded: null,
      };

      setTimeout(() => {
        request.onupgradeneeded?.(
          new Event('upgradeneeded') as IDBVersionChangeEvent,
        );
        request.onsuccess?.(new Event('success'));
      }, 0);

      return request as unknown as IDBOpenDBRequest;
    },
  } as unknown as IDBFactory;
};

const createGeneratedApplication = (id: string): IGeneratedApplication => ({
  id,
  additionalDetails: 'Additional details',
  company: 'Company',
  generatedResult: 'Generated result',
  jobTitle: 'Job title',
  keySkills: ['React'],
});

describe('ApplicationsIndexedDbStorage', () => {
  it('adds, reads, updates, and deletes generated applications asynchronously', async () => {
    const storage = new ApplicationsIndexedDbStorage({
      databaseName: 'test-applications',
      indexedDb: createIndexedDbMock(),
    });

    const application = createGeneratedApplication('application-1');

    await expect(storage.add(application)).resolves.toEqual(application);
    await expect(storage.count()).resolves.toBe(1);
    await expect(storage.getAll()).resolves.toEqual([application]);
    await expect(storage.getById(application.id)).resolves.toEqual(application);

    await expect(
      storage.updateById(application.id, {
        company: 'Updated Company',
      }),
    ).resolves.toEqual({
      ...application,
      company: 'Updated Company',
    });

    await expect(storage.deleteById(application.id)).resolves.toBeUndefined();
    await expect(storage.count()).resolves.toBe(0);
    await expect(storage.getById(application.id)).resolves.toBeUndefined();
  });

  it('notifies subscribers after adding, updating, and deleting generated applications', async () => {
    const eventsPublisher =
      new PublisherSubscriber<TApplicationsIndexedDbChange>();

    const listener = vi.fn();

    const storage = new ApplicationsIndexedDbStorage({
      databaseName: 'test-applications',
      eventsPublisher,
      indexedDb: createIndexedDbMock(),
    });

    const application = createGeneratedApplication('application-1');

    eventsPublisher.subscribe(listener);

    await storage.add(application);

    expect(listener).toHaveBeenCalledWith({
      application,
      type: 'add',
    });

    await storage.updateById(application.id, {
      company: 'Updated Company',
    });

    expect(listener).toHaveBeenLastCalledWith({
      application: {
        ...application,
        company: 'Updated Company',
      },
      type: 'update',
    });

    await storage.deleteById(application.id);

    expect(listener).toHaveBeenLastCalledWith({
      application: {
        ...application,
        company: 'Updated Company',
      },
      type: 'delete',
    });
  });

  it('rejects when updating a missing generated application', async () => {
    const storage = new ApplicationsIndexedDbStorage({
      databaseName: 'test-applications',
      indexedDb: createIndexedDbMock(),
    });

    await expect(
      storage.updateById('missing-id', { company: 'Updated Company' }),
    ).rejects.toThrow(
      'Generated application with id "missing-id" was not found.',
    );
  });

  it('rejects when deleting a missing generated application', async () => {
    const storage = new ApplicationsIndexedDbStorage({
      databaseName: 'test-applications',
      indexedDb: createIndexedDbMock(),
    });

    await expect(storage.deleteById('missing-id')).rejects.toThrow(
      'Generated application with id "missing-id" was not found.',
    );
  });
});
