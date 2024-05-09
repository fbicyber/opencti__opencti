import React, { FunctionComponent, useEffect, useState } from 'react';
import { Field } from 'formik';
import { graphql, usePreloadedQuery } from 'react-relay';
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


// probably want to paginate this query
// see ReportLines for reference

// TODO ensure markings do not exceed the users allowed markings  (see ObjectMarkingField for reference)
// TODO make this field required
// TODO type query results (see comments in useEffect)

export const objectContainerFieldQuery = graphql`
query ObjectContainerFieldQuery($Filters: FilterGroup) {
  containers(filters: $Filters) {
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
  }
}
`;

export const objectContainerFieldArgs = (value: 'Report' | 'Case') => {
  return {
    "Filters": {
      "mode": "or",
      "filterGroups": [],
      "filters": [{
        "key": "entity_type",
        "values": [value]
      }]
    }
  }
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
    containerType && fetchQuery(objectContainerFieldQuery, objectContainerFieldArgs(containerType))
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
