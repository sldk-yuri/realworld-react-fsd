import { ChangeEvent, FormEventHandler, useEffect } from 'react';
import { useUnit } from 'effector-react';
import { Link } from 'react-router-dom';
import { FormFieldModel } from '~shared/lib/form';
import { PATH_PAGE } from '~shared/lib/router';
import { ErrorHandler } from '~shared/ui/error-handler';
import { SignupFormModel } from './model';

type FieldType = {
  $$model: FormFieldModel<string>;
};

function UsernameField(props: FieldType) {
  const { $$model } = props;
  const [value, error] = useUnit([$$model.$value, $$model.$error]);
  const [changed, touched] = useUnit([$$model.changed, $$model.touched]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    changed(e.target.value);

  return (
    <fieldset className="form-group">
      <input
        className="form-control form-control-lg"
        type="text"
        placeholder="Your Name"
        value={value}
        onChange={handleChange}
        onBlur={touched}
      />
      {error && <div>{error.map((e) => e)}</div>}
    </fieldset>
  );
}

function EmailField(props: FieldType) {
  const { $$model } = props;
  const [value, error] = useUnit([$$model.$value, $$model.$error]);
  const [changed, touched] = useUnit([$$model.changed, $$model.touched]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    changed(e.target.value);
  return (
    <fieldset className="form-group">
      <input
        className="form-control form-control-lg"
        type="text"
        placeholder="Email"
        value={value}
        onChange={handleChange}
        onBlur={touched}
      />
      {error && <div>{error.map((e) => e)}</div>}
    </fieldset>
  );
}

function PasswordField(props: FieldType) {
  const { $$model } = props;
  const [value, error] = useUnit([$$model.$value, $$model.$error]);
  const [changed, touched] = useUnit([$$model.changed, $$model.touched]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    changed(e.target.value);

  return (
    <fieldset className="form-group">
      <input
        className="form-control form-control-lg"
        type="password"
        placeholder="Password"
        value={value}
        onChange={handleChange}
        onBlur={touched}
      />
      {error && <div>{error.map((e) => e)}</div>}
    </fieldset>
  );
}

type SignupFormProps = {
  $$model: SignupFormModel;
};

export function SignupForm(props: SignupFormProps) {
  const { $$model } = props;

  const [error, pending] = useUnit([
    $$model.$$sessionSignUp.$error,
    $$model.$$sessionSignUp.$pending,
  ]);
  const [submited, unmounted] = useUnit([$$model.submitted, $$model.unmounted]);

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    submited();
  };

  useEffect(() => unmounted, [unmounted]);

  return (
    <>
      <h1 className="text-xs-center">Sign up</h1>
      <p className="text-xs-center">
        <Link to={PATH_PAGE.login}>Have an account?</Link>
      </p>

      {error && <ErrorHandler error={error as any} />}

      <form onSubmit={onFormSubmit}>
        <fieldset disabled={pending}>
          <UsernameField $$model={$$model.fields.username} />
          <EmailField $$model={$$model.fields.email} />
          <PasswordField $$model={$$model.fields.password} />
          <button
            type="submit"
            className="btn btn-lg btn-primary pull-xs-right"
          >
            Sign up
          </button>
        </fieldset>
      </form>
    </>
  );
}
