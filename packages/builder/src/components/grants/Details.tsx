import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProjectApplications } from "../../actions/projects";
import { RootState } from "../../reducers";
import { FormInputs, Metadata, Project } from "../../types";
import About from "./About";
import ProjectDetailsHeader from "./ProjectDetailsHeader";
import Rounds from "./rounds/Rounds";
import Stats from "./stats/Stats";
import { Hypercerts } from "./hypercerts/Hypercerts";

export default function Details({
  project,
  createdAt,
  updatedAt,
  bannerImg,
  logoImg,
  showApplications,
  showTabs,
}: {
  project?: Metadata | FormInputs | Project;
  updatedAt: number;
  createdAt: number;
  bannerImg: string | Blob;
  logoImg: string | Blob;
  showApplications: boolean;
  showTabs: boolean;
}) {
  const params = useParams();
  const dispatch = useDispatch();
  const props = useSelector((state: RootState) => {
    const { chainId } = params;

    const applications = state.projects.applications[params.id!] || [];

    return {
      chainId: Number(chainId),
      projectID: params.id!,
      applications,
    };
  });

  useEffect(() => {
    if (props.projectID) {
      dispatch(fetchProjectApplications(props.projectID, props.chainId));
    }
  }, [dispatch, props.projectID, props.chainId]);

  return (
    <>
      <ProjectDetailsHeader
        title={project?.title ?? ""}
        bannerImg={bannerImg}
        logoImg={logoImg}
      />
      {showTabs ? (
        <Tabs className="mt-8" defaultIndex={0}>
          <TabList className="mb-12" width="fit-content">
            <Tab
              _focus={{ boxShadow: "none" }}
              _selected={{
                color: "#6F3FF5",
                borderBottom: "2px solid",
                borderBottomColor: "#6F3ff5",
              }}
            >
              <span>About</span>
            </Tab>
            <Tab
              _focus={{ boxShadow: "none" }}
              _selected={{
                color: "#6F3FF5",
                borderBottom: "2px solid",
                borderBottomColor: "#6F3ff5",
              }}
            >
              Stats
            </Tab>
            <Tab
              _focus={{ boxShadow: "none" }}
              _selected={{
                color: "#6F3FF5",
                borderBottom: "2px solid",
                borderBottomColor: "#6F3ff5",
              }}
            >
              Rounds
            </Tab>
            {!!project?.hypercertIds?.length && <Tab>Hypercerts</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel>
              <About
                project={project}
                showApplications={showApplications}
                createdAt={createdAt}
                updatedAt={updatedAt}
              />
            </TabPanel>
            <TabPanel>
              <Stats />
            </TabPanel>
            <TabPanel>
              <Rounds />
            </TabPanel>
            <TabPanel>
              <Hypercerts project={project} chainId={props.chainId} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <About
          project={project}
          showApplications={showApplications}
          createdAt={createdAt}
          updatedAt={updatedAt}
        />
      )}
    </>
  );
}
