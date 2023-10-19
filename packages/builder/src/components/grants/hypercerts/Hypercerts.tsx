import { useEffect, useState } from "react";
import { fetchHypercertMetadata } from "common/src/hypercert";
import PinataClient from "../../../services/pinata";
import { FormInputs, Metadata, Project } from "../../../types";

const pinataClient = new PinataClient();

function HypercertTile({
  hypercertId,
  chainId,
}: {
  hypercertId: string;
  chainId: number;
}) {
  const [image, setImage] = useState<string | undefined>();

  useEffect(() => {
    const fetch = async () => {
      if (!chainId) {
        return;
      }
      const fetchedHypercert = await fetchHypercertMetadata(
        hypercertId,
        chainId
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
      <img src={image} alt="Hypercert" style={{ height: 400, width: 320 }} />
    </a>
  );
}

export function Hypercerts({
  project,
  chainId,
}: {
  chainId: number;
  project?: Metadata | FormInputs | Project;
}) {
  if (!project) return null;

  return (
    <div className="flex gap-x-2 gap-y-2 flex-wrap">
      {project.hypercertIds?.map((id) => (
        <HypercertTile key={id} hypercertId={id} chainId={chainId} />
      ))}
    </div>
  );
}
