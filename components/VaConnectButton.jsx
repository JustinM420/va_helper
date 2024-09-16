import React from 'react';

const VaConnectButton = () => {
  const handleConnect = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI,
      response_type: 'code',
      scope: 'profile openid service_history.read \
disability_rating.read',
      state: 'your_random_state', // Replace with a random string
    });

    window.location.href = `${process.env.NEXT_PUBLIC_VA_AUTHORIZATION_URL}\
?${params.toString()}`;
  };

  return (
    <button 
        onClick={handleConnect}
        varient="contained"
    >
      Connect with VA
    </button>
  );
};

export default VaConnectButton;
