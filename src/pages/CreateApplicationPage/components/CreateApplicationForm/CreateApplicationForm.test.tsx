import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CREATE_APPLICATION_FIELD_LIMITS } from '@/pages/CreateApplicationPage/validation';

import { CreateApplicationForm } from './CreateApplicationForm';
import { useCreateApplicationForm } from './hooks/useCreateApplicationForm';
import type {
  IAiTextGenerationService,
  IApplicationsStorage,
  IGeneratedApplication,
} from '@/shared/types';

const generatedId =
  '00000000-0000-4000-8000-000000000000' as `${string}-${string}-${string}-${string}-${string}`;

const createStorageMock = () => ({
  add: vi.fn((application: IGeneratedApplication) =>
    Promise.resolve(application),
  ),
  count: vi.fn(() => Promise.resolve(0)),
  deleteById: vi.fn(() => Promise.resolve()),
  getAll: vi.fn(() => Promise.resolve([])),
  getById: vi.fn(() => Promise.resolve(undefined)),
  updateById: vi.fn((
    id: string,
    application: Parameters<IApplicationsStorage['updateById']>[1],
  ) =>
    Promise.resolve({
      id,
      additionalDetails: '',
      company: '',
      generatedResult: '',
      jobTitle: '',
      keySkills: [],
      ...application,
    }),
  ),
});

const createTextGenerationServiceMock = () => ({
  generateText: vi.fn(() => Promise.resolve('AI generated cover letter')),
});

interface ICreateApplicationFormTestProps {
  applicationId?: string;
  defaultApplication?: IGeneratedApplication | null;
  onGenerated: (application: IGeneratedApplication) => void;
  storage?: IApplicationsStorage;
  textGenerationService?: IAiTextGenerationService;
}

const CreateApplicationFormTestWrapper = ({
  applicationId,
  defaultApplication,
  onGenerated,
  storage,
  textGenerationService,
}: ICreateApplicationFormTestProps) => {
  const form = useCreateApplicationForm({
    applicationId,
    defaultApplication,
    onGenerated,
    storage,
    textGenerationService,
  });

  return (
    <CreateApplicationForm
      applicationId={applicationId}
      {...form}
    />
  );
};

const renderForm = (
  props: ICreateApplicationFormTestProps,
) => render(
  <MemoryRouter>
    <CreateApplicationFormTestWrapper {...props} />
  </MemoryRouter>,
);

