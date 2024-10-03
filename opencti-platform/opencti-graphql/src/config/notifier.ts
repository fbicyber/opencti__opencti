// Support for notifier email sending to admins on error.log occurrence.
import path from 'node:path';
import nconf from 'nconf';
import { GraphQLError } from 'graphql/error';
import * as fs from 'fs';
import nodemailer from 'nodemailer';
import * as R from 'ramda';
import pjson from '../../package.json';

const LOG_APP = 'APP';
export const PLATFORM_VERSION = pjson.version;

// #########################################################################################
// THIS IS CURRENTLY DUPLICATED - WILL CAUSE A DEP LOOP IF src/config/conf.js IS IMPORTED
// #########################################################################################
const buildMetaErrors = (error: any): any[] => {
  const errors = [];
  interface ExtensionsData {
    cause?: any;
    [key: string]: any;
  }
  if (error instanceof GraphQLError) {
    const extensions = error.extensions ?? {};
    const extensionsData: Partial<ExtensionsData> = extensions.data ?? {};
    // const attributes = R.dissoc('cause', extensionsData);
    const { cause: _, ...attributes } = extensionsData || {};
    const baseError = { name: extensions.code ?? error.name, message: error.message, stack: error.stack, attributes };
    errors.push(baseError);
    if (extensionsData.cause && extensionsData.cause instanceof Error) {
      errors.push(...buildMetaErrors(extensionsData.cause));
    }
  } else if (error instanceof Error) {
    const baseError = { name: error.name, message: error.message, stack: error.stack };
    errors.push(baseError);
  }
  return errors;
};
const addBasicMetaInformation = (category: string, error: any, meta: any) => {
  const logMeta = { ...meta };
  if (error) logMeta.errors = buildMetaErrors(error);
  return { category, version: PLATFORM_VERSION, ...logMeta };
};
const booleanConf = (key: string | undefined, defaultValue = true) => {
  const configValue = nconf.get(key);
  if (R.isEmpty(configValue) || R.isNil(configValue)) {
    return defaultValue;
  }
  return configValue === true || configValue === 'true';
};
// #########################################################################################
// # END DUPLICATION OF REQUIRED src/config/conf.js FUNCTIONS
// #########################################################################################

// #########################################################################################
// THIS IS CURRENTLY DUPLICATED - WILL CAUSE A DEP LOOP IF src/database/smtp.js IS IMPORTED
// #########################################################################################

const USE_SSL = booleanConf('smtp:use_ssl', false);
const REJECT_UNAUTHORIZED = booleanConf('smtp:reject_unauthorized', false);

const smtpOptions = {
  host: nconf.get('smtp:hostname') || 'localhost',
  port: nconf.get('smtp:port') || 25,
  secure: USE_SSL,
  tls: {
    rejectUnauthorized: REJECT_UNAUTHORIZED,
    maxVersion: nconf.get('smtp:tls_max_version'),
    minVersion: nconf.get('smtp:tls_min_version'),
    ciphers: nconf.get('smtp:tls_ciphers'),
  },
};

const transporter = nodemailer.createTransport(smtpOptions);

const sendMail = async (args: { to: any; from: any; subject: any; html: any; }) => {
  const { from, to, subject, html } = args;
  await transporter.sendMail({ from, to, subject, html });
};

// #########################################################################################
// # END DUPLICATION OF REQUIRED src/database/smtp.js FUNCTIONS
// #########################################################################################

function loadEmailTemplate(
  filePath: fs.PathOrFileDescriptor,
  replacements: {
    [x: string]: string;
    emailIntro?: any;
    platformUrl?: any;
    platformVersion?: any;
    eventTimestamp?: any;
    openctiUser?: any;
    errorEvent?: any;
  }
) {
  let template = fs.readFileSync(filePath, 'utf8');
  //   for (const key in replacements) {
  Object.keys(replacements).forEach((key, _index) => {
    if (key) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, replacements[key]);
    }
  });
  return template;
}

// Lookup user details for the specific error that was encountered
// async function getUserById(user) {
//   // Will cause cyclical dep loop if the user.js is required for findById()
//   return await findById({}, SYSTEM_USER, user);
// }

async function processUserEmail(user: string, errorEvent: any) {
  try {
    // Some errors will not have an attached user
    const openctiUserName = user ?? 'Unknown';
    // if (user) {
    //   const userInfo = await getUserById(user);
    //   const { firstname, lastname, user_email } = userInfo;
    //   openctiUserName = `${firstname} ${lastname} &lt;${user_email}&gt;`;
    // }

    const platformVersion = PLATFORM_VERSION; // defined above
    const platformUrl = nconf.get('app:base_url'); // defined above
    const emailSubject = nconf.get('smtp:notifier_email_subject');
    const emailIntro = nconf.get('smtp:notifier_email_intro');
    const emailFrom = nconf.get('smtp:notifier_from_email');
    const emailList = nconf.get('smtp:notifier_email_list');
    const emailArray = emailList.split(',');
    const date = new Date().toISOString();

    const mailArgs = {
      from: emailFrom,
      to: emailList,
      subject: emailSubject,
      html: loadEmailTemplate(path.join(__dirname, '../src/templates/emailTemplate.html'), {
        emailIntro,
        platformUrl,
        platformVersion,
        eventTimestamp: date,
        openctiUser: openctiUserName,
        errorEvent: JSON.stringify(errorEvent),
      })
    };
    // Iterate over config defined email list
    emailArray.forEach((email: string) => {
      const updatedMailArgs = { ...mailArgs, to: email.trim() };
      sendMail(updatedMailArgs)
        // Cannot require config/conf.js to use logApp will cause a circular dep.
        // eslint-disable-next-line no-console
        .then(() => console.log('Notification Email sent successfully!'))
        // eslint-disable-next-line no-console
        .catch((error) => console.error('Error sending email via smtp:notifier:', error));
    });
  } catch (error) {
    // Cannot require config/conf.js to use logApp will cause a circular dep.
    // eslint-disable-next-line no-console
    console.error('Error sending email via smtp:notifier:', error);
  }
}

export const notifierEmail = (error: any, meta: any) => {
  // if (error != null && nconf.get('smtp:notifier_enabled')) {
  if (error != null) {
    // If enabled - send email to defined admins from nconf.get('smtp:notifier_email_list')
    const informationJSONString = JSON.stringify(addBasicMetaInformation(LOG_APP, error, { ...meta, source: 'backend' }));
    try {
      const platformVersion = PLATFORM_VERSION; // defined above
      const parsedData = JSON.parse(informationJSONString);
      const openctiUser = parsedData?.user?.user_id ?? 'Unknown';
      const parsedCategory = parsedData?.category ?? 'Unknown';
      const parsedErrors = parsedData?.errors ?? 'Unknown';
      const errorEvent = {
        category: parsedCategory,
        version: platformVersion,
        ...parsedErrors,
      };

      processUserEmail(openctiUser, errorEvent);
    } catch (localError) {
      // Cannot require config/conf.js to use logApp will cause a circular dep.
      // eslint-disable-next-line no-console
      console.error('Invalid JSON string for smtp:notifier: ', localError);
    }
  }
};

export default notifierEmail;
