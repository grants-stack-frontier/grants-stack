import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchHypercertMetadata } from "common/src/hypercert";
import { RootState } from "../../../reducers";
import PinataClient from "../../../services/pinata";
import { FormInputs, Metadata, Project } from "../../../types";

const pinataClient = new PinataClient();

function HypercertTile({ hypercertId }: { hypercertId: string }) {
  const chainId = useSelector((state: RootState) => state.web3.chainID);
  const [image, setImage] = useState<string | undefined>();

  useEffect(() => {
    const fetch = async () => {
      const fetchedHypercert = await fetchHypercertMetadata(
        hypercertId,
        chainId as number
      );

      if (!fetchedHypercert) {
        throw new Error("Hypercert not found");
      }

      const hypercertMetadata = await pinataClient.fetchJson(
        fetchedHypercert.uri?.replace("ipfs://", "")!
      );

      setImage(hypercertMetadata.image);
    };
    fetch();
  }, [hypercertId]);

  return (
    <a
      href={`https://hypercerts.org/app/view/#claimId=${hypercertId}`}
      target="_blank"
      rel="noreferrer"
    >
      <img src={image} alt="Hypercert" />
    </a>
  );
}

export function Hypercerts({
  project,
}: {
  project?: Metadata | FormInputs | Project;
}) {
  if (!project) return null;

  return (
    <div className="flex gap-x-2 gap-y-2 flex-wrap">
      {project.hypercertIds?.map((id) => (
        <HypercertTile hypercertId={id} key={id} />
      ))}
    </div>
  );
}