describe('CreateApplicationForm', () => {
  beforeEach(() => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(generatedId);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the default title when job title and company are empty', () => {
    const storage = createStorageMock();
    const textGenerationService = createTextGenerationServiceMock();

    renderForm({ onGenerated: vi.fn(), storage, textGenerationService });

    const title = screen.getByRole('heading', {
      level: 1,
      name: 'New application',
    });

    expect(title).toHaveClass('text-neutral-100');
  });

  it('matches the empty form snapshot', () => {
    const storage = createStorageMock();
    const textGenerationService = createTextGenerationServiceMock();
    const { asFragment } = renderForm({ onGenerated: vi.fn(), storage, textGenerationService });
    expect(asFragment()).toMatchSnapshot();
  });

  it('disables submit when all fields are empty', () => {
    const storage = createStorageMock();
    const textGenerationService = createTextGenerationServiceMock();

    renderForm({ onGenerated: vi.fn(), storage, textGenerationService });

    expect(screen.getByRole('button', { name: /generate now/i })).toBeDisabled();
  });

  it('shows additional details character counter', () => {
    const storage = createStorageMock();
    const textGenerationService = createTextGenerationServiceMock();

    renderForm({ onGenerated: vi.fn(), storage, textGenerationService });

    expect(
      screen.getByText(`0/${CREATE_APPLICATION_FIELD_LIMITS.additionalDetails}`),
    ).toBeInTheDocument();
  });

  it('updates additional details character counter and marks overflow', () => {
    const storage = createStorageMock();
    const textGenerationService = createTextGenerationServiceMock();
    const value = 'a'.repeat(CREATE_APPLICATION_FIELD_LIMITS.additionalDetails + 1);

    renderForm({ onGenerated: vi.fn(), storage, textGenerationService });

    fireEvent.change(screen.getByLabelText(/additional details/i), {
      target: { value },
    });

    expect(
      screen.getByText(
        `${value.length}/${CREATE_APPLICATION_FIELD_LIMITS.additionalDetails}`,
      ),
    ).toHaveClass('text-red-300');
  });

  it('shows job title and company in the title when both values are entered', async () => {
    const user = userEvent.setup();
    const storage = createStorageMock();
    const textGenerationService = createTextGenerationServiceMock();

    renderForm({ onGenerated: vi.fn(), storage, textGenerationService });

    await user.type(screen.getByLabelText(/job title/i), 'Frontend Engineer');
    await user.type(screen.getByLabelText(/company/i), 'Acme');

    const title = screen.getByRole('heading', {
      level: 1,
      name: 'Frontend Engineer, Acme',
    });

    expect(title).toHaveClass('text-neutral-300');
  });

  it.each([
    ['Job title', 'Frontend Engineer'],
    ['Company', 'Acme'],
  ])('shows %s in the title without a comma when it is the only value', async (
    label,
    value,
  ) => {
    const user = userEvent.setup();
    const storage = createStorageMock();
    const textGenerationService = createTextGenerationServiceMock();

    renderForm({ onGenerated: vi.fn(), storage, textGenerationService });

    await user.type(screen.getByLabelText(new RegExp(label, 'i')), value);

    const title = screen.getByRole('heading', {
      level: 1,
      name: value,
    });

    expect(title).toHaveClass('text-neutral-300');
  });

  it.each([
    ['Job title', 'Job title must be 100 characters or fewer.'],
    ['Company', 'Company must be 100 characters or fewer.'],
    ['I am good as...', 'Skills must be 100 characters or fewer.'],
  ])('shows max-length validation for %s', async (label, message) => {
    const storage = createStorageMock();
    const textGenerationService = createTextGenerationServiceMock();

    renderForm({ onGenerated: vi.fn(), storage, textGenerationService });

    fireEvent.change(screen.getByLabelText(new RegExp(label, 'i')), {
      target: { value: 'a'.repeat(101) },
    });

    expect(await screen.findByText(message)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate now/i })).toBeDisabled();
    expect(storage.add).not.toHaveBeenCalled();
  });

  it('shows max-length validation for Additional details', async () => {
    const storage = createStorageMock();
    const textGenerationService = createTextGenerationServiceMock();

    renderForm({ onGenerated: vi.fn(), storage, textGenerationService });

    fireEvent.change(screen.getByLabelText(/additional details/i), {
      target: { value: 'a'.repeat(1201) },
    });

    await waitFor(() =>
      expect(screen.getByLabelText(/additional details/i)).toHaveAttribute(
        'aria-invalid',
        'true',
      ),
    );
    expect(screen.getByRole('button', { name: /generate now/i })).toBeDisabled();
    expect(storage.add).not.toHaveBeenCalled();
  });

  it('generates and stores an application record', async () => {
    const user = userEvent.setup();
    const onGenerated = vi.fn();
    const storage = createStorageMock();
    const textGenerationService = createTextGenerationServiceMock();

    renderForm({ onGenerated, storage, textGenerationService });

    await user.type(screen.getByLabelText(/job title/i), 'Frontend Engineer');
    await user.type(screen.getByLabelText(/company/i), 'Acme');
    await user.type(screen.getByLabelText(/i am good as/i), 'React, Testing');
    await user.type(
      screen.getByLabelText(/additional details/i),
      'I build maintainable user interfaces.',
    );
    await user.click(screen.getByRole('button', { name: /generate now/i }));

    expect(textGenerationService.generateText).toHaveBeenCalledWith(
      expect.stringContaining('Company: Acme'),
    );
    expect(textGenerationService.generateText).toHaveBeenCalledWith(
      expect.stringContaining('Job title: Frontend Engineer'),
    );
    expect(textGenerationService.generateText).toHaveBeenCalledWith(
      expect.stringContaining('Key skills: React, Testing'),
    );
    expect(storage.add).toHaveBeenCalledWith({
      id: generatedId,
      jobTitle: 'Frontend Engineer',
      company: 'Acme',
      keySkills: ['React', 'Testing'],
      additionalDetails: 'I build maintainable user interfaces.',
      generatedResult: 'AI generated cover letter',
    });
    expect(onGenerated).toHaveBeenCalledWith(
      expect.objectContaining({
        id: generatedId,
        generatedResult: 'AI generated cover letter',
      }),
    );
  });

  it('updates an existing application when application id is provided', async () => {
    const user = userEvent.setup();
    const onGenerated = vi.fn();
    const storage = createStorageMock();
    const textGenerationService = createTextGenerationServiceMock();

    const defaultApplication: IGeneratedApplication = {
      id: 'application-1',
      additionalDetails: 'Old details',
      company: 'Acme',
      generatedResult: 'Old result',
      jobTitle: 'Frontend Engineer',
      keySkills: ['React'],
    };

    renderForm({
      applicationId: defaultApplication.id,
      defaultApplication,
      onGenerated,
      storage,
      textGenerationService,
    });

    const companyInput = screen.getByLabelText(/company/i);

    await user.clear(companyInput);
    await user.type(companyInput, 'Updated Company');
    await user.click(screen.getByRole('button', { name: /regenerate/i }));

    expect(storage.add).not.toHaveBeenCalled();
    expect(storage.updateById).toHaveBeenCalledWith(
      defaultApplication.id,
      expect.objectContaining({
        company: 'Updated Company',
        generatedResult: 'AI generated cover letter',
        id: defaultApplication.id,
      }),
    );
  });
});
