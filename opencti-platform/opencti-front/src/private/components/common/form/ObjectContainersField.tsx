import React, { FunctionComponent, useEffect, useState } from 'react';
import { Field } from 'formik';
import { graphql } from 'react-relay';
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
export const objectContainersFieldQuery = graphql`
  query ObjectContainersFieldQuery {
    reports {
      edges {
        node {
          id
          name
          published
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
        }
      }
  }
}
`;

interface ObjectContainersFieldProps {
  name: string;
  style?: React.CSSProperties;
  onChange?: (
    name: string,
    values: Option[],
    operation?: string | undefined,
  ) => void;
  helpertext?: unknown;
  disabled?: boolean;
  label?: string;
  setFieldValue?: (name: string, values: Option[]) => void;
}

interface OptionValues {
  currentValues: Option[];
  valueToReplace: Option;
}

const ObjectContainersField: FunctionComponent<ObjectContainersFieldProps> = ({
  name,
  style,
  setFieldValue
}) => {

  const { t_i18n } = useFormatter();
  const [options, setOptions] = useState<
  Option[] | OptionValues | undefined
>(undefined);
  const [newReport, setNewReport] = useState<
    Option[] | OptionValues | undefined
  >(undefined);
  //const [operation, setOperation] = useState<string | undefined>(undefined);

  useEffect(() => {fetchQuery(objectContainersFieldQuery)
  .toPromise() // TODO type all this
  .then((data: any) => {
    const items = data.reports.edges.map((e: any) => e.node);
    const reports = items
      .map((n: any) => ({
        name: n.name,
        id: n.id,
      }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name))
      .sort((a: any, b: any) => a.id.localeCompare(b.id));
    setOptions(reports)
  })}, []);

  console.log(options)


  const handleOnChange = (n: string, values: Option[]) => {
    const valueAdded = values[values.length - 1];
    // const valueToReplace = values.find(
    //   (marking) => marking.definition_type === valueAdded.definition_type
    //     && marking.x_opencti_order !== valueAdded.x_opencti_order,
    // );

    // if (valueToReplace) {
    //   setOperation('replace');
    //   setNewReport({ currentValues: values, valueToReplace });
    // } else onChange?.(name, values);
  };

  // const renderOption: RenderOption = (props, option) => (
  //   <li {...props}>
  //     <div className={classes.icon} style={{ color: option.color }}>
  //       <ItemIcon type="Marking-Definition" color={option.color} />
  //     </div>
  //     <div className={classes.text}>{option.label}</div>
  //   </li>
  // );

  return (
    <>
      <Field
        component={AutocompleteField}
        style={style}
        name={name}
        multiple={true}
        disabled={false}
        textfieldprops={{
          variant: 'standard',
          label: t_i18n('Reports'),
          helperText: t_i18n('Reports'),
        }}
        noOptionsText={t_i18n('No available options')}
        options={options}
        onChange={handleOnChange}
      // renderOption={renderOption}
      />
    </>
  );
};

export default ObjectContainersField;
