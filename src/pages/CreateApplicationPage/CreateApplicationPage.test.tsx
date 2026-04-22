import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { appRoutes } from '@/router/constants/appRoutes';
import { CreateApplicationPage } from './CreateApplicationPage';

const {
  addGeneratedApplicationMock,
  countGeneratedApplicationsMock,
  generateTextMock,
  getGeneratedApplicationByIdMock,
  subscribeToGeneratedApplicationsMock,
  updateGeneratedApplicationByIdMock,
} = vi.hoisted(() => ({
  addGeneratedApplicationMock: vi.fn(
    (application: unknown) => Promise.resolve(application),
  ),
  countGeneratedApplicationsMock: vi.fn(() => Promise.resolve(0)),
  generateTextMock: vi.fn(() => Promise.resolve('AI generated cover letter')),
  getGeneratedApplicationByIdMock: vi.fn(
    () => Promise.resolve(undefined as unknown),
  ),
  subscribeToGeneratedApplicationsMock: vi.fn(() => vi.fn()),
  updateGeneratedApplicationByIdMock: vi.fn(
    (id: string, application: unknown) =>
      Promise.resolve({ ...(application as object), id }),
  ),
}));

vi.mock('@/shared/services/ApplicationsIndexedDbStorage', () => ({
  applicationsIndexedDbPublisherSubscriber: {
    subscribe: subscribeToGeneratedApplicationsMock,
  },
  applicationsIndexedDbStorage: {
    add: addGeneratedApplicationMock,
    count: countGeneratedApplicationsMock,
    getById: getGeneratedApplicationByIdMock,
    updateById: updateGeneratedApplicationByIdMock,
  },
}));

vi.mock('@/shared/services/GoogleGenAiTextGenerationService', () => ({
  googleGenAiTextGenerationService: {
    generateText: generateTextMock,
  },
}));

const generatedId =
  '00000000-0000-4000-8000-000000000000' as `${string}-${string}-${string}-${string}-${string}`;

const LocationPathname = () => {
  const location = useLocation();

  return <span data-testid='location-pathname'>{location.pathname}</span>;
};

describe('CreateApplicationPage', () => {
  beforeEach(() => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(generatedId);
    addGeneratedApplicationMock.mockClear();
    countGeneratedApplicationsMock.mockClear();
    generateTextMock.mockClear();
    getGeneratedApplicationByIdMock.mockClear();
    subscribeToGeneratedApplicationsMock.mockClear();
    updateGeneratedApplicationByIdMock.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the expected form fields', () => {
    render(
      <MemoryRouter>
        <CreateApplicationPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /new application/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/i am good as/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/additional details/i)).toBeInTheDocument();
  });

  it('matches the empty form snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <CreateApplicationPage />
      </MemoryRouter>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders generated result after successful generation', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CreateApplicationPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/job title/i), 'Frontend Engineer');
    await user.type(screen.getByLabelText(/company/i), 'Acme');
    await user.type(screen.getByLabelText(/i am good as/i), 'React, Testing');
    await user.type(
      screen.getByLabelText(/additional details/i),
      'I build maintainable user interfaces.',
    );
    await user.click(screen.getByRole('button', { name: /generate now/i }));

    expect(await screen.findByText('AI generated cover letter')).toBeInTheDocument();
    expect(generateTextMock).toHaveBeenCalledWith(
      expect.stringContaining('Company: Acme'),
    );
    expect(addGeneratedApplicationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        generatedResult: 'AI generated cover letter',
        id: generatedId,
        jobTitle: 'Frontend Engineer',
      }),
    );
  });

  it('shows loading state in result while application is generating', async () => {
    const user = userEvent.setup();

    generateTextMock.mockReturnValue(new Promise(() => undefined));

    render(
      <MemoryRouter>
        <CreateApplicationPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText(/job title/i), 'Frontend Engineer');
    await user.type(screen.getByLabelText(/company/i), 'Acme');
    await user.type(screen.getByLabelText(/i am good as/i), 'React, Testing');
    await user.type(
      screen.getByLabelText(/additional details/i),
      'I build maintainable user interfaces.',
    );
    await user.click(screen.getByRole('button', { name: /generate now/i }));

    expect(await screen.findByRole('status', { name: /loading/i })).toBeInTheDocument();
  });

  it('loads application defaults from route id', async () => {
    getGeneratedApplicationByIdMock.mockResolvedValue({
      id: 'application-1',
      additionalDetails: 'Existing details',
      company: 'Acme',
      generatedResult: 'Existing generated result',
      jobTitle: 'Frontend Engineer',
      keySkills: ['React', 'Testing'],
    });

    render(
      <MemoryRouter initialEntries={[appRoutes.applications.getDetailsPath('application-1')]}>
        <Routes>
          <Route
            path={appRoutes.applications.details}
            element={<CreateApplicationPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(getGeneratedApplicationByIdMock).toHaveBeenCalledWith('application-1');
    expect(await screen.findByDisplayValue('Frontend Engineer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Acme')).toBeInTheDocument();
    expect(screen.getByDisplayValue('React, Testing')).toBeInTheDocument();
    expect(screen.getByText('Existing generated result')).toBeInTheDocument();
  });

  it('resets application form when navigating from existing application to create page', async () => {
    const user = userEvent.setup();

    getGeneratedApplicationByIdMock.mockResolvedValue({
      id: 'application-1',
      additionalDetails: 'Existing details',
      company: 'Acme',
      generatedResult: 'Existing generated result',
      jobTitle: 'Frontend Engineer',
      keySkills: ['React', 'Testing'],
    });

    render(
      <MemoryRouter initialEntries={[appRoutes.applications.getDetailsPath('application-1')]}>
        <Routes>
          <Route
            path={appRoutes.applications.create}
            element={(
              <>
                <LocationPathname />
                <CreateApplicationPage />
              </>
            )}
          />
          <Route
            path={appRoutes.applications.details}
            element={(
              <>
                <LocationPathname />
                <CreateApplicationPage />
              </>
            )}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByDisplayValue('Frontend Engineer')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /create new/i }));

    expect(screen.getByTestId('location-pathname')).toHaveTextContent(
      appRoutes.applications.create,
    );
    expect(screen.getByLabelText(/job title/i)).toHaveValue('');
    expect(screen.getByLabelText(/company/i)).toHaveValue('');
    expect(screen.getByLabelText(/i am good as/i)).toHaveValue('');
    expect(screen.getByLabelText(/additional details/i)).toHaveValue('');
    expect(screen.queryByText('Existing generated result')).not.toBeInTheDocument();
  });

  it('redirects to create page when route id is missing in storage', async () => {
    getGeneratedApplicationByIdMock.mockResolvedValue(undefined);

    render(
      <MemoryRouter initialEntries={[appRoutes.applications.getDetailsPath('missing-id')]}>
        <Routes>
          <Route
            path={appRoutes.applications.create}
            element={<LocationPathname />}
          />
          <Route
            path={appRoutes.applications.details}
            element={<CreateApplicationPage />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(getGeneratedApplicationByIdMock).toHaveBeenCalledWith('missing-id');
    expect(await screen.findByTestId('location-pathname')).toHaveTextContent(
      appRoutes.applications.create,
    );
  });
});
