import React, { useEffect } from "react";
// import { RootState } from '../../reducers';
import { Link } from "react-router-dom";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { RootState } from "../../reducers";
import { grantPath } from "../../routes";
import { loadProjects, unloadProjects } from "../../actions/grants";

function GrantsList() {
  const dispatch = useDispatch();
  const props = useSelector(
    (state: RootState) => ({
      loading: state.projects.loading,
      grants: state.projects.projects,
      chainID: state.web3.chainID,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(loadProjects());
    return () => {
      dispatch(unloadProjects());
    };
  }, [dispatch]);

  return (
    <div className="container mx-auto">
      {props.loading && <>loading...</>}

      {!props.loading && (
        <ul>
          {props.grants.map((item: number) => (
            <li key={item}>
              <Link to={grantPath(item)}>Grant #{item}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GrantsList;
