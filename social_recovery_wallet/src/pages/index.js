// Filename - pages/index.js
 
import React from "react";

import GenerateContractData from "../components/SolidityUtils/GenerateContractData";
import GetSocialRecoveryDigest from "../components/SolidityUtils/GenerateDigest";

let open_id_default = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY3MTk2NzgzNTFhNWZhZWRjMmU3MDI3NGJiZWE2MmRhMmE4YzRhMTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4OTIwMjE5NDMwNDctNHVzczdpOTY1bGNuaHY5ZHZoamdkNWJ0bTMxNDBiOW8uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4OTIwMjE5NDMwNDctNHVzczdpOTY1bGNuaHY5ZHZoamdkNWJ0bTMxNDBiOW8uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk5NTYwNjY1NTgxNDUzMjAyNzMiLCJhdF9oYXNoIjoiU2pkMnVJcFlSOEpFVjhPNkQ3UTNnZyIsIm5vbmNlIjoiMHg2M2RmYTg3ZjRhMWYyZmZmOTljMmY1YThhMzNlNzhmZDVlZWNkNDczYWJlMzc5MzViOTMyZjQ5YTkxM2U1NDUxIiwiaWF0IjoxNzE3NDQzOTMzLCJleHAiOjE3MTc0NDc1MzN9.VW5O-nnNjzz-OcxYhvD37CdR8YYhCTSAjuWScpEqPTMTUZkcMYrujT_scevxBsDqInRxTZtPEc6bXEb1utt4iMYSOCiO03drQ5JFVOJniZ7NEaVeBzfnTSBVFMqIs3HQOaY0TucIc8fgwRXCkYQsgOnliS61SaCgyYWvnvRzlFSBZbAsphx8ley1XsXZBk0V3iScpE5QjSgSfKqUHxU8UoT6Azg7CxnsdcqwVSbUF1r21c91a_iurakDhX8gHGOvCuZ7waWPb6k3S_9UVsDWxsuFTkH-BnG5ZvUYvgzGXj7yh6s_pLLc_zC5LrUOSf-Ru9Yi5bjAa6IXl_SsnkJbzQ"

const Home = () => {
    return (
        <div>
            <h1>Welcome to Social Recovery Wallet</h1>
            <br/>
            <h2>Nonce for permissions signiture</h2>
            <br/>
            {/* { GetSocialRecoveryDigest()} */}
            <br/>
            <h2>Permissions signiture</h2>
            <br/>
            {GenerateContractData(open_id_default)}
            
        </div>
    );
};
 
export default Home;