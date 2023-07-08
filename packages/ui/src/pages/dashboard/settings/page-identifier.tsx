import { trpcClient, TRPCClientError } from '@chirpy-dev/trpc/src/client';
import * as React from 'react';

import {
  Button,
  Link,
  Spinner,
  Text,
  TextField,
  useToast,
} from '../../../components';
import { logger } from '../../../utilities';
import { Card } from './card';

export type PageUrlProps = {
  id: string;
};

export function PageIdentifier(props: PageUrlProps): JSX.Element {
  const [parameter, setParameter] = React.useState('');
  const [error, setError] = React.useState('');
  const { mutateAsync, isLoading } = trpcClient.project.update.useMutation();
  const { showToast } = useToast();
  const handleSaveQueryParameters = async () => {
    try {
      await mutateAsync({
        projectId: props.id,
        queryParameters: parameter,
      });
      setError('');
      showToast({
        type: 'success',
        title: 'Page identifier updated',
      });
    } catch (error) {
      if (
        error instanceof TRPCClientError &&
        error.data.code === 'BAD_REQUEST'
      ) {
        setError(
          'Invalid query parameters, only letters, numbers, - and _ allowed',
        );
        return;
      }
      showToast({
        type: 'error',
        title:
          'We apologize for the inconvenience. It seems that we are experiencing technical difficulties on our end. Please try again later.',
      });
      logger.error('Update page url failed', { error });
    }
  };
  return (
    <Card>
      <Card.Body>
        <Card.Title>Page identifier</Card.Title>
        <Text variant="secondary">
          {`Chirpy uses the URL domain + path of your page as the comment widget identifier by default, if you want to add `}
          <Link
            variant="primary"
            href="https://en.wikipedia.org/wiki/Query_string"
          >
            {`query parameters`}
          </Link>
          {` as the identifier, please specify them below.`}
        </Text>
        <div className="pt-6">
          <TextField
            value={parameter}
            onChange={(e) => {
              setParameter(e.target.value);
              setError('');
            }}
            className="w-full"
            name="pageQueryParameters"
            label="Query parameters"
            hintText="Multiple parameters must be separated by commas"
            placeholder="id,name"
            errorMessage={error}
          />
        </div>
      </Card.Body>
      <Card.Footer>
        <Button
          color="primary"
          variant="solid"
          onClick={handleSaveQueryParameters}
          disabled={!!process.env.NEXT_PUBLIC_MAINTENANCE_MODE}
        >
          {isLoading ? (
            <Spinner className="!text-gray-100">Save</Spinner>
          ) : (
            'Save'
          )}
        </Button>
      </Card.Footer>
    </Card>
  );
}