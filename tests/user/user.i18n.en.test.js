import { describe, expect, it, vi } from 'vitest';
import { baseUrl } from './shared/user.server.setup.js';
import { validUserInputs } from './shared/user.test.data.js';
import axios from 'axios';
import userRepository from '../../src/user/user.repository.js';
import console from 'node:console';
import EmailService from '../../src/user/email.service.js';

describe('i18n test', () => {
  const postForUser = async (userInputs) =>
    await axios.post(`${baseUrl}/api/users`, userInputs);

  const usernameNull = 'Username is required';
  const usernameLength = 'Username must be between 4 and 32 characters long';
  const passwordNull = 'Password is required';
  const passwordLength = 'Password must be between 6 and 32 characters long';
  const passwordPattern =
    'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  const emailNull = 'Email is required';
  const emailInvalid = 'Email must be valid';
  const emailRegistered = 'Email is already registered';
  const emailSentFailed = 'Email sending have failed';

  it.each`
    field         | value                  | expectedErrorMessage
    ${'username'} | ${null}                | ${usernameNull}
    ${'username'} | ${'usr'}               | ${usernameLength}
    ${'username'} | ${'u'.repeat(33)}      | ${usernameLength}
    ${'password'} | ${null}                | ${passwordNull}
    ${'password'} | ${'p'.repeat(5)}       | ${passwordLength}
    ${'password'} | ${'lowercase'}         | ${passwordPattern}
    ${'password'} | ${'UPPERCASE'}         | ${passwordPattern}
    ${'password'} | ${'UPPERandlowercase'} | ${passwordPattern}
    ${'email'}    | ${null}                | ${emailNull}
    ${'email'}    | ${'test.com'}          | ${emailInvalid}
  `(
    `should return error message: $expectedErrorMessage for field: $field with value: $value`,
    async ({ field, value, expectedErrorMessage }) => {
      const input = {
        username: 'test',
        password: 'P4ssword',
        email: 'test@test.com',
      };

      input[field] = value;
      let errorMessage;
      await postForUser(input).catch((error) => {
        const validationErrors = error.response.data.validationErrors;
        errorMessage = validationErrors[field];
      });
      expect(errorMessage).toBe(expectedErrorMessage);
    },
  );

  it('should return email is already registered when email is already registered', async () => {
    await userRepository.create(validUserInputs);
    let errorMessage;
    await postForUser(validUserInputs).catch((error) => {
      const validationErrors = error.response.data.validationErrors;
      errorMessage = validationErrors.email;
    });
    expect(errorMessage).toBe(emailRegistered);
  });

  it(`should return message: ${emailSentFailed} when email sending have failed`, async () => {
    const mockSendAccountActivationEmail = vi
      .spyOn(EmailService, 'sendAccountActivationEmail')
      .mockRejectedValue({
        message: 'Email sending have failed',
      });
    let errorMessage;
    await postForUser(validUserInputs).catch((error) => {
      if (error.response) {
        console.log(error.response);
        errorMessage = error.response.data.message;
      }
    });
    expect(errorMessage).toBe(emailSentFailed);
    mockSendAccountActivationEmail.mockRestore();
  });
});
