import knex from '../utils/db';

const tagListFields = ['id', 'user_id', 'name', 'category', 'createdAt'];
const userTagListFields = ['userId', 'tagId', 'love'];
<<<<<<< HEAD
const tagUserListFields = ['user_tag.userId', 'users.username', 'user_tag.tagId', 'love', 'emoji'];

=======
const tagsForUser = ['id', 'name', 'category', 'love'];
>>>>>>> profileBackend

export const dbGetTags = () => knex('tags').select(tagListFields);

export const dbGetTag = id =>
  knex('tags')
    .first()
    .where({ id });

export const dbGetTagsForUser = userId =>
  knex('tags')
    .select(tagsForUser)
    .leftJoin('user_tag', 'user_tag.tagId', 'tags.id')
    .where({ 'user_tag.userId': userId });

export const dbCreateTag = ({ ...fields }) =>
  knex.transaction(async (trx) => {
    const tag = await trx('tags')
      .insert(fields)
      .returning('*')
      .then(results => results[0]); // return only first result

    return tag;
  });

export const dbDelTag = id =>
  knex('tags')
    .where({ id })
    .del();

export const dbUpdateTag = (id, fields) =>
  knex('tags')
    .update({ ...fields })
    .where({ id })
    .returning('*');

//  Get all tags that a user has chosen to be either loved or hated
export const dbGetUserTags = userId =>
  knex('user_tag')
    .select(userTagListFields)
    .where({ userId });

// Get all the users of a tag, used in admin to check how many loves/hates a tag has
export const dbGetTagsUser = tagId =>
  knex('user_tag')
    .select(userTagListFields)
    .where({ tagId });

// Get all the users of a tag, used by users in searching for users who love/hate a tag. (includes username and emoji)
export const dbGetUsersInTag = tagId =>
  knex('user_tag')
    .select(tagUserListFields)
    .join('users', 'user_tag.userId', '=', 'users.id')
    .where({ tagId });

export const dbGetCountLikes = tagId =>
knex('user_tag')
  .where({tagId})
  .groupBy('love')
  .countDistinct('userId');

// Add a new tag that a user loves/hates
export const dbCreateUserTag = ({ ...fields }) =>
  knex.transaction(async (trx) => {
    const tag = await trx('user_tag')
      .insert(fields)
      .returning('*')
      .then(results => results[0]); // return only first result

    return tag;
  });

//  Delete a user_tag
export const dbDelUserTag = (userId, tagId) =>
  knex('user_tag')
    .where({ userId, tagId })
    .del();
