import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { GoogleSignIn } from './GoogleSignIn';

export const LoginBanner: React.FC = () => {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <Alert variant="info" dismissible onClose={() => setShow(false)} className="mb-4">
      <Alert.Heading>Welcome to Big Calendar!</Alert.Heading>
      <p>
        You're viewing a demo calendar with sample events. Sign in with your Google account 
        to see your real Google Calendar events in a beautiful year-at-a-glance view.
      </p>
      <hr />
      <div className="d-flex justify-content-end">
        <GoogleSignIn />
      </div>
    </Alert>
  );
};
