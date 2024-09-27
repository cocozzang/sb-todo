import { ValidationError } from 'class-validator';

// stackoverflow https://stackoverflow.com/a/76636345/23203033

const getAllConstraints = (errors: ValidationError[]) => {
  const constraints: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      const constraintValues = Object.values(error.constraints);
      constraints.push(...constraintValues);
    }

    if (error.children) {
      const childConstraints = getAllConstraints(error.children);
      constraints.push(...childConstraints);
    }
  }

  return constraints;
};

const getCustomValidationError = (message: string | string[]) => {
  return {
    statusCode: 422,
    message,
    error: 'Unprocessable Entity',
  };
};

export { getAllConstraints, getCustomValidationError };
