import { trpcClient } from '@chirpy-dev/trpc/src/client';
import { Theme as ThemeType } from '@chirpy-dev/types';
import { DehydratedState } from '@tanstack/react-query';

import {
  SiteLayout,
  THEME_WIDGET_CLS,
  ThemeEditor,
  ThemeEditorProps,
} from '../../blocks';
import { WidgetThemeProvider } from '../../contexts';

export type ThemeProps = {
  trpcState: DehydratedState;
  domain: string;
} & Pick<ThemeEditorProps, 'buildDate'>;

export function ThemePage(props: ThemeProps): JSX.Element {
  const { data: project } = trpcClient.project.byDomain.useQuery(props.domain);
  return (
    <SiteLayout
      title={project?.name || 'Theme'}
      styles={{
        container: `!grid-cols-[1fr_min(105ch,calc(100%-32px))_1fr]`,
      }}
    >
      <WidgetThemeProvider
        widgetTheme={project?.theme as ThemeType}
        selector={`.${THEME_WIDGET_CLS}`}
      >
        <ThemeEditor project={project!} buildDate={props.buildDate} />
      </WidgetThemeProvider>
    </SiteLayout>
  );
}