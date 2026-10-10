import React from 'react';
import { PreviewClient } from './PreviewClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Live Preview | Portfolio Builder',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PreviewPage() {
  return <PreviewClient />;
}
