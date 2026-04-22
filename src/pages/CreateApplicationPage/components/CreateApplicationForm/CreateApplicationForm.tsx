import cn from 'classnames';
import { Button, EButtonVariant } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { TextArea } from '@/shared/components/TextArea';
import { CREATE_APPLICATION_FIELD_LIMITS } from '@/pages/CreateApplicationPage/validation';
import { RepeatIcon } from '@/assets/icons';
import { getApplicationTitle } from '../../utils';
import { styles } from './styles';
import type { ICreateApplicationFormValues } from '@/pages/CreateApplicationPage/types';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { FormEventHandler } from 'react';

interface IProps {
  applicationId?: string;
  additionalDetailsValue: string;
  companyValue: string;
  errors: FieldErrors<ICreateApplicationFormValues>;
  isSubmitting: boolean;
  jobTitleValue: string;
  keySkillsValue: string;
  register: UseFormRegister<ICreateApplicationFormValues>;
  submitError: string | null;
  submitForm: FormEventHandler<HTMLFormElement>;
}

const defaultTitle = 'New application';
const additionalDetailsLimit = CREATE_APPLICATION_FIELD_LIMITS.additionalDetails;

export const CreateApplicationForm = ({
  applicationId,
  additionalDetailsValue,
  companyValue,
  errors,
  isSubmitting,
  jobTitleValue,
  keySkillsValue,
  register,
  submitError,
  submitForm,
}: IProps) => {
  const applicationTitle = getApplicationTitle(jobTitleValue, companyValue);
  const hasApplicationTitle = Boolean(applicationTitle);

  const areSomeFieldsEmpty = [
    additionalDetailsValue,
    companyValue,
    jobTitleValue,
    keySkillsValue,
  ].some(value => value.trim() === '');

  const hasErrors = Object.keys(errors).length > 0;
  const isSubmitDisabled = areSomeFieldsEmpty || hasErrors;
  const additionalDetailsLength = additionalDetailsValue.length;
  const hasAdditionalDetailsOverflow = additionalDetailsLength > additionalDetailsLimit;

  return (
    <form className='flex w-full flex-col gap-xl' onSubmit={submitForm} noValidate>
      <h1
        className={cn(
          styles.title,
          hasApplicationTitle ? styles.titleFilled : styles.titleDefault,
        )}
      >
        {hasApplicationTitle ? applicationTitle : defaultTitle}
      </h1>
      <div className='grid w-full gap-xl lg:grid-cols-2'>
        <Input
          label='Job title'
          placeholder='Product manager'
          error={errors.jobTitle?.message}
          {...register('jobTitle')}
        />
        <Input
          error={errors.company?.message}
          label='Company'
          placeholder='Apple'
          {...register('company')}
        />
      </div>
      <Input
        error={errors.keySkills?.message}
        label='I am good as...'
        placeholder='HTML, CSS and doing things in time'
        {...register('keySkills')}
      />
      <div className='flex flex-col items-start gap-s'>
        <TextArea
          error={!!errors.additionalDetails?.message}
          label='Additional details'
          modifiers='min-h-[240px] resize-y max-h-[500px]'
          placeholder='Describe why you are a great fit or paste your bio'
          {...register('additionalDetails')}
        />
        <p
          className={cn('text-xs leading-[20px] text-neutral-800', { 'text-red-300': hasAdditionalDetailsOverflow })}
        >
          {additionalDetailsLength}/{additionalDetailsLimit}
        </p>
      </div>
      {submitError ? (
        <p className='text-sm leading-5 text-red-600' role='alert'>
          {submitError}
        </p>
      ) : null}
      <div className='flex justify-start'>
        <Button
          type='submit'
          modifiers='w-full'
          disabled={isSubmitDisabled}
          isLoading={isSubmitting}
          variant={applicationId ? EButtonVariant.Outline : EButtonVariant.Primary}
        >
          {applicationId && <RepeatIcon />}
          {applicationId ? 'Regenerate with AI' : 'Generate now with AI'}
        </Button>
      </div>
    </form>
  );
};
