import { useAccount } from "wagmi";
import SaveSocialLinks from "../Header/SaveSocialLinks";
import { useNavigate, useParams } from "react-router";

const Invites = () => {
  const { code } = useParams();
  console.log("code", code);
  const { address } = useAccount();
  const navigate = useNavigate();
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
};
export default Invites;
