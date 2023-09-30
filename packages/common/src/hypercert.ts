const getHypercertGraphUrl = (chainId: number) => {
  switch (chainId) {
    case 5:
      return "https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-testnet";
    case 10:
      return "https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-optimism-mainnet";
    default:
      return "";
  }
};

export const fetchHypercertMetadata = async (
  hypercertId: string,
  chainId: number
) => {
  const graphUrl = getHypercertGraphUrl(chainId);
  return fetch(graphUrl, {
    method: "POST",
    body: JSON.stringify({
      variables: {
        id: hypercertId,
      },
      query: `
query ClaimById($id: ID!) {
  claim(id: $id) {
    contract
    tokenID
    creator
    id
    owner
    totalUnits
    uri
  }
}`,
    }),
  })
    .then((res) => res.json())
    .then((res) => res?.data?.claim);
};
