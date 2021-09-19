import AlertCircleFill from '@geist-ui/react-icons/alertCircleFill';
import Head from 'next/head';
import * as React from 'react';
import tw, { css } from 'twin.macro';

import { Button } from '$/components/Button';
import { Heading } from '$/components/Heading';
import { Link } from '$/components/Link';
import { List, ListItem } from '$/components/List';
import { Text } from '$/components/Text/Text';

export default function Custom404(): JSX.Element {
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <main tw="py-12 px-4 space-y-8 flex flex-col items-center">
        <div
          css={[
            tw`flex justify-center text-gray-1000`,
            css`
              --geist-icons-background: white;
            `,
          ]}
        >
          <div css={[dashedBorder, tw`p-6 border-opacity-30`]}>
            <div css={[dashedBorder, tw`p-5 border-opacity-50`]}>
              <div css={[dashedBorder, tw`p-4 border-opacity-80`]}>
                <div css={[dashedBorder, tw`p-3`]}>
                  <AlertCircleFill size={84} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Heading>Oops! Page not found</Heading>
        <Text variant="secondary">We might have encountered some issues...</Text>
        <section tw="space-y-3">
          <Heading as="h5">What could have caused this?</Heading>
          <List variant="unordered" tw="space-y-3">
            <ListItem markerStyle={listMakerStyle}>Something went wrong in our services.</ListItem>
            <ListItem markerStyle={listMakerStyle}>The page might be removed.</ListItem>
            <ListItem markerStyle={listMakerStyle}>You might typed the wrong URL.</ListItem>
          </List>
        </section>
        <div tw="flex justify-center items-center space-x-6">
          <Link href="/" variant="plain">
            <Button
              variant="solid"
              color="primary"
              className="group"
              tw="space-x-1 transition hover:shadow-2xl"
            >
              <span>Back to homepage</span>
            </Button>
          </Link>
          <Button>Learn More</Button>
        </div>
      </main>
    </>
  );
}

const dashedBorder = tw`rounded-full border border-dashed`;
const listMakerStyle = tw`bg-red-900`;
