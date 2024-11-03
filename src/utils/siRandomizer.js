const images = require("./images");

module.exports.getRandomEnding = () => {
  const stinkyEndings = [
    { sniff: images.sniff1, ending: [images.stinky1, images.stinkyEnd1] },
    { sniff: images.sniff2, ending: [images.stinky2, images.stinkyEnd2] },
  ];
  const notStinkyEndings = [
    { sniff: images.sniff1, ending: [images.notStinky1, images.notStinkyEnd1] },
    { sniff: images.sniff2, ending: [images.notStinky2, images.notStinkyEnd2] },
  ];

  const isStinky = Math.random() < 0.5;
  const endings = isStinky ? stinkyEndings : notStinkyEndings;
  const selectedEnding = endings[Math.floor(Math.random() * endings.length)];

  return {
    sniff: selectedEnding.sniff,
    ending: selectedEnding.ending,
    isStinky, // Include this flag to indicate ending type
  };
};
