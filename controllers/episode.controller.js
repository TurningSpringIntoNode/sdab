const { Episode } = require('../core/mongodb').mongoose.models;

const responseWriter = require('../utils/response-writer');
const constants = require('../core/response-constants');

const getEpisodes = (req, res) => {
  const { animeId } = req.params;
  const { sorting } = req;

  Episode
    .find({
      anime: animeId,
    }, {}, req.pagination)
    .sort([[sorting.sortBy, sorting.order]])
    .then((episodes) => {
      Promise
        .all(episodes.map(episode => episode.toJSONAsync()))
        .then((episodesJson) => {
          responseWriter.goodResponse(res, {
            episodes: episodesJson,
          });
        });
    })
    .catch(responseWriter.failedToComplete(res));
};

const getEpisodeById = (req, res) => {
  const { animeId, episodeId } = req.params;

  Episode
    .findOne({
      anime: animeId,
      _id: episodeId,
    })
    .then((episode) => {
      if (episode) {
        episode
          .toJSONAsync()
          .then((episodeJson) => {
            responseWriter.goodResponse(res, {
              episode: episodeJson,
            });
          });
      } else {
        responseWriter.badResponse(res, 404, constants.EPISODE_NOT_FOUND);
      }
    })
    .catch(responseWriter.failedToComplete(res));
};


const createEpisode = (req, res) => {
  const { name, chapter, description } = req.body;
  const { public_id, url } = req.file;

  const { animeId } = req.params;

  const episode = new Episode({
    name,
    chapter,
    description,
    anime: animeId,
    video: {
      id: public_id,
      url,
    },
  });

  episode
    .save()
    .then((episodeDb) => {
      episodeDb
        .toJSONAsync()
        .then((episodeJson) => {
          responseWriter.goodResponse(res, {
            episode: episodeJson,
          });
        });
    })
    .catch(responseWriter.failedToComplete(res));
};

const updateEpisode = (req, res) => {
  const { animeId, episodeId } = req.params;

  const { name, chapter, description } = req.body;
  const { public_id, url } = req.file;

  Episode
    .findOne({
      anime: animeId,
      _id: episodeId,
    })
    .then((episode) => {
      if (episode) {
        episode.name = name;
        episode.chapter = chapter;
        episode.description = description;
        episode.video.url = url;
        episode.video.id = public_id;
        episode
          .save()
          .then((episodeDb) => {
            episodeDb
              .toJSONAsync()
              .then((episodeJson) => {
                responseWriter.goodResponse(res, {
                  episode: episodeJson,
                });
              });
          });
      } else {
        responseWriter.badResponse(res, 404, constants.EPISODE_NOT_FOUND);
      }
    })
    .catch(responseWriter.failedToComplete(res));
};

const deleteEpisode = (req, res) => {
  const { animeId, episodeId } = req.params;

  Episode
    .deleteOne({
      _id: episodeId,
      anime: animeId,
    })
    .then(() => {
      responseWriter.goodResponse(res, {});
    })
    .catch(responseWriter.failedToComplete(res));
};

module.exports = {
  getEpisodes,
  getEpisodeById,
  createEpisode,
  updateEpisode,
  deleteEpisode,
};
