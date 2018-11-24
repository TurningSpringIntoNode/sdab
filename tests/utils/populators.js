const { Anime, Episode }  = require('../../core/mongodb').mongoose.models;


const animes = [
  {
    name: 'test1',
    genre: 'daba',
    thumb: {
      id: '1',
      url: 'animes.com/1'
    },
    resume: 'Test for anime number 1'
  },
  {
    name: 'test2',
    genre: 'naba',
    thumb: {
      id: '2',
      url: 'animes.com/2'
    },
    resume: 'Test for anime number 2' 
  },
  {
    name: 'test3',
    genre: 'vaba',
    thumb: {
      id: '3',
      url: 'animes.com/3'
    },
    resume: 'Test for anime number 3'
  }
];

const episodes = [
  {
    name: 'test_ep_1',
    chapter: 'x1',
    description: 'test episode 1',
    video: {
      id: '1',
      url: 'episodes.com/1',
    },
  },
  {
    name: 'test_ep_2',
    chapter: 'x2',
    description: 'test episode 2',
    video: {
      id: '2',
      url: 'episodes.com/2',
    },
  },
  {
    name: 'test_ep_3',
    chapter: 'x3',
    description: 'test episode 3',
    video: {
      id: '3',
      url: 'episodes.com/3',
    },
  },
  {
    name: 'test_ep_4',
    chapter: 'x4',
    description: 'test episode 4',
    video: {
      id: '4',
      url: 'episodes.com/4',
    },
  },
];

const populateAnime = () => Promise.all(animes.map(x => new Anime(x).save()));

const populateEpisode = async () => {
  const animes = await Anime.find({});
  return Promise.all(episodes.map((episode, ind) => {
    const index = Math.floor(ind % animes.length);
    const anime_id = animes[index]._id;
    return new Episode({
      name: episode.name,
      chapter: episode.chapter,
      description: episode.description,
      video: episode.video,
      anime: anime_id,
    }).save();
  }))
};

module.exports = {
  populateAnime,
  populateEpisode,
}