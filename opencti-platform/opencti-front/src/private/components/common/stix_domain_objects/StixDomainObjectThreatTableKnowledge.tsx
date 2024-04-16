import React, { FunctionComponent } from 'react';

interface StixDomainObjectThreatTableKnowledgeProps {
  stixDomainObjectId: string;
  stixDomainObjectType: string;
  displayObservablesStats: boolean;
}

const StixDomainObjectThreatTableKnowledge: FunctionComponent<
StixDomainObjectThreatTableKnowledgeProps
> = () => {
  return (
    <>
      <h2>This is the Table Knowledge View</h2>
    </>
  );
};

export default StixDomainObjectThreatTableKnowledge;
