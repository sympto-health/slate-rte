import React from 'react'
import SlateController from './SlateController'
import { ErrorBoundary } from 'react-error-boundary'
import { SlateProps } from './SlateProps';

const ManagedSlateController = (props: SlateProps): JSX.Element => (
  <ErrorBoundary
    fallbackRender={({error, resetErrorBoundary }) => {
      setTimeout(resetErrorBoundary, 500);
      return (
        <>
          <div className="text-danger text-center pt-2">
            <pre>{error.message}</pre>
          </div>
          <SlateController {...props} />
        </>
      );
    }}
  >
 	  <SlateController {...props} />
  </ErrorBoundary>
);

export default ManagedSlateController;
