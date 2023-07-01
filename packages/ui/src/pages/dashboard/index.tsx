import { trpcClient } from '@chirpy-dev/trpc/src/client';
import { DehydratedState } from '@tanstack/react-query';
import * as React from 'react';

import {
  EmptyProjectCard,
  PageTitle,
  ProjectCard,
  SiteLayout,
} from '../../blocks';
import { Button, Dialog, Spinner, TextField } from '../../components';
import { useCurrentUser } from '../../contexts';
import { useForm } from '../../hooks';
import { isValidDomain } from '../../utilities';
import { CreateProjectButton } from './create-project-button';

type FormFields = {
  name: string;
  domain: string;
};

export type DashboardProps = {
  username: string;
  trpcState: DehydratedState;
};

export function Dashboard(props: DashboardProps): JSX.Element {
  const { loading: userIsLoading } = useCurrentUser();
  const {
    data: projects,
    refetch: fetchUserProjects,
    isFetching,
  } = trpcClient.project.all.useQuery({
    username: props.username,
  });

  const { mutateAsync: createAProject } =
    trpcClient.project.create.useMutation();
  const handleCreateProject = React.useCallback(() => {
    setShowDialog(true);
  }, []);
  const [showDialog, setShowDialog] = React.useState(false);

  const handleCloseDialog = React.useCallback(() => {
    setShowDialog(false);
  }, []);
  const { register, errors, handleSubmit, hasError, setError } =
    useForm<FormFields>({
      defaultValues: {
        name: '',
        domain: '',
      },
    });
  const handleClickSubmit = handleSubmit(
    async (fields, _event: unknown): Promise<void> => {
      try {
        await createAProject({
          // TODO: Team id?
          name: fields.name,
          domain: fields.domain,
        });
      } catch (error: any) {
        if (error?.message?.includes('Unique constraint')) {
          setError('domain', 'A project associated with this domain already');
          return;
        }
        throw error;
      }

      setShowDialog(false);
      fetchUserProjects();
    },
  );

  return (
    <SiteLayout title="Dashboard">
      <section className="space-y-10">
        <div className="flex flex-col items-start space-y-5 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
          <PageTitle>Dashboard</PageTitle>
          <CreateProjectButton
            projectCount={projects?.length}
            onCreateProject={handleCreateProject}
          />
        </div>
        {projects?.length ? (
          <ul className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <li key={project.id}>
                <ProjectCard
                  project={project}
                  onDeletedProject={fetchUserProjects}
                />
              </li>
            ))}
          </ul>
        ) : isFetching || userIsLoading ? (
          <Spinner />
        ) : (
          <div className="py-6">
            <EmptyProjectCard />
          </div>
        )}
      </section>
      <Dialog show={showDialog} title="New project" onClose={handleCloseDialog}>
        <Dialog.Body>
          <form className="flex w-80 flex-col space-y-4">
            <TextField
              {...register('name', {
                required: { value: true, message: 'Name is required' },
                pattern: {
                  value: /^\w+$/,
                  message: `Only word characters are allowed`,
                },
                minLength: { value: 3, message: 'At least 3 characters' },
                maxLength: { value: 16, message: 'At most 16 characters' },
              })}
              aria-label="Name of this project"
              label="Name"
              errorMessage={errors.name}
              placeholder="swift"
              className="w-full"
            />
            <TextField
              {...register('domain', {
                required: { value: true, message: 'Domain is required' },
                pattern: {
                  value: isValidDomain,
                  message: 'Invalid domain',
                },
              })}
              label="Domain"
              hintText="Associate your domain with this project"
              errorMessage={errors.domain}
              placeholder="example.com"
              className="w-full"
            />
          </form>
        </Dialog.Body>
        <Dialog.Footer>
          <Button onClick={handleCloseDialog} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            className="w-full sm:w-auto"
            disabled={hasError}
            color="primary"
            variant="solid"
            onClick={handleClickSubmit}
          >
            Create
          </Button>
        </Dialog.Footer>
      </Dialog>
    </SiteLayout>
  );
}

export * from './redirect';
export * from './project';
export * from './theme';
export * from './analytics';
export * from './settings';
