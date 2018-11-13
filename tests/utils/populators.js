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

const populateAnime = () => Promise.all(animes.map(x => new Anime(x).save()));

module.exports = {
  populateAnime
}