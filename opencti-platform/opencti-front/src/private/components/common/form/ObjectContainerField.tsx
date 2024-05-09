import React, { FunctionComponent, useEffect, useState } from 'react';
import { Field } from 'formik';
import { graphql, useFragment, usePaginationFragment, usePreloadedQuery } from 'react-relay';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import useAuth from '../../../../utils/hooks/useAuth';
import ItemIcon from '../../../../components/ItemIcon';
import Transition from '../../../../components/Transition';
import AutocompleteField from '../../../../components/AutocompleteField';
import { RenderOption } from '../../../../components/list_lines';
import { useFormatter } from '../../../../components/i18n';
import { convertMarking } from '../../../../utils/edition';
import { Option } from './ReferenceField';
import { fetchQuery } from 'src/relay/environment';
import useQueryLoading from 'src/utils/hooks/useQueryLoading';
import usePreloadedPaginationFragment from 'src/utils/hooks/usePreloadedPaginationFragment';
import { setNumberOfElements } from 'src/utils/Number';
import { FilterGroup, ObjectContainerFieldPaginationQuery, ObjectContainerFieldPaginationQuery$variables } from '../form/__generated__/ObjectContainerFieldPaginationQuery.graphql'


// probably want to paginate this query
// see ReportLines for reference

// TODO paginate query to get full list of reports
// TODO ensure markings on cases/reports do not exceed the users allowed markings  (see ObjectMarkingField for reference)
// TODO make the selectable Case/Report field required when the users opts to import into a Case/Report
// TODO type query results as something other than 'any' (see comments in useEffect)

export const objectContainerFieldQuery = graphql`
  query ObjectContainerFieldPaginationQuery(
    $count: Int!
    $cursor: ID
    $filters: FilterGroup
  ) {
    ...ObjectContainerField_data
    @arguments(
      count: $count
      cursor: $cursor
      filters: $filters
    )
  }
`;

const objectContainerFieldFragment = graphql`
  fragment ObjectContainerField_data on Query
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 500 }
    cursor: { type: "ID" }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "ObjectContainerFieldRefetchQuery") {
    containers(
      first: $count
      after: $cursor
      filters: $filters
    ) @connection(key: "Pagination_containers") {
      edges {
        node {
          id
          entity_type
          createdBy {
            ... on Identity {
              id
              name
              entity_type
            }
          }
          objectMarking {
            id
            definition_type
            definition
            x_opencti_order
            x_opencti_color
          }
          ... on Report {
            entity_type
            name
          }
          ... on Case {
            entity_type
            name
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        globalCount
      }
    }
  }
`;




export const objectContainerFieldArgs = (value: 'Report' | 'Case' | null) => {

  return {
    count: 500,
    cursor: null,
    filters: {
      "mode": "or",
      "filterGroups": [],
      "filters": [{
        "key": "entity_type",
        "values": [value]
      }]
    }
  } as ObjectContainerFieldPaginationQuery$variables
}

interface ObjectContainerFieldProps {
  name: string;
  style?: React.CSSProperties;
  helpertext?: unknown;
  disabled?: boolean;
  label?: string;
  containerType: 'Report' | 'Case' | null;
  setFieldValue: (name: string, value: Option | null) => void;
}

interface OptionValues {
  currentValues: Option[];
  valueToReplace: Option;
}

const ObjectContainerField: FunctionComponent<ObjectContainerFieldProps> = ({
  name,
  style,
  helpertext,
  disabled,
  label,
  containerType,
  setFieldValue,
}) => {

  const { t_i18n } = useFormatter();
  const [options, setOptions] = useState<
    Option[] | OptionValues | undefined>(undefined);


  useEffect(() => {
    setFieldValue(name, null) // deselect currently selected item when containerType changes
    if (containerType) {

      const queryRef = useQueryLoading<ObjectContainerFieldPaginationQuery>(
        objectContainerFieldQuery,
        objectContainerFieldArgs(containerType)
      );
      const data = useFragment(objectContainerFieldFragment, objectContainerFieldArgs(containerType))
        .toPromise() // TODO type all this
        .then((data: any) => {
          const items = data.containers.edges.map((e: any) => e.node);
          const containers = items
            .map((n: any) => ({
              label: n.name,
              id: n.id,
              value: n.id
            }))
            .sort((a: any, b: any) => a.label.localeCompare(b.label))
            .sort((a: any, b: any) => a.id.localeCompare(b.id));
          setOptions(containers)

          if (!containers.map((c: any) => (c.id)).includes('field value')) {
            setFieldValue(name, null)
          }
        })
        .catch((err) => {
          console.log(err)
          setOptions([])
        })
    }
  }, [containerType]);

  const handleOnChange = (n: string, value: Option) => {
    setFieldValue(n, value)
  };

  const renderOption: RenderOption = (props, option) => (
    <li {...props}>
      <div>{option.label}</div>
    </li>
  );

  return (
    <>
      <Field
        component={AutocompleteField}
        style={style}
        name={name}
        multiple={false}
        disabled={false}
        textfieldprops={{
          variant: 'standard',
          label: label,
        }}
        noOptionsText={t_i18n('No available options')}
        options={options}
        onChange={handleOnChange}
        renderOption={renderOption}
      />
    </>
  );
};

export default ObjectContainerField;
