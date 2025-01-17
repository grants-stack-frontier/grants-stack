import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useSwitchNetwork } from "wagmi";
import { RootState } from "../../reducers";
import { ChangeHandlers, ProjectFormStatus } from "../../types";
import { Select } from "../grants/inputs";
import Button, { ButtonVariants } from "./Button";
import NetworkSwitchModal from "./NetworkSwitchModal";

function NetworkForm({
  setVerifying,
  targetNetwork,
}: {
  setVerifying: (verifying: ProjectFormStatus) => void;
  targetNetwork?: number;
}) {
  const props = useSelector(
    (state: RootState) => ({
      currentChain: state.web3.chainID,
    }),
    shallowEqual
  );
  const [switchTo, setSwitchTo] = useState<number | undefined>(
    props.currentChain
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const { chains } = useSwitchNetwork();

  const handleNetworkSelect = async (e: ChangeHandlers) => {
    const { value } = e.target;
    setSwitchTo(parseInt(value, 10));

    if (value !== props.currentChain?.toString()) {
      setShowModal(true);
    }
  };

  const nextStepRegularRound = () => {
    setVerifying(ProjectFormStatus.Metadata);
  };

  const nextStepHypercertRound = () => {
    setVerifying(ProjectFormStatus.HypercertMetadata);
  };

  useEffect(() => {
    if (targetNetwork) {
      setSwitchTo(targetNetwork);
      if (targetNetwork !== props.currentChain) {
        setShowModal(true);
      }

      if (targetNetwork === props.currentChain) {
        nextStepHypercertRound();
      }
    }
  }, [targetNetwork, props.currentChain?.toString()]);

  return (
    <div
      className="border-0 sm:border sm:border-solid border-tertiary-text rounded text-primary-text p-0 sm:p-4"
      data-testid="network-form"
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="relative mt-4 w-full sm:w-1/2">
          <Select
            name="network"
            defaultValue={props.currentChain?.toString()}
            label={
              <span className="text-[15px]">
                Which network would you like to create this project on?
              </span>
            }
            options={chains.map((i) => ({
              id: i.id.toString(),
              title: i.name,
            }))}
            changeHandler={handleNetworkSelect}
            required
            feedback={{ type: "none", message: "" }}
          />
        </div>
        <div className="flex w-full justify-end mt-6">
          <Button
            disabled={switchTo !== props.currentChain}
            variant={ButtonVariants.primary}
            onClick={nextStepRegularRound}
          >
            Regular round
          </Button>
          <Button
            disabled={switchTo !== props.currentChain}
            variant={ButtonVariants.primary}
            onClick={nextStepHypercertRound}
          >
            Hypercert round
          </Button>
        </div>
      </form>
      <NetworkSwitchModal
        modalOpen={showModal}
        toggleModal={setShowModal}
        networkId={switchTo}
        onSwitch={() => setShowModal(false)}
      />
    </div>
  );
}

export default NetworkForm;
