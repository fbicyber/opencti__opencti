import { BUS_TOPICS } from '../../config/conf';
import { createEntity, deleteElementById, updateAttribute } from '../../database/middleware';
import { listEntitiesPaginated, storeLoadById, type EntityOptions } from '../../database/middleware-loader';
import { notify } from '../../database/redis';
import type { EditInput, ThemeAddInput } from '../../generated/graphql';
import { publishUserAction } from '../../listener/UserActionListener';
import { ENTITY_TYPE_THEME } from '../../schema/internalObject';
import type { AuthContext, AuthUser } from '../../types/user';
import { SYSTEM_USER } from '../../utils/access';
import { type BasicStoreEntityTheme } from './theme-types';

export const findById = (
  context: AuthContext,
  id: string,
) => storeLoadById<BasicStoreEntityTheme>(
  context,
  SYSTEM_USER,
  id,
  ENTITY_TYPE_THEME,
);

export const findAll = async (
  context: AuthContext,
  opts: EntityOptions<BasicStoreEntityTheme>,
) => listEntitiesPaginated<BasicStoreEntityTheme>(
  context,
  SYSTEM_USER,
  [ENTITY_TYPE_THEME],
  opts,
);

export const addTheme = async (
  context: AuthContext,
  user: AuthUser,
  input: ThemeAddInput,
) => {
  const created = await createEntity(context, user, input, ENTITY_TYPE_THEME);

  await publishUserAction({
    user,
    event_type: 'mutation',
    event_scope: 'create',
    event_access: 'extended',
    message: `creates theme \`${created.name}\``,
    context_data: {
      id: created.id,
      entity_type: ENTITY_TYPE_THEME,
      input,
    },
  });

  return notify(BUS_TOPICS[ENTITY_TYPE_THEME].ADDED_TOPIC, created, user);
};

export const deleteTheme = async (
  context: AuthContext,
  user: AuthUser,
  id: string,
) => {
  const deleted = await deleteElementById(
    context,
    user,
    id,
    ENTITY_TYPE_THEME,
  );

  await publishUserAction({
    user,
    event_type: 'mutation',
    event_scope: 'delete',
    event_access: 'extended',
    message: `deletes theme \`${deleted.name}\``,
    context_data: {
      id: deleted.id,
      entity_type: ENTITY_TYPE_THEME,
      input: deleted,
    },
  });

  return notify(BUS_TOPICS[ENTITY_TYPE_THEME].DELETE_TOPIC, deleted, user).then(() => id);
};

export const editTheme = async (
  context: AuthContext,
  user: AuthUser,
  id: string,
  input: EditInput[],
) => {
  const { element } = await updateAttribute(
    context,
    user,
    id,
    ENTITY_TYPE_THEME,
    input,
  );

  await publishUserAction({
    user,
    event_type: 'mutation',
    event_scope: 'update',
    event_access: 'administration',
    message: `update theme with id:\`${element.id}\``,
    context_data: {
      id: element.id,
      entity_type: ENTITY_TYPE_THEME,
      input,
    },
  });

  return notify(BUS_TOPICS[ENTITY_TYPE_THEME].EDIT_TOPIC, element, user);
};