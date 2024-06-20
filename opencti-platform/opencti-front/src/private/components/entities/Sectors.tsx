import React, { FunctionComponent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QueryRenderer } from '../../../relay/environment';
import { buildViewParamsFromUrlAndStorage/* , saveViewParameters */ } from '../../../utils/ListParameters';
import { useFormatter } from '../../../components/i18n';
import SectorsLines, { sectorsLinesQuery } from './sectors/SectorsLines';
import SectorCreation from './sectors/SectorCreation';
import SearchInput from '../../../components/SearchInput';
import Security from '../../../utils/Security';
import { KNOWLEDGE_KNUPDATE } from '../../../utils/hooks/useGranted';
import Breadcrumbs from '../../../components/Breadcrumbs';
import useConnectedDocumentModifier from '../../../utils/hooks/useConnectedDocumentModifier';

const Sectors: FunctionComponent = () => {
  const { t_i18n } = useFormatter();
  const { setTitle } = useConnectedDocumentModifier();
  setTitle(t_i18n('Sectors | Entities'));
  const navigate = useNavigate();
  const location = useLocation();
  const LOCAL_STORAGE_KEY = 'sectors';
  const params = buildViewParamsFromUrlAndStorage(navigate, location, LOCAL_STORAGE_KEY);
  const [searchTerm, setSearchTerm] = useState<string>(params.searchTerm ?? '');
  // const [openExports] = useState<boolean>(false);

  /* const saveView = () => {
    setTitle(t_i18n('Sectors | Entities'));
    saveViewParameters(
      navigate,
      location,
      LOCAL_STORAGE_KEY,
      {
        searchTerm,
        openExports,
      },
    );
  }; */

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // saveView();
  };

  /* const handleToggleExports = () => {
    setOpenExports(!openExports);
  }; */

  return (
    <>
      <Breadcrumbs variant="list" elements={[{ label: t_i18n('Entities') }, { label: t_i18n('Sectors'), current: true }]} />
      <div style={{ float: 'left', marginRight: 20 }}>
        <SearchInput
          variant="small"
          onSubmit={handleSearch.bind(this)}
          keyword={searchTerm}
        />
      </div>
      <div className="clearfix" />
      <QueryRenderer
        query={sectorsLinesQuery}
        variables={{ count: 500 }}
        render={({ props } : { props: string }) => (
          <SectorsLines data={props} keyword={searchTerm} />
        )}
      />
      <Security needs={[KNOWLEDGE_KNUPDATE]}>
        <SectorCreation paginationOptions={{
          count: 0,
          cursor: undefined,
        }}
        />
      </Security>
    </>
  );
};

export default Sectors;
