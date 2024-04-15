import React, { FunctionComponent } from 'react';

interface StixDomainObjectThreatOnePageKnowledgeProps {
  stixDomainObjectId: string;
  stixDomainObjectType: string;
  displayObservablesStats: boolean;
}

const StixDomainObjectThreatOnePageKnowledge: FunctionComponent<
StixDomainObjectThreatOnePageKnowledgeProps
> = () => {
  return (
    <>
      <h2>This is a different view</h2>
    </>
  );
};

export default StixDomainObjectThreatOnePageKnowledge;
