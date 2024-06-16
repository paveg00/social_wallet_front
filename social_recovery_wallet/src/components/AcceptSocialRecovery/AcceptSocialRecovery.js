import React from "react";
import { useAuth } from "react-oidc-context";

function AcceptSocialRecovery(props) {

    const auth = useAuth();


    switch (auth.activeNavigator) {
        case "signinSilent":
            return <div>Signing you in...</div>;
        case "signoutRedirect":
            return <div>Signing you out...</div>;
    }

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.error) {
        return <div>Oops... {auth.error.message}</div>;
    }

    if (auth.isAuthenticated) {
        return (
            <div>
                Hello {"sub: "}{auth.user?.profile.sub}<br></br>
                Hello {"aud: "}{auth.user?.profile.aud}{" "}<br></br>
                Hello {"exp: "}{auth.user?.profile.exp}{" "}<br></br>
                Hello {"iat: "}{auth.user?.profile.iat}{" "}<br></br>
                Hello {"iss: "}{auth.user?.profile.iss}{" "}<br></br>
                Hello {"scope: "}{auth.user?.scope}{" "}<br></br>
                Hello {"open_id_token: "}{auth.user?.id_token}{" "}<br></br>
                Hello {"nonce: "}{auth.user?.profile.nonce}{" "}<br></br>
                {/* {auth.user?.toStorageString()} */}

                <button onClick={() => void auth.removeUser()}>Log out</button>
            </div>
        );
    }

    return <button onClick={() => void auth.signinRedirect({ nonce: props.nonce })}>Log in</button>;
}

export default AcceptSocialRecovery;