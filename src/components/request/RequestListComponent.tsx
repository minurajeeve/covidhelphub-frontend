/* eslint-disable react/button-has-type */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import RequestModel from '../../objectModel/RequestModel';
import RequestService from '../../services/RequestService';
import StageService from '../../services/StageService';
import StageModel from '../../objectModel/StageModel';

function RequestListComponent() {
  const [requests, setRequests] = useState([] as RequestModel[]);
  const [stages, setStages] = useState([] as StageModel[]);
  const history = useHistory();
  const { programCode, stageCode = 'Open' } = useParams<{ programCode: string; stageCode: string }>();

  useEffect(() => {
    async function getData() {
      const requestData = await RequestService.list();
      setRequests(requestData);
      const stageData = await StageService.list();
      setStages(stageData);
    }
    getData();
  }, []);

  let RequestLinks = {};
  // // TODO: move styling to CSS or define at bottom
  const StageButtons = stages.map((stage) => {
    const fontWeight = stage.code.toUpperCase() === stageCode.toUpperCase() ? 'bold' : 'normal';
    return (
      <Link
        key={`stage-${stage.code}`}
        to={`/request/list/${programCode}/${stage.code}`}
        style={{ padding: '0px 50px 0px 0px', fontWeight: `${fontWeight}` }}
      >
        {' '}
        {stage.code}
      </Link>
    );
  });
  RequestLinks = requests
    .filter((request) => request.programCode === programCode.toUpperCase())
    .map((requestObj, i) => (
      <tr key={`requestrow-${requestObj.name}-${i}`}>
        <td>{requestObj.name}</td>
        <td>{requestObj.address}</td>
        <td>{requestObj.phone}</td>
        <td>{requestObj.email}</td>
        <td>
          <button>Email Blast</button>
        </td>
      </tr>
    ));

  function addRequest() {
    history.push('/request/create');
  }

  // TODO: move styling to CSS file
  return (
    <div>
      <button onClick={addRequest}>Add</button>
      <p>
        Program:
        {programCode}
      </p>
      <div style={{ padding: '20px 0px' }}>{StageButtons}</div>

      <table className="">
        <thead>
          <tr>
            <th>Target Date</th>
            <th>Flexible Date</th>
            <th>Submitted Date</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>{RequestLinks}</tbody>
      </table>
      <hr />
      <br />
    </div>
  );
}

export default RequestListComponent;
