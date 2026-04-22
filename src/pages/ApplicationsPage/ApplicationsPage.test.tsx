import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { APPLICATIONS_GOAL_COUNT } from '@/shared/constants/applications';
import { App } from '../../App';
import { ApplicationsPage } from './ApplicationsPage';
import type { IApplicationsStorage, IGeneratedApplication } from '@/shared/types';

const application: IGeneratedApplication = {
  id: 'application-1',
  additionalDetails: 'Additional details',
  company: 'Stripe',
  generatedResult: 'Dear Stripe team,\n\nI am excited to apply.',
  jobTitle: 'Product designer',
  keySkills: ['Design systems'],
};

const completedApplications = Array.from({ length: 6 }, (_, index) => ({
  ...application,
  id: `application-${index + 1}`,
}));

const createGeneratedApplicationsCountResult = (applicationsCount: number) => {
  const completedCount = Math.min(applicationsCount, APPLICATIONS_GOAL_COUNT);

  return {
    applicationsCount,
    completedCount,
    isGoalReached: completedCount >= APPLICATIONS_GOAL_COUNT,
  };
};

const createApplicationsStorageMock = (
  applications: IGeneratedApplication[],
): IApplicationsStorage => ({
  add: vi.fn((newApplication: IGeneratedApplication) => Promise.resolve(newApplication)),
  count: vi.fn(() => Promise.resolve(applications.length)),
  deleteById: vi.fn(() => Promise.resolve()),
  getAll: vi.fn(() => Promise.resolve(applications)),
  getById: vi.fn((id: string) => (
    Promise.resolve(applications.find(savedApplication => savedApplication.id === id))
  )),
  updateById: vi.fn((id: string, patch: Partial<Omit<IGeneratedApplication, 'id'>>) => (
    Promise.resolve({
      ...application,
      ...patch,
      id,
    })
  )),
});

const {
  addApplicationMock,
  countApplicationsMock,
  deleteApplicationByIdMock,
  getAllApplicationsMock,
  getApplicationByIdMock,
  subscribeToApplicationsMock,
  updateApplicationByIdMock,
  useGeneratedApplicationsCountMock,
} = vi.hoisted(() => ({
  addApplicationMock: vi.fn(),
  countApplicationsMock: vi.fn(() => Promise.resolve(0)),
  deleteApplicationByIdMock: vi.fn(() => Promise.resolve()),
  getAllApplicationsMock: vi.fn(() => Promise.resolve([])),
  getApplicationByIdMock: vi.fn(),
  subscribeToApplicationsMock: vi.fn(() => vi.fn()),
  updateApplicationByIdMock: vi.fn(),
  useGeneratedApplicationsCountMock: vi.fn(() => createGeneratedApplicationsCountResult(0)),
}));

vi.mock('@/shared/services/ApplicationsIndexedDbStorage', () => ({
  applicationsIndexedDbPublisherSubscriber: {
    subscribe: subscribeToApplicationsMock,
  },
  applicationsIndexedDbStorage: {
    add: addApplicationMock,
    count: countApplicationsMock,
    deleteById: deleteApplicationByIdMock,
    getAll: getAllApplicationsMock,
    getById: getApplicationByIdMock,
    updateById: updateApplicationByIdMock,
  },
}));

vi.mock('../../shared/hooks/useGeneratedApplicationsCount', () => ({
  useGeneratedApplicationsCount: useGeneratedApplicationsCountMock,
}));

describe('ApplicationsPage', () => {
  beforeEach(() => {
    getAllApplicationsMock.mockResolvedValue([]);
    subscribeToApplicationsMock.mockClear();
    useGeneratedApplicationsCountMock.mockReturnValue(createGeneratedApplicationsCountResult(0));
  });

  it('renders the empty state with goal progress', async () => {
    render(
      <MemoryRouter>
        <ApplicationsPage storage={createApplicationsStorageMock([])} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /^applications$/i }),
    ).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /hit your goal/i })).toBeInTheDocument();
    expect(screen.getByText(/0\/5 applications generated/i)).toBeInTheDocument();
    expect(screen.getByText(/0 out of 5/i)).toBeInTheDocument();
  });

  it('matches the empty state snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <ApplicationsPage storage={createApplicationsStorageMock([])} />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: /hit your goal/i })).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders applications and the goal banner before five applications', async () => {
    useGeneratedApplicationsCountMock.mockReturnValue(createGeneratedApplicationsCountResult(3));

    render(
      <MemoryRouter>
        <ApplicationsPage
          storage={createApplicationsStorageMock([
            { ...application, id: 'application-1' },
            { ...application, id: 'application-2' },
            { ...application, id: 'application-3' },
          ])}
        />
      </MemoryRouter>,
    );

    expect(await screen.findAllByText(/dear stripe team/i)).toHaveLength(3);
    expect(screen.getByText(/3\/5 applications generated/i)).toBeInTheDocument();
    expect(screen.getByText(/3 out of 5/i)).toBeInTheDocument();
  });

  it('hides the goal banner after five applications are generated', async () => {
    useGeneratedApplicationsCountMock.mockReturnValue(createGeneratedApplicationsCountResult(6));

    render(
      <MemoryRouter>
        <ApplicationsPage storage={createApplicationsStorageMock(completedApplications)} />
      </MemoryRouter>,
    );

    expect(await screen.findAllByText(/dear stripe team/i)).toHaveLength(6);
    expect(screen.getByText(/6 applications generated/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /hit your goal/i })).not.toBeInTheDocument();
  });

  it('navigates to the create placeholder', async () => {
    const user = userEvent.setup();

    window.history.pushState({}, '', '/');
    render(<App />);

    await user.click(screen.getByRole('button', { name: /create new/i }));

    expect(
      await screen.findByRole('heading', { name: /new application/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /generate now/i }),
    ).toBeInTheDocument();
  });
});
