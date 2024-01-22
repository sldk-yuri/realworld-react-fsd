import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { useNavigate } from 'react-router-dom';
import {
  articleApi,
  articleContracts,
  articleLib,
  articleTypes,
} from '~entities/article';
import { pathKeys } from '~shared/lib/react-router';
import { formikContract } from '~shared/lib/zod';
import { ErrorHandler } from '~shared/ui/error';
import { FullPageWrapper } from '~shared/ui/full-page-wrapper';
import { Spinner } from '~shared/ui/spinner';

type UpdateArticleFormProps = { slug: string };

export function UpdateArticleForm(props: UpdateArticleFormProps) {
  const { slug } = props;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: currentArticle,
    isPending: isArticlePending,
    isError: isArticleError,
    error: articleError,
  } = useQuery({
    queryKey: [...articleApi.ARTICLE_KEY, slug],
    queryFn: () => articleApi.articleQuery(slug),
  });

  const {
    mutate: updateArticle,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: [...articleApi.UPDATE_ARTICLE_KEY, slug],
    mutationFn: articleApi.updateArticleMutation,
    onSuccess: async (article) => {
      queryClient.setQueryData(
        [...articleApi.ARTICLE_KEY, article.slug],
        article,
      );
      await queryClient.invalidateQueries({
        queryKey: [...articleApi.ARTICLE_KEY, article.slug],
      });
      navigate(pathKeys.article.bySlug({ slug: article.slug }));
    },
  });

  if (isArticlePending)
    return (
      <FullPageWrapper>
        <Spinner />
      </FullPageWrapper>
    );

  if (isArticleError) {
    return (
      <FullPageWrapper>
        <ErrorHandler error={articleError} />
      </FullPageWrapper>
    );
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...initialArticle,
        ...articleLib.mapUpdateArticle(currentArticle),
      }}
      validate={formikContract(articleContracts.UpdateArticleSchema)}
      onSubmit={(article) => updateArticle({ slug, article: article })}
      initialTouched={{ form: true }}
    >
      <Form>
        {isError && <ErrorHandler error={error} />}
        <fieldset disabled={isPending}>
          <fieldset className="form-group">
            <Field
              name="title"
              type="text"
              className="form-control form-control-lg"
              placeholder="Article Title"
            />
            <ErrorMessage name="title" />
          </fieldset>
          <fieldset className="form-group">
            <Field
              name="description"
              type="text"
              className="form-control"
              placeholder="What's this article about?"
            />
            <ErrorMessage name="description" />
          </fieldset>
          <fieldset className="form-group">
            <Field
              name="body"
              as="textarea"
              className="form-control"
              rows={8}
              placeholder="Write your article (in markdown)"
            />
            <ErrorMessage name="body" />
          </fieldset>
          <fieldset className="form-group">
            <Field
              name="tagList"
              type="text"
              className="form-control"
              placeholder="Enter tags"
            />
            <ErrorMessage name="tagList" />
            <div className="tag-list" />
          </fieldset>
          <fieldset className="form-group">
            <Field name="form" type="hidden" />
            <ErrorMessage name="form" />
          </fieldset>
          <SubmitButton />
        </fieldset>
      </Form>
    </Formik>
  );
}

const initialArticle: articleTypes.UpdateArticle & { form: string } = {
  form: '',
  title: '',
  description: '',
  body: '',
  tagList: '',
};

const SubmitButton = () => {
  const { isValidating, isValid } = useFormikContext();

  return (
    <button
      className="btn btn-lg pull-xs-right btn-primary"
      type="submit"
      disabled={!isValid || isValidating}
    >
      Update Article
    </button>
  );
};