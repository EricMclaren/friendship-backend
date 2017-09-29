import knex from '../utils/db';

const topicListFields = ['id', 'name'];
const userTopicListFields = ['userId', 'topicId', 'love'];
const topicUserListFields = ['user_topic.userId', 'users.username', 'user_topic.topicId', 'love'];
const pageLimit = 10;

export const dbGetTopics = () => knex('topics').select(topicListFields);

export const dbGetTopic = id =>
  knex('topics')
    .first()
    .where({ id });

export const dbCreateTopic = ({ ...fields }) =>
  knex.transaction(async (trx) => {
    const topic = await trx('topics')
      .insert(fields)
      .returning('*')
      .then(results => results[0]); // return only first result

    return topic;
  });

export const dbDelTopic = id =>
  knex('topics')
    .where({ id })
    .del();

export const dbUpdateTopic = (id, fields) =>
  knex('topics')
    .update({ ...fields })
    .where({ id })
    .returning('*');


//  Get all topics that a user has chosen to be either loved or hated
export const dbGetUserTopics = userId =>
  knex('user_topic')
    .select(userTopicListFields)
    .where({ userId });
    //  Get all topics that a user has chosen to be either loved or hated
export const dbGetUsersInTopic = topicId =>
  knex('user_topic')
    .select(topicUserListFields)
    .join('users', 'user_topic.userId', '=', 'users.id')
    .where({ topicId });

// Add a new topic that a user loves/hates
export const dbCreateUserTopic = ({ ...fields }) =>
  knex.transaction(async (trx) => {
    const topic = await trx('user_topic')
      .insert(fields)
      .returning('*')
      .then(results => results[0]); // return only first result

    return topic;
  });


//  Delete a user_topic
export const dbDelUserTopic = (userId, topicId) =>
  knex('user_topic')
    .where({ userId, topicId })
    .del();
