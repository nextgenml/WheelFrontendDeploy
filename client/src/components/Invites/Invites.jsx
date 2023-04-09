import { useAccount } from "wagmi";
import SaveSocialLinks from "../Header/SaveSocialLinks";
import { useNavigate, useParams } from "react-router";

const Invites = () => {
  const { code } = useParams();
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();

  if (isConnected)
    return (
      <>
        <SaveSocialLinks
          walletId={address}
          onClose={() => navigate("/")}
          inviteCode={code}
          links={{}}
        />
      </>
    );
  return null;
};
export default Invites;
