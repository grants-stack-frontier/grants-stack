import ViewProgram from "../ViewProgramPage"
import { screen } from "@testing-library/react"
import { useListRoundsQuery } from "../../api/services/round"
import { useWallet } from "../../common/Auth"
import { makeProgramData, makeRoundData, renderWithContext } from "../../../test-utils"
import { faker } from "@faker-js/faker"
import { Round } from "../../api/types"

const programId = faker.datatype.number().toString()
const useParamsFn = () => ({id: programId});

jest.mock("../../common/Navbar")
jest.mock("../../common/Auth")
jest.mock("../../api/services/program")
jest.mock("../../api/services/round")
jest.mock("@rainbow-me/rainbowkit", () => ({
  ConnectButton: jest.fn(),
}))
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: useParamsFn
}))


describe("<ViewProgram />", () => {
  let stubProgram = makeProgramData();

  beforeEach(() => {
    jest.clearAllMocks();

    stubProgram = makeProgramData();

    (useWallet as jest.Mock).mockReturnValue({ chain: {}, address: stubProgram.operatorWallets[0] });
    (useListProgramsQuery as jest.Mock).mockReturnValue({ program: stubProgram });
    (useListRoundsQuery as jest.Mock).mockReturnValue({ data: [], isLoading: false, isSuccess: true });
  });

  it("should display 404 when there no program is found", () => {
    (useListProgramsQuery as jest.Mock).mockReturnValue({ });

    renderWrapped(<ViewProgram />);
    expect(screen.getByText("404 ERROR")).toBeInTheDocument();
  })

  it("should display access denied when wallet accessing is not program operator", () => {
    (useWallet as jest.Mock).mockReturnValue({ chain: {} });

    renderWrapped(<ViewProgram />);
    expect(screen.getByText("Access Denied!")).toBeInTheDocument();
  })

  it("displays the program name", async () => {
    const stubProgram = makeProgramData({id: programId});

    renderWithContext(<ViewProgram />, {programs: [stubProgram]})

    await screen.findByText(stubProgram.metadata!.name)
  })

  it("displays a list of operator wallets", async () => {
    let operatorWallets = [
      faker.finance.ethereumAddress(),
      faker.finance.ethereumAddress(),
      faker.finance.ethereumAddress(),
    ];

    const stubProgram = makeProgramData({ id: programId, operatorWallets });
    (useWallet as jest.Mock).mockReturnValue({ chain: {}, address: stubProgram.operatorWallets[0] });

    renderWithContext(<ViewProgram />, {programs: [stubProgram]});

    const wallets = await screen.findAllByTestId("program-operator-wallet")
    expect(wallets.length).toEqual(operatorWallets.length);
  })

  describe("when there are no rounds in the program", () => {
    beforeEach(() => {
      (useListRoundsQuery as jest.Mock).mockReturnValue({ data: [], isLoading: false, isSuccess: true });
    });

    it("displays introductory text on the page", async () => {
      const stubProgram = makeProgramData({id: programId});

      renderWithContext(<ViewProgram />, {programs: [stubProgram]});

      await screen.findAllByTestId("program-details-intro");
    })
  });

  describe("when there is a round in the program", () => {
    let stubRound = makeRoundData({ ownedBy: stubProgram.id });

    beforeEach(() => {
      stubRound = makeRoundData({ ownedBy: stubProgram.id });

      (useWallet as jest.Mock).mockReturnValue({ chain: {}, address: stubProgram.operatorWallets[0] });
      (useListProgramsQuery as jest.Mock).mockReturnValue({ program: stubProgram });
      (useListRoundsQuery as jest.Mock).mockReturnValue({ data: [stubRound], isLoading: false, isSuccess: true });
    });


    it("displays round name", async () => {
      const stubProgram = makeProgramData({id: programId});
      const stubRound = makeRoundData({ ownedBy: stubProgram.id });
      (useListRoundsQuery as jest.Mock).mockReturnValue({
        data: [stubRound],
        isLoading: false, isSuccess: true
      });

      renderWithContext(<ViewProgram />, {programs: [stubProgram]});

      expect(screen.getByText(stubRound.roundMetadata?.name!!)).toBeInTheDocument();
    });

    it("displays grant application start and end dates", async () => {
      const stubProgram = makeProgramData({id: programId});
      const stubRound = makeRoundData({ ownedBy: stubProgram.id });
      (useListRoundsQuery as jest.Mock).mockReturnValue({
        data: [stubRound],
        isLoading: false, isSuccess: true
      });

      renderWithContext(<ViewProgram />, {programs: [stubProgram]});

      const applicationTimePeriod = await screen.findByTestId("application-time-period");
      expect(applicationTimePeriod.textContent).toEqual(`${stubRound?.applicationsStartTime.toLocaleDateString()} - ${stubRound.applicationsEndTime.toLocaleDateString()}`);
    });

    it("displays round start and end dates", async () => {
      const stubProgram = makeProgramData({id: programId});
      const stubRound = makeRoundData({ ownedBy: stubProgram.id });
      (useListRoundsQuery as jest.Mock).mockReturnValue({
        data: [stubRound],
        isLoading: false, isSuccess: true
      });

      renderWithContext(<ViewProgram />, {programs: [stubProgram]});

      const roundTimePeriodElement = await screen.findByTestId("round-time-period");
      expect(roundTimePeriodElement.textContent).toEqual(`${stubRound.roundStartTime.toLocaleDateString()} - ${stubRound.roundEndTime.toLocaleDateString()}`);
    });

    it("displays create round link", async () => {
      const stubProgram = makeProgramData({id: programId});
      const stubRound = makeRoundData({ ownedBy: stubProgram.id });
      (useListRoundsQuery as jest.Mock).mockReturnValue({
        data: [stubRound],
        isLoading: false, isSuccess: true
      });

      renderWithContext(<ViewProgram />, {programs: [stubProgram]});

      await screen.findByTestId("create-round-small-link");
    })
  })
})
