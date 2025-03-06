import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useFormatter } from '../../../../components/i18n';
import { QueryRenderer } from '../../../../relay/environment';
import { NO_DATA_WIDGET_MESSAGE } from '../../../../components/dashboard/WidgetNoData';
import { graphql } from 'react-relay';

const auditsTableTopKeywordsQuery = graphql`
  query AuditsTableTopKeywordsQuery($field: String!, $limit: Int, $filters: FilterGroup) {
    auditsDistribution(field: $field, operation: count, limit: $limit, filters: $filters) {
      label
      value
    }
  }
`;

interface AuditData {
  auditsDistribution?: { label: string; value: number}[];
}

interface AuditsTableProps {
  height?: number;
  parameters: { title: string};
  dataSelection: {
    attribute: string;
    date_attribute?: string;
    number: number;
    filters: {
      mode: string;
      filters: { key: string; values: string[] } [];
      filterGroups: any[];
    };
  }[];
}

const AuditsTable: React.FC<AuditsTableProps> = ({ height = 400, parameters, dataSelection }) => {
  
  const { t_i18n } = useFormatter();
  const selection = dataSelection[0];

  return (
    <div style={{ height: '100%' }}>
      <Typography variant="h4" gutterBottom>
        {t_i18n(parameters.title)}
      </Typography>
      <Paper variant="outlined" style={{ height: '100%', padding: '16px' }}>
        <QueryRenderer
          query={auditsTableTopKeywordsQuery}
          variables={{
            field: selection.attribute,
            limit: selection.number,
            filters: selection.filters,
          }}
          render={({ props }: { props: AuditData | null }) => {
            if (!props) {
              return <CircularProgress size={40} thickness={2} style={{ display: 'block', margin: 'auto' }} />;
            }
            const data = props.auditsDistribution || [];
            if (data.length === 0) {
              return <Typography align="center">{t_i18n(NO_DATA_WIDGET_MESSAGE)}</Typography>;
            }
            return (
              <TableContainer style={{ maxHeight: height - 50, overflowY: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t_i18n('Keyword')}</TableCell>
                      <TableCell align="right">{t_i18n('Search Count')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row: { label: string; value: number }, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{row.label}</TableCell>
                        <TableCell align="right">{row.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            );
          }}
        />
      </Paper>
    </div>
  );
};

export default AuditsTable;