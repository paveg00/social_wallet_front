import React from 'react';

import AcceptSocialRecovery from '../components/AcceptSocialRecovery/AcceptSocialRecovery';
import { useSearchParams } from 'react-router-dom';


const AcceptSocialRecoveryPage = () => {
  const [searchParams] = useSearchParams();

  const nonce = searchParams.get("nonce");
  const wallet = searchParams.get("wallet");
  const new_owner = searchParams.get("new_owner");

  return (
      <div>
          <h1>You are accepting social recovery to wallet {wallet} with new owner {new_owner} </h1>
          <AcceptSocialRecovery 
            nonce={nonce}
          />
          <br/>
          You should send this open_id JWT token to the new owner. 
      </div>

  );
};

export default AcceptSocialRecoveryPage;
