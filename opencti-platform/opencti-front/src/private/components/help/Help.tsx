import React, { useState } from 'react';
import { Button, Grid, Stack } from '@mui/material';
import { useTheme } from '@mui/styles';
import { Theme } from '@mui/material/styles/createTheme';
import { useFormatter } from '../../../components/i18n';
import FeedbackCreation from '../cases/feedbacks/FeedbackCreation';

const Help = () => {
  const { t_i18n } = useFormatter();
  const theme = useTheme<Theme>();
  const [openFeedback, setOpenFeedback] = useState<boolean>(false);

  const handleOpenFeedback = () => setOpenFeedback(true);
  const handleCloseFeedback = () => setOpenFeedback(false);

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <h1>{t_i18n('Frequently Asked Questions')}</h1>
        <Stack
          spacing={theme.spacing(1)}
          direction={'row'}
          justifyContent={'center'}
        >
          <Button variant="outlined" href="https://docs.opencti.io">
            {t_i18n('View Documentation')}
          </Button>
          <Button variant="contained" onClick={handleOpenFeedback}>
            {t_i18n('Submit Feedback')}
          </Button>
        </Stack>
        <Grid container spacing={theme.spacing(1)}>
          <Grid item xs={6}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              blandit ultricies eleifend. Cras eu efficitur eros. Cras gravida
              elit eu maximus suscipit. Aenean pretium nibh at orci consequat
              bibendum. Donec finibus, erat tristique auctor sollicitudin, ante
              mauris tristique diam, at elementum massa lacus vel dolor.
              Suspendisse ultricies at neque vitae tincidunt. Vestibulum aliquet
              magna non libero tristique pellentesque. Suspendisse id lorem
              elementum, ornare ante at, interdum enim. Aliquam eget tellus
              posuere, commodo leo sagittis, luctus ante. Integer vestibulum
              imperdiet massa, at pellentesque est sodales eu. Nullam a dui
              velit. Vivamus at sapien varius, mattis lorem eget, varius nibh.
              Curabitur porttitor faucibus elementum.
            </p>
          </Grid>
          <Grid item xs={6}>
            <p>
              Nam tempor ornare libero, eget rhoncus felis placerat et.
              Curabitur nec dolor lobortis est faucibus malesuada. Suspendisse
              id tempus lacus. Vivamus ut felis at nulla aliquet pretium ac at
              quam. Aenean sed nisl vel arcu aliquet aliquam ut id diam. Duis
              nec pharetra augue, a interdum sapien. Vestibulum neque sapien,
              luctus quis magna ut, congue congue ante. Etiam rhoncus augue
              vitae dapibus volutpat. Vestibulum fermentum congue mi a
              fringilla. Integer eu fringilla orci. Suspendisse volutpat eros ut
              nunc iaculis rhoncus. Ut a diam placerat, tincidunt nisl vitae,
              semper orci. Pellentesque nisl sem, tincidunt ac congue nec,
              mollis vel dui. Nam viverra volutpat ante in luctus.
            </p>
          </Grid>
          <Grid item xs={6}>
            <p>
              Morbi id ante eget tortor pharetra vehicula. Nullam finibus
              fringilla laoreet. Fusce et velit sed turpis facilisis volutpat
              sit amet in neque. Praesent maximus eleifend volutpat. Nulla
              turpis metus, pulvinar non nunc sit amet, consectetur cursus est.
              Sed bibendum posuere ex, ut iaculis arcu accumsan quis. Maecenas
              eu faucibus massa. Aenean gravida malesuada odio, id placerat
              risus. Phasellus vitae ornare massa. Cras sagittis mollis
              suscipit. Ut vel risus risus. Cras dui velit, fringilla in tellus
              ac, iaculis bibendum lectus.
            </p>
          </Grid>
          <Grid item xs={6}>
            <p>
              Fusce in velit suscipit, euismod purus vel, ultricies nibh. Morbi
              dapibus nibh at orci hendrerit, sit amet malesuada nunc pulvinar.
              Sed non turpis ac elit venenatis faucibus sed vel lectus. Ut id
              blandit tortor. Vivamus porta velit justo, sed faucibus diam
              consectetur et. Proin sem quam, laoreet eu magna sed, vehicula
              tincidunt sem. Nulla facilisi. Nulla et vestibulum leo. Etiam
              faucibus lobortis lorem et dictum. Sed malesuada enim turpis, quis
              condimentum ipsum scelerisque eget. Ut sodales ex lacus, vel
              aliquet dolor volutpat sit amet.
            </p>
          </Grid>
          <Grid item xs={6}>
            <p>
              Nam blandit dui id mattis rutrum. Etiam erat felis, accumsan eget
              dolor quis, euismod viverra nisi. Cras faucibus felis quis lorem
              rhoncus, eu rhoncus massa venenatis. Interdum et malesuada fames
              ac ante ipsum primis in faucibus. Mauris at ornare odio.
              Pellentesque eget pretium mauris, nec efficitur nisi. Nullam in
              magna sit amet diam dictum lacinia vel ac ipsum. Aliquam faucibus
              tempus urna ut pulvinar. Vestibulum posuere hendrerit erat non
              maximus. Nulla id lacus lacus. Nulla lacinia vitae nunc ac
              hendrerit. Mauris gravida vulputate nulla, id malesuada dolor
              iaculis ac. Vivamus nisl augue, semper quis vehicula non, maximus
              a dui.
            </p>
          </Grid>
        </Grid>
      </div>
      <FeedbackCreation
        openDrawer={openFeedback}
        handleCloseDrawer={handleCloseFeedback}
      />
    </div>
  );
};

export default Help;
